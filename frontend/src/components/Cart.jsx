import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleUpdateQuantity = (id, change, currentQty) => {
    const newQty = currentQty + change;
    if (newQty > 0) {
      updateQuantity(id, newQty);
    } else {
      removeFromCart(id);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to checkout!");
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: total,
        shippingAddress: {
          name: user.fullName || "User",
          phone: "1234567890", // Mocked for now, normally would be gathered via form
          address: "Mocked Address",
          pincode: "123456"
        },
        paymentMethod: "COD"
      };

      await api.post('/orders', orderData);
      alert("Order placed successfully!");
      clearCart();
      navigate('/');
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Failed to place order.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = cartTotal;
  const shipping = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-neutral-900 p-8 rounded-full mb-6 animate-pulse">
            <ShoppingBag size={64} className="text-neutral-600" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
        <p className="text-neutral-400 mb-8 max-w-md">Looks like you haven't added anything yet. Explore our collection of premium stationery and books.</p>
        <Link to="/shop" className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12">
          Your <span className="text-amber-500">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-amber-500/30 transition-all duration-300">
                {/* Image Placeholder */}
                <div className="w-full sm:w-32 h-32 bg-neutral-800 rounded-2xl overflow-hidden shrink-0">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex-1 w-full text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-amber-500 font-bold text-lg mb-4">{item.price}₹</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-black rounded-xl border border-neutral-800">
                      <button onClick={() => handleUpdateQuantity(item._id, -1, item.quantity)} className="p-2 text-neutral-400 hover:text-white transition-colors">
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item._id, 1, item.quantity)} className="p-2 text-neutral-400 hover:text-white transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                        <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right hidden sm:block">
                    <p className="text-neutral-500 text-sm mb-1">Total</p>
                    <p className="text-white font-bold text-xl">{(item.price * item.quantity).toLocaleString()}₹</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sticky top-32">
              <h3 className="text-2xl font-bold text-white mb-8">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{subtotal.toLocaleString()}₹</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping Estimate</span>
                  <span className="text-white font-medium">{shipping.toLocaleString()}₹</span>
                </div>
                <div className="h-px bg-neutral-800 my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-amber-500">{total.toLocaleString()}₹</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform ${!isCheckingOut && 'hover:-translate-y-1'} transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isCheckingOut ? 'Processing...' : 'Checkout Now'} {!isCheckingOut && <ArrowRight size={20} strokeWidth={2.5} />}
              </button>
              
              <p className="text-neutral-500 text-xs text-center mt-6">
                Secure checkout powered by Almas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;