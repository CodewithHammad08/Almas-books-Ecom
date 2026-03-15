import React from 'react'
import ContactForm from '../ContactForm'
import ShopDetail from '../ShopDetail';
import SEO from '../SEO';

const Contact = () => {
  return (
    <div className='bg-black min-h-screen py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
      <SEO 
        title="Contact Us" 
        description="Get in touch with Almas Books. Visit our store in Mumbra, call us, or send a message for any inquiries."
        keywords="contact almas books, stationery shop location, mumbra book store address, phone number"
        url={window.location.href}
      />
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='flex flex-col justify-center items-center mb-16'>
          <h1 className='text-4xl md:text-6xl font-bold text-center text-white'>Get In <span className="text-amber-500">Touch</span></h1>
          <p className='text-lg font-medium text-center pt-4 text-neutral-400 max-w-2xl'>
            We'd love to hear from you. Visit us or send a message!
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form Section */}
          <div className=''>
            <ContactForm />
          </div>

          {/* Details and Map Section */}
          <div className='flex flex-col gap-8'>
            <div className='rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 h-80 lg:h-96 w-full bg-neutral-900 relative group'>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.6383977610726!2d73.0215079746673!3d19.167299449101023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7bf4d095fb6a9%3A0x21e08d9a0ea43794!2sAlmas%20book!5e0!3m2!1sen!2sin!4v1767549641302!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Almas Book Location"
              ></iframe>
            </div>
            <div>
              <ShopDetail />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact