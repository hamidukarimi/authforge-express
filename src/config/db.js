// src/config/db.js

import mongoose from "mongoose";
import env from "../config/env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri);

    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
