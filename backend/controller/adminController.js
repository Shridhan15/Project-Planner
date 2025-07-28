import Project from "../models/Project.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


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




export { loginAdmin, getAllProjects, getAllUsers };
