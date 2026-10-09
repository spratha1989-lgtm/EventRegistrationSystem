
require("dotenv").config();

const mongoose = require("mongoose");
const Registration = require("./models/Registration");

async function checkRegistration() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const registrations = await Registration.find()
            .select("_id user event status")
            .lean();

        console.log("\nRegistration details:\n");

        registrations.forEach((r) => {
            console.log({
                registrationId: r._id.toString(),
                idLength: r._id.toString().length,
                userId: r.user.toString(),
                eventId: r.event.toString(),
                status: r.status
            });
        });
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkRegistration();
