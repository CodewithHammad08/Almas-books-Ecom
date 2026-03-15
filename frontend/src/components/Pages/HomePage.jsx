import React from 'react';
import Hero from '../Hero';
import Category from '../Category';
import ProductListing from '../ProductListing';
import PrintInfo from '../PrintInfo';
import Review from '../Review';
import SEO from '../SEO';

const HomePage = () => {
  return (
    <>
      <SEO 
        title="Home" 
        description="Welcome to Almas Books. Discover our vast collection of books across all genres."
        url={window.location.href}
      />
      <Hero />
      <Category />
      <ProductListing />
      <PrintInfo />
      <Review />
    </>
  );
};

export default HomePage;