import React, { useEffect, useState } from 'react'
import Card from './card';
import { ArrowRight  } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Let's assume the response sends back { data: [...] } or the products directly
        // We'll limit it to 4 products for the homepage listing
        const allProducts = response.data.data || response.data || [];
        setProducts(allProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='w-full h-auto py-12 md:py-20 bg-black'>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className='text-white text-center text-3xl md:text-5xl font-bold mb-3 md:mb-4'>Featured Products</h2>
        <p className='text-neutral-400 text-center text-base md:text-xl font-medium mb-8 md:mb-12'>Popular items this month</p>
        
        {/* Cards */}
        {loading ? (
          <div className="text-amber-500 text-center py-10">Loading products...</div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 justify-items-center'>
            {products.map((product) => (
              <Card 
                key={product._id || product.id} 
                product={product}
                title={product.name || product.title} 
                price={`${product.price}₹`} 
              />
            ))}
          </div>
        )}

        <div className="mt-10 md:mt-16 flex justify-center">
          <Link to="/shop" className="group bg-amber-400 px-6 py-3 md:px-8 md:py-4 flex items-center gap-3 text-black rounded-full font-bold text-base md:text-xl hover:bg-amber-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            View All Products
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} md:size={24} strokeWidth={2.5}/>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductListing