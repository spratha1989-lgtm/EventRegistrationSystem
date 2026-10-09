const express = require("express");

const router = express.Router();

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

const {
    authenticateToken,
    authorizeAdmin
} = require("../middleware/authMiddleware");


// ==========================================
// GET ALL EVENTS
// ==========================================
// Public API
// Anyone can view events

router.get("/", getEvents);


// ==========================================
// GET EVENT BY ID
// ==========================================
// Public API
// Anyone can view a particular event

router.get("/:id", getEventById);


// ==========================================
// CREATE EVENT
// ==========================================
// Only ADMIN can create an event

router.post(
    "/",
    authenticateToken,
    authorizeAdmin,
    createEvent
);


// ==========================================
// UPDATE EVENT
// ==========================================
// Only ADMIN can update an event

router.put(
    "/:id",
    authenticateToken,
    authorizeAdmin,
    updateEvent
);


// ==========================================
// DELETE EVENT
// ==========================================
// Only ADMIN can delete an event

router.delete(
    "/:id",
    authenticateToken,
    authorizeAdmin,
    deleteEvent
);


module.exports = router;