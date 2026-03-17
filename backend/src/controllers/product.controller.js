import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isActive: true })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category', 'name slug');
    
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, discountPrice, category, brand, stock, tags, imageUrl } = req.body;
    
    if (!name || !price) {
        throw new ApiError(400, "Name and price are required");
    }

    // Build images array — either from a provided Cloudinary URL or empty
    const images = imageUrl ? [{ url: imageUrl, public_id: "" }] : [];

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const product = await Product.create({
        name,
        slug,
        description: description || "",
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        category: (category && category !== 'null' && category !== '') ? category : null,
        brand: brand || "",
        stock: stock ? Number(stock) : 0,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())) : [],
        images,
        createdBy: req.user?._id || null
    });

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});


const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, price, discountPrice, category, stock, brand, tags, imageUrl } = req.body;

    const product = await Product.findById(id);
    if (!product) throw new ApiError(404, "Product not found");

    // Update all fields if provided
    if (name !== undefined) {
        product.name = name;
        product.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = discountPrice ? Number(discountPrice) : null;
    if (category !== undefined) product.category = (category && category !== 'null' && category !== '') ? category : null;
    if (stock !== undefined) product.stock = Number(stock);
    if (brand !== undefined) product.brand = brand;
    if (tags !== undefined) product.tags = Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim()).filter(Boolean);

    // Update image URL — store in images array
    if (imageUrl !== undefined) {
        product.images = imageUrl ? [{ url: imageUrl, public_id: "" }] : [];
    }

    const updatedProduct = await product.save({ validateModifiedOnly: true });

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
