import React from 'react'
import BgImage from "../assets/lib.png";
import { ShoppingCart, PackageX } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Card = ({ title, price, product }) => {
  const numericPrice = price ? price.toString().replace(/[^0-9.]/g, '') : '';
  const { addToCart } = useCart();

  // Support both new schema (images[]) and old schema (image string)
  const imageUrl = product?.images?.[0]?.url || product?.image || BgImage;
  const isOutOfStock = product?.stock === 0;
  const discountPrice = product?.discountPrice;

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

  return (
    <article itemScope itemType="https://schema.org/Product" className='group relative w-full h-full flex flex-col rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/50 cursor-pointer'>
      {/* Image Section */}
      <div className='h-40 sm:h-56 w-full relative overflow-hidden shrink-0'>
        <img
          src={imageUrl}
          alt={title}
          itemProp="image"
          className='w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500'
          onError={(e) => { e.target.src = BgImage; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Stock / category badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          {isOutOfStock && (
            <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 sm:py-1 rounded-full">
              <PackageX size={10} /> <span className="hidden sm:inline">Out of Stock</span><span className="sm:hidden">OOS</span>
            </span>
          )}
          {product?.category?.name && (
            <span className="text-[9px] sm:text-[10px] font-bold bg-black/60 text-amber-400 px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm border border-amber-500/20 line-clamp-1 max-w-[80px] sm:max-w-none">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Discount badge */}
        {discountPrice && discountPrice < Number(numericPrice) && (
          <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg">
            SALE
          </span>
        )}

        {/* Floating Add to Cart for Mobile */}
        <button
          onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
          disabled={isOutOfStock}
          aria-label={`Add ${title} to cart`}
          className='absolute bottom-2 right-2 md:hidden bg-amber-400 hover:bg-amber-500 text-black p-2 rounded-full shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:bg-neutral-700'
        >
          {isOutOfStock ? <PackageX size={14} /> : <ShoppingCart size={14} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Content */}
      <div className='p-3 sm:p-5 flex flex-col flex-1'>
        <h3 itemProp="name" className='font-bold text-[13px] sm:text-base text-white mb-1 leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-0'>{title}</h3>

        {product?.brand && (
          <p className="text-neutral-500 text-[10px] sm:text-xs mb-2 line-clamp-1">{product.brand}</p>
        )}

        <div className="mt-auto pt-2">
          <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-3 sm:mb-4">
            <meta itemProp="priceCurrency" content="INR" />
            <meta itemProp="price" content={discountPrice && discountPrice < Number(numericPrice) ? discountPrice : numericPrice} />
            {discountPrice && discountPrice < Number(numericPrice) ? (
              <>
                <p className='font-bold text-amber-400 text-sm sm:text-xl'>₹{discountPrice}</p>
                <p className='text-neutral-500 text-[10px] sm:text-sm line-through'>{price}</p>
              </>
            ) : (
              <p className='font-bold text-amber-400 text-sm sm:text-xl'>{price}</p>
            )}
          </div>

          {/* Desktop Add to Cart */}
          <button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
            disabled={isOutOfStock}
            aria-label={`Add ${title} to cart`}
            className='hidden md:flex w-full items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-black font-bold py-2.5 rounded-xl transition-colors duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400 text-sm'
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default Card
