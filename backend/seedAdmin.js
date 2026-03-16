/**
 * seedAdmin.js
 * Creates admin accounts in the new 'admins' collection.
 * Run from backend/: node seedAdmin.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "./src/constant.js";
import { Admin } from "./src/models/admin.model.js";

dotenv.config({ path: "./.env" });

const ADMINS = [
    {
        name: "Hammad",
        email: "hammaddalvi905@gmail.com",
        password: "Hammad@2006",
        role: "superadmin",
        phone: ""
    },
    {
        name: "Owner",
        email: "zubair36@gmail.com",
        password: "password123",
        role: "admin",
        phone: ""
    }
];

const seedAdmin = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("✅ Connected to MongoDB\n");

        for (const data of ADMINS) {
            const existing = await Admin.findOne({ email: data.email });
            if (existing) {
                console.log(`⚠️  Already exists: ${data.email} (${data.role}) — skipped`);
                continue;
            }
            await Admin.create(data);
            console.log(`✅ Created: ${data.email} | role: ${data.role} | password: ${data.password}`);
        }

        console.log("\n🎉 Admin seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        process.exit(1);
    }
};

seedAdmin();
