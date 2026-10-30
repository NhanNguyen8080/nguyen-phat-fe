import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Services from './components/Services/Services';
import WhyChooseUs from './components/WhyChooseUs/WhyChooseUs';
import Portfolio from './components/Portfolio/Portfolio';
import News from './components/News/News';
import Contact from './components/Contact/Contact';
import ProductList from './components/ProductList/ProductList';
import ProductDetail from './components/ProductDetail/ProductDetail';
import ProjectList from './components/ProjectList/ProjectList';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import AboutPage from './components/AboutPage/AboutPage';
import NewsPage from './components/NewsPage/NewsPage';
import NewsDetail from './components/NewsDetail/NewsDetail';
import './App.css';

function parseLocation() {
  const hash = window.location.hash || '';
  const path = window.location.pathname || '';

  // Chi tiết sản phẩm: #/products/:idOrSlug
  if (hash.startsWith('#/products/') && hash.replace('#/products/', '').length > 0) {
    return { page: 'product-detail', id: decodeURIComponent(hash.replace('#/products/', '')) };
  }
  // Chi tiết công trình: #/projects/:idOrSlug
  if (hash.startsWith('#/projects/') && hash.replace('#/projects/', '').length > 0) {
    return { page: 'project-detail', id: decodeURIComponent(hash.replace('#/projects/', '')) };
  }
  // Chi tiết tin tức: #/news/:idOrSlug
  if (hash.startsWith('#/news/') && hash.replace('#/news/', '').length > 0) {
    return { page: 'news-detail', id: decodeURIComponent(hash.replace('#/news/', '')) };
  }
  // Trang danh sách / trang con
  if (path === '/about' || hash === '#/about' || hash === '#about-page') {
    return { page: 'about', id: '' };
  }
  if (path === '/projects' || hash === '#/projects' || hash === '#projects-page') {
    return { page: 'projects', id: '' };
  }
  if (path === '/products' || hash === '#/products' || hash === '#products') {
    return { page: 'products', id: '' };
  }
  if (path === '/news' || hash === '#/news' || hash === '#news-page') {
    return { page: 'news', id: '' };
  }
  return { page: 'home', id: '' };
}

function App() {
  const [route, setRoute] = useState(() => parseLocation());
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseLocation());
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateToAbout = () => {
    window.location.hash = '#/about';
    setRoute({ page: 'about', id: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProducts = (category = 'all') => {
    const nextCat = typeof category === 'string' && category ? category : 'all';
    setProductCategoryFilter(nextCat);
    window.location.hash = '#/products';
    setRoute({ page: 'products', id: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProductDetail = (productOrId) => {
    const idOrSlug = typeof productOrId === 'object' && productOrId !== null
      ? (productOrId.slug || productOrId.id)
      : productOrId;

    window.location.hash = `#/products/${idOrSlug}`;
    setRoute({ page: 'product-detail', id: idOrSlug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProjects = () => {
    window.location.hash = '#/projects';
    setRoute({ page: 'projects', id: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProjectDetail = (projectOrId) => {
    const idOrSlug = typeof projectOrId === 'object' && projectOrId !== null
      ? (projectOrId.slug || projectOrId.id)
      : projectOrId;

    window.location.hash = `#/projects/${idOrSlug}`;
    setRoute({ page: 'project-detail', id: idOrSlug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToNews = () => {
    window.location.hash = '#/news';
    setRoute({ page: 'news', id: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToNewsDetail = (postOrId) => {
    const idOrSlug = typeof postOrId === 'object' && postOrId !== null
      ? (postOrId.slug || postOrId.id)
      : postOrId;

    window.location.hash = `#/news/${idOrSlug}`;
    setRoute({ page: 'news-detail', id: idOrSlug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (targetId = '#home') => {
    window.location.hash = targetId;
    setRoute({ page: 'home', id: '' });
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
        currentPage={route.page}
        onNavigateHome={navigateToHome}
        onNavigateAbout={navigateToAbout}
        onNavigateProducts={navigateToProducts}
        onNavigateProjects={navigateToProjects}
        onNavigateNews={navigateToNews}
      />
      {route.page === 'about' ? (
        <AboutPage onNavigateHome={navigateToHome} />
      ) : route.page === 'products' ? (
        <ProductList 
          onNavigateHome={() => navigateToHome('#contact')} 
          onSelectProduct={navigateToProductDetail}
          initialCategory={productCategoryFilter}
        />
      ) : route.page === 'product-detail' ? (
        <ProductDetail 
          productIdOrSlug={route.id}
          onNavigateBack={() => navigateToProducts('all')}
          onNavigateCategory={navigateToProducts}
          onNavigateHome={navigateToHome}
          onNavigateContact={() => navigateToHome('#contact')}
          onSelectProduct={navigateToProductDetail}
        />
      ) : route.page === 'projects' ? (
        <ProjectList 
          onNavigateHome={() => navigateToHome('#contact')} 
          onSelectProject={navigateToProjectDetail}
        />
      ) : route.page === 'project-detail' ? (
        <ProjectDetail 
          projectIdOrSlug={route.id}
          onNavigateBack={navigateToProjects}
          onNavigateContact={() => navigateToHome('#contact')}
          onSelectProject={navigateToProjectDetail}
        />
      ) : route.page === 'news' ? (
        <NewsPage 
          onNavigateHome={() => navigateToHome('#contact')} 
          onSelectNews={navigateToNewsDetail}
        />
      ) : route.page === 'news-detail' ? (
        <NewsDetail 
          postIdOrSlug={route.id}
          onNavigateBack={navigateToNews}
          onNavigateContact={() => navigateToHome('#contact')}
          onSelectNews={navigateToNewsDetail}
        />
      ) : (
        <main>
          <Hero onNavigateAbout={navigateToAbout} />
          <About onNavigateAbout={navigateToAbout} />
          <Services onNavigateProducts={navigateToProducts} />
          <WhyChooseUs />
          <Portfolio onNavigateProjects={navigateToProjects} />
          <News 
            onNavigateNews={navigateToNews} 
            onSelectNews={navigateToNewsDetail}
          />
          <Contact />
        </main>
      )}
    </div>
  );
}

export default App;
