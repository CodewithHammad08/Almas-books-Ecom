import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const response = await api.get('/wishlist');
            if (response.data?.success) {
                setWishlistItems(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (product) => {
        if (!user) return false; // Should trigger login prompt/redirect in UI

        try {
            const response = await api.post('/wishlist/toggle', { productId: product._id });
            if (response.data?.success) {
                const isAdded = response.data.data.isWishlisted;
                if (isAdded) {
                    setWishlistItems(prev => [...prev, product]);
                } else {
                    setWishlistItems(prev => prev.filter(item => item._id !== product._id));
                }
                return true;
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
        return false;
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            toggleWishlist,
            isInWishlist,
            loading,
            refreshWishlist: fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
