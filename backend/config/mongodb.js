import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log(" MongoDB connection successful");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });

        await mongoose.connect(`${process.env.MONGO_URI}/project-partner`, {

            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });

    } catch (error) {
        console.error(" Error connecting to MongoDB:", error.message);
        process.exit(1); // Stop the app if DB connection fails
    }
};

export default connectDB;
