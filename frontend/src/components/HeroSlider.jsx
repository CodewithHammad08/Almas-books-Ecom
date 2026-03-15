import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Page1 from "../assets/Page1.png";
import Page2 from "../assets/Page2.png";
import Page3 from "../assets/Page3.png";
import Page4 from "../assets/Page4.png";
import Page5 from "../assets/Page5.png";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const HeroSlider = () => {
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);
  const slides = [
    {
      image: Page1,
      title: "Welcome to",
      highlight: "Almas Books",
      description: "Your trusted partner for quality stationery and educational supplies since 2012.",
    },
    {
      image: Page2,
      title: "Academic",
      highlight: "Excellence",
      description: "Stationery, Textbooks, notebooks, and study guides for students of all grades.",
    },
    {
      image: Page3,
      title: "Unleash Your",
      highlight: "Creativity",
      description: "Explore our wide range of art and craft supplies for every artist.",
    },
    {
      image: Page4,
      title: "Essential",
      highlight: "Office Supplies",
      description: "Organize your workspace with our premium office essentials and organizers.",
    },
    {
      image: Page5,

    },
  ];

  return (
    <div className="w-full h-[65vh] sm:h-[80vh] lg:h-screen relative group bg-black overflow-hidden">
      {/* Custom Navigation Buttons - Hidden on mobile */}
      <div className="absolute inset-y-0 left-0 z-20 hidden md:flex items-center pl-4 lg:pl-8">
        <button ref={(node) => setPrevEl(node)} className="bg-black/20 hover:bg-amber-500 hover:text-black text-white backdrop-blur-md p-3 lg:p-4 rounded-full transition-all duration-300 border border-white/10 hover:scale-110 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] -translate-x-20 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 z-20 hidden md:flex items-center pr-4 lg:pr-8">
        <button ref={(node) => setNextEl(node)} className="bg-black/20 hover:bg-amber-500 hover:text-black text-white backdrop-blur-md p-3 lg:p-4 rounded-full transition-all duration-300 border border-white/10 hover:scale-110 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] translate-x-20 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
          <ChevronRight size={28} strokeWidth={2} />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        navigation={{
          prevEl,
          nextEl,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="w-full h-full [&_.swiper-pagination-bullet-active]:bg-amber-500 [&_.swiper-pagination-bullet]:bg-white/50"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            {({ isActive }) => (
              <div className="w-full h-full relative">
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={slide.image}
                    className={`w-full h-full object-contain md:object-cover object-center transition-transform duration-5000 ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                    alt={`${slide.title} ${slide.highlight}`}
                  />
                </div>

                {/* Overlays for readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-90 md:hidden" />
                
                {/* Desktop: Directional gradients */}
                <div className={`hidden md:block absolute inset-0 bg-gradient-to-${index % 2 === 0 ? 'l' : 'r'} from-black/90 via-black/40 to-transparent`} />
                <div className="hidden md:block absolute inset-0 bg-black/20" />

                {/* Content Container */}
                <div className={`absolute inset-0 flex flex-col justify-end md:justify-center px-6 pb-24 md:pb-0 sm:px-12 md:px-20 lg:px-32 ${index % 2 === 0 ? 'items-end text-right' : 'items-start text-left'}`}>
                  {index !== 4 && (
                  <div className="w-full max-w-3xl space-y-4 md:space-y-6">
                    
                    {/* Title Animation */}
                    <h1 className="overflow-hidden">
                      <span className={`block text-2xl sm:text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight transition-transform duration-1000 delay-300 ${isActive ? 'translate-y-0' : 'translate-y-full'}`}>
                        {slide.title} <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-600 filter drop-shadow-lg">
                          {slide.highlight}
                        </span>
                      </span>
                    </h1>

                    {/* Description Animation */}
                    <p className={`text-xs sm:text-xl md:text-2xl text-neutral-300 font-medium max-w-xs sm:max-w-xl leading-relaxed transition-all duration-1000 delay-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${index % 2 === 0 ? 'ml-auto' : ''}`}>
                      {slide.description}
                    </p>

                    {/* Button Animation */}
                    <div className={`pt-4 transition-all duration-1000 delay-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                      <Link to="/shop" className="group relative inline-flex px-4 py-2 md:px-8 md:py-4 bg-amber-500 text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                        <span className="relative z-10 flex items-center gap-2 text-sm md:text-lg">
                          Explore Now
                          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </Link>
                    </div>

                  </div>
                  )}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
