import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'} ${scrolled || isOpen ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex flex-col">
            <h3 className="font-bold text-2xl uppercase text-white tracking-wider group-hover:text-amber-400 transition-colors duration-300 leading-none">
              <span className="text-amber-500 group-hover:text-white transition-colors duration-300">الماس</span> | Almas
            </h3>
            <p className="font-medium text-[10px] md:text-xs text-neutral-400 tracking-[0.2em] uppercase pl-1">Books & General Store</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="relative text-sm font-bold text-white hover:text-amber-400 uppercase tracking-wide transition-colors duration-300 group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/print-services" className="relative text-sm font-bold text-white hover:text-amber-400 uppercase tracking-wide transition-colors duration-300 group">
            Printing Services
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="relative text-sm font-bold text-white hover:text-amber-400 uppercase tracking-wide transition-colors duration-300 group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="relative text-sm font-bold text-white hover:text-amber-400 uppercase tracking-wide transition-colors duration-300 group">
            Contact Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/shop" className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 flex items-center gap-2">
            <ShoppingBag size={16} strokeWidth={2.5} /> Shop Now
          </Link>
        </div>

        {/* Desktop Search & Cart */}
        <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-neutral-900/50 border border-neutral-700 text-neutral-300 text-sm rounded-full pl-4 pr-10 py-2 w-48 focus:w-64 focus:border-amber-500 focus:bg-black focus:outline-none transition-all duration-300"
                />
                <Search className="absolute right-3 top-2.5 text-neutral-500 group-focus-within:text-amber-500 transition-colors" size={18} />
            </div>

            <Link to="/login" className="relative group">
              <div className="p-2.5 rounded-full bg-neutral-900/50 border border-neutral-700 text-neutral-300 hover:text-amber-500 hover:border-amber-500 hover:bg-black transition-all duration-300">
                <User size={20} />
              </div>
            </Link>

            <Link to="/cart" className="relative group">
              <div className="p-2.5 rounded-full bg-neutral-900/50 border border-neutral-700 text-neutral-300 hover:text-amber-500 hover:border-amber-500 hover:bg-black transition-all duration-300">
                <ShoppingCart size={20} />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">2</span>
            </Link>
        </div>

        {/* Hamburger Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-white hover:text-amber-400 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden md:hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-6 gap-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-amber-400 transition-colors border-b border-white/5 pb-3">Home</Link>
          <Link to="/print-services" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-amber-400 transition-colors border-b border-white/5 pb-3">Printing Services</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-amber-400 transition-colors border-b border-white/5 pb-3">About</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-amber-400 transition-colors border-b border-white/5 pb-3">Contact Us</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-amber-400 transition-colors border-b border-white/5 pb-3">Login</Link>
          <Link to="/cart" onClick={() => setIsOpen(false)} className="text-lg font-medium text-neutral-300 hover:text-amber-400 transition-colors border-b border-white/5 pb-3 flex items-center justify-between">
            Cart
            <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">2 Items</span>
          </Link>
          <Link to="/shop" onClick={() => setIsOpen(false)} className="text-lg font-bold text-black bg-amber-500 rounded-xl p-3 text-center hover:bg-amber-600 transition-colors flex items-center justify-center gap-2">
            <ShoppingBag size={20} /> Shop Now
          </Link>
          
          {/* Mobile Search */}
          <div className="relative mt-2">
            <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl px-4 py-3 focus:border-amber-500 focus:outline-none transition-colors"
            />
            <Search className="absolute right-4 top-3.5 text-neutral-500" size={20} />
          </div>
        </div>
      </div>
    </nav>
  )
}


export default Navbar;