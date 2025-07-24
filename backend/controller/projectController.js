
import { v2 as cloudinary } from "cloudinary";
import Project from "../models/Project.js";
import User from "../models/User.js";


const addProject = async (req, res) => {

    try {

        const { title, description, techStack, skillsRequired, } = req.body;
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
            status: "open", // Default status

        });

        await newProject.save();

        console.log("Project added successfully:", newProject);
        res.json({ success: true, message: "Project added successfully", project: newProject });

    } catch (error) {
        console.error("Error adding project:", error);
        res.json({ success: false, message: "Internal server error" });

    }

}


export { addProject }
