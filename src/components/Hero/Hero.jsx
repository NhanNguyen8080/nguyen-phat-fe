import React from 'react';
import './Hero.css';
import heroImage from '../../assets/hero.png';

const Hero = () => {
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
          <button className="btn-primary">Build</button>
          <button className="btn-secondary">About Us</button>
        </div>

        <div className="hero-image-wrapper">
          <img 
            src={heroImage} 
            alt="Construction workers on site" 
            className="hero-image"
          />
          <div className="hero-stats-left">
            <div className="team-avatars">
              <div className="avatar"></div>
              <div className="avatar"></div>
              <div className="avatar"></div>
            </div>
            <span>+1,500 Team Members</span>
          </div>
          
          <div className="hero-stats-right">
            <span>Present in 4 Countries</span>
            <div className="country-flags">
              <div className="flag"></div>
              <div className="flag"></div>
              <div className="flag"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
