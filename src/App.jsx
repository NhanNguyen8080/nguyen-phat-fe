import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Services from './components/Services/Services';
import WhyChooseUs from './components/WhyChooseUs/WhyChooseUs';
import Portfolio from './components/Portfolio/Portfolio';
import Contact from './components/Contact/Contact';
import ProductList from './components/ProductList/ProductList';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    if (path === '/products' || hash === '#/products' || hash === '#products') {
      return 'products';
    }
    return 'home';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (path === '/products' || hash === '#/products' || hash === '#products') {
        setCurrentPage('products');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateToProducts = () => {
    window.location.hash = '#/products';
    setCurrentPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (targetId = '#home') => {
    window.location.hash = targetId;
    setCurrentPage('home');
    setTimeout(() => {
      const id = targetId.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 85;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <div className="app">
      <Header 
        currentPage={currentPage}
        onNavigateHome={navigateToHome}
        onNavigateProducts={navigateToProducts}
      />
      {currentPage === 'products' ? (
        <ProductList onNavigateHome={() => navigateToHome('#contact')} />
      ) : (
        <main>
          <Hero />
          <About />
          <Services onNavigateProducts={navigateToProducts} />
          <WhyChooseUs />
          <Portfolio />
          <Contact />
        </main>
      )}
    </div>
  );
}

export default App;
