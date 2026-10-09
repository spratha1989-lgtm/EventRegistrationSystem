
const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const User = require("../models/User");
const Event = require("../models/Event");

// Register a user for an event
const registerForEvent = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        const { eventId } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "User information not found in token"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        if (
            typeof eventId !== "string" ||
            !mongoose.Types.ObjectId.isValid(eventId.trim())
        ) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const cleanEventId = eventId.trim();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const event = await Event.findById(cleanEventId);
        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const existingRegistration = await Registration.findOne({
            user: userId,
            event: cleanEventId
        });

        if (existingRegistration) {
            if (existingRegistration.status === "REGISTERED") {
                return res.status(400).json({
                    message: "User is already registered for this event"
                });
            }

            const activeCount = await Registration.countDocuments({
                event: cleanEventId,
                status: "REGISTERED"
            });

            if (activeCount >= event.capacity) {
                return res.status(400).json({
                    message: "Event is full"
                });
            }

            existingRegistration.status = "REGISTERED";
            existingRegistration.registeredAt = new Date();

            await existingRegistration.save();

            return res.status(200).json({
                message: "Registration successful again",
                registration: existingRegistration
            });
        }

        const activeCount = await Registration.countDocuments({
            event: cleanEventId,
            status: "REGISTERED"
        });

        if (activeCount >= event.capacity) {
            return res.status(400).json({
                message: "Event is full"
            });
        }

        const registration = await Registration.create({
            user: userId,
            event: cleanEventId,
            status: "REGISTERED"
        });

        return res.status(201).json({
            message: "User registered successfully",
            registration
        });
    } catch (error) {
        console.error("Registration Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "A registration already exists for this user and event"
            });
        }

        return res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
};

// Get registrations for the logged-in user
const getUserRegistrations = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({
                message: "Invalid user information in token"
            });
        }

        const registrations = await Registration.find({
            user: userId
        })
            .populate("user", "name email role")
            .populate(
                "event",
                "name description date location capacity"
            );

        return res.status(200).json({
            message: "User registrations fetched successfully",
            registrations
        });
    } catch (error) {
        console.error("Get User Registrations Error:", error);

        return res.status(500).json({
            message: "Error fetching registrations",
            error: error.message
        });
    }
};

// Get active registrations for an event (admin only)
const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;

        console.log("Event ID received:", eventId);

        if (
            typeof eventId !== "string" ||
            !mongoose.Types.ObjectId.isValid(eventId.trim())
        ) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const cleanEventId = eventId.trim();
        const event = await Event.findById(cleanEventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const registrations = await Registration.find({
            event: cleanEventId,
            status: "REGISTERED"
        })
            .populate("user", "name email role")
            .populate(
                "event",
                "name description date location capacity"
            );

        return res.status(200).json({
            message: "Event registrations fetched successfully",
            registrations
        });
    } catch (error) {
        console.error("Get Event Registrations Error:", error);

        return res.status(500).json({
            message: "Error fetching registrations",
            error: error.message
        });
    }
};

// Cancel your own registration
const cancelRegistration = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user?.id || req.user?._id;

        console.log("Registration ID received:", JSON.stringify(id));
        console.log("Registration ID length:", id?.length);

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({
                message: "Invalid user information in token"
            });
        }

        if (
            typeof id !== "string" ||
            !mongoose.Types.ObjectId.isValid(id.trim())
        ) {
            return res.status(400).json({
                message: "Invalid registration ID",
                receivedId: id,
                receivedLength: id?.length
            });
        }

        const cleanId = id.trim();
        const registration = await Registration.findById(cleanId);

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        if (registration.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You can cancel only your own registration"
            });
        }

        if (registration.status === "CANCELLED") {
            return res.status(400).json({
                message: "Registration is already cancelled"
            });
        }

        registration.status = "CANCELLED";
        await registration.save();

        return res.status(200).json({
            message: "Registration cancelled successfully",
            registration
        });
    } catch (error) {
        console.error("Cancel Registration Error:", error);

        return res.status(500).json({
            message: "Error cancelling registration",
            error: error.message
        });
    }
};

module.exports = {
    registerForEvent,
    getUserRegistrations,
    getEventRegistrations,
    cancelRegistration
};
