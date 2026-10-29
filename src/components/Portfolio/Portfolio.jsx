import React from 'react';
import './Portfolio.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

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

const Portfolio = ({ onNavigateProjects }) => {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ threshold: 0.08 });
  const actionsRef = useScrollReveal();

  return (
    <section className="portfolio" id="project">
      <span id="cong-trinh"></span>
      <span id="projects"></span>
      <div className="container">
        <div className="portfolio-header" ref={headerRef}>
          <h2 className="section-title reveal delay-1"><span className="text-yellow">Công trình</span></h2>
          <p className="portfolio-subtitle reveal delay-3">We have completed over 500+ projects across USA.</p>
        </div>

        <div className="portfolio-grid" ref={gridRef}>
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`portfolio-item reveal ${index === 0 ? 'featured-item' : ''}`}
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
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

        <div className="portfolio-actions reveal" ref={actionsRef}>
          <button 
            type="button" 
            className="btn-primary"
            onClick={onNavigateProjects}
            style={{ 
              padding: '12px 32px', 
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
      </div>
    </section>
  );
};

export default Portfolio;
