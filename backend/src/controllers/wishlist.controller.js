import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Wishlist } from "../models/wishlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    if (!productId) throw new ApiError(400, "Product ID is required");

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user._id,
            items: [productId]
        });
        return res.status(200).json(new ApiResponse(200, { isWishlisted: true }, "Added to wishlist"));
    }

    const index = wishlist.items.indexOf(productId);
    if (index === -1) {
        wishlist.items.push(productId);
        await wishlist.save();
        return res.status(200).json(new ApiResponse(200, { isWishlisted: true }, "Added to wishlist"));
    } else {
        wishlist.items.splice(index, 1);
        await wishlist.save();
        return res.status(200).json(new ApiResponse(200, { isWishlisted: false }, "Removed from wishlist"));
    }
});

const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items");
    
    return res.status(200).json(
        new ApiResponse(200, wishlist ? wishlist.items : [], "Wishlist fetched successfully")
    );
});

export {
    toggleWishlist,
    getWishlist
};
