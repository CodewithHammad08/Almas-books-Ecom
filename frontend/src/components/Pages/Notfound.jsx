import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, BookX, Ghost } from 'lucide-react';
import SEO from '../SEO';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Page Not Found" 
        description="The page you are looking for does not exist."
        url={window.location.href}
      />
      {/* Ambient Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 md:w-[600px] md:h-[600px] bg-amber-500/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none animate-pulse duration-[4000ms]" />
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-10 left-[5%] sm:top-20 sm:left-[10%] animate-bounce duration-[3000ms]">
            <Ghost size={32} className="text-neutral-700 sm:w-12 sm:h-12" />
         </div>
         <div className="absolute bottom-20 right-[5%] sm:bottom-40 sm:right-[10%] animate-bounce duration-[4000ms] delay-700">
            <BookX size={48} className="text-neutral-700 sm:w-16 sm:h-16" />
         </div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto w-full">
        {/* Large 404 Text */}
        <h1 className="text-[100px] sm:text-[160px] md:text-[220px] font-black text-neutral-900 leading-none select-none relative tracking-tighter">
          404
          <span className="absolute inset-0 text-amber-500/5 blur-sm">404</span>
        </h1>

        {/* Content Container */}
        <div className="relative -mt-8 sm:-mt-16 md:-mt-20 space-y-4 sm:space-y-6 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-white/5 bg-black/30 mx-2 sm:mx-0">
          <div className="inline-flex p-3 sm:p-4 rounded-full bg-neutral-900 border border-neutral-800 shadow-[0_0_30px_rgba(245,158,11,0.15)] mb-2">
            <BookX className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-amber-500" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Page Not Found
          </h2>
          
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto">
            The chapter you are looking for hasn't been written yet, or it might have been moved to a different shelf in our store.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link 
              to="/" 
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Home size={18} className="sm:w-5 sm:h-5" />
              Back to Home
            </Link>
            
            <Link 
              to="/shop" 
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-transparent border border-neutral-700 text-white font-bold rounded-full hover:border-amber-500 hover:text-amber-500 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Search size={18} className="sm:w-5 sm:h-5" />
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
