import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

const Loader = () => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Trigger the smooth CSS transition shortly after mount
    const timer = setTimeout(() => setStartAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-4">
      {/* Ambient Background Glow - Breathing */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 md:w-[600px] md:h-[600px] bg-amber-500/5 rounded-full blur-[60px] sm:blur-[100px] md:blur-[120px] pointer-events-none animate-pulse duration-[3000ms]" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon Container */}
        <div className="relative mb-8 sm:mb-10">
            {/* Elegant thin rings */}
            <div className="absolute -inset-6 sm:-inset-8 rounded-full border border-neutral-800/50"></div>
            <div className="absolute -inset-6 sm:-inset-8 rounded-full border-t border-amber-500/30 animate-spin" style={{ animationDuration: '3s' }}></div>
            
            <div className="absolute -inset-3 sm:-inset-4 rounded-full border border-neutral-800/50"></div>
            <div className="absolute -inset-3 sm:-inset-4 rounded-full border-r border-amber-500/50 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
            
            {/* Center Icon with Glow */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-black border border-neutral-800 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.15)] sm:shadow-[0_0_50px_rgba(245,158,11,0.15)] relative z-10 group">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" strokeWidth={1.5} />
            </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-widest">
            <span className="text-amber-500 font-serif">الماس</span>
            <span className="w-px h-6 sm:h-8 bg-neutral-800"></span>
            <span className="font-sans tracking-[0.2em]">ALMAS</span>
        </div>
        
        <p className="text-neutral-500 text-[8px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.5em] uppercase mb-8 sm:mb-10 opacity-80 text-center">
          Premium Stationery
        </p>

        {/* Smooth Progress Bar */}
        <div className="w-32 sm:w-48 h-px bg-neutral-900 rounded-full overflow-hidden relative">
            <div 
                className={`absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,1)] transition-all duration-[1800ms] ease-out ${startAnimation ? 'w-full' : 'w-0'}`}
            />
        </div>
      </div>
    </div>
  );
};

export default Loader;
