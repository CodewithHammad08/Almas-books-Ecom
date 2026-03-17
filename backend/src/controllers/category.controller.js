import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, icon, description } = req.body;

    if (!name?.trim()) throw new ApiError(400, "Category name is required");

    const existing = await Category.findOne({ name: { $regex: `^${name.trim()}$`, $options: "i" } });
    if (existing) throw new ApiError(409, "Category already exists");

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const category = await Category.create({
        name: name.trim(),
        slug,
        icon: icon || "",
        description: description || ""
    });

    return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new ApiError(404, "Category not found");
    return res.status(200).json(new ApiResponse(200, {}, "Category deleted"));
});

export { getCategories, createCategory, deleteCategory };
