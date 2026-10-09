const jwt = require("jsonwebtoken");


// ==========================================
// AUTHENTICATE TOKEN
// ==========================================

const authenticateToken = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid token"
        });
    }
};


// ==========================================
// ADMIN AUTHORIZATION
// ==========================================

const authorizeAdmin = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    next();
};


module.exports = {
    authenticateToken,
    authorizeAdmin
};