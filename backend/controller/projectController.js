
import { v2 as cloudinary } from "cloudinary";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { sendMail } from "../config/sendMail.js";
import Notification from "../models/Notification.js";
import { io, userSocketMap } from "../server.js";
import JoinRequest from "../models/joinRequest.js";


const addProject = async (req, res) => {
    try {
        const { title, description, techStack, skillsRequired } = req.body;
        const image = req.file;

        let imageUrl = "";
        let imagePublicId = "";

        if (image) {
            const result = await cloudinary.uploader.upload(image.path, {
                resource_type: "image",
            });
            imageUrl = result.secure_url;
            imagePublicId = result.public_id; // Store the public ID for future reference(while deleting the image)
        }

        const newProject = new Project({
            title,
            description,
            techStack: techStack.split(",").map(skill => skill.trim()),
            skillsRequired: skillsRequired.split(",").map(skill => skill.trim()),
            image: imageUrl,
            author: req.user._id,
            imagePublicId: imagePublicId,
            status: "open",
        });

        await newProject.save();

        console.log("Project added successfully:", newProject);
        res.json({ success: true, message: "Project added successfully", project: newProject });

    } catch (error) {
        console.error("Error adding project(in controller):", error);
        res.json({ success: false, message: "Internal server error" });
    }
};


const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("author", "_id name email mobileNumber");
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
        const existingRequest = await JoinRequest.findOne({
            project: projectId,
            sender: sender._id,
        });
        if (existingRequest) {
            return res.status(400).json({ success: false, message: "Request already sent" });
        }
        const joinRequest = await JoinRequest.create({
            project: projectId,
            sender: sender._id,
            receiver: project.author._id,
            status: 'Sent',
        });

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

        let notification = await Notification.create({
            recipient: project.author._id,
            sender: sender._id,
            project: projectId,
            type: 'joinRequest',
            joinRequest: joinRequest._id,
            //  
            message: `You have a new join request for your project ${project.title} from ${sender.name}.`,
        });
        notification = await notification.populate([
            { path: 'sender', select: 'name _id' },
            { path: 'joinRequest', select: 'status _id sender project receiver' },
        ]);



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


const acceptJoinRequest = async (req, res) => {
    try {
        const { requestId } = req.params; // ✅ join request ID from frontend
        const request = await JoinRequest.findByIdAndUpdate(
            requestId,
            { status: 'Accepted' },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ success: false, message: "Join request not found" });
        }

        const projectData = await Project.findById(request.project)
            .populate("author", "name email mobileNumber");

        const notification = await Notification.create({
            recipient: request.sender,
            sender: request.receiver,
            project: request.project,
            joinRequest: request._id,
            type: 'responseToRequest',
            message: `Your join request for the project ${projectData.title} has been accepted by ${projectData.author.name}.`,
        });

        const socketId = userSocketMap.get(request.sender.toString());
        if (socketId) io.to(socketId).emit("new_notification", notification);

        res.json({ success: true, message: "Join request accepted", request });
    } catch (error) {
        console.error("Error accepting join request:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const rejectJoinRequest = async (req, res) => {

    try {

        const { requestId } = req.params; //   join request ID from frontend
        const request = await JoinRequest.findByIdAndUpdate(
            requestId,
            { status: 'Rejected' },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ success: false, message: "Join request not found" });
        }
        const projectData = await Project.findById(request.project).populate("author", "name email mobileNumber");
        if (!projectData) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        const notification = await Notification.create({
            recipient: request.sender,
            sender: request.receiver,
            project: request.project,
            joinRequest: request._id,
            type: 'responseToRequest',
            message: `Your join request for the project ${projectData.title} has been rejected by the ${projectData.author.name}.`,
        });

        const socketId = userSocketMap.get(request.sender.toString());
        if (socketId) io.to(socketId).emit("new_notification", notification);


        res.json({ success: true, message: "Join request rejected", request });

    } catch (error) {
        console.error("Error rejecting join request:(in controller)", error);
        res.json({ success: false, message: error.message });

    }
}




export { addProject, getProjects, sendJoinRequest, closeProject, acceptJoinRequest, rejectJoinRequest };
