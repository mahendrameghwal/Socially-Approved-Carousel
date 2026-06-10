import mongoose from "mongoose";
import { autoScheduleJobs } from "../controllers/blog.controller";

const connectDB = async () => {
const MongoURL: string |undefined =  process.env.MONGO_URI!;
console.log(MongoURL) 
  try {
    await mongoose.connect(MongoURL);
    console.log("MongoDB connected");
    autoScheduleJobs()

  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;