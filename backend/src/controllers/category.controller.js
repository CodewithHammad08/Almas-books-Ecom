import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, icon } = req.body;
    
    if (!name) {
        throw new ApiError(400, "Category name is required");
    }

    const category = await Category.create({ name, icon });

    return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

export {
    getCategories,
    createCategory
};
