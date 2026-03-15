import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "./src/constant.js";

dotenv.config({ path: "./.env" });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  stock: { type: Number, default: 0 }
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const mockProducts = [
  { name: "Executive Leather Diary", description: "Premium executive leather diary for professionals.", price: 950, stock: 50 },
  { name: "Complete Sketching Kit", description: "All-in-one sketching kit for artists.", price: 1200, stock: 30 },
  { name: "Desktop File Organizer", description: "Keep your workspace tidy.", price: 850, stock: 100 },
  { name: "School Stationery Bundle", description: "Everything a student needs.", price: 450, stock: 200 },
  { name: "Premium Fountain Pen", description: "Smooth writing fountain pen.", price: 1500, stock: 20 },
  { name: "Acrylic Paint Set", description: "Vibrant acrylic colors.", price: 650, stock: 60 },
  { name: "Scientific Calculator", description: "Advanced calculator for complex math.", price: 800, stock: 40 },
  { name: "Canvas Board (Set of 3)", description: "High-quality canvas boards.", price: 300, stock: 150 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Connected to MongoDB for Seeding");

    await Product.deleteMany({}); // Clear existing products (optional, but good for fresh seed)
    console.log("Cleared existing Products");

    await Product.insertMany(mockProducts);
    console.log("Successfully seeded mock products!");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed", error);
    process.exit(1);
  }
};

seedDB();
