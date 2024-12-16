require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const path = require("path");

// Custom modules
const dbConnection = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

// Initialize app
const app = express();

// Constants
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(cors()); // Enable CORS
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// Database connection
dbConnection().then(() => {
  console.log("Database connected successfully.");
}).catch((err) => {
  console.error("Database connection failed:", err);
  process.exit(1); // Exit process on critical error
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
