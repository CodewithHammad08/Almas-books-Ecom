import React from 'react'
import BgImage from "../assets/lib.png";
import { ShoppingCart, PackageX, Heart, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Card = ({ title, price, product, onOpen }) => {
  const numericPrice = price ? price.toString().replace(/[^0-9.]/g, '') : '';
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  // Support both new schema (images[]) and old schema (image string)
  const imageUrl = product?.images?.[0]?.url || product?.image || BgImage;
  const isOutOfStock = product?.stock === 0;
  const discountPrice = product?.discountPrice;
  const isSelected = isInWishlist(product?._id || product?.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (product) {
      addToCart({
        _id: product._id || product.id,
        name: title,
        price: (discountPrice && discountPrice < Number(numericPrice)) ? discountPrice : Number(numericPrice),
        image: imageUrl,
      });
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to use wishlist");
      return;
    }
    toggleWishlist(product);
  };

  return (
    <article 
      itemScope 
      itemType="https://schema.org/Product" 
      onClick={() => onOpen?.(product)}
      className='group relative w-full h-full flex flex-col rounded-[32px] overflow-hidden border border-white/5 bg-neutral-900/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:border-amber-400/30 cursor-pointer animate-in fade-in zoom-in duration-700'
    >
      {/* Decorative Gradient Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-400/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Image Section */}
      <div className='h-40 sm:h-52 w-full relative overflow-hidden shrink-0 bg-black/20'>
        <img
          src={imageUrl}
          alt={title}
          itemProp="image"
          className='w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-700 ease-out p-4'
          onError={(e) => { e.target.src = BgImage; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-60" />

        {/* Informative Badges (Top Left) */}
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-20 pointer-events-none">
          {isOutOfStock && (
            <span className="flex items-center gap-1.5 text-[10px] font-black bg-red-500/90 text-white px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg uppercase tracking-widest">
              <PackageX size={12} strokeWidth={3} /> <span className="hidden xs:inline">Sold Out</span> <span className="xs:hidden">OOS</span>
            </span>
          )}
          {product?.category?.name && (
            <span className="text-[10px] font-black bg-black/60 text-amber-400 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 uppercase tracking-widest shadow-lg truncate max-w-[80px] sm:max-w-none">
              {product.category.name}
            </span>
          )}
          {discountPrice && discountPrice < Number(numericPrice) && (
            <div className="bg-amber-400 text-black font-black text-[10px] px-3 py-1.5 rounded-full shadow-[0_10px_20px_rgba(251,191,36,0.3)] uppercase tracking-tighter text-center animate-pulse">
              -{Math.round((1 - discountPrice/Number(numericPrice)) * 100)}%
            </div>
          )}
        </div>

        {/* Action Buttons (Top Right) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2.5 z-20">
          <button
            onClick={handleWishlistClick}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all duration-500 transform active:scale-90 ${
              isSelected 
              ? 'bg-red-500 text-white border-red-500 shadow-[0_10px_20px_rgba(239,68,68,0.2)]' 
              : 'bg-black/60 border-white/20 text-white hover:border-amber-400 hover:text-amber-400 shadow-lg'
            }`}
            title={isSelected ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} fill={isSelected ? "currentColor" : "none"} strokeWidth={3} />
          </button>
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/20 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-500 shadow-lg hidden sm:flex cursor-pointer">
            <Eye size={16} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 sm:p-6 flex flex-col flex-1'>
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} strokeWidth={2.5} />
              ))}
            </div>
            {product.reviewsCount > 0 && (
              <span className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">({product.reviewsCount})</span>
            )}
          </div>
          
          <h3 itemProp="name" className='font-black text-sm sm:text-base text-white mb-1 leading-tight tracking-tight line-clamp-2 min-h-[2.5rem] group-hover:text-amber-400 transition-colors'>
            {title}
          </h3>

          {product?.brand && (
            <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.2em]">{product.brand}</p>
          )}
        </div>

        <div className="mt-auto">
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="flex items-baseline gap-2 mb-4">
            <meta itemProp="priceCurrency" content="INR" />
            <meta itemProp="price" content={discountPrice && discountPrice < Number(numericPrice) ? discountPrice : numericPrice} />
            {discountPrice && discountPrice < Number(numericPrice) ? (
              <>
                <p className='font-black text-amber-400 text-xl sm:text-2xl tracking-tighter'>₹{discountPrice}</p>
                <p className='text-neutral-600 text-[10px] sm:text-xs line-through font-bold'>₹{numericPrice}</p>
              </>
            ) : (
              <p className='font-black text-amber-400 text-xl sm:text-2xl tracking-tighter'>₹{numericPrice}</p>
            )}
          </div>

          {/* Add to Cart CTA - Text shortened for one-line fit */}
          <button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
            disabled={isOutOfStock}
            aria-label={`Add ${title} to cart`}
            className='flex w-full items-center justify-center gap-2 bg-amber-400 hover:bg-white disabled:opacity-30 text-black font-black py-3 sm:py-3.5 rounded-2xl transition-all duration-300 active:scale-95 shadow-xl shadow-amber-400/20 disabled:cursor-not-allowed group/btn overflow-hidden relative'
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            <ShoppingCart size={18} strokeWidth={3} className="relative z-10 shrink-0" />
            <span className="relative z-10 uppercase tracking-[0.15em] text-[10px] sm:text-xs whitespace-nowrap">
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default Card
