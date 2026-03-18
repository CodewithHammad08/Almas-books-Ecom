import React from "react";
import { Printer, ArrowRight, FileText, Image } from "lucide-react";
import { Link } from 'react-router-dom';

const PrintInfo = () => {
  return (
    <div className="bg-black w-full py-16 md:py-24 border-t border-neutral-900 relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 font-bold text-sm mb-6">
              <Printer size={20} />
              <span>PRINTING SERVICES</span>
            </div>
            
            <h2 className="text-white font-bold text-3xl md:text-5xl leading-tight mb-4 md:mb-6">
              High-Quality Prints, <br />
              <span className="text-amber-500">Fast & Affordable.</span>
            </h2>
            
            <p className="text-neutral-400 text-base md:text-xl mb-6 md:mb-8 leading-relaxed">
              From thesis papers to colorful art projects, we provide professional printing solutions. 
              Upload online or visit us in-store.
            </p>

            <Link to="/print-services" className="group inline-flex w-full sm:w-auto justify-center items-center gap-3 bg-amber-400 px-6 py-3 md:px-8 md:py-4 text-black rounded-full font-bold text-base md:text-xl hover:bg-amber-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]">
              Start Printing
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} md:size={24} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
            
            {/* B&W Card */}
            <div className="bg-neutral-900 rounded-3xl p-6 md:p-8 border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 group cursor-default shadow-lg shadow-black/50">
              <div className="bg-neutral-800 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors duration-300">
                <FileText className="text-white group-hover:text-black transition-colors" size={28} />
              </div>
              <p className="text-neutral-400 font-medium mb-2">Black & White</p>
              <h3 className="text-4xl font-bold text-white mb-1">3.00₹</h3>
              <p className="text-sm text-neutral-500">per page</p>
            </div>

            {/* Color Card */}
            <div className="bg-neutral-900 rounded-3xl p-6 md:p-8 border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 group cursor-default shadow-lg shadow-black/50">
              <div className="bg-neutral-800 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                <Image className="text-white group-hover:text-black transition-colors" size={28} />
              </div>
              <p className="text-neutral-400 font-medium mb-2">Color Print</p>
              <h3 className="text-4xl font-bold text-amber-500 mb-1">10.00₹</h3>
              <p className="text-sm text-neutral-500">per page</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInfo;
