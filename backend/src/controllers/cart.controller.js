import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }
    return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
        // Product exists in the cart, update the quantity
        cart.items[itemIndex].quantity += quantity ? Number(quantity) : 1;
    } else {
        // Product does not exist in cart, add new item
        cart.items.push({ product: productId, quantity: quantity ? Number(quantity) : 1, priceAtAdd: product.price });
    }

    await cart.save();
    
    // populate before sending
    await cart.populate('items.product');

    return res.status(200).json(new ApiResponse(200, cart, "Item added to cart successfully"));
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await cart.save();
    
    await cart.populate('items.product');

    return res.status(200).json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});

const syncCart = asyncHandler(async (req, res) => {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
        throw new ApiError(400, "Items must be an array");
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    cart.items = items.map(item => ({
        product: item._id || item.product,
        quantity: item.quantity,
        priceAtAdd: item.price || item.priceAtAdd || 0
    }));

    await cart.save();
    await cart.populate('items.product');

    return res.status(200).json(new ApiResponse(200, cart, "Cart synced successfully"));
});

export {
    getCart,
    addToCart,
    removeFromCart,
    syncCart
};
