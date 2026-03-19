import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import Card from '../card';
import ProductDetailsModal from "../ProductDetailsModal";
import { useState } from 'react';

const Wishlist = () => {
    const { user, loading: authLoading } = useAuth();
    const { wishlistItems, loading: wishlistLoading } = useWishlist();
    const [selectedProduct, setSelectedProduct] = useState(null);

    if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-amber-500 font-bold">Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Link to="/shop" className="inline-flex items-center gap-2 text-neutral-500 hover:text-amber-500 transition-colors mb-4 text-sm font-bold group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Shop
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            My <span className="text-amber-500">Wishlist</span>
                        </h1>
                        <p className="text-neutral-400 mt-2">Products you've saved for later</p>
                    </div>
                    <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 px-6 py-4 rounded-3xl">
                        <p className="text-neutral-500 text-xs uppercase font-bold tracking-widest mb-1">Total Items</p>
                        <p className="text-2xl font-black text-white">{wishlistItems.length} <span className="text-amber-500 text-sm">Products</span></p>
                    </div>
                </div>

                {/* Content */}
                {wishlistLoading ? (
                    <div className="text-center py-20 text-amber-500 font-bold">Updating your wishlist...</div>
                ) : wishlistItems.length === 0 ? (
                    <div className="text-center py-24 bg-neutral-900/30 rounded-[40px] border border-neutral-800/50">
                        <div className="bg-neutral-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-700">
                            <Heart size={40} className="text-neutral-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">See something you like? Tap the heart icon to save it here for later.</p>
                        <Link 
                            to="/shop" 
                            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:-translate-y-1"
                        >
                            <ShoppingBag size={20} />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {wishlistItems.map((product) => (
                            <Card 
                                key={product._id} 
                                title={product.name} 
                                price={`₹${product.price}`} 
                                product={product} 
                                onOpen={(p) => setSelectedProduct(p)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedProduct && (
                <ProductDetailsModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                />
            )}
        </div>
    );
};

export default Wishlist;
