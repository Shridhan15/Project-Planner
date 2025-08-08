
import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  techStack: { type: [String], default: [] },
  skillsRequired: { type: [String], default: [] },
  image: String,
  imagePublicId: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open", // Project is open by default
  },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
