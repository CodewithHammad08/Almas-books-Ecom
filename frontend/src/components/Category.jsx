import React from 'react'
import { BookOpen,
  Palette,
  Briefcase,
  GraduationCap} from 'lucide-react';

const Category = () => {
  return (
    <div className='w-full h-auto py-12 md:py-20 bg-black'>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className='text-white text-center text-3xl md:text-5xl font-bold mb-3 md:mb-4'>Shop By Category</h2>
        <p className='text-neutral-400 text-center text-base md:text-xl font-medium mb-8 md:mb-12'>Find exactly what you need for work, school, or art.</p>

        {/* Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          
          {/* Card 1 */}
          <div className='group relative bg-neutral-900 rounded-3xl p-6 border border-neutral-800 hover:border-amber-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer'>
            <div className='bg-neutral-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300'>
              <BookOpen className='text-amber-500 w-8 h-8 group-hover:text-black transition-colors duration-300' strokeWidth={2} />
            </div>
            <h3 className='text-white text-2xl font-bold mb-2'>Stationery</h3>
            <p className='text-neutral-400 font-medium'>Pens, pencils, notebooks & more..</p>
          </div>

          {/* Card 2 */}
          <div className='group relative bg-neutral-900 rounded-3xl p-6 border border-neutral-800 hover:border-amber-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer'>
            <div className='bg-neutral-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300'>
              <Palette className='text-amber-500 w-8 h-8 group-hover:text-black transition-colors duration-300' strokeWidth={2} />
            </div>
            <h3 className='text-white text-2xl font-bold mb-2'>Art & Craft</h3>
            <p className='text-neutral-400 font-medium'>Colors, brushes, craft supplies</p>
          </div>

          {/* Card 3 */}
          <div className='group relative bg-neutral-900 rounded-3xl p-6 border border-neutral-800 hover:border-amber-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer'>
            <div className='bg-neutral-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300'>
              <Briefcase className='text-amber-500 w-8 h-8 group-hover:text-black transition-colors duration-300' strokeWidth={2} />
            </div>
            <h3 className='text-white text-2xl font-bold mb-2'>Office Items</h3>
            <p className='text-neutral-400 font-medium'>Files, folders, desk organizers</p>
          </div>

          {/* Card 4 */}
          <div className='group relative bg-neutral-900 rounded-3xl p-6 border border-neutral-800 hover:border-amber-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer'>
            <div className='bg-neutral-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300'>
              <GraduationCap className='text-amber-500 w-8 h-8 group-hover:text-black transition-colors duration-300' strokeWidth={2} />
            </div>
            <h3 className='text-white text-2xl font-bold mb-2'>School Supplies</h3>
            <p className='text-neutral-400 font-medium'>Everything students need</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category