import React, { useState, useEffect, useMemo } from "react";
import HeroSlider from "../HeroSlider";
import { BookOpen, Search, Package, SlidersHorizontal } from "lucide-react";
import Card from "../card";
import SEO from "../SEO";
import api from '../../api/axios';

const ShoppingPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products with category populated
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter products by active category + search
  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter(p =>
        p.category?.name?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [products, activeCategory, searchQuery]);

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
          <p className="text-base sm:text-lg font-medium text-neutral-400 max-w-2xl px-2">
            Explore our wide range of quality products curated for students, artists, and professionals.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="sticky top-24 z-30 bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-3xl mb-8 md:mb-12 shadow-2xl shadow-black/50">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">

            {/* Dynamic Categories from DB */}
            <div className="flex flex-nowrap overflow-x-auto gap-2 w-full lg:w-auto pb-1 scrollbar-none">
              {/* Always show "All" first */}
              <button
                onClick={() => setActiveCategory('All')}
                className={`shrink-0 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border transition-all text-xs sm:text-sm font-medium whitespace-nowrap ${
                  activeCategory === 'All'
                    ? 'bg-amber-500 border-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-amber-500/50 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <BookOpen size={14} />
                All
                <span className="bg-black/20 text-current px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {products.length}
                </span>
              </button>

              {/* Categories loaded from DB */}
              {categories.map((cat) => {
                const count = products.filter(p => p.category?.name?.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <button
                    key={cat._id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`shrink-0 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border transition-all text-xs sm:text-sm font-medium whitespace-nowrap ${
                      activeCategory === cat.name
                        ? 'bg-amber-500 border-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-amber-500/50 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {cat.icon || <SlidersHorizontal size={14} />}
                    {cat.name}
                    {count > 0 && (
                      <span className="bg-black/20 text-current px-1.5 py-0.5 rounded-full text-[10px] font-bold">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-72 shrink-0">
              <input
                type="text"
                placeholder="Search products, brands, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-full pl-5 pr-12 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all text-sm placeholder:text-neutral-600"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            </div>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-neutral-500 text-sm mb-6">
            Showing <span className="text-amber-400 font-bold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
            {activeCategory !== 'All' && <> in <span className="text-white">{activeCategory}</span></>}
            {searchQuery && <> matching <span className="text-white">"{searchQuery}"</span></>}
          </p>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full max-w-[320px] h-80 rounded-3xl bg-neutral-900 border border-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <Package size={64} className="mx-auto mb-4 text-neutral-700" />
            <h3 className="text-xl font-bold text-neutral-400 mb-2">No products found</h3>
            <p className="text-neutral-600 text-sm">
              {searchQuery ? `No results for "${searchQuery}"` : `No products in this category yet.`}
            </p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="mt-4 text-amber-400 text-sm hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center pb-12">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                product={product}
                title={product.name}
                price={`₹${product.price}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingPage;

