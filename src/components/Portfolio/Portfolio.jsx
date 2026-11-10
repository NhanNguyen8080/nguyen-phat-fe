import React, { useEffect, useState } from 'react';
import './Portfolio.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getProjects, MOCK_PROJECTS } from '../../services/projectService';

const getCleanTitle = (project) => {
  if (!project) return '';
  const matched = MOCK_PROJECTS.find(
    (m) => m.id === project.id || m.slug === project.slug || (project.thumbnail && m.thumbnail === project.thumbnail)
  );
  if (matched && matched.title) {
    return matched.title;
  }
  return project.title || 'Công trình Cơ Điện Nguyên Phát';
};

const FALLBACK_PROJECTS = [
  {
    id: '47792699-c75d-479e-bb27-f0540f15f1f7',
    slug: 'nha-may-sx-coc-vach-nhua-upvc-kcn-hiep-phuoc-nha-be-34',
    title: 'Nhà Máy SX Cọc Vách Nhựa UPVC - KCN Hiệp Phước',
    desc: 'Sản xuất, cung cấp và lắp đặt trọn gói hệ thống Tủ điện phân phối và Thang máng cáp',
    image: 'http://diennguyenphat.com/upload/files/image004.jpg',
  },
  {
    id: 'd34e5709-db4c-4ea2-92f4-9cdbe7344eec',
    slug: 'khu-tai-dinh-cu-tan-hoa-dong-quan-6-35',
    title: 'Khu Tái Định Cư Tân Hòa Đông - Quận 6',
    desc: 'Cung cấp trọn gói tủ điện MSB, ATS 400A và thang máng cáp',
    image: 'http://diennguyenphat.com/upload/files/image007.jpg',
  },
  {
    id: 'aea46dc7-bb75-4e90-a568-53d947e0f819',
    slug: 'kcn-long-duc-dong-nai-36',
    title: 'Nhà Xưởng KCN Long Đức - Đồng Nai',
    desc: 'Tủ điện điều khiển MCC, tủ bù công suất phản kháng và máng cáp',
    image: 'http://diennguyenphat.com/upload/files/image009.jpg',
  },
  {
    id: '530c7ac4-a340-4251-a139-8a54822cdc7d',
    slug: 'toa-nha-van-phong-dai-dien-phia-nam-cty-319-invest-tan-binh-39',
    title: 'Tòa Nhà Văn Phòng Đại Diện Cty 319 Invest',
    desc: 'Cung cấp toàn bộ hệ thống tủ phân phối tầng và thang máng cáp',
    image: 'http://diennguyenphat.com/upload/files/image014.jpg',
  }
];

const Portfolio = ({ onNavigateProjects, onSelectProject }) => {
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
        slug: p.slug || p.id,
        title: getCleanTitle(p),
        desc: p.scope_of_work || p.project_type || 'Sản xuất và lắp đặt tủ điện, thang máng cáp',
        image: p.thumbnail || (p.images && p.images[0]) || 'http://diennguyenphat.com/upload/files/image004.jpg',
      }))
    : FALLBACK_PROJECTS;

  const handleProjectClick = (project) => {
    if (onSelectProject && (project.slug || project.id)) {
      onSelectProject(project.slug || project.id);
    } else if (onNavigateProjects) {
      onNavigateProjects();
    }
  };

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
              key={project.id || index}
              className="portfolio-item reveal"
              style={{ transitionDelay: `${index * 0.1}s`, cursor: 'pointer' }}
              onClick={() => handleProjectClick(project)}
              title={`Xem chi tiết: ${project.title}`}
            >
              <div className="portfolio-image-wrap">
                <img 
                  src={project.image} 
                  alt={project.title || "Công trình Nguyên Phát"} 
                  className="portfolio-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop';
                  }}
                />
              </div>
              <div className="portfolio-info">
                <h4 className="portfolio-item-title" title={project.title}>
                  {project.title}
                </h4>
              </div>
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
