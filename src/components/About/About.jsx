import React from 'react';
import './About.css';
import aboutImage from '../../assets/about-us.png';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const About = () => {
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
