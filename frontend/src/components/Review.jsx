import React from 'react'
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Teacher",
    text: "Best place to find quality school supplies! The staff is always helpful and prices are reasonable.",
    stars: 5
  },
  {
    name: "Michael Chen",
    role: "Student",
    text: "Love their selection of art supplies. Found everything I needed for my design projects.",
    stars: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Office Manager",
    text: "Their print services are fast and affordable. We use them for all our office printing needs.",
    stars: 5
  }
];

const Review = () => {
  return (
    <div className='bg-black w-full py-24 border-t border-neutral-900'>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className='text-white text-3xl md:text-5xl font-bold mb-4'>What Our Customers Say</h2>
            <p className='text-neutral-400 text-lg md:text-xl font-medium'>Trusted by students and professionals</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {reviews.map((review, index) => (
             <div key={index} className='group relative bg-neutral-900 rounded-3xl p-8 border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-black/50'>
                <div className="absolute -top-6 left-8 bg-neutral-800 p-3 rounded-2xl group-hover:bg-amber-500 transition-colors duration-300">
                  <Quote className="text-amber-500 group-hover:text-black transition-colors duration-300" size={24} fill="currentColor" />
                </div>
                
                <div className="flex gap-1 mb-6 mt-4">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="text-amber-500 fill-amber-500" size={20} />
                  ))}
                </div>

                <p className='text-neutral-300 text-lg mb-8 leading-relaxed'>"{review.text}"</p>
                
                <div className="border-t border-neutral-800 pt-6">
                  <h3 className='text-white font-bold text-xl'>{review.name}</h3>
                  <p className='text-neutral-500 font-medium'>{review.role}</p>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Review