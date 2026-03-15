import React from 'react'
import { Printer, IndianRupee, Check, FileText  } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import PrintForm from '../PrintForm';
import SEO from '../SEO';

const PrintServices = () => {
  return (
    <div className='bg-black min-h-screen py-20 md:py-32 relative overflow-hidden'>
      <SEO 
        title="Print & Photocopy Services" 
        description="Fast, affordable, and high-quality printing and photocopying services at Almas Books. Black & white, color printing, and bulk discounts available."
        keywords="printing services, photocopying, color print, black and white print, xerox, almas books printing, mumbra printing"
        url={window.location.href}
      />
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Top Section */}
        <div className='flex flex-col justify-center items-center px-4 relative z-10'>
        <Printer className='h-20 w-20 p-4 bg-amber-500 text-black rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.3)]' />
        <h1 className='text-4xl md:text-6xl font-bold mt-8 text-center text-white'>Print & <span className="text-amber-500">Photocopy</span> Services</h1>
        <p className='text-lg md:text-xl font-medium text-center pt-4 text-neutral-400 max-w-2xl'>Fast, affordable, and high-quality printing services. Upload your documents or <br className="hidden md:block" />visit us in-store.</p>
        
        <a href="https://wa.me/919833660690" target="_blank" rel="noopener noreferrer" className='mt-10 flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-500 transition-all shadow-lg shadow-green-900/20 hover:shadow-green-500/40 hover:-translate-y-1'>
          <FaWhatsapp size={24} />
          Send via WhatsApp
        </a>
        </div>

{/* Rate Card */}
        <div className='mt-20 flex flex-wrap justify-center gap-8 px-4 relative z-10'>
        <div className='w-full md:w-96 py-10 px-8 bg-neutral-900 rounded-3xl border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-2 group'>
          <h2 className='flex justify-center font-bold text-2xl text-white mb-2'>Black & White</h2>
          <h4 className='flex justify-center items-baseline font-bold text-5xl text-amber-500'>3.00 <IndianRupee size={32} strokeWidth={3} className='ml-1'/><span className='text-lg font-medium text-neutral-500 ml-2'>/ page</span></h4>
            <div className="mt-8 space-y-4">
                <p className='flex items-center gap-3 text-lg font-medium text-neutral-400'><div className="p-1 rounded-full bg-amber-500/10"><Check size={16} strokeWidth={3} className='text-amber-500' /></div>Standard quality</p>
                <p className='flex items-center gap-3 text-lg font-medium text-neutral-400'><div className="p-1 rounded-full bg-amber-500/10"><Check size={16} strokeWidth={3} className='text-amber-500' /></div>Single or double-sided</p>
                <p className='flex items-center gap-3 text-lg font-medium text-neutral-400'><div className="p-1 rounded-full bg-amber-500/10"><Check size={16} strokeWidth={3} className='text-amber-500' /></div>Any paper size</p>     
            </div>
        </div>

        <div className='w-full md:w-96 py-10 px-8 bg-neutral-900 rounded-3xl border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden'>
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-400 to-amber-600"></div>
          <h2 className='flex justify-center font-bold text-2xl text-white mb-2'>Color Printing</h2>
          <h4 className='flex justify-center items-baseline font-bold text-5xl text-amber-500'>10.00 <IndianRupee size={32} strokeWidth={3} className='ml-1'/><span className='text-lg font-medium text-neutral-500 ml-2'>/ page</span></h4>
            <div className="mt-8 space-y-4">
                <p className='flex items-center gap-3 text-lg font-medium text-neutral-400'><div className="p-1 rounded-full bg-amber-500/10"><Check size={16} strokeWidth={3} className='text-amber-500' /></div>High quality color</p>
                <p className='flex items-center gap-3 text-lg font-medium text-neutral-400'><div className="p-1 rounded-full bg-amber-500/10"><Check size={16} strokeWidth={3} className='text-amber-500' /></div>Professional finish</p>
                <p className='flex items-center gap-3 text-lg font-medium text-neutral-400'><div className="p-1 rounded-full bg-amber-500/10"><Check size={16} strokeWidth={3} className='text-amber-500' /></div>Various paper types</p>     
            </div>
        </div>

        <div className='w-full md:w-96 py-10 px-8 bg-neutral-900 rounded-3xl border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 transform hover:-translate-y-2 group'>
          <h2 className='flex justify-center font-bold text-2xl text-white mb-2'>Photocopying</h2>
          <h4 className='flex justify-center items-baseline font-bold text-5xl text-amber-500'>2.00 <IndianRupee size={32} strokeWidth={3} className='ml-1'/><span className='text-lg font-medium text-neutral-500 ml-2'>/ page</span></h4>
            <div className="mt-8 space-y-4">
                <p className='flex items-center gap-3 text-lg font-medium text-neutral-400'><div className="p-1 rounded-full bg-amber-500/10"><Check size={16} strokeWidth={3} className='text-amber-500' /></div>Quick turnaround</p>
                <p className='flex items-center gap-3 text-lg font-medium text-neutral-400'><div className="p-1 rounded-full bg-amber-500/10"><Check size={16} strokeWidth={3} className='text-amber-500' /></div>Bulk discounts</p>
                <p className='flex items-center gap-3 text-lg font-medium text-neutral-400'><div className="p-1 rounded-full bg-amber-500/10"><Check size={16} strokeWidth={3} className='text-amber-500' /></div>Clear copies</p>     
            </div>
        </div>
        </div>
        {/* Print form */}
<div className='mt-20 relative z-10'>
      <PrintForm />
</div>

{/* End part */}
<div className='grid grid-cols-1 md:grid-cols-3 gap-8 px-4 w-full max-w-6xl mx-auto mt-20 mb-10 relative z-10'>
  <div className='p-8 bg-neutral-900 border border-neutral-800 flex flex-col justify-center items-center text-center rounded-3xl hover:border-amber-500/30 transition-all duration-300 group'>
    <div className="p-4 mb-6 bg-green-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        <Printer  className='h-10 w-10 text-green-500'/> 
    </div>
    <h2 className='mb-3 text-xl font-bold text-white'>Fast Turnaround</h2>
    <p className='text-base font-medium text-neutral-400'>Most print jobs completed within 30 minutes.</p>
  </div>
  <div className='p-8 bg-neutral-900 border border-neutral-800 flex flex-col justify-center items-center text-center rounded-3xl hover:border-amber-500/30 transition-all duration-300 group'>
    <div className="p-4 mb-6 bg-red-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        <FileText className='h-10 w-10 text-red-500'/> 
    </div>
    <h2 className='mb-3 text-xl font-bold text-white'>Quality Guaranteed</h2>
    <p className='text-base font-medium text-neutral-400'>Professional printing equipment for best results.</p>
  </div>
  <div className='p-8 bg-neutral-900 border border-neutral-800 flex flex-col justify-center items-center text-center rounded-3xl hover:border-amber-500/30 transition-all duration-300 group'>
    <div className="p-4 mb-6 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        <Check  className='h-10 w-10 text-purple-500'/> 
    </div>
    <h2 className='mb-3 text-xl font-bold text-white'>Bulk Discounts</h2>
    <p className='text-base font-medium text-neutral-400'>Special rates for large print orders.</p>
  </div>

</div>


    </div>
  )
}

export default PrintServices