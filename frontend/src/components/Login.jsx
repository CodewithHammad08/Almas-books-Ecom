import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import the Auth context
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth(); // Destructure login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await login(email, password);
      // Determine if admin or not
      const userRole = res.data?.user?.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await googleLogin(credentialResponse.credential);
      const userRole = res.data?.user?.role || res.user?.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden pt-20">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div className="max-w-md w-full bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 border border-neutral-800 shadow-2xl relative z-10 hover:border-amber-500/30 transition-all duration-500">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 mb-6 border border-neutral-700 text-amber-500">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-neutral-400">Sign in to continue your creative journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-neutral-300 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-neutral-500 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-black border border-neutral-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-neutral-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label htmlFor="password" className="text-sm font-bold text-neutral-300">Password</label>
              <a href="#" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">Forgot password?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-neutral-500 group-focus-within:text-amber-500 transition-colors" size={20} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-black border border-neutral-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-neutral-700"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform ${!isLoading && 'hover:-translate-y-1'} transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <ArrowRight size={20} strokeWidth={2.5} />}
          </button>
          
          <div className="relative flex items-center justify-center py-4">
            <span className="absolute bg-neutral-900/80 px-4 text-xs font-medium text-neutral-500 uppercase tracking-widest z-10">Or Continue With</span>
            <div className="w-full h-px bg-neutral-800"></div>
          </div>
          
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed')}
              theme="filled_black"
              size="large"
              shape="pill"
            />
          </div>
        </form>
        
        <div className="mt-8 text-center text-neutral-500 text-sm">
          <p>Don't have an account? <Link to="/register" className="text-amber-500 hover:text-amber-400 font-bold transition-colors ml-1">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;