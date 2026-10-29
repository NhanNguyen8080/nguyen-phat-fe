import React from 'react';
import './Hero.css';
import heroImage from '../../assets/hero.png';

const Hero = ({ onNavigateAbout }) => {
  return (
    <section className="hero" id="home">
      <div className="container hero-container">
        <div className="hero-top">
          <div className="hero-location">
            <p>
              Located in the heart of <strong>Silicon Valley</strong>, we are
              <br />
              a construction company dedicated to building
            </p>
          </div>
          <div className="hero-title-main hero-title-main-top">
            <h1 className="hero-title">
              <span className="text-yellow">Creating</span> a Brighter Future
            </h1>
          </div>
          <div className="hero-title-main hero-title-main-bottom">
            <h1 className="hero-title">
              Starting <span className="text-yellow">Today</span>
            </h1>
          </div>
          <div className="hero-description">
            <p>
              We are a forward-thinking construction company dedicated to
              creating innovative solutions that enhance everyday life.
            </p>
          </div>
        </div>

        <div className="hero-actions">
          <a href="#product" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Build</a>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onNavigateAbout}
          >
            About Us
          </button>
        </div>

        <div className="hero-image-wrapper">
          <img 
            src={heroImage} 
            alt="Construction workers on site" 
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
