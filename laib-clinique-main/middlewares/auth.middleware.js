const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();  // Load .env file

const authenticateToken = async (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // Check if the token is not present
    if (!token) {
      return res.status(403).json({ error: "Unauthorized, no token provided" });
    }

    try {
        // Ensure that the JWT_SECRET is correctly loaded from the environment variables
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ error: "Server misconfiguration: JWT secret not set" });
        }

        // Verify the token using the secret
        const decoded = jwt.verify(token, secret);

        // Find the user by the ID stored in the decoded token
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(403).json({ error: "Unauthorized, user not found" });
        }

        // Attach the user object to the request for later middleware or route handlers
        req.user = user;
        next();
    } catch (err) {

        // Handle different types of JWT errors (invalid token, expired token, etc.)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: "Invalid token" });
        }

        return res.status(500).json({ error: "Server error" });
    }
};

module.exports = authenticateToken;
