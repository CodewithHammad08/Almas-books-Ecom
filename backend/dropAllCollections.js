/**
 * dropAllCollections.js
 * Wipes the entire almas-books-store database.
 * Run from backend/: node dropAllCollections.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "./src/constant.js";

dotenv.config({ path: "./.env" });

const wipeDatabase = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("✅ Connected to MongoDB");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        if (collections.length === 0) {
            console.log("ℹ️  No collections found — database is already empty.");
        } else {
            for (const col of collections) {
                await db.dropCollection(col.name);
                console.log(`🗑️  Dropped: ${col.name}`);
            }
            console.log(`\n✅ Done — dropped ${collections.length} collection(s) from '${DB_NAME}'.`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to wipe database:", error.message);
        process.exit(1);
    }
};

wipeDatabase();
