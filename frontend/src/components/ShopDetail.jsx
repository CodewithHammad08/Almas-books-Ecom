import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";


const ShopDetail = () => {
  return (
    <div className="bg-neutral-900 rounded-3xl shadow-xl border border-neutral-800 p-8 w-full hover:border-amber-500/30 transition-all duration-300">
      <h2 className="text-3xl font-bold mb-8 text-white border-b pb-4 border-neutral-800">Contact Information</h2>

      <div className="space-y-8">
        {/* Address */}
        <div className="flex items-start gap-5 group">
          <div className="bg-neutral-800 p-4 rounded-2xl group-hover:bg-amber-500 transition-colors duration-300 shrink-0">
            <MapPin className="w-6 h-6 text-amber-500 group-hover:text-black transition-colors duration-300" />
          </div>
          <div>
            <p className="font-bold text-lg text-white mb-1">Address</p>
            <p className="text-neutral-400 leading-relaxed">
              Shop No. 2, Maryam Manzil,
              Almas Colony, Kausa,<br />
              Mumbra - 400612
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-5 group">
          <div className="bg-neutral-800 p-4 rounded-2xl group-hover:bg-amber-500 transition-colors duration-300 shrink-0">
            <Phone className="w-6 h-6 text-amber-500 group-hover:text-black transition-colors duration-300" />
          </div>
          <div>
            <p className="font-bold text-lg text-white mb-1">Phone</p>
            <p className="text-neutral-400">+91 98336 60690</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-5 group">
          <div className="bg-neutral-800 p-4 rounded-2xl group-hover:bg-amber-500 transition-colors duration-300 shrink-0">
            <Mail className="w-6 h-6 text-amber-500 group-hover:text-black transition-colors duration-300" />
          </div>
          <div>
            <p className="font-bold text-lg text-white mb-1">Email</p>
            <p className="text-neutral-400">zubair36@gmail.com</p>
          </div>
        </div>

        {/* Shop Hours */}
        <div className="flex items-start gap-5 group">
          <div className="bg-neutral-800 p-4 rounded-2xl group-hover:bg-amber-500 transition-colors duration-300 shrink-0">
            <Clock className="w-6 h-6 text-amber-500 group-hover:text-black transition-colors duration-300" />
          </div>
          <div>
            <p className="font-bold text-lg text-white mb-1">Shop Hours</p>
            <p className="text-neutral-400 leading-relaxed">
              Mon – Thu & Sat: 9:30 AM – 11:00 PM<br />
              Friday: 10:00 AM – 1:00 PM & 4:00 PM – 11:00 PM <br />
              Sunday: 10:00 AM - 11:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
