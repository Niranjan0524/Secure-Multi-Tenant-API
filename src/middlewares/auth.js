const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    console.log("Token from header:", token);

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    console.log("auth middleware");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("User ID from token:", decoded);
        console.log("Decoded token:", decoded);
        next();
    } catch (error) {
        console.log("JWT verification error:", error.message);
        console.log("Error name:", error.name);

        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token has expired." });
        } else if (error.name === "JsonWebTokenError") {
          return res.status(403).json({ message: "Invalid token format." });
        }

        return res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = { authenticateJWT };

// {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGI1OTkwOGM0YjA2NzYwOGM5ZjI3YjEiLCJyb2xlIjoiYWRtaW4iLCJvcmdhbml6YXRpb25JZCI6IjY4YjU5OTA4YzRiMDY3NjA4YzlmMjdhZiIsImlhdCI6MTc1NjczMTcwMiwiZXhwIjoxNzU2NzM1MzAyfQ.PLlP2xlS-Hbp96cKwf6kW35ToQ-4Ww38hBYzB1Y5o88","userId":"68b59908c4b067608c9f27b1","role":"admin","organizationId":"68b59908c4b067608c9f27af"}