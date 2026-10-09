const mongoose = require("mongoose");
const Event = require("../models/Event");

// CREATE EVENT
const createEvent = async (req, res) => {
    try {
        const { name, description, date, location, capacity } = req.body;

        // Validation
        if (!name || !description || !date || !location || capacity === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (capacity <= 0) {
            return res.status(400).json({
                message: "Capacity must be greater than 0"
            });
        }

        const event = await Event.create({
            name,
            description,
            date,
            location,
            capacity
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating event",
            error: error.message
        });
    }
};


// GET ALL EVENTS
const getEvents = async (req, res) => {
    try {
        const events = await Event.find();

        res.status(200).json(events);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching events",
            error: error.message
        });
    }
};


// GET SINGLE EVENT
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json(event);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching event",
            error: error.message
        });
    }
};


// UPDATE EVENT
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const { name, description, date, location, capacity } = req.body;

        // Validation
        if (capacity !== undefined && capacity <= 0) {
            return res.status(400).json({
                message: "Capacity must be greater than 0"
            });
        }

        const event = await Event.findByIdAndUpdate(
            id,
            {
                name,
                description,
                date,
                location,
                capacity
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating event",
            error: error.message
        });
    }
};


// DELETE EVENT
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting event",
            error: error.message
        });
    }
};


module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};