import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <span className="logo-text">C<span className="text-yellow">&amp;</span>A</span>
        </div>
        
        <nav className="nav-menu">
          <ul className="nav-list">
            <li><a href="#home" className="nav-link active">Home</a></li>
            <li><a href="#about" className="nav-link">About Us</a></li>
            <li><a href="#team" className="nav-link">Team</a></li>
            <li><a href="#projects" className="nav-link">Projects</a></li>
            <li><a href="#blog" className="nav-link">Blog</a></li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <a href="#contact" className="btn-primary">Contact</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
