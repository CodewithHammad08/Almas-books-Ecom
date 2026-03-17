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
        price: Number(numericPrice),
        image: imageUrl,
      });
    }
  };

  return (
    <article itemScope itemType="https://schema.org/Product" className='group relative w-full max-w-[320px] rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/50 cursor-pointer'>
      {/* Image Section */}
      <div className='h-56 w-full relative overflow-hidden'>
        <img
          src={imageUrl}
          alt={title}
          itemProp="image"
          className='w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500'
          onError={(e) => { e.target.src = BgImage; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Stock / category badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isOutOfStock && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500 text-white px-2 py-1 rounded-full">
              <PackageX size={10} /> Out of Stock
            </span>
          )}
          {product?.category?.name && (
            <span className="text-[10px] font-bold bg-black/60 text-amber-400 px-2 py-1 rounded-full backdrop-blur-sm border border-amber-500/20">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Discount badge */}
        {discountPrice && discountPrice < Number(numericPrice) && (
          <span className="absolute top-3 right-3 text-[10px] font-bold bg-amber-500 text-black px-2 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>

      {/* Content */}
      <div className='p-5'>
        <h3 itemProp="name" className='font-bold text-base text-white mb-1 line-clamp-1'>{title}</h3>

        {product?.brand && (
          <p className="text-neutral-500 text-xs mb-2">{product.brand}</p>
        )}

        <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="flex items-baseline gap-2 mb-4">
          <meta itemProp="priceCurrency" content="INR" />
          <meta itemProp="price" content={numericPrice} />
          <p className='font-bold text-amber-400 text-xl'>{price}</p>
          {discountPrice && discountPrice < Number(numericPrice) && (
            <p className='text-neutral-500 text-sm line-through'>₹{discountPrice}</p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={`Add ${title} to cart`}
          className='w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-black font-bold py-2.5 rounded-xl transition-colors duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400'
        >
          <ShoppingCart size={18} strokeWidth={2.5} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}

export default Card