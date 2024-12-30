const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const fs = require("fs");
const https = require("https");
const authMiddleware = require("./middleware/authMiddleware");
const limiter = require("./middleware/rateLimiter");
// Initialize express
const app = express();

// Configure environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors({
  origin: "https://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(limiter);

// Load routes
const uploadRoute = require("./routes/upload");
const authRoutes = require("./routes/auth");

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Document Vault API!");
});

// Route configurations
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoute);

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// SSL configuration
const options = {
  key: fs.readFileSync('ssl/private-key.pem'),
  cert: fs.readFileSync('ssl/certificate.pem')
};

// Create HTTPS server
const server = https.createServer(options, app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Secure server running on port ${PORT}`);
});
