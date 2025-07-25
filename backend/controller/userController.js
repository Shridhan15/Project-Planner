import User from "../models/User.js";
import Project from "../models/Project.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const registerUser= async(req,res)=>{

    const errors= validationResult(req);
    if(!errors.isEmpty()){
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

const loginUser= async(req,res)=>{
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

const fetchUserProfile= async(req,res)=>{

    try {
        const user=await User.findById(req.user._id)
        if(!user){
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.json({ success: false, message: "Internal server error" });
        
    }
}

const updateProfile= async(req, res) => {
    try {

        const updates= req.body;

        const updateUser= await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        );

        res.json({ success: true, user: updateUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.json({ success: false, message: "Internal server error" });
        
    }
}


const getUserProjects= async(req,res)=>{
    try {

        const userId= req.user._id;
        const userProjects= await Project.find({ author: userId }).populate("author", "name email");
        if (!userProjects) {
            return res.json({ success: false, message: "No projects found for this user" });
        }
        res.json({ success: true, projects: userProjects });
        
    } catch (error) {
        console.error("Error fetching user projects:", error);
        res.json({ success: false, message: "Internal server error" });
        
    }
}

export { registerUser, loginUser, fetchUserProfile,updateProfile,getUserProjects };