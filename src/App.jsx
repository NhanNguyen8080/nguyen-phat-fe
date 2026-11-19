import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
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

// Danh sách các màn hình 100vh khi lăn chuột trên máy tính (Mục Trang chủ gồm 2 màn hình: #home và #home-intro)
const HOME_SCROLL_SCREENS = [
  { id: 'home', navId: 'home', label: 'Trang chủ' },
  { id: 'home-intro', navId: 'home', label: 'Trang chủ' },
  { id: 'about', navId: 'about', label: 'Giới thiệu' },
  { id: 'product', navId: 'product', label: 'Sản phẩm' },
  { id: 'project', navId: 'project', label: 'Công trình' },
  { id: 'capacity', navId: 'capacity', label: 'Hồ sơ năng lực' },
  { id: 'contact', navId: 'contact', label: 'Liên hệ' },
  { id: 'footer', navId: 'footer', label: 'Chân trang' }
];

// Danh sách 7 đề mục hiển thị trên thanh chỉ báo bên trái (2 màn hình đầu gộp chung vào mục 01 - Trang chủ)
const HOME_SECTIONS = [
  { id: 'home', label: 'Trang chủ' },
  { id: 'about', label: 'Giới thiệu' },
  { id: 'product', label: 'Sản phẩm' },
  { id: 'project', label: 'Công trình' },
  { id: 'capacity', label: 'Hồ sơ năng lực' },
  { id: 'contact', label: 'Liên hệ' },
  { id: 'footer', label: 'Chân trang' }
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
  const isWheelLockedRef = useRef(false);
  const wheelLockTimerRef = useRef(null);
  const scrollAnimFrameRef = useRef(null);

  // Hàm cuộn mượt chậm rãi (Custom Smooth Scroll 1250ms với đường cong easeInOutCubic)
  const animateSlowScrollTo = (targetY, duration = 1250) => {
    if (scrollAnimFrameRef.current) {
      cancelAnimationFrame(scrollAnimFrameRef.current);
      scrollAnimFrameRef.current = null;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) {
      window.scrollTo({ top: targetY, behavior: 'instant' });
      return;
    }

    const startTime = performance.now();
    const htmlEl = document.documentElement;
    const prevScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    // Đường cong chuyển động êm ái: bắt đầu nhẹ, lướt đều và dừng lại từ từ
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);

      window.scrollTo({
        top: Math.round(startY + distance * eased),
        behavior: 'instant'
      });

      if (progress < 1) {
        scrollAnimFrameRef.current = requestAnimationFrame(step);
      } else {
        window.scrollTo({ top: targetY, behavior: 'instant' });
        htmlEl.style.scrollBehavior = prevScrollBehavior;
        scrollAnimFrameRef.current = null;
      }
    };

    scrollAnimFrameRef.current = requestAnimationFrame(step);
  };

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

  // Cơ chế Full-page Section Scroll: Lăn chuột 1 nấc = chuyển đúng 1 đề mục trên máy tính (> 992px)
  useEffect(() => {
    if (route.page !== 'home') return;

    const getSectionElements = () =>
      HOME_SCROLL_SCREENS.map((s) => ({
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
      if (isWheelLockedRef.current) return;
      const sections = getSectionElements();
      if (!sections.length) return;
      const idx = findCurrentSectionIndex(sections);
      setActiveFpSection(sections[idx].navId);
    };

    syncActiveSectionOnScroll();
    window.addEventListener('scroll', syncActiveSectionOnScroll, { passive: true });
    window.addEventListener('resize', syncActiveSectionOnScroll, { passive: true });

    const jumpToSectionIndex = (targetIdx, sections) => {
      const clamped = Math.max(0, Math.min(sections.length - 1, targetIdx));
      const target = sections[clamped];
      if (!target || !target.el) return;

      const ScrollDuration = 1250;
      isWheelLockedRef.current = true;
      setActiveFpSection(target.navId);
      const targetTop = getElementDocumentTop(target.el);
      animateSlowScrollTo(targetTop, ScrollDuration);

      if (wheelLockTimerRef.current) {
        clearTimeout(wheelLockTimerRef.current);
      }
      wheelLockTimerRef.current = setTimeout(() => {
        isWheelLockedRef.current = false;
      }, ScrollDuration + 80);
    };

    const handleWheel = (e) => {
      // Chỉ kích hoạt nhảy từng mục trên màn hình máy tính (> 992px) và không giữ phím Ctrl (zoom)
      if (window.innerWidth <= 992 || e.ctrlKey) return;
      if (document.body.style.overflow === 'hidden') return; // Đang mở modal/drawer

      const delta = e.deltaY;
      if (Math.abs(delta) < 12) return;

      const sections = getSectionElements();
      if (!sections.length) return;

      const currentIdx = findCurrentSectionIndex(sections);
      const currentSec = sections[currentIdx];
      const footerTop = getElementDocumentTop(currentSec.el);

      // Nếu đang ở phần Footer dài ở cuối trang, cho phép cuộn tự nhiên bên trong Footer
      if (currentSec.id === 'footer') {
        if (delta > 0) return; // Đang cuộn xuống tiếp trong footer
        if (delta < 0 && window.scrollY > footerTop + 30) {
          return; // Cuộn lên bên trong footer cho tới đầu footer
        }
      }

      e.preventDefault();
      if (isWheelLockedRef.current) return;

      if (delta > 0 && currentIdx < sections.length - 1) {
        jumpToSectionIndex(currentIdx + 1, sections);
      } else if (delta < 0 && currentIdx > 0) {
        jumpToSectionIndex(currentIdx - 1, sections);
      }
    };

    const handleKeyDown = (e) => {
      if (window.innerWidth <= 992) return;
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp'].includes(e.key)) {
        const sections = getSectionElements();
        if (!sections.length) return;
        const currentIdx = findCurrentSectionIndex(sections);
        const isDown = e.key === 'ArrowDown' || e.key === 'PageDown';

        if (sections[currentIdx]?.id === 'footer' && isDown) return;

        e.preventDefault();
        if (isWheelLockedRef.current) return;

        if (isDown && currentIdx < sections.length - 1) {
          jumpToSectionIndex(currentIdx + 1, sections);
        } else if (!isDown && currentIdx > 0) {
          jumpToSectionIndex(currentIdx - 1, sections);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', syncActiveSectionOnScroll);
      window.removeEventListener('resize', syncActiveSectionOnScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (wheelLockTimerRef.current) {
        clearTimeout(wheelLockTimerRef.current);
      }
      if (scrollAnimFrameRef.current) {
        cancelAnimationFrame(scrollAnimFrameRef.current);
      }
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
          const top = element.getBoundingClientRect().top + window.scrollY;
          animateSlowScrollTo(top, 1250);
          setActiveFpSection(id);
        } else {
          animateSlowScrollTo(0, 1000);
        }
      }, 60);
    } else {
      animateSlowScrollTo(0, 1150);
      setActiveFpSection('home');
    }
  };

  return (
    <div className={`app ${route.page === 'home' ? 'is-home-fullpage' : ''} ${route.page === 'capacity' ? 'is-capacity-page' : ''}`}>
      {/* Lớp nền cảnh quan điện (cột điện cao thế, đường dây & tòa nhà công nghiệp mờ phía sau) */}
      <div className="electric-landscape-bg" aria-hidden="true" />

      {route.page !== 'capacity' && (
        <Header 
          currentPage={route.page}
          onNavigateHome={navigateToHome}
          onNavigateAbout={navigateToAbout}
          onNavigateProducts={navigateToProducts}
          onNavigateProjects={navigateToProjects}
          onNavigateCapacity={navigateToCapacity}
        />
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
      {route.page !== 'capacity' && (
        <Footer
          onNavigateHome={navigateToHome}
          onNavigateAbout={navigateToAbout}
          onNavigateProducts={navigateToProducts}
          onNavigateProjects={navigateToProjects}
          onNavigateCapacity={navigateToCapacity}
        />
      )}
    </div>
  );
}

export default App;
