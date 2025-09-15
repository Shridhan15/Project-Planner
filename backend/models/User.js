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
  mobileNumber: {
    type: String,
    default: '',
  },
  yearOfStudy: { type: String, default: '' },
  technologiesKnown: [{ type: String }],

  profileImage: {
    type: String, // URL  
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
