import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  skills: {
    type: [String],
    default: [],
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, // URL (e.g., Cloudinary)
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
