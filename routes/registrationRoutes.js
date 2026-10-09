
const express = require("express");

const router = express.Router();

const {
    registerForEvent,
    getUserRegistrations,
    getEventRegistrations,
    cancelRegistration
} = require("../controllers/registrationController");

const {
    authenticateToken,
    authorizeAdmin
} = require("../middleware/authMiddleware");

// REGISTER FOR EVENT
// POST /api/registrations
router.post(
    "/",
    authenticateToken,
    registerForEvent
);

// GET LOGGED-IN USER'S REGISTRATIONS
// GET /api/registrations/user
router.get(
    "/user",
    authenticateToken,
    getUserRegistrations
);

// GET EVENT REGISTRATIONS (ADMIN ONLY)
// GET /api/registrations/event/:eventId
router.get(
    "/event/:eventId",
    authenticateToken,
    authorizeAdmin,
    getEventRegistrations
);

// CANCEL OWN REGISTRATION
// DELETE /api/registrations/:id
router.delete(
    "/:id",
    authenticateToken,
    cancelRegistration
);

module.exports = router;
