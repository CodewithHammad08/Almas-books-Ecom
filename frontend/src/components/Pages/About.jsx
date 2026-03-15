import React from "react";
import { LibraryBig, Heart, Award,Users } from "lucide-react";
import FounderImg from "../../assets/Founder.png";
import TechHeadImg from "../../assets/TechHead.png";
import SEO from "../SEO";


const About = () => {
  return (
    <div className="flex flex-col bg-black min-h-screen py-20 md:py-32 justify-center items-center relative overflow-hidden">
      <SEO 
        title="About Us" 
        description="Learn about Almas Books & Stationery, your trusted partner for quality educational supplies and printing services since 2012."
        keywords="about almas books, stationery shop history, zubair dalvi, mumbra stationery store"
        url={window.location.href}
      />
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="flex flex-col justify-center items-center px-4 relative z-10">
        <LibraryBig className="h-16 w-16 md:h-20 md:w-20 p-4 bg-amber-500 text-black rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.3)]" />
        <h1 className="text-4xl md:text-6xl font-bold mt-8 text-center text-white">
          About <span className="text-amber-500">Almas</span>
        </h1>
        <p className="text-lg md:text-xl font-medium text-center pt-4 text-neutral-400 mb-12 max-w-2xl">
          Your trusted partner for quality stationery and educational supplies
          since 2012.
        </p>
      </div>
      <div className="flex flex-col w-full max-w-4xl justify-center bg-neutral-900/50 border border-neutral-800 py-10 px-6 md:px-12 rounded-3xl mb-16 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 text-center md:text-left text-white">Our Story</h2>
        <div className="space-y-4 text-sm md:text-base font-normal text-neutral-300 leading-relaxed">
          <p>
            Established in 2012, Almas Books & Stationery has been serving the
            local community with a clear focus on quality, reliability, and
            affordability. What began as a small stationery and book shop has
            steadily grown through trust built with students, teachers, and
            working professionals.
          </p>
          <p>
            We offer a wide range of products including everyday stationery,
            academic and general books, office supplies, and selected art
            materials. To meet practical needs, we also provide photocopying and
            basic printing services, making us a convenient one-stop solution for
            study and work essentials.
          </p>
          <p>
            Over the years, our shop has become a familiar and dependable place
            for customers who value personal service and consistent quality. We
            believe in understanding our customers’ requirements and offering the
            right solutions rather than just selling products.
          </p>
          <p>
            At Almas Books & Stationery, our goal remains simple: to support
            learning and work by providing dependable products, fair pricing, and
            friendly service in a comfortable environment.
          </p>
        </div>
      </div>
      {/* FounderInfo */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-6xl p-6 md:p-10 gap-8 md:gap-12 mb-12 bg-neutral-900 border border-neutral-800 rounded-3xl hover:border-amber-500/30 transition-all duration-300">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-0 bg-amber-500 rounded-2xl transform translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2 opacity-80"></div>
            <img src={FounderImg} alt="Zubair Dalvi - Founder of Almas Books" className="relative w-full h-auto rounded-2xl shadow-2xl object-cover transition-all duration-500" />
          </div>
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-black uppercase bg-amber-500 rounded-full">
            Visionary Leadership
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Meet the Founder</h2>
          <blockquote className="p-4 mb-6 border-l-4 border-amber-500 bg-black/30 rounded-r-lg italic text-neutral-300">
            "Dedicated to serving the community with quality educational resources and a commitment to excellence since day one."
          </blockquote>
          <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
            Almas Books & Stationery was founded by <span className="font-bold text-white">Zubair Dalvi</span>, whose vision and hard work laid the foundation for everything the shop represents today. With a strong understanding of customer needs and a commitment to honest service, he built lasting relationships within the community and shaped the values we continue to follow.
          </p>
        </div>
      </div>

      {/* Co-Founder Info */}
      <div className="flex flex-col md:flex-row-reverse items-center w-full max-w-6xl p-6 md:p-10 gap-8 md:gap-12 mb-20 bg-neutral-900 border border-neutral-800 rounded-3xl hover:border-emerald-500/30 transition-all duration-300">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-0 bg-emerald-500 rounded-2xl transform -translate-x-3 translate-y-3 transition-transform duration-300 group-hover:-translate-x-2 group-hover:translate-y-2 opacity-80"></div>
            <img src={TechHeadImg} alt="Technical Head & Co-Founder" className="relative w-full h-auto rounded-2xl shadow-2xl object-cover transition-all duration-500" />
          </div>
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-black uppercase bg-emerald-500 rounded-full">
            Technical Innovation
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Tech Head</h2>
          <blockquote className="p-4 mb-6 border-l-4 border-emerald-500 bg-black/30 rounded-r-lg italic text-neutral-300">
            "Bridging tradition with technology to create a seamless experience for our community."
          </blockquote>
          <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
            Driving the digital transformation of Almas Books, our <span className="font-bold text-white">Technical Head</span> ensures that we stay ahead of the curve. By integrating modern e-commerce solutions with our core values, we are making quality education more accessible than ever before.
          </p>
        </div>
      </div>

      {/* Value Card */}
      <div className="flex flex-col items-center w-full max-w-6xl px-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-white">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[
            {
              icon: Heart,
              title: "Customer First",
              desc: "We prioritize your needs and satisfaction above everything else.",
              color: "text-red-500",
              bg: "bg-red-500/10"
            },
            {
              icon: Award,
              title: "Quality Guaranteed",
              desc: "Only the best brands and materials for our customers.",
              color: "text-amber-500",
              bg: "bg-amber-500/10"
            },
            {
              icon: Users,
              title: "Community Focus",
              desc: "Supporting local students, teachers, and professionals.",
              color: "text-blue-500",
              bg: "bg-blue-500/10"
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col justify-center items-center text-center p-8 bg-neutral-900 border border-neutral-800 rounded-3xl hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 h-full group">
              <div className={`p-4 mb-6 rounded-2xl ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`h-10 w-10 ${item.color}`} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
              <p className="text-base font-medium text-neutral-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="w-full max-w-6xl bg-linear-to-r from-amber-500 to-amber-600 rounded-3xl p-8 md:p-12 mb-12 shadow-[0_0_50px_rgba(245,158,11,0.2)] mx-4">
          <h2 className="mb-8 text-3xl md:text-4xl font-bold text-black text-center">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <h3 className="mb-2 text-4xl md:text-6xl font-black text-black/80">14+</h3><p className="text-sm md:text-base font-bold text-black/60 uppercase tracking-wider">Years in Business</p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-4xl md:text-6xl font-black text-black/80">5k+</h3><p className="text-sm md:text-base font-bold text-black/60 uppercase tracking-wider">Products</p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-4xl md:text-6xl font-black text-black/80">1k+</h3><p className="text-sm md:text-base font-bold text-black/60 uppercase tracking-wider">Happy Customers</p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-4xl md:text-6xl font-black text-black/80">10+</h3><p className="text-sm md:text-base font-bold text-black/60 uppercase tracking-wider">Schools Served</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default About;
