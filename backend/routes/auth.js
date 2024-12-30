// // User authentication routes

const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;


















// require('dotenv').config(); // Ensure .env variables are loaded

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const router = express.Router();

// // Register Route
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Name, email, and password are required" });
//     }

//     // Check if email is in valid format
//     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Please provide a valid email address" });
//     }

//     // Check if password is strong enough (optional but recommended)
//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters long" });
//     }

//     // Check if user already exists in the database
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save user in the database
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     console.error("Error during registration:", error); // Log the error for debugging
//     res.status(500).json({ message: "Server error during registration", error: error.message });
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     // Find user in the database
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Generate token using environment variable
//     const token = jwt.sign(
//       { email: user.email, id: user._id },
//       process.env.JWT_SECRET || "fallback_secret",
//       { expiresIn: "1h" }
//     );

//     res.json({ message: "Login successful", token });
//   } catch (error) {
//     console.error("Error during login:", error); // Log the error for debugging
//     res.status(500).json({ message: "Server error during login", error: error.message });
//   }
// });

// module.exports = router;
