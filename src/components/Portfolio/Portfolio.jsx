import React from 'react';
import './Portfolio.css';

const projects = [
  {
    id: 1,
    title: 'House Renovation',
    desc: 'Full Renovation With Recycled Materials',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop',
    featured: true
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop'
  }
];

const Portfolio = () => {
  return (
    <section className="portfolio" id="projects">
      <div className="container">
        <div className="portfolio-header">
          <h2 className="section-title">Our <span className="text-yellow">Portfolio</span></h2>
          <p className="portfolio-subtitle">We have completed over 500+ projects across USA.</p>
        </div>

        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <div key={project.id} className={`portfolio-item ${index === 0 ? 'featured-item' : ''}`}>
              <img src={project.image} alt="Project" className="portfolio-image" />
              {project.featured && (
                <div className="portfolio-info">
                  <h4 className="portfolio-item-title">{project.title}</h4>
                  <p className="portfolio-item-desc">{project.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="portfolio-actions">
          <button className="btn-primary">See All Projects Now</button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
