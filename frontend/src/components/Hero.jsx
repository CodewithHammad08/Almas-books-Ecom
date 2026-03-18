import React from "react";
import BgImage from "../assets/lib.png";
import { ArrowRight, Printer  } from 'lucide-react';
import {Link} from "react-router-dom"


const Hero = () => {
  return (
    <div className="relative w-full min-h-[85vh] bg-black overflow-hidden flex flex-col justify-center">
      {/* Background Image with Gradient Overlay */}
      <div
        style={{ backgroundImage: `url(${BgImage})` }}
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
      >
         <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
         <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
         <div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/30 to-transparent" />
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 md:pt-40 lg:pt-48 md:pb-12 lg:pb-20">
        <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 font-bold text-sm mb-6 border border-amber-500/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"/>
              <span>PREMIUM STATIONERY & PRINTING</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-4 md:mb-6">
              Your Creative <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-600">
                Journey Starts Here
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-neutral-300 mb-8 md:mb-10 leading-relaxed max-w-lg">
              Discover a curated collection of books, premium stationery, and professional printing services designed for students and professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to="/shop" className="group bg-amber-400 px-6 py-3 md:px-8 md:py-4 flex w-full sm:w-auto items-center justify-center gap-3 text-black rounded-full font-bold text-base md:text-lg hover:bg-amber-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                Shop Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} strokeWidth={2.5}/>
              </Link>
              
              <Link to="/print-services" className="group px-6 py-3 md:px-8 md:py-4 flex w-full sm:w-auto items-center justify-center gap-3 text-white rounded-full font-bold text-base md:text-lg border border-neutral-700 hover:border-amber-500/50 hover:bg-neutral-900/50 backdrop-blur-sm transition-all duration-300">
                Print Services
                <Printer className="group-hover:text-amber-500 transition-colors" size={20} strokeWidth={2.5} />
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
