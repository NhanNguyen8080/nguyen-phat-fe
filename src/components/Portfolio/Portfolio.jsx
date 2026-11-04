import React, { useEffect, useState } from 'react';
import './Portfolio.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getProjects } from '../../services/projectService';

const Portfolio = ({ onNavigateProjects }) => {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ threshold: 0.08 });
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getProjects().then((res) => {
      if (isMounted && res?.projects?.length > 0) {
        setProjectList(res.projects.slice(0, 4));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayProjects = projectList.length > 0
    ? projectList.map((p, idx) => ({
        id: p.id || idx,
        title: p.title,
        desc: p.scope_of_work || p.project_type || 'Sản xuất và lắp đặt tủ điện, thang máng cáp',
        image: p.thumbnail || (p.images && p.images[0]) || 'http://diennguyenphat.com/upload/files/image004.jpg',
        featured: idx === 0
      }))
    : [
        {
          id: 1,
          title: 'Nhà Máy SX Cọc Vách Nhựa UPVC',
          desc: 'Sản xuất, cung cấp và lắp đặt trọn gói hệ thống Tủ điện phân phối và Thang máng cáp',
          image: 'http://diennguyenphat.com/upload/files/image004.jpg',
          featured: true
        },
        {
          id: 2,
          image: 'http://diennguyenphat.com/upload/files/image007.jpg'
        },
        {
          id: 3,
          image: 'http://diennguyenphat.com/upload/files/image009.jpg'
        },
        {
          id: 4,
          image: 'http://diennguyenphat.com/upload/files/image014.jpg'
        }
      ];

  return (
    <section className="portfolio" id="project">
      <span id="cong-trinh"></span>
      <span id="projects"></span>
      <div className="container">
        <div className="portfolio-header" ref={headerRef}>
          <h2 className="section-title reveal delay-1"><span className="text-yellow">Công trình</span></h2>
          <p className="portfolio-subtitle reveal delay-3">Hơn 500+ dự án cơ điện công nghiệp và công trình tiêu biểu trên toàn quốc.</p>
        </div>

        <div className="portfolio-grid" ref={gridRef}>
          {displayProjects.map((project, index) => (
            <div
              key={project.id}
              className={`portfolio-item reveal ${index === 0 ? 'featured-item' : ''}`}
              style={{ transitionDelay: `${index * 0.12}s`, cursor: 'pointer' }}
              onClick={onNavigateProjects}
              title="Xem danh sách công trình"
            >
              <img src={project.image} alt={project.title || "Công trình Nguyên Phát"} className="portfolio-image" />
              {project.featured && (
                <div className="portfolio-info">
                  <h4 className="portfolio-item-title">{project.title}</h4>
                  <p className="portfolio-item-desc">{project.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="portfolio-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <button 
            type="button" 
            className="btn-primary"
            onClick={onNavigateProjects}
            style={{ 
              padding: '14px 36px', 
              fontSize: '1rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              borderRadius: 'var(--border-radius-lg)',
              cursor: 'pointer'
            }}
          >
            <span>Xem thêm</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
