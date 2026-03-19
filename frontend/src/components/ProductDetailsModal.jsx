import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Heart, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../api/axios';

const ProductDetailsModal = ({ product, onClose }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    const imageUrl = product?.images?.[0]?.url || product?.image;
    const isOutOfStock = product?.stock === 0;
    const isWishlisted = isInWishlist(product?._id);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`/reviews/product/${product._id}`);
                setReviews(res.data.data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoadingReviews(false);
            }
        };
        fetchReviews();
    }, [product._id]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to write a review");
            return;
        }
        setSubmitting(true);
        try {
            const res = await api.post('/reviews', {
                productId: product._id,
                rating: newReview.rating,
                comment: newReview.comment
            });
            if (res.data.success) {
                setReviews([res.data.data, ...reviews]);
                setNewReview({ rating: 5, comment: '' });
                alert("Review added successfully!");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-amber-500/10 animate-in zoom-in-95 duration-300">
                
                {/* Left: Image Section */}
                <div className="md:w-1/2 bg-black relative flex items-center justify-center p-8 border-r border-neutral-800">
                    <button onClick={onClose} className="absolute top-6 left-6 p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 md:hidden z-20">
                        <X size={20} />
                    </button>
                    <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="max-w-full max-h-[400px] object-contain drop-shadow-[0_20px_50px_rgba(245,158,11,0.15)]" 
                    />
                    {product.discountPrice < product.price && (
                        <div className="absolute top-8 right-8 bg-amber-500 text-black font-black px-4 py-1.5 rounded-full text-sm">
                            SAVE ₹{(product.price - product.discountPrice).toLocaleString()}
                        </div>
                    )}
                </div>

                {/* Right: Info Section */}
                <div className="md:w-1/2 flex flex-col h-full bg-neutral-900 relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 hidden md:flex z-20">
                        <X size={20} />
                    </button>

                    <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-none">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-amber-500 mb-4">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < Math.round(product.rating || 0) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">({reviews.length} Reviews)</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">{product.name}</h2>
                            <p className="text-neutral-500 font-bold tracking-widest uppercase text-xs mb-6">{product.brand || "Almas Books Exclusive"}</p>
                            
                            <div className="flex items-baseline gap-4 mb-8">
                                <p className="text-4xl font-black text-amber-500">₹{product.discountPrice || product.price}</p>
                                {product.discountPrice < product.price && (
                                    <p className="text-xl text-neutral-600 line-through font-bold">₹{product.price}</p>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-neutral-800 mb-8">
                            {['description', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 text-sm font-black uppercase tracking-widest transition-all relative ${
                                        activeTab === tab ? 'text-amber-500' : 'text-neutral-500 hover:text-white'
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-full" />}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="mb-12">
                            {activeTab === 'description' ? (
                                <div className="space-y-4">
                                    <p className="text-neutral-400 leading-relaxed italic">{product.description || "No description available for this masterpiece."}</p>
                                    <div className="grid grid-cols-2 gap-4 pt-6">
                                        <div className="bg-neutral-800/50 p-4 rounded-2xl border border-neutral-800">
                                            <p className="text-neutral-500 text-[10px] uppercase font-bold mb-1">Stock Status</p>
                                            <p className={`font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-500'}`}>
                                                {isOutOfStock ? 'Out of Stock' : `${product.stock} Units left`}
                                            </p>
                                        </div>
                                        <div className="bg-neutral-800/50 p-4 rounded-2xl border border-neutral-800">
                                            <p className="text-neutral-500 text-[10px] uppercase font-bold mb-1">Authentic</p>
                                            <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                                                <ShieldCheck size={16} /> Verified
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Add Review Form */}
                                    {user && (
                                        <form onSubmit={handleAddReview} className="bg-neutral-800/30 p-6 rounded-3xl border border-neutral-800 mb-8">
                                            <h4 className="text-white font-bold mb-4">Write a review</h4>
                                            <div className="flex gap-2 mb-4">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <button 
                                                        key={s} 
                                                        type="button" 
                                                        onClick={() => setNewReview({ ...newReview, rating: s })}
                                                        className={`p-1 transition-colors ${newReview.rating >= s ? 'text-amber-500' : 'text-neutral-700 hover:text-neutral-500'}`}
                                                    >
                                                        <Star size={24} fill={newReview.rating >= s ? "currentColor" : "none"} />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                required
                                                value={newReview.comment}
                                                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                                placeholder="What did you think of the quality?"
                                                className="w-full bg-black border border-neutral-700 text-white p-4 rounded-2xl text-sm focus:outline-none focus:border-amber-500 transition-colors mb-4 min-h-[100px]"
                                            />
                                            <button 
                                                disabled={submitting}
                                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-black py-3 rounded-xl transition-all"
                                            >
                                                {submitting ? "Posting..." : "Post Review"}
                                            </button>
                                        </form>
                                    )}

                                    {/* Review List */}
                                    {loadingReviews ? (
                                        <p className="text-neutral-500 italic">Exploring thoughts...</p>
                                    ) : reviews.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageSquare className="mx-auto text-neutral-800 mb-2" size={32} />
                                            <p className="text-neutral-500">Be the first to share your experience!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {reviews.map(r => (
                                                <div key={r._id} className="border-b border-neutral-800 pb-6">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="text-white font-bold text-sm">{r.user?.name || "Customer"}</p>
                                                        <div className="flex text-amber-500">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-neutral-400 text-sm leading-relaxed">{r.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-neutral-800 flex gap-4 bg-neutral-900/80 backdrop-blur-md">
                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`p-4 rounded-2xl border transition-all ${
                                isWishlisted 
                                ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                                : 'bg-neutral-800 border-neutral-700 text-white hover:border-amber-500'
                            }`}
                        >
                            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                        <button
                            disabled={isOutOfStock}
                            onClick={() => {
                                addToCart({
                                    _id: product._id,
                                    name: product.name,
                                    price: product.discountPrice || product.price,
                                    image: imageUrl
                                });
                            }}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-black py-4 rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3"
                        >
                            <ShoppingCart size={20} strokeWidth={3} />
                            {isOutOfStock ? "Out of Stock" : "Add to Shopping Bag"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
