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

const FALLBACK_5_PROJECTS = MOCK_PROJECTS.slice(0, 5).map((p) => ({
  id: p.id,
  slug: p.slug || p.id,
  title: p.title,
  desc: p.scope_of_work || p.project_type || 'Sản xuất và lắp đặt tủ điện, thang máng cáp',
  image: p.thumbnail || (p.images && p.images[0]) || 'http://diennguyenphat.com/upload/files/image004.jpg'
}));

const Portfolio = ({ onNavigateProjects, onSelectProject }) => {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ threshold: 0.08 });
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getProjects().then((res) => {
      if (isMounted && res?.projects?.length > 0) {
        setProjectList(res.projects);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Luôn đảm bảo hiển thị đúng 5 tấm hình công trình tiêu biểu (nếu API trả về ít hơn 5 thì bù thêm từ MOCK_PROJECTS)
  const mergedProjects = (() => {
    const fromApi = projectList.map((p, idx) => ({
      id: p.id || idx,
      slug: p.slug || p.id,
      title: getCleanTitle(p),
      desc: p.scope_of_work || p.project_type || 'Sản xuất và lắp đặt tủ điện, thang máng cáp',
      image: p.thumbnail || (p.images && p.images[0]) || 'http://diennguyenphat.com/upload/files/image004.jpg'
    }));

    if (fromApi.length >= 5) {
      return fromApi.slice(0, 5);
    }

    const combined = [
      ...fromApi,
      ...FALLBACK_5_PROJECTS.filter((f) => !fromApi.some((a) => a.id === f.id || a.slug === f.slug))
    ];
    return combined.slice(0, 5);
  })();

  const handleProjectClick = (project) => {
    if (onSelectProject && (project.slug || project.id)) {
      onSelectProject(project.slug || project.id);
    } else if (onNavigateProjects) {
      onNavigateProjects();
    }
  };

  const handleOpenAllProjects = () => {
    if (onNavigateProjects) {
      onNavigateProjects();
    } else {
      window.location.hash = '#/projects';
    }
  };

  return (
    <section className="portfolio" id="project">
      <span id="cong-trinh"></span>
      <span id="projects"></span>
      <div className="container portfolio-container">
        {/* Tiêu đề "Các công trình tiêu biểu" — bấm vào chuyển thẳng vào trang Công trình bên trong */}
        <div className="portfolio-header" ref={headerRef}>
          <h2
            className="section-title portfolio-clickable-heading reveal delay-1"
            onClick={handleOpenAllProjects}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenAllProjects();
              }
            }}
            title="Bấm để xem toàn bộ trang Công trình tiêu biểu"
          >
            <span className="text-yellow">Các công trình</span> tiêu biểu
          </h2>
        </div>

        {/* Lưới 5 tấm hình công trình sắp xếp To - Nhỏ (Mosaic / Bento Grid) */}
        <div className="portfolio-mosaic-grid" ref={gridRef}>
          {mergedProjects.map((project, index) => (
            <div
              key={project.id || index}
              className={`portfolio-item portfolio-mosaic-item mosaic-slot-${index + 1} reveal`}
              style={{ transitionDelay: `${index * 0.08}s` }}
              onClick={() => handleProjectClick(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProjectClick(project);
                }
              }}
              title={`Xem chi tiết: ${project.title}`}
            >
              <img
                src={project.image}
                alt={project.title || 'Công trình Nguyên Phát'}
                className="portfolio-image"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="portfolio-overlay" />
              <div className="portfolio-info">
                <h4 className="portfolio-item-title" title={project.title}>
                  {project.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Nút dưới cùng: "Xem tất cả" — bấm vào chuyển vào trang Công trình bên trong */}
        <div className="portfolio-actions">
          <button
            type="button"
            className="btn-primary portfolio-view-all-btn"
            onClick={handleOpenAllProjects}
          >
            <span>Xem tất cả</span>
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
