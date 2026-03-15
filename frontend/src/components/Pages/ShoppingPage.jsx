import React, { useState } from "react";
import HeroSlider from "../HeroSlider";
import { BookOpen, Pen, GraduationCap, Palette, Briefcase, Search } from "lucide-react";
import Card from "../card";
import SEO from "../SEO";

const ShoppingPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: BookOpen },
    { name: 'Stationery', icon: Pen },
    { name: 'Books', icon: BookOpen },
    { name: 'School Supplies', icon: GraduationCap },
    { name: 'Art & Craft', icon: Palette },
    { name: 'Office Items', icon: Briefcase },
  ];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await import('../api/axios').then(m => m.default.get('/products'));
        const allProducts = response.data.data || response.data || [];
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      <SEO 
        title="Shop Stationery & Books" 
        description="Explore our wide range of quality stationery, books, art supplies, and office essentials at Almas Books."
        keywords="buy stationery online, art supplies, school books, office items, almas books shop"
        url={window.location.href}
      />
       {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />
      
      <HeroSlider />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative z-10">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 md:mb-4">Our <span className="text-amber-500">Products</span></h2>
          <p className="text-base sm:text-lg md:text-xl font-medium text-neutral-400 max-w-2xl px-2">
            Explore our wide range of quality products curated for students, artists, and professionals.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="sticky top-24 z-30 bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-3xl mb-8 md:mb-12 shadow-2xl shadow-black/50 transition-all duration-300">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6">
            {/* Categories */}
            <div className="flex flex-nowrap overflow-x-auto sm:flex-wrap justify-start sm:justify-center lg:justify-start gap-2 w-full lg:w-auto pb-2 sm:pb-0">
                {categories.map((cat) => (
                    <button 
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`shrink-0 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border transition-all duration-300 text-xs sm:text-sm font-medium whitespace-nowrap ${
                            activeCategory === cat.name 
                            ? 'bg-amber-500 border-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                            : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-amber-500/50 hover:text-white hover:bg-neutral-800'
                        }`}
                    >
                        <cat.icon size={14} className="sm:w-4 sm:h-4" />
                        {cat.name}
                    </button>
                ))}
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full lg:w-72 shrink-0">
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-full pl-5 pr-12 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all text-sm placeholder:text-neutral-600"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-amber-500 text-center py-10 w-full col-span-full">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center pb-12">
              {products.map((product) => (
                  <Card 
                    key={product._id || product.id} 
                    product={product}
                    title={product.name || product.title} 
                    price={`${product.price}₹`} 
                  />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingPage;
