import User from "../models/User.js";
import Project from "../models/Project.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";

const registerUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}

const fetchUserProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.json({ success: false, message: "Internal server error" });

    }
}

const updateProfile = async (req, res) => {
    try {

        const { name, email, mobileNumber, yearOfStudy, skills, technologiesKnown } = req.body

        if (!name || !email) {
            res.json({ success: false, message: "Data Missing" })
        }


        const profileImage = req.file
        let imageUrl = ""


        await User.findByIdAndUpdate(req.user._id, { name, email, mobileNumber, yearOfStudy, skills, technologiesKnown })
        if (profileImage) {
            const result = await cloudinary.uploader.upload(profileImage.path, {
                resource_type: "image",
            });
            imageUrl = result.secure_url;
            await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl })
        }
 
  
        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.json({ success: false, message: "Internal server error" });

    }
}


const getUserProjects = async (req, res) => {
    try {

        const userId = req.user._id;
        const userProjects = await Project.find({ author: userId }).populate("author", "name email");
        if (!userProjects) {
            return res.json({ success: false, message: "No projects found for this user" });
        }
        res.json({ success: true, projects: userProjects });

    } catch (error) {
        console.error("Error fetching user projects:", error);
        res.json({ success: false, message: "Internal server error" });

    }
}

const getAuthorProfile= async(req,res)=>{
    try{

        const authorId= req.params.id;
        const authorProfile = await User.findById(authorId).select("-password");
        if (!authorProfile) {
            return res.json({ success: false, message: "Author not found" });
        }
        res.json({ success: true, author: authorProfile });

    }catch(error){
        console.error("Error fetching author profile:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}



 const getMe = async (req, res) => {
  try {
    const user = req.user;  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({success:true,user});
  } catch (err) {
    console.error("Error in getMe controller:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
 



export { registerUser, loginUser, fetchUserProfile, updateProfile, getUserProjects, getAuthorProfile,getMe };