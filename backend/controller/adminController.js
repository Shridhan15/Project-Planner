import Project from "../models/Project.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import Query from "../models/Query.js";
import { sendMail } from "../config/sendMail.js";

const loginAdmin = async (req, res) => {
    try {
        console.log("BODY RECEIVED:", req.body);
        const { email, password } = req.body;
        console.log("Admin login attempt:", email, password);
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);//generate token in case of right credentials
            res.json({ success: true, token })
        }

        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    }
    catch (error) {
        console.log("Error in controller", error)
        res.json({ success: false, message: error.message })

    }
}

const getAllProjects = async (req, res) => {

    try {
        const projects = await Project.find().populate("author", "name email");
        res.json({ success: true, projects });
    } catch (error) {
        console.error("Error fetching projects in controller:", error);
        res.json({ success: false, message: "Internal server error" });
    }

}

const getAllUsers = async (req, res) => {

    try {
        const users = await User.find(); // Fetch all user fields
        res.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}



const deleteProject = async (req, res) => {
    const projectId = req.params.id;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }



        await Project.findByIdAndDelete(projectId);

        res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project(in controller):", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await Project.deleteMany({ author: id });
        await User.findByIdAndDelete(id);

        res.json({ success: true, message: "User and related projects deleted" });
    } catch (err) {
        console.error("Error deleting user and projects: (in controller)", err);
        res.json({ success: false, message: "Server error" });
    }
};

const fetchQueries = async (req, res) => {
    try {

        const queries = await Query.find().sort({ createdAt: 1 });
        res.json({ success: true, queries });

    } catch (error) {
        console.error("Error fetching queries:", error);
        res.json({ success: false, message: "Internal server error" });

    }
}

const queryResponse = async (req, res) => {
    try {
        const { response } = req.body;
        const queryId = req.params.id;

        if (!queryId) {
            return res.json({ success: false, message: "Query ID is required" });
        }
        if (!response) {
            return res.json({ success: false, message: "Response is required" });
        }

        const query = await Query.findById(queryId);
        if (!query) {
            return res.json({ success: false, message: "Query not found" });
        }
 
        query.response = response;
        query.isResponded = true;
        await query.save();
 
        const subject = "Response to Your Support Query";
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #4A90E2;">Hello ${query.name},</h2>
              <p>Thank you for reaching out to us. Below is our response to your query: <strong>${query.message}</strong></p>

              <blockquote style="margin: 16px 0; padding: 10px 16px; background-color: #f9f9f9; border-left: 4px solid #4A90E2;">
                ${response}
              </blockquote>

              <p>If you have any further questions, feel free to reply to this email.</p>

              <br/>
              <p>Best regards,<br/>
              <strong>Project-Partner</strong><br/>
              Support Team</p>
            </div>
        `;
 
        await sendMail(query.email, subject, html);

        res.json({ success: true, message: "Response saved and email sent." });

    } catch (error) {
        console.error("Error responding to query:", error);
        res.json({ success: false, message: "Internal server error" });
    }
};

const deleteQuery= async(req,res)=>{
    try {
        const queryId = req.params.id;
        if (!queryId) {
            return res.json({ success: false, message: "Query ID is required" });
        }
  

        await Query.findByIdAndDelete(queryId);
        res.json({ success: true, message: "Query deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting query:", error);
        res.json({ success: false, message: error.message });
        
    }
}




export { loginAdmin, getAllProjects, getAllUsers, deleteProject, deleteUser, fetchQueries,queryResponse,deleteQuery };
