const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ==========================================
// CREATE USER / REGISTER
// ==========================================
const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || "USER"
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Create User Error:", error);

        return res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
};


// ==========================================
// LOGIN USER
// ==========================================
const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // ==========================================
        // CREATE JWT TOKEN
        // ==========================================
        const token = jwt.sign(
            {
                // VERY IMPORTANT
                // Registration controller uses req.user.id
                id: user._id.toString(),

                email: user.email,

                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Send response
        return res.status(200).json({
            message: "Login successful",

            token: token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Error logging in",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL USERS
// ==========================================
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });

    } catch (error) {
        console.error("Get Users Error:", error);

        return res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
};


// ==========================================
// GET USER BY ID
// ==========================================
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        console.error("Get User Error:", error);

        return res.status(500).json({
            message: "Error fetching user",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE USER
// ==========================================
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            password,
            role
        } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update fields only if provided
        if (name) {
            user.name = name;
        }

        if (email) {
            user.email = email;
        }

        if (password) {
            user.password = password;
        }

        if (role) {
            user.role = role;
        }

        await user.save();

        return res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Update User Error:", error);

        return res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }
};


// ==========================================
// DELETE USER
// ==========================================
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete User Error:", error);

        return res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
    createUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};