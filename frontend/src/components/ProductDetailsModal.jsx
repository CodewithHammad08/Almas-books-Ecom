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

    // Derived statistics for real-time updates
    const currentReviewsCount = reviews.length;
    const currentAverageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) 
        : (product.rating || 0);

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
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-10" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-[40px] w-full max-w-5xl h-full md:h-[85vh] max-h-[800px] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(251,191,36,0.1)] animate-in zoom-in-95 duration-300">
                
                {/* Left: Image Section */}
                <div className="md:w-1/2 bg-black relative flex items-center justify-center p-6 md:p-10 border-b md:border-b-0 md:border-r border-neutral-800 shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-50" />
                    <button onClick={onClose} className="absolute top-4 left-4 p-2.5 rounded-full bg-neutral-800/80 backdrop-blur-md text-white hover:bg-neutral-700 md:hidden z-[60] border border-white/5">
                        <X size={22} />
                    </button>
                    <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="max-w-full h-auto max-h-[280px] md:max-h-[500px] object-contain drop-shadow-[0_20px_60px_rgba(251,191,36,0.2)] transition-all duration-700 hover:scale-110" 
                    />
                    {product.discountPrice < product.price && (
                        <div className="absolute top-8 left-8 bg-amber-400 text-black font-black px-5 py-2 rounded-2xl text-xs shadow-xl shadow-amber-400/20">
                            SPECIAL OFFER: -{Math.round((1 - product.discountPrice/product.price) * 100)}%
                        </div>
                    )}
                </div>

                {/* Right: Info Section */}
                <div className="md:w-1/2 flex flex-col md:h-full flex-1 min-h-0 bg-neutral-900 relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-3 rounded-2xl bg-white/5 text-white hover:bg-amber-400 hover:text-black transition-all hidden md:flex z-50 border border-white/10">
                        <X size={20} />
                    </button>

                    <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                        <div className="mb-8">
                            <div className="flex items-center gap-2 text-amber-400 mb-4">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < Math.round(currentAverageRating) ? "currentColor" : "none"} strokeWidth={2} />
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setActiveTab('reviews')}
                                    className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                                >
                                    ({currentReviewsCount} Reviews)
                                </button>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight tracking-tight">{product.name}</h2>
                            <p className="text-neutral-500 font-bold tracking-[0.2em] uppercase text-[10px] mb-8">{product.brand || "Almas Books Exclusive Edition"}</p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 group/actions">
                                <div className="flex items-baseline gap-4">
                                    <p className="text-5xl font-black text-amber-400 tracking-tighter">₹{product.discountPrice || product.price}</p>
                                    {product.discountPrice < product.price && (
                                        <p className="text-xl text-neutral-600 line-through font-bold">₹{product.price}</p>
                                    )}
                                </div>
                                
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
                                    className="bg-amber-400 hover:bg-white disabled:opacity-50 text-black font-black px-10 py-5 rounded-2xl transition-all shadow-[0_15px_30px_rgba(251,191,36,0.3)] flex items-center justify-center gap-3 sm:w-auto w-full active:scale-95"
                                >
                                    <ShoppingCart size={22} strokeWidth={3} />
                                    {isOutOfStock ? "SOLD OUT" : "DIRECT ADD"}
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-neutral-800 mb-8">
                            {[
                                { id: 'description', label: 'Description', icon: ShieldCheck },
                                { id: 'reviews', label: 'Reviews', icon: MessageSquare }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                                        activeTab === tab.id ? 'text-amber-400' : 'text-neutral-500 hover:text-white'
                                    }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]" />}
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
                                    <div className="pt-8 mt-8 border-t border-white/5">
                                        <button 
                                            onClick={() => setActiveTab('reviews')}
                                            className="text-amber-400 hover:text-white text-sm font-black uppercase tracking-widest flex items-center gap-3 transition-colors group"
                                        >
                                            <div className="p-2 bg-amber-400/10 rounded-xl group-hover:bg-amber-400 group-hover:text-black transition-all">
                                                <Star size={18} />
                                            </div>
                                            Read {currentReviewsCount} Verified Reviews
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Elevated Review Form */}
                                    {user ? (
                                        <form onSubmit={handleAddReview} className="bg-neutral-800/40 p-8 rounded-[32px] border border-white/5 shadow-inner shadow-white/5">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="p-3 bg-amber-400/10 text-amber-400 rounded-2xl">
                                                    <MessageSquare size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-black uppercase tracking-widest text-sm">Write a Review</h4>
                                                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Share your authentic experience</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2 mb-8">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <button 
                                                        key={s} 
                                                        type="button" 
                                                        onClick={() => setNewReview({ ...newReview, rating: s })}
                                                        className={`p-2 rounded-xl transition-all ${newReview.rating >= s ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'bg-white/5 text-neutral-600 hover:text-white'}`}
                                                    >
                                                        <Star size={20} fill={newReview.rating >= s ? "currentColor" : "none"} strokeWidth={2.5} />
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            <textarea
                                                required
                                                value={newReview.comment}
                                                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                                placeholder="Describe the quality, style, or content..."
                                                className="w-full bg-black/40 border border-white/5 text-white p-6 rounded-3xl text-sm focus:outline-none focus:border-amber-400/50 transition-all mb-6 min-h-[140px] resize-none"
                                            />
                                            
                                            <button 
                                                disabled={submitting || !newReview.comment.trim()}
                                                className="w-full bg-amber-400 hover:bg-white disabled:opacity-30 text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-amber-400/20 active:scale-95 uppercase tracking-[0.2em] text-xs"
                                            >
                                                {submitting ? "PUBLISHING..." : "SUBMIT REVIEW"}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="bg-neutral-800/30 p-12 rounded-[40px] border border-dashed border-neutral-700 text-center">
                                            <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-3xl mx-auto mb-6">
                                                <MessageSquare className="text-neutral-500" size={32} />
                                            </div>
                                            <h4 className="text-white text-xl font-black mb-2 uppercase tracking-tight">Join the Conversation</h4>
                                            <p className="text-neutral-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">Sign in to share your thoughts and help others in our community.</p>
                                            <a href="/login" className="inline-block bg-amber-400 text-black font-black px-10 py-4 rounded-2xl text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-amber-400/20">SIGN IN TO REVIEW</a>
                                        </div>
                                    )}

                                    {/* Premium Review List */}
                                    <div className="space-y-6">
                                        {loadingReviews ? (
                                            <p className="text-center text-neutral-600 animate-pulse py-12 italic">Fetching the library of thoughts...</p>
                                        ) : reviews.length === 0 ? (
                                            <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/5 border-dashed">
                                                <p className="text-neutral-500 font-bold mb-1 uppercase tracking-tighter">No reviews yet</p>
                                                <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-[0.2em]">Be the first to share your opinion.</p>
                                            </div>
                                        ) : (
                                            reviews.map((r, idx) => (
                                                <div key={r._id} className="bg-neutral-800/20 p-8 rounded-[32px] border border-white/5 hover:border-amber-400/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-amber-400 text-black font-black flex items-center justify-center rounded-full text-xs shadow-lg shadow-amber-400/20">
                                                                {r.user?.name?.[0] || 'A'}
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-black text-sm">{r.user?.name || "Verified Customer"}</p>
                                                                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex text-amber-400 gap-0.5 scale-90">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} strokeWidth={2.5} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-neutral-400 leading-relaxed text-sm italic">"{r.comment}"</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-white/5 flex gap-4 bg-neutral-900/80 backdrop-blur-md">
                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`p-5 rounded-2xl border transition-all ${
                                isWishlisted 
                                ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                                : 'bg-white/5 border-white/5 text-white hover:border-amber-400'
                            }`}
                        >
                            <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
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
                            className="flex-1 bg-amber-400 hover:bg-white disabled:opacity-50 text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-95"
                        >
                            <ShoppingCart size={22} strokeWidth={3} />
                            {isOutOfStock ? "Out of Stock" : "Add to Shopping Bag"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
