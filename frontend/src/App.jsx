import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar';
import Footer from './components/footer';
import HomePage from './components/Pages/HomePage';
import ShoppingPage from './components/Pages/ShoppingPage';
import PrintServices from './components/Pages/PrintServices';
import About from './components/Pages/About';
import Contact from './components/Pages/Contact';
import { Routes, Route, Navigate } from 'react-router-dom';
import Cart from './components/Cart';
import Loader from './components/Loader';
import NotFound from './components/Pages/Notfound';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/Pages/AdminDashboard';
import MyOrders from './components/Pages/MyOrders';
import { useAuth } from './context/AuthContext';

// Redirects logged-in users away from login/register pages
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // wait for session check
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/shop'} replace />;
  return children;
};
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out animation
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Remove loader from DOM after fade completes
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <div>
      {isLoading && (
        <div className={`fixed inset-0 z-60 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <Loader />
        </div>
      )}
      
      <Navbar />

      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/print-services" element={<PrintServices />} />
        <Route path="/shop" element={<ShoppingPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
      
      
      <Footer />

    </div>
  )
}

export default App