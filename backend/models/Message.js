import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        from_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, trim: true, required: true },
        seen: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
