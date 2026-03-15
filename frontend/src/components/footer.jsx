import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-neutral-900 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div>
                 <h3 className="font-bold text-2xl text-white uppercase tracking-wider">
                   Almas | <span className="text-amber-500">الماس</span>
                 </h3>
                 <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em]">Books & General Store</p>
               </div>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Your one-stop shop for quality stationery, books, and office supplies. 
              Serving students and professionals with care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop', path: '/shop' },
                { name: 'Print Services', path: '/print-services' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-neutral-400 hover:text-amber-500 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-amber-500 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-neutral-400 group">
                <MapPin className="w-5 h-5 text-amber-500 mt-1 shrink-0 group-hover:text-white transition-colors" />
                <p className="group-hover:text-white transition-colors">Shop No. 2, Maryam Manzil, Almas Colony, Kausa, Mumbra-400612</p>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 group">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 group-hover:text-white transition-colors" />
                <p className="group-hover:text-white transition-colors">+91 98336 60690</p>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 group">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 group-hover:text-white transition-colors" />
                <p className="group-hover:text-white transition-colors">zubair36@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Hours & Social */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6">Shop Hours</h3>
            <div className="flex items-start gap-3 text-neutral-400 mb-8">
              <Clock className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
              <div className="space-y-1">
                <p>Mon - Thu & Sat: <span className="text-white">9:30 AM - 11:00 PM</span></p>
                <p>Friday: <span className="text-white">10:00 AM - 1:00 PM</span> <br/> & <span className="text-white">4:00 PM - 11:00 PM</span></p>
                <p>Sunday: <span className="text-white">10:00 AM - 11:00 PM</span></p>
              </div>
            </div>

            <h4 className="text-white font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-neutral-800 p-3 rounded-full text-amber-500 hover:bg-amber-500 hover:text-black transition-all duration-300 hover:-translate-y-1">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="bg-neutral-800 p-3 rounded-full text-amber-500 hover:bg-amber-500 hover:text-black transition-all duration-300 hover:-translate-y-1">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-8 text-center">
          <p className="text-neutral-500">© {new Date().getFullYear()} Almas Books & General Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
