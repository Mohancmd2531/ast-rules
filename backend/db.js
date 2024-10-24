// db.js
import mongoose from "mongoose";
import Rule from "./models/Rule.js"; // Import the Rule model

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect("mongodb://localhost:27017/ast-rules");
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Clear the collection on server start (optional)
    await Rule.deleteMany({}); // This will remove all documents from the Rule collection

    console.log("All rules have been cleared.");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
