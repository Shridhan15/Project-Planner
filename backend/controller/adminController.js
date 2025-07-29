import Project from "../models/Project.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

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





export { loginAdmin, getAllProjects, getAllUsers, deleteProject, deleteUser };
