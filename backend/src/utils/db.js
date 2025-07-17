import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("db connected successfully");
    } catch (error) {
        console.log("error connecting to db");
        process.exit(1);
    }
} 