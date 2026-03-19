import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState(() => {
        // Load from local storage initially
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    // Fetch cart from backend when user logs in
    useEffect(() => {
        const syncWithBackend = async () => {
            if (user) {
                try {
                    const response = await api.get('/cart');
                    if (response.data?.success) {
                        const backendItems = response.data.data.items.map(item => {
                            const p = item.product;
                            const effectivePrice = (p?.discountPrice && p?.discountPrice < p?.price) ? p.discountPrice : p?.price;
                            
                            return {
                                ...p,
                                price: effectivePrice,
                                image: p?.images?.[0]?.url || p?.image || '',
                                quantity: item.quantity,
                                priceAtAdd: item.priceAtAdd
                            };
                        });
                        setCartItems(backendItems);
                    }
                } catch (error) {
                    console.error("Error syncing cart with backend:", error);
                }
            } else {
                // If no user, clear cart items (logout case)
                setCartItems([]);
                localStorage.removeItem('cart');
            }
        };

        syncWithBackend();
    }, [user]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = async (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                return prevItems.map(item => 
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });

        if (user) {
            try {
                await api.post('/cart/add', { productId: product._id, quantity });
            } catch (error) {
                console.error("Error adding to cart backend:", error);
            }
        }
    };

    const removeFromCart = async (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));

        if (user) {
            try {
                await api.delete('/cart/remove', { data: { productId } });
            } catch (error) {
                console.error("Error removing from cart backend:", error);
            }
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        
        const newItems = cartItems.map(item => 
            item._id === productId ? { ...item, quantity } : item
        );
        setCartItems(newItems);

        if (user) {
            try {
                await api.put('/cart/sync', { items: newItems });
            } catch (error) {
                console.error("Error syncing quantity to backend:", error);
            }
        }
    };

    const clearCart = async () => {
        setCartItems([]);
        if (user) {
            try {
                await api.put('/cart/sync', { items: [] });
            } catch (error) {
                console.error("Error clearing cart backend:", error);
            }
        }
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
