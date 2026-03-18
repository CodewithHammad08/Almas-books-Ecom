import React, { useState, useEffect, useMemo } from "react";
import HeroSlider from "../HeroSlider";
import { BookOpen, Search, Package, SlidersHorizontal } from "lucide-react";
import Card from "../card";
import SEO from "../SEO";
import api from '../../api/axios';
import { useLocation } from 'react-router-dom';

const ShoppingPage = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam !== null) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

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
        <div className="sticky top-[70px] md:top-24 z-30 bg-black/95 md:bg-black/90 backdrop-blur-2xl border-b md:border border-white/10 md:rounded-3xl p-3 md:p-4 mb-6 md:mb-12 md:shadow-2xl md:shadow-black/50 -mx-4 md:mx-0 px-4 md:px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            
            {/* Search Bar - Moves to Top on Mobile */}
            <div className="relative w-full md:w-72 shrink-0 md:order-last">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-2xl pl-10 pr-4 py-2.5 md:py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-all text-sm placeholder:text-neutral-500"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            </div>

            {/* Dynamic Categories from DB */}
            <div className="flex flex-nowrap overflow-x-auto gap-2 w-full md:w-auto pb-1 scrollbar-none md:order-first items-center">
              {/* Always show "All" first */}
              <button
                onClick={() => setActiveCategory('All')}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 md:py-2.5 rounded-full border transition-all text-[13px] md:text-sm font-medium whitespace-nowrap ${
                  activeCategory === 'All'
                    ? 'bg-amber-500 border-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <BookOpen size={14} />
                All
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeCategory === 'All' ? 'bg-black/20' : 'bg-neutral-800'}`}>
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
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 md:py-2.5 rounded-full border transition-all text-[13px] md:text-sm font-medium whitespace-nowrap ${
                      activeCategory === cat.name
                        ? 'bg-amber-500 border-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {cat.icon || <SlidersHorizontal size={14} />}
                    {cat.name}
                    {count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeCategory === cat.name ? 'bg-black/20' : 'bg-neutral-800'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pb-12 w-full">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full aspect-[2/3] sm:h-80 rounded-2xl sm:rounded-3xl bg-neutral-900 border border-neutral-800 animate-pulse" />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pb-12 w-full">
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

