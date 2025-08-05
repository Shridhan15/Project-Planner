
import { v2 as cloudinary } from "cloudinary";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { sendMail } from "../config/sendMail.js";
import Notification from "../models/Notification.js";
import { io, userSocketMap } from "../server.js";


const addProject = async (req, res) => {
    try {
        const { title, description, techStack, skillsRequired } = req.body;
        const image = req.file;

        let imageUrl = "";

        if (image) {
            const result = await cloudinary.uploader.upload(image.path, {
                resource_type: "image",
            });
            imageUrl = result.secure_url;
        }

        const newProject = new Project({
            title,
            description,
            techStack: techStack.split(",").map(skill => skill.trim()),
            skillsRequired: skillsRequired.split(",").map(skill => skill.trim()),
            image: imageUrl,
            author: req.user._id,
            status: "open",
        });

        await newProject.save();

        console.log("Project added successfully:", newProject);
        res.json({ success: true, message: "Project added successfully", project: newProject });

    } catch (error) {
        console.error("Error adding project:", error);
        res.json({ success: false, message: "Internal server error" });
    }
};


const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("author", "name email mobileNumber");
        res.json({ success: true, projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}


const sendJoinRequest = async (req, res) => {

    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId).populate("author", "name email mobileNumber");
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const author = project.author;
        const sender = req.user;

        if (!sender) {
            return res.status(401).json({ success: false, message: "Sender not authenticated" });
        }

        const subject = `🚀 Join Request for Your Project: ${project.title}`;
        const html = `
      <p>Hi ${author.name},</p>
      <p><strong>${sender.name}</strong> is interested in joining your project <strong>${project.title}</strong>.</p>
      <p><strong>Sender Details:</strong></p>
      <ul>
        <li>Email: ${sender.email}</li>
      </ul>
      <p>You can reply directly to this email to connect with them.</p>
      <p>Cheers,<br/>Project Partner Team</p>
    `;

        const notification = await Notification.create({
            recipient: project.author._id,
            sender: sender._id,
            message: `You have a join request from ${req.user.name}. Check your email to contact.`,
        });

        // Emit in real time (if online)
        const socketId = userSocketMap.get(author._id.toString());
        if (socketId) {
            io.to(socketId).emit("new_notification", notification);
            console.log("Real-time notification sent to:", socketId);
        } else {
            console.log("Author not online (socket not found).");
        }

        await sendMail(author.email, subject, html);
        res.json({ success: true, message: "Join request sent and notification created." });

    } catch (error) {
        console.error("Error sending join request:(in controller)", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const closeProject = async (req, res) => {

    try {

        const { projectId } = req.params;
        if (!projectId) {
            return res.json({ success: false, message: "Project ID is required" });
        }

        await Project.findByIdAndUpdate(projectId, { status: 'closed' });
        res.json({ success: true, message: "Project closed successfully" });

    } catch (error) {
        console.error("Error closing project:", error);
        res.json({ success: false, message: "Internal server error" });

    }
}





export { addProject, getProjects, sendJoinRequest, closeProject };
