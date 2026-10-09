const express = require("express");

const router = express.Router();


// ======================================================
// CONTROLLERS
// ======================================================

const {
    createUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");


// ======================================================
// MIDDLEWARE
// ======================================================

const {
    authenticateToken
} = require("../middleware/authMiddleware");


// ======================================================
// CREATE USER
// POST /api/users
// ======================================================
// Public API
// Anyone can create/register a user

router.post(
    "/",
    createUser
);


// ======================================================
// LOGIN USER
// POST /api/users/login
// ======================================================
// Public API
// No token required

router.post(
    "/login",
    loginUser
);


// ======================================================
// GET ALL USERS
// GET /api/users
// ======================================================
// Public API

router.get(
    "/",
    getUsers
);


// ======================================================
// GET USER BY ID
// GET /api/users/:id
// ======================================================
// Public API

router.get(
    "/:id",
    getUserById
);


// ======================================================
// UPDATE USER
// PUT /api/users/:id
// ======================================================
// Login/token required

router.put(
    "/:id",
    authenticateToken,
    updateUser
);


// ======================================================
// DELETE USER
// DELETE /api/users/:id
// ======================================================
// Login/token required

router.delete(
    "/:id",
    authenticateToken,
    deleteUser
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;