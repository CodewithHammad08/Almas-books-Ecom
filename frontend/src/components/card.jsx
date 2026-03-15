import React from 'react'
import BgImage from "../assets/lib.png";
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';


const Card = ({ title, price, product }) => {
  const numericPrice = price ? price.toString().replace(/[^0-9.]/g, '') : '';
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      // Create a cart item mapping
      addToCart({
        _id: product._id || product.id,
        name: title,
        price: Number(numericPrice),
        image: product.image || BgImage,
      });
      alert(`Added ${title} to cart`);
    } else {
      console.warn("No product data passed to Card");
    }
  };

  return (
    <article itemScope itemType="https://schema.org/Product" className='group relative w-full max-w-[320px] rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/50 cursor-pointer'>
      {/* Image Section */}
      <div className='h-64 w-full relative'>
        <img 
          src={product?.image || BgImage} 
          alt={title} 
          itemProp="image"
          className='w-full h-full object-cover object-center'
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
      </div>

      {/* Content Section */}
      <div className='p-6'>
        <h3 itemProp="name" className='font-bold text-xl text-white mb-2 line-clamp-1'>{title}</h3>
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="INR" />
          <meta itemProp="price" content={numericPrice} />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <p className='font-bold text-amber-400 text-2xl mb-4'>{price}</p>
        </div>

        <button 
          onClick={handleAddToCart}
          aria-label={`Add ${title} to cart`} 
          className='w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 rounded-xl transition-colors duration-300 active:scale-95'
        >
          <ShoppingCart size={20} strokeWidth={2.5} />
          Add to Cart
        </button>
      </div>
    </article>
  )
}

export default Card