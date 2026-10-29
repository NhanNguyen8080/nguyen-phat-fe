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

  useEffect(() => {
    if (currentPage === 'about') {
      setActiveSection('about');
      return;
    }

    if (currentPage === 'products') {
      setActiveSection('product');
      return;
    }

    if (currentPage === 'projects') {
      setActiveSection('project');
      return;
    }

    if (currentPage === 'news') {
      setActiveSection('news');
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sectionIds = ['contact', 'news', 'project', 'product', 'about', 'home'];
      const scrollPosition = window.scrollY + 140;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();

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

    // 2. Khi đang ở trang Products
    if (currentPage === 'products') {
      if (targetId === '#product') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // 3. Khi đang ở trang Projects
    if (currentPage === 'projects') {
      if (targetId === '#project') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // 4. Khi đang ở trang News
    if (currentPage === 'news') {
      if (targetId === '#news') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const headerOffset = 85;
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
          <span className="logo-text">C<span className="text-yellow">&amp;</span>A</span>
        </div>
        
        <nav className="nav-menu">
          <ul className="nav-list">
            <li>
              <a 
                href="#home" 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#home')}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#about')}
              >
                About Us
              </a>
            </li>
            <li>
              <a 
                href="#product" 
                className={`nav-link ${activeSection === 'product' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#product')}
              >
                Product
              </a>
            </li>
            <li>
              <a 
                href="#project" 
                className={`nav-link ${activeSection === 'project' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#project')}
              >
                Project
              </a>
            </li>
            <li>
              <a 
                href="#news" 
                className={`nav-link ${activeSection === 'news' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#news')}
              >
                News
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
            Contact
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
