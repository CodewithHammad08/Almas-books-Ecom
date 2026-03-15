import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "./src/constant.js";
import { User } from "./src/models/user.model.js";

dotenv.config({ path: "./.env" });

const seedAdmin = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Connected to MongoDB for Admin Seeding");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "zubair36@gmail.com" });
        if (existingAdmin) {
            console.log("Admin account (zubair36@gmail.com) already exists. Skipping.");
            process.exit(0);
            return;
        }

        const admin = await User.create({
            name: "Owner",
            email: "zubair36@gmail.com",
            password: "password123", // Pre-save hook will hash this
            phone: "9833660690",
            role: "admin",
            address: {
                street: "Store HQ"
            }
        });

        console.log("Admin account created successfully!");
        console.log("Login: admin@almas.com");
        console.log("Pass: password123");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed", error);
        process.exit(1);
    }
};

seedAdmin();
