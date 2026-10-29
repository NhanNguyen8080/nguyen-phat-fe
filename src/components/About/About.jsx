import React from 'react';
import './About.css';
import aboutImage from '../../assets/about-us.png';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const About = ({ onNavigateAbout }) => {
  const containerRef = useScrollReveal();

  return (
    <section className="about" id="about">
      <div className="container about-container" ref={containerRef}>
        
        <div className="about-left reveal-left">
          <span className="about-badge">About Us</span>
          <h2 className="about-title">Who we are?</h2>
          <p className="about-description">
            At our company, we pride ourselves on being a dynamic team of over 1,500 dedicated professionals. Each member brings unique skills and perspectives, contributing to a collaborative environment where innovation thrives. Together, we work towards a common goal of delivering exceptional solutions and services that meet the diverse needs of our clients.
          </p>
          <div className="about-author">
            <div className="author-avatar"></div>
            <div className="author-info">
              <strong>George Brian</strong>
              <span>CEO / C&amp;A</span>
            </div>
          </div>

          {onNavigateAbout && (
            <div style={{ marginTop: '24px' }}>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={onNavigateAbout}
                style={{ 
                  padding: '12px 30px', 
                  fontSize: '0.95rem', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  borderRadius: 'var(--border-radius-lg)',
                  cursor: 'pointer'
                }}
              >
                <span>Xem thêm</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="about-center reveal-scale">
          <img 
            src={aboutImage}
            alt="Workers on scaffolding" 
            className="about-image"
          />
        </div>

        <div className="about-right reveal-right">
          <div className="mission-vision reveal delay-2">
            <h3 className="mv-title">Our <span className="text-yellow">Mission</span></h3>
            <p className="mv-description">
              We empower a diverse team of 1,500 passionate individuals who drive innovation and excellence. Our commitment is to deliver outstanding solutions that meet our clients' unique needs, creativity, and teamwork.
            </p>
          </div>
          <div className="mission-vision reveal delay-4">
            <h3 className="mv-title">Our <span className="text-yellow">Vision</span></h3>
            <p className="mv-description">
              We aim to inspire a vibrant community of 1,500 professionals who drive creativity and innovation, delivering tailored solutions that foster collaboration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
