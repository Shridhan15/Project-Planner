import Message from "../models/Message.js";

// In-memory SSE connections
const connections = {};

// SSE endpoint
export const sseController = (req, res) => {
    const userId = req.user._id.toString();
    console.log("New client connected:", userId);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    connections[userId] = res;

    res.write("data: Connected\n\n");

    req.on("close", () => {
        delete connections[userId];
        console.log("Client disconnected:", userId);
    });
};

// Send a text message
export const sendMessage = async (req, res) => {
    try {
        const from_user_id = req.user._id;
        const { to_user_id, text } = req.body;

        if (!text || !text.trim())
            return res.status(400).json({ success: false, message: "Message cannot be empty" });

        const message = await Message.create({ from_user_id, to_user_id, text });

        // Populate sender data
        const messageWithUserData = await Message.findById(message._id).populate("from_user_id to_user_id");

        // SSE push to receiver
        if (connections[to_user_id]) {
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }

        res.json({ success: true, message: messageWithUserData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all messages between two users
 
export const getChatMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const { to_user_id } = req.body;

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId }
            ]
        })
            .populate("from_user_id", "name _id profileImage")
            .populate("to_user_id", "name _id profileImage")
            .sort({ createdAt: -1 });  
        
        await Message.updateMany(
            { from_user_id: to_user_id, to_user_id: userId, seen: false },
            { seen: true }
        );

        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get recent chats for logged-in user
export const getUserRecentMessages = async (req, res) => {
    try {
        const userId = req.user._id.toString();

        // Get all messages involving the user, sorted by newest first
        const messages = await Message.find({
            $or: [{ from_user_id: userId }, { to_user_id: userId }],
        })
            .populate("from_user_id to_user_id")
            .sort({ createdAt: -1 });
 
        const chatMap = {};
        for (const msg of messages) {
            const idA = msg.from_user_id._id.toString();
            const idB = msg.to_user_id._id.toString();
            const chatId = [idA, idB].sort().join("_");
            if (!chatMap[chatId]) {
                chatMap[chatId] = {
                    _id: chatId,
                    from_user_id: msg.from_user_id,
                    to_user_id: msg.to_user_id,
                    lastMessage: msg.text,  
                };
            }
        }

        res.json({ success: true, messages: Object.values(chatMap) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
