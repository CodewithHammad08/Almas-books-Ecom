import React from 'react';
import { Printer, IndianRupee, Check, FileText, Mail, Zap, ShieldCheck, Layers } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import SEO from '../SEO';

const PrintServices = () => {
  return (
    <div className='bg-black min-h-screen pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden'>
      <SEO 
        title="Print & Photocopy Services | Almas" 
        description="Fast, affordable, and high-quality printing and photocopying services at Almas Books. Black & white, color printing, and bulk discounts available."
        keywords="printing services, photocopying, color print, black and white print, xerox, almas books printing, mumbra printing"
        url={window.location.href}
      />
      
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Header Section */}
      <div className='max-w-4xl mx-auto flex flex-col justify-center items-center px-4 relative z-10 text-center mb-16 md:mb-24'>
        <div className="inline-flex justify-center items-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-3xl mb-8 group hover:bg-amber-500/20 transition-all duration-300">
            <Printer className='h-12 w-12 md:h-16 md:w-16 text-amber-500 group-hover:scale-110 transition-transform duration-500' strokeWidth={1.5} />
        </div>
        <h1 className='text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6'>
          Premium Print <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-600">& Photocopy</span>
        </h1>
        <p className='text-base sm:text-lg md:text-xl font-medium text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-10'>
          Fast, crystal-clear, and highly affordable printing infrastructure. Drop your essential documents via WhatsApp or Email, and we’ll have them ready in minutes.
        </p>
        
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto'>
          <a href="https://wa.me/919833660690" target="_blank" rel="noopener noreferrer" className='flex items-center justify-center gap-3 bg-green-600/90 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg hover:bg-green-500 transition-all duration-300 shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] hover:-translate-y-1 w-full sm:w-auto backdrop-blur-sm'>
            <FaWhatsapp size={24} />
            Send via WhatsApp
          </a>
          <a href="mailto:zubair36@gmail.com?subject=Print Request" target="_blank" rel="noopener noreferrer" className='flex items-center justify-center gap-3 bg-neutral-900 border border-neutral-700 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg hover:border-amber-500 hover:bg-neutral-800 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:-translate-y-1 w-full sm:w-auto backdrop-blur-sm'>
            <Mail size={24} className="text-amber-500" />
            Send via Email
          </a>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 relative z-10 mb-20 md:mb-32">
        <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
            <p className="text-neutral-500 text-base md:text-lg">No hidden fees. Premium quality guaranteed always.</p>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
          
          {/* Black & White */}
          <div className='flex flex-col bg-neutral-900/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-800 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60 group'>
            <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white transition-colors duration-500">
                <FileText className="text-white group-hover:text-black transition-colors duration-500" size={32} strokeWidth={1.5} />
            </div>
            <h3 className='font-bold text-2xl text-white mb-2'>Black & White</h3>
            <div className='flex items-baseline gap-1 mb-8'>
                <span className="text-4xl md:text-5xl font-bold text-amber-500">3.00</span>
                <IndianRupee size={24} strokeWidth={3} className='text-amber-500'/>
                <span className='text-sm md:text-base font-medium text-neutral-500 ml-1'>/ page</span>
            </div>
            <div className="space-y-4 flex-1">
                <p className='flex items-start gap-3 text-base md:text-lg font-medium text-neutral-300'>
                    <span className="p-1 rounded-full bg-amber-500/10 mt-0.5"><Check size={14} strokeWidth={3} className='text-amber-500' /></span>
                    High-contrast text & graphics
                </p>
                <p className='flex items-start gap-3 text-base md:text-lg font-medium text-neutral-300'>
                    <span className="p-1 rounded-full bg-amber-500/10 mt-0.5"><Check size={14} strokeWidth={3} className='text-amber-500' /></span>
                    Single or double-sided
                </p>
                <p className='flex items-start gap-3 text-base md:text-lg font-medium text-neutral-300'>
                    <span className="p-1 rounded-full bg-amber-500/10 mt-0.5"><Check size={14} strokeWidth={3} className='text-amber-500' /></span>
                    Standard A4 / Legal sizes
                </p>     
            </div>
          </div>

          {/* Color Printing - Highlighted */}
          <div className='flex flex-col bg-neutral-900/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-500 hover:border-amber-400 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden shadow-2xl shadow-amber-500/5 lg:-translate-y-4 lg:hover:-translate-y-6'>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-amber-400 via-amber-500 to-amber-600"></div>
            <div className="absolute top-6 right-8 px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20 uppercase tracking-wider">Most Popular</div>
            
            <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-500">
                <Layers className="text-amber-500 group-hover:text-black transition-colors duration-500" size={32} strokeWidth={1.5} />
            </div>
            <h3 className='font-bold text-2xl text-white mb-2'>Color Printing</h3>
            <div className='flex items-baseline gap-1 mb-8'>
                <span className="text-4xl md:text-5xl font-bold text-amber-500">10.00</span>
                <IndianRupee size={24} strokeWidth={3} className='text-amber-500'/>
                <span className='text-sm md:text-base font-medium text-neutral-500 ml-1'>/ page</span>
            </div>
            <div className="space-y-4 flex-1">
                <p className='flex items-start gap-3 text-base md:text-lg font-medium text-neutral-300'>
                    <span className="p-1 rounded-full bg-amber-500/10 mt-0.5"><Check size={14} strokeWidth={3} className='text-amber-500' /></span>
                    Vibrant, photo-quality ink
                </p>
                <p className='flex items-start gap-3 text-base md:text-lg font-medium text-neutral-300'>
                    <span className="p-1 rounded-full bg-amber-500/10 mt-0.5"><Check size={14} strokeWidth={3} className='text-amber-500' /></span>
                    Professional project finishes
                </p>
                <p className='flex items-start gap-3 text-base md:text-lg font-medium text-neutral-300'>
                    <span className="p-1 rounded-full bg-amber-500/10 mt-0.5"><Check size={14} strokeWidth={3} className='text-amber-500' /></span>
                    Premium glossy or matte paper
                </p>     
            </div>
          </div>

          {/* Photocopying */}
          <div className='flex flex-col bg-neutral-900/80 backdrop-blur-sm rounded-3xl p-8 border border-neutral-800 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60 group'>
             <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-neutral-600 transition-colors duration-500">
                <Printer className="text-neutral-400 group-hover:text-white transition-colors duration-500" size={32} strokeWidth={1.5} />
            </div>
            <h3 className='font-bold text-2xl text-white mb-2'>Photocopying</h3>
            <div className='flex items-baseline gap-1 mb-8'>
                <span className="text-4xl md:text-5xl font-bold text-amber-500">2.00</span>
                <IndianRupee size={24} strokeWidth={3} className='text-amber-500'/>
                <span className='text-sm md:text-base font-medium text-neutral-500 ml-1'>/ page</span>
            </div>
            <div className="space-y-4 flex-1">
                <p className='flex items-start gap-3 text-base md:text-lg font-medium text-neutral-300'>
                    <span className="p-1 rounded-full bg-amber-500/10 mt-0.5"><Check size={14} strokeWidth={3} className='text-amber-500' /></span>
                    Ultra-fast automated scanning
                </p>
                <p className='flex items-start gap-3 text-base md:text-lg font-medium text-neutral-300'>
                    <span className="p-1 rounded-full bg-amber-500/10 mt-0.5"><Check size={14} strokeWidth={3} className='text-amber-500' /></span>
                    Heavy bulk volume discounts
                </p>
                <p className='flex items-start gap-3 text-base md:text-lg font-medium text-neutral-300'>
                    <span className="p-1 rounded-full bg-amber-500/10 mt-0.5"><Check size={14} strokeWidth={3} className='text-amber-500' /></span>
                    Lossless crisp reproduction
                </p>     
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className='max-w-7xl mx-auto px-4 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 bg-neutral-900/40 rounded-[2rem] p-6 md:p-10 border border-neutral-800/50'>
          
          <div className='flex flex-col md:flex-row items-center md:items-start md:text-left text-center gap-5 md:gap-6 group'>
            <div className="p-4 bg-green-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Zap className='h-8 w-8 text-green-500'/> 
            </div>
            <div>
              <h3 className='text-lg md:text-xl font-bold text-white mb-2'>Lightning Fast</h3>
              <p className='text-sm md:text-base font-medium text-neutral-400 leading-relaxed'>Most print jobs are fully processed and ready for collection within 30 minutes of sending.</p>
            </div>
          </div>

          <div className='flex flex-col md:flex-row items-center md:items-start md:text-left text-center gap-5 md:gap-6 group'>
            <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                <ShieldCheck className='h-8 w-8 text-amber-500'/> 
            </div>
            <div>
              <h3 className='text-lg md:text-xl font-bold text-white mb-2'>Quality Guaranteed</h3>
              <p className='text-sm md:text-base font-medium text-neutral-400 leading-relaxed'>We utilize strict professional-grade ink and premium paper resulting in flawlessly sharp documents.</p>
            </div>
          </div>

          <div className='flex flex-col md:flex-row items-center md:items-start md:text-left text-center gap-5 md:gap-6 group'>
            <div className="p-4 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Layers className='h-8 w-8 text-purple-500'/> 
            </div>
            <div>
              <h3 className='text-lg md:text-xl font-bold text-white mb-2'>Bulk Flexibility</h3>
              <p className='text-sm md:text-base font-medium text-neutral-400 leading-relaxed'>Need a textbook or manual printed out? We offer specialized automated bulk printing deals.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default PrintServices;