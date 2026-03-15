import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().populate('category', 'name icon');
    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category', 'name icon');
    
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    
    if ([name, price].some((field) => field?.toString().trim() === "")) {
        throw new ApiError(400, "Name and price are required");
    }

    let imageUrl = "";
    if (req.file) {
        const uploadedImage = await uploadOnCloudinary(req.file.path);
        if (uploadedImage) {
            imageUrl = uploadedImage.url;
        }
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock: stock || 0,
        image: imageUrl
    });

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (req.file) {
        const uploadedImage = await uploadOnCloudinary(req.file.path);
        if (uploadedImage) {
            product.image = uploadedImage.url;
        }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;

    const updatedProduct = await product.save();

    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
