import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = ({ 
  currentPage = 'home', 
  onNavigateHome, 
  onNavigateAbout,
  onNavigateProducts,
  onNavigateProjects,
  onNavigateNews
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Khóa cuộn trang khi mở menu di động
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (currentPage === 'about') {
      setActiveSection('about');
    } else if (currentPage === 'products' || currentPage === 'product-detail') {
      setActiveSection('product');
    } else if (currentPage === 'projects' || currentPage === 'project-detail') {
      setActiveSection('project');
    } else if (currentPage === 'news' || currentPage === 'news-detail') {
      setActiveSection('news');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (currentPage === 'home') {
        const sectionIds = ['contact', 'news', 'project', 'product', 'about', 'home'];
        const scrollPosition = window.scrollY + 140;

        for (const id of sectionIds) {
          const element = document.getElementById(id);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    // 1. Khi đang ở trang About Us
    if (currentPage === 'about') {
      if (targetId === '#about') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (targetId === '#product' && onNavigateProducts) {
        onNavigateProducts();
        return;
      }
      if (targetId === '#project' && onNavigateProjects) {
        onNavigateProjects();
        return;
      }
      if (targetId === '#news' && onNavigateNews) {
        onNavigateNews();
        return;
      }
      if (onNavigateHome) {
        onNavigateHome(targetId);
      }
      return;
    }

    // 2. Khi đang ở trang Products hoặc Product Detail
    if (currentPage === 'products' || currentPage === 'product-detail') {
      if (targetId === '#product') {
        if (currentPage === 'product-detail' && onNavigateProducts) {
          onNavigateProducts();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      if (targetId === '#about' && onNavigateAbout) {
        onNavigateAbout();
        return;
      }
      if (targetId === '#project' && onNavigateProjects) {
        onNavigateProjects();
        return;
      }
      if (targetId === '#news' && onNavigateNews) {
        onNavigateNews();
        return;
      }
      if (onNavigateHome) {
        onNavigateHome(targetId);
      }
      return;
    }

    // 3. Khi đang ở trang Projects hoặc Project Detail
    if (currentPage === 'projects' || currentPage === 'project-detail') {
      if (targetId === '#project') {
        if (currentPage === 'project-detail' && onNavigateProjects) {
          onNavigateProjects();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      if (targetId === '#about' && onNavigateAbout) {
        onNavigateAbout();
        return;
      }
      if (targetId === '#product' && onNavigateProducts) {
        onNavigateProducts();
        return;
      }
      if (targetId === '#news' && onNavigateNews) {
        onNavigateNews();
        return;
      }
      if (onNavigateHome) {
        onNavigateHome(targetId);
      }
      return;
    }

    // 4. Khi đang ở trang News hoặc News Detail
    if (currentPage === 'news' || currentPage === 'news-detail') {
      if (targetId === '#news') {
        if (currentPage === 'news-detail' && onNavigateNews) {
          onNavigateNews();
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      if (targetId === '#about' && onNavigateAbout) {
        onNavigateAbout();
        return;
      }
      if (targetId === '#product' && onNavigateProducts) {
        onNavigateProducts();
        return;
      }
      if (targetId === '#project' && onNavigateProjects) {
        onNavigateProjects();
        return;
      }
      if (onNavigateHome) {
        onNavigateHome(targetId);
      }
      return;
    }

    // 5. Khi đang ở Trang Chủ -> cuộn mượt xuống đúng section (kể cả #about, #product, #project, #news)
    const id = targetId.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = window.innerWidth <= 768 ? 62 : 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
      window.history.pushState(null, '', targetId);
    } else if (targetId === '#news' && onNavigateNews) {
      onNavigateNews();
    }
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        <div 
          className="logo" 
          style={{ cursor: 'pointer' }} 
          onClick={(e) => handleNavClick(e, '#home')}
        >
          <span className="logo-text">Nguyên <span className="text-yellow">Phát</span></span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="nav-menu">
          <ul className="nav-list">
            <li>
              <a 
                href="#home" 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#home')}
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#about')}
              >
                Giới thiệu
              </a>
            </li>
            <li>
              <a 
                href="#product" 
                className={`nav-link ${activeSection === 'product' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#product')}
              >
                Sản phẩm
              </a>
            </li>
            <li>
              <a 
                href="#project" 
                className={`nav-link ${activeSection === 'project' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#project')}
              >
                Công trình
              </a>
            </li>
            <li>
              <a 
                href="#news" 
                className={`nav-link ${activeSection === 'news' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#news')}
              >
                Tin tức
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <a 
            href="#contact" 
            className="btn-primary"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Liên hệ
          </a>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button 
          type="button"
          className={`hamburger-btn ${isMobileMenuOpen ? 'is-active' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      <div 
        className={`mobile-menu-backdrop ${isMobileMenuOpen ? 'is-open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className={`mobile-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <div className="mobile-drawer-header">
          <div 
            className="logo" 
            style={{ cursor: 'pointer' }} 
            onClick={(e) => handleNavClick(e, '#home')}
          >
            <span className="logo-text">Nguyên <span className="text-yellow">Phát</span></span>
          </div>
          <button 
            type="button" 
            className="mobile-drawer-close"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="mobile-nav">
          <ul className="mobile-nav-list">
            <li>
              <a 
                href="#home" 
                className={`mobile-nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#home')}
              >
                <span className="mobile-nav-icon">🏠</span>
                <span>Trang chủ</span>
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`mobile-nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#about')}
              >
                <span className="mobile-nav-icon">🏢</span>
                <span>Giới thiệu</span>
              </a>
            </li>
            <li>
              <a 
                href="#product" 
                className={`mobile-nav-link ${activeSection === 'product' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#product')}
              >
                <span className="mobile-nav-icon">⚡</span>
                <span>Sản phẩm</span>
              </a>
            </li>
            <li>
              <a 
                href="#project" 
                className={`mobile-nav-link ${activeSection === 'project' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#project')}
              >
                <span className="mobile-nav-icon">🏗️</span>
                <span>Công trình</span>
              </a>
            </li>
            <li>
              <a 
                href="#news" 
                className={`mobile-nav-link ${activeSection === 'news' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#news')}
              >
                <span className="mobile-nav-icon">📰</span>
                <span>Tin tức</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="mobile-drawer-footer">
          <a 
            href="#contact" 
            className="btn-primary mobile-cta-btn"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Liên hệ ngay
          </a>
          <div className="mobile-contact-quick">
            <p>Hotline: <strong>0903 000 xxx</strong></p>
            <p>Email: <strong>contact@nguyenphat.vn</strong></p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
