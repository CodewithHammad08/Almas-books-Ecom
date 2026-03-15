import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import BgImage from "../assets/lib.png";
import SEO from '../SEO';

const Cart = () => {
  // Mock Data - Replace with your context/state later
  const [cartItems, setCartItems] = useState([
    { id: 1, title: "Executive Leather Diary", price: 950, quantity: 1, image: BgImage },
    { id: 2, title: "Complete Sketching Kit", price: 1200, quantity: 2, image: BgImage },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 50;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <SEO 
          title="Shopping Cart" 
          description="Your cart is empty. Start shopping for premium stationery and books at Almas Books."
          url={window.location.href}
        />
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
      <SEO 
        title="Shopping Cart" 
        description="Review your selected items and proceed to checkout at Almas Books."
        url={window.location.href}
      />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12">
          Your <span className="text-amber-500">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-amber-500/30 transition-all duration-300">
                {/* Image Placeholder */}
                <div className="w-full sm:w-32 h-32 bg-neutral-800 rounded-2xl overflow-hidden shrink-0">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex-1 w-full text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-amber-500 font-bold text-lg mb-4">{item.price}₹</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-black rounded-xl border border-neutral-800">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-neutral-400 hover:text-white transition-colors">
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-neutral-400 hover:text-white transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
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

              <button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                Checkout Now <ArrowRight size={20} strokeWidth={2.5} />
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
