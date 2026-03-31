import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        // Build the URI: insert DB_NAME before any query params (?appName=...)
        // so the final URI is: ...mongodb.net/almas-books?appName=Cluster0
        const rawUri = process.env.MONGODB_URI;
        let uri = rawUri;
        if (rawUri) {
            const questionIdx = rawUri.indexOf('?');
            if (questionIdx !== -1) {
                // Insert DB name before the query string
                uri = `${rawUri.slice(0, questionIdx)}${DB_NAME}?${rawUri.slice(questionIdx + 1)}`;
            } else {
                // No query params — safe to append directly
                const separator = rawUri.endsWith('/') ? '' : '/';
                uri = `${rawUri}${separator}${DB_NAME}`;
            }
        }
        const connectionInstance = await mongoose.connect(uri);
        console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectDB;
