import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        default: ""
    },
    icon: {
        type: String,
        default: ""
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const Category = mongoose.model("Category", CategorySchema);
