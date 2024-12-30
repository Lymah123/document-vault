// Middleware for verifying user authentication

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // More robust token extraction
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  try {
    // Use environment variable with a fallback for safety
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret); // Use the secret variable

    req.user = decoded; // Attach user data to request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    // More detailed error handling
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
