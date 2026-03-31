import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "./src/constant.js";
import { User } from "./src/models/user.model.js";
import { Admin } from "./src/models/admin.model.js";

dotenv.config({ path: "./.env" });

const checkDb = async () => {
    try {
        const rawUri = process.env.MONGODB_URI;
        let uri = rawUri;
        if (rawUri) {
            const questionIdx = rawUri.indexOf('?');
            if (questionIdx !== -1) {
                uri = `${rawUri.slice(0, questionIdx)}${DB_NAME}?${rawUri.slice(questionIdx + 1)}`;
            } else {
                const separator = rawUri.endsWith('/') ? '' : '/';
                uri = `${rawUri}${separator}${DB_NAME}`;
            }
        }
        await mongoose.connect(uri);
        
        const users = await User.find({}).lean();
        console.log("Users:", users.map(u => ({ email: u.email, pwd: u.password })));
        
        const admins = await Admin.find({}).lean();
        console.log("Admins:", admins.map(a => ({ email: a.email, pwd: a.password })));
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDb();
