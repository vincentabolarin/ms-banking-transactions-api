import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info("MongoDB Connected");
  } catch (error) {
    if (error instanceof Error) {
      logger.error("MongoDB connection error:", error.message);
    } else {
      logger.error("An unknown error occurred:", error);
    }
  }
};

export default connectDB;
