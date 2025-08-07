

import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  status: { type: String, enum: ["Sent", "Accepted", "Rejected"], default: "Sent" },
});

const JoinRequest = mongoose.model("JoinRequest", joinRequestSchema);
export default JoinRequest;
