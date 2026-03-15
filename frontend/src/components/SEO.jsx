import { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    // Update Page Title
    document.title = title ? `${title} | Almas Books` : 'Almas Books';

    const metaDesc = description || 'Welcome to Almas Books, your favorite online bookstore.';
    const metaUrl = url || window.location.href;

    // Helper function to set meta tags
    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Helper function to set link tags (canonical)
    const setLink = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard SEO
    setMeta('description', metaDesc);
    setMeta('keywords', keywords);
    setLink('canonical', metaUrl);

    // Open Graph / Facebook
    setMeta('og:type', 'website', true);
    setMeta('og:title', title ? `${title} | Almas Books` : 'Almas Books', true);
    setMeta('og:description', metaDesc, true);
    if (image) setMeta('og:image', image, true);
    setMeta('og:url', metaUrl, true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title ? `${title} | Almas Books` : 'Almas Books');
    setMeta('twitter:description', metaDesc);
    if (image) setMeta('twitter:image', image);

  }, [title, description, keywords, image, url]);

  return null;
};

export default SEO;