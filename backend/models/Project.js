import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  techStack: {
    type: [String],
    default: [],
  },
  skillsRequired: {
    type: [String],
    default: [],
  },
  image: {
    type: String, // Cloudinary image URL
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;
