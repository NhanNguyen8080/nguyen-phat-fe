import React, { Suspense, lazy, useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Services from './components/Services/Services';
import Portfolio from './components/Portfolio/Portfolio';
import CapacityProfile from './components/CapacityProfile/CapacityProfile';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import './App.css';

const ProductList = lazy(() => import('./components/ProductList/ProductList'));
const ProductDetail = lazy(() => import('./components/ProductDetail/ProductDetail'));
const ProjectList = lazy(() => import('./components/ProjectList/ProjectList'));
const ProjectDetail = lazy(() => import('./components/ProjectDetail/ProjectDetail'));
const AboutPage = lazy(() => import('./components/AboutPage/AboutPage'));
const CapacityProfilePage = lazy(() => import('./components/CapacityProfilePage/CapacityProfilePage'));

const HOME_SECTIONS = [
  { id: 'home', label: 'Trang chủ' },
  { id: 'about', label: 'Giới thiệu' },
  { id: 'product', label: 'Sản phẩm' },
  { id: 'project', label: 'Công trình' },
  { id: 'capacity', label: 'Hồ sơ năng lực' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'footer', label: 'Đối tác & Chân trang' }
];

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
  if (
    path === '/capacity-profile' ||
    hash.startsWith('#/capacity-profile') ||
    hash.startsWith('#/ho-so-nang-luc') ||
    path === '/news' ||
    hash.startsWith('#/news')
  ) {
    return { page: 'capacity', id: '' };
  }
  return { page: 'home', id: '' };
}

function App() {
  const [route, setRoute] = useState(() => parseLocation());
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [capacityInitialPage, setCapacityInitialPage] = useState(1);
  const [activeFpSection, setActiveFpSection] = useState('home');

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const currentHash = window.location.hash || '';
    const homeSectionHashes = [
      '#product', '#project', '#capacity', '#news', '#about', '#contact', '#home',
      '#services', '#portfolio', '#tin-tuc', '#cong-trinh'
    ];
    if (homeSectionHashes.includes(currentHash)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const initialRoute = parseLocation();
    if (initialRoute.page === 'home') {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }

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

  // Cơ chế đồng bộ đề mục đang xem (Scroll-Spy) chính xác trên trang chủ
  useEffect(() => {
    if (route.page !== 'home') return;

    const getSectionElements = () =>
      HOME_SECTIONS.map((s) => ({
        ...s,
        el: document.getElementById(s.id)
      })).filter((s) => s.el);

    const getElementDocumentTop = (el) => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    const findCurrentSectionIndex = (sections) => {
      const scrollCenter = window.scrollY + window.innerHeight * 0.38;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (getElementDocumentTop(sections[i].el) <= scrollCenter) {
          idx = i;
        }
      }
      return idx;
    };

    const syncActiveSectionOnScroll = () => {
      const sections = getSectionElements();
      if (!sections.length) return;
      const idx = findCurrentSectionIndex(sections);
      setActiveFpSection(sections[idx].id);
    };

    syncActiveSectionOnScroll();
    window.addEventListener('scroll', syncActiveSectionOnScroll, { passive: true });
    window.addEventListener('resize', syncActiveSectionOnScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', syncActiveSectionOnScroll);
      window.removeEventListener('resize', syncActiveSectionOnScroll);
    };
  }, [route.page]);

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

  const navigateToCapacity = (pageNum = 1) => {
    const validPage = typeof pageNum === 'number' && pageNum >= 1 ? pageNum : 1;
    setCapacityInitialPage(validPage);
    window.location.hash = '#/capacity-profile';
    setRoute({ page: 'capacity', id: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (targetId = '#home') => {
    setRoute({ page: 'home', id: '' });
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (targetId && targetId !== '#home') {
      setTimeout(() => {
        const id = targetId.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveFpSection(id);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveFpSection('home');
    }
  };

  const handleDotClick = (secId) => {
    const el = document.getElementById(secId);
    if (el) {
      setActiveFpSection(secId);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`app ${route.page === 'home' ? 'is-home-fullpage' : ''}`}>
      {/* Lớp nền cảnh quan điện (cột điện cao thế, đường dây & tòa nhà công nghiệp mờ phía sau) */}
      <div className="electric-landscape-bg" aria-hidden="true" />

      <Header 
        currentPage={route.page}
        onNavigateHome={navigateToHome}
        onNavigateAbout={navigateToAbout}
        onNavigateProducts={navigateToProducts}
        onNavigateProjects={navigateToProjects}
        onNavigateCapacity={navigateToCapacity}
      />

      {/* Thanh chỉ báo đề mục (Section Dots) khi lăn chuột từng trang trên máy tính */}
      {route.page === 'home' && (
        <aside className="fp-section-dots" aria-label="Điều hướng từng mục trang chủ">
          {HOME_SECTIONS.map((sec, idx) => (
            <button
              key={sec.id}
              type="button"
              className={`fp-dot-btn ${activeFpSection === sec.id ? 'active' : ''}`}
              onClick={() => handleDotClick(sec.id)}
              title={`Chuyển tới: ${sec.label}`}
              aria-label={sec.label}
            >
              <span className="fp-dot-index">0{idx + 1}</span>
              <span className="fp-dot-circle" />
              <span className="fp-dot-label">{sec.label}</span>
            </button>
          ))}
        </aside>
      )}

      <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
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
        ) : route.page === 'capacity' ? (
          <CapacityProfilePage
            initialPage={capacityInitialPage}
            onNavigateHome={navigateToHome}
          />
        ) : (
          <main className="home-fullpage-main">
            <div className={`fp-stage ${activeFpSection === 'home' ? 'fp-active' : ''}`}>
              <Hero onNavigateAbout={navigateToAbout} />
            </div>
            <div className={`fp-stage ${activeFpSection === 'about' ? 'fp-active' : ''}`}>
              <About onNavigateAbout={navigateToAbout} />
            </div>
            <div className={`fp-stage ${activeFpSection === 'product' ? 'fp-active' : ''}`}>
              <Services 
                onNavigateProducts={navigateToProducts} 
                onSelectProduct={navigateToProductDetail}
              />
            </div>
            <div className={`fp-stage ${activeFpSection === 'project' ? 'fp-active' : ''}`}>
              <Portfolio 
                onNavigateProjects={navigateToProjects} 
                onSelectProject={navigateToProjectDetail}
              />
            </div>
            <div className={`fp-stage ${activeFpSection === 'capacity' ? 'fp-active' : ''}`}>
              <CapacityProfile onNavigateCapacity={navigateToCapacity} />
            </div>
            <div className={`fp-stage ${activeFpSection === 'contact' ? 'fp-active' : ''}`}>
              <Contact />
            </div>
          </main>
        )}
      </Suspense>
      <Footer
        onNavigateHome={navigateToHome}
        onNavigateAbout={navigateToAbout}
        onNavigateProducts={navigateToProducts}
        onNavigateProjects={navigateToProjects}
        onNavigateCapacity={navigateToCapacity}
      />
    </div>
  );
}

export default App;
