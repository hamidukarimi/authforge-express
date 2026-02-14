import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";



const PORT = env.port || 5000;

const startServer = async () => {
  try {
    await connectDB(); // Connect DB first

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
