import express from "express";
import connectDB from "./db.js"; // Import your database connection function
import ruleRoutes from "./routes/rules.js"; // Import routes
import events from "events";

// Increase the max listeners limit to avoid the warning
events.EventEmitter.defaultMaxListeners = 20; // or any number greater than 10

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use rule routes
app.use("/api", ruleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for testing
export { app };
//export default app;
