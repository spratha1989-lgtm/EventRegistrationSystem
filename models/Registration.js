const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        status: {
            type: String,
            enum: ["REGISTERED", "CANCELLED"],
            default: "REGISTERED"
        },

        registeredAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

registrationSchema.index(
    { user: 1, event: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "Registration",
    registrationSchema
);