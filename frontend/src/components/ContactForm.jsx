import React from 'react'
import { useState } from "react";
import { Send, User, Mail, Phone, Type, MessageSquare, Star } from 'lucide-react';


const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    rating: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (score) => {
    setFormData({ ...formData, rating: score });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // later send to backend
  };

  return (
    <div className="max-w-3xl h-full mx-auto bg-neutral-900 p-6 md:p-10 rounded-3xl shadow-xl border border-neutral-800">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Send Us a Message</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First + Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-neutral-400 mb-2 block">First Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-neutral-500 h-5 w-5" />
              <input
                type="text"
                name="firstName"
                placeholder="John"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-black border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-400 mb-2 block">Last Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-neutral-500 h-5 w-5" />
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-black border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="text-sm font-bold text-neutral-400 mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-neutral-500 h-5 w-5" />
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-black border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-bold text-neutral-400 mb-2 block">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-neutral-500 h-5 w-5" />
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-black border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="text-sm font-bold text-neutral-400 mb-2 block">Subject</label>
          <div className="relative">
            <Type className="absolute left-4 top-3.5 text-neutral-500 h-5 w-5" />
            <input
              type="text"
              name="subject"
              placeholder="How can we help?"
              onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-black border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>

        {/* Rating System */}
        <div>
          <label className="text-sm font-bold text-neutral-400 mb-2 block">Rate Your Experience</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= formData.rating
                      ? "fill-amber-500 text-amber-500"
                      : "text-neutral-700 hover:text-amber-500"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-bold text-neutral-400 mb-2 block">Message</label>
          <div className="relative">
          <MessageSquare className="absolute left-4 top-3.5 text-neutral-500 h-5 w-5" />
          <textarea
            name="message"
            rows="4"
            placeholder="Tell us more about your inquiry..."
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-black border border-neutral-800 text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none transition-all placeholder:text-neutral-600"
          />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
        >
          <Send size={20} /> Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
