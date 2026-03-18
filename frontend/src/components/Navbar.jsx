import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, ShoppingBag, ShoppingCart, User, LogOut, LayoutDashboard, MapPin, ClipboardList, Home } from 'lucide-react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved delivery address from localStorage
  const savedAddress = (() => { try { return JSON.parse(localStorage.getItem('savedAddress') || 'null'); } catch { return null; } })();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 md:py-4' : 'py-4 md:py-6'} ${scrolled || isOpen ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-center md:justify-between">
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
            <form onSubmit={handleSearchSubmit} className="relative group">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-neutral-900/50 border border-neutral-700 text-neutral-300 text-sm rounded-full pl-4 pr-10 py-2 w-48 focus:w-64 focus:border-amber-500 focus:bg-black focus:outline-none transition-all duration-300"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-neutral-500 group-focus-within:text-amber-500 transition-colors">
                    <Search size={18} />
                </button>
            </form>

            {/* User Icon / Dropdown */}
            <div className="relative" ref={menuRef}>
              {!loading && user ? (
                // Logged-in: show avatar initial + dropdown
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full bg-neutral-900/50 border border-neutral-700 hover:border-amber-500 transition-all duration-300 group"
                    title={user.name}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-bold text-sm flex items-center justify-center uppercase group-hover:bg-amber-400 transition-colors">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-neutral-800">
                        <p className="text-white font-bold text-sm truncate">{user.name}</p>
                        <p className="text-neutral-400 text-xs truncate mt-0.5">{user.email}</p>
                        <span className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-700 text-neutral-400'}`}>
                          {user.role}
                        </span>
                      </div>
                  {/* Actions */}
                      <div className="p-2 flex flex-col gap-1">
                        {/* Saved delivery address */}
                        {savedAddress?.street && (
                          <div className="px-3 py-2 rounded-xl bg-neutral-800/60 border border-neutral-700/50 mb-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin size={11} className="text-amber-500 shrink-0" />
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Last Delivery Address</span>
                            </div>
                            <p className="text-neutral-300 text-xs leading-relaxed">{savedAddress.street}, {savedAddress.city}</p>
                          </div>
                        )}
                        <Link
                          to="/my-orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200"
                        >
                          <ClipboardList size={16} className="text-amber-500" />
                          My Orders
                        </Link>
                        {(user.role === 'admin' || user.role === 'superadmin') && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200"
                          >
                            <LayoutDashboard size={16} className="text-amber-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Guest: link to login
                <Link to="/login" className="relative group">
                  <div className="p-2.5 rounded-full bg-neutral-900/50 border border-neutral-700 text-neutral-300 hover:text-amber-500 hover:border-amber-500 hover:bg-black transition-all duration-300">
                    <User size={20} />
                  </div>
                </Link>
              )}
            </div>

            <Link to="/cart" className="relative group">
              <div className="p-2.5 rounded-full bg-neutral-900/50 border border-neutral-700 text-neutral-300 hover:text-amber-500 hover:border-amber-500 hover:bg-black transition-all duration-300">
                <ShoppingCart size={20} />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>
              )}
            </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation (App-like) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-xl border-t border-neutral-800 z-50 px-6 py-3 flex justify-between items-center pb-safe">
        <Link to="/" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-amber-500">
          <Home size={22} className={location.pathname === '/' ? 'text-amber-500' : ''} />
          <span className={`text-[10px] font-medium ${location.pathname === '/' ? 'text-amber-500' : ''}`}>Home</span>
        </Link>
        <Link to="/shop" className="flex flex-col items-center gap-1 text-neutral-400 hover:text-amber-500">
          <ShoppingBag size={22} className={location.pathname === '/shop' ? 'text-amber-500' : ''} />
          <span className={`text-[10px] font-medium ${location.pathname === '/shop' ? 'text-amber-500' : ''}`}>Shop</span>
        </Link>
        <Link to="/cart" className="relative flex flex-col items-center gap-1 text-neutral-400 hover:text-amber-500">
          <div className="relative">
            <ShoppingCart size={22} className={location.pathname === '/cart' ? 'text-amber-500' : ''} />
            {cartCount > 0 && <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
          </div>
          <span className={`text-[10px] font-medium ${location.pathname === '/cart' ? 'text-amber-500' : ''}`}>Cart</span>
        </Link>
        <Link to={user ? "/my-orders" : "/login"} className="flex flex-col items-center gap-1 text-neutral-400 hover:text-amber-500">
          <User size={22} className={(location.pathname === '/login' || location.pathname === '/my-orders') ? 'text-amber-500' : ''} />
          <span className={`text-[10px] font-medium ${(location.pathname === '/login' || location.pathname === '/my-orders') ? 'text-amber-500' : ''}`}>Profile</span>
        </Link>
      </div>
    </nav>
  )
}


export default Navbar;




