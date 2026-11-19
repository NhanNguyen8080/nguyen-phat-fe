import React, { useEffect, useMemo, useState } from 'react';
import './ProjectDetail.css';
import { getProjectById, getProjects } from '../../services/projectService';
import { stripHtml } from '../../utils/textUtils';

const ProjectDetail = ({ projectIdOrSlug, onNavigateBack, onNavigateContact, onSelectProject }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadData = async () => {
      setLoading(true);
      const data = await getProjectById(projectIdOrSlug);
      const allRes = await getProjects();
      
      if (isMounted) {
        setProject(data);
        setActiveImage(data?.thumbnail || (data?.images && data.images[0]) || '');
        
        // Lọc 4 công trình liên quan khác
        if (allRes?.projects) {
          const others = allRes.projects.filter(p => p.id !== data?.id && p.slug !== data?.slug).slice(0, 4);
          setRelatedProjects(others);
        }
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [projectIdOrSlug]);

  // Danh sách toàn bộ hình ảnh của dự án
  const galleryImages = useMemo(() => {
    if (!project) return [];
    const imgs = [];
    if (project.thumbnail) imgs.push(project.thumbnail);
    if (Array.isArray(project.images)) {
      project.images.forEach((img) => {
        if (img && !imgs.includes(img)) imgs.push(img);
      });
    }
    return imgs;
  }, [project]);

  // Lock scroll khi mở lightbox modal
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIsLightboxOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isLightboxOpen]);

  if (loading) {
    return (
      <div className="page-loading-wrapper" aria-label="Đang tải thông tin chi tiết công trình">
        <div className="yellow-spinner" role="status"></div>
        <span className="loading-text">Đang tải thông tin công trình...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-empty container">
        <h2>Không tìm thấy công trình</h2>
        <p>Công trình này có thể đã được cập nhật hoặc không tồn tại.</p>
        <button type="button" className="btn-primary" onClick={onNavigateBack}>
          ← Quay lại danh sách công trình
        </button>
      </div>
    );
  }

  const hasHtmlContent = project.content && /<[a-z][\s\S]*>/i.test(project.content);
  const cleanSnippet = project.content ? stripHtml(project.content) : '';

  return (
    <div className="project-detail-page">
      {/* Top Breadcrumb & Back Strip */}
      <div className="project-detail-nav">
        <div className="container project-detail-nav-inner">
          <nav className="breadcrumbs" aria-label="Đường dẫn điều hướng">
            <button 
              type="button" 
              className="breadcrumb-item breadcrumb-link" 
              onClick={onNavigateBack}
            >
              Công trình
            </button>
            <span className="breadcrumb-separator">/</span>
            {(project.project_type || project.category_name) && (
              <>
                <span className="breadcrumb-item">{project.project_type || project.category_name}</span>
                <span className="breadcrumb-separator">/</span>
              </>
            )}
            <span className="breadcrumb-item active">{project.title}</span>
          </nav>
          <button 
            type="button" 
            className="project-back-btn" 
            onClick={onNavigateBack}
          >
            ← Quay lại danh sách
          </button>
        </div>
      </div>

      {/* Main Screen Container - Bố cục 2 cột cân đối, nằm gọn gàng 1 trang */}
      <main className="container project-detail-main">
        <div className="project-stage-layout">
          {/* CỘT TRÁI: Gallery hình ảnh vừa vặn, không quá to, dải ảnh nhỏ bên dưới */}
          <div className="project-media-col">
            <div 
              className="project-main-image-wrap clickable"
              onClick={() => setIsLightboxOpen(true)}
              title="Bấm vào để xem ảnh phóng to toàn màn hình"
            >
              <img 
                key={activeImage || project.thumbnail}
                src={activeImage || project.thumbnail} 
                alt={project.title} 
                className="project-main-image"
              />
              <div className="project-zoom-badge">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                <span>Phóng to</span>
              </div>
            </div>

            {/* Dải ảnh nhỏ chuyển bên dưới ảnh chính */}
            {galleryImages.length > 1 && (
              <div className="project-thumbs-list" role="tablist" aria-label="Danh sách hình ảnh công trình">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`project-thumb-btn ${activeImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                    aria-label={`Xem ảnh ${idx + 1}`}
                    aria-selected={activeImage === imgUrl}
                  >
                    <img src={imgUrl} alt={`${project.title} ${idx + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: Nội dung thông tin công trình */}
          <div className="project-content-col">
            {/* Phân loại công trình */}
            {(project.project_type || project.category_name) && (
              <span className="project-detail-badge">
                {project.project_type || project.category_name}
              </span>
            )}

            {/* Tiêu đề công trình */}
            <h1 className="project-detail-title">{project.title}</h1>

            {/* 4 MỤC THÔNG TIN CỐT LÕI THEO YÊU CẦU */}
            <div className="project-key-specs-card">
              <div className="key-spec-item">
                <span className="key-spec-label">Chủ đầu tư:</span>
                <span className="key-spec-value">{project.client || project.investor || 'Chủ đầu tư dự án'}</span>
              </div>
              <div className="key-spec-item">
                <span className="key-spec-label">Địa điểm:</span>
                <span className="key-spec-value">{project.location || 'Việt Nam'}</span>
              </div>
              <div className="key-spec-item">
                <span className="key-spec-label">Hạng mục đảm nhận:</span>
                <span className="key-spec-value">{project.scope_of_work || project.scope || 'Sản xuất, cung cấp và lắp đặt trọn gói hệ thống Tủ điện & Thang máng cáp'}</span>
              </div>
              <div className="key-spec-item">
                <span className="key-spec-label">Năm hoàn thành:</span>
                <span className="key-spec-value">{project.completion_year ? `Năm ${project.completion_year}` : 'Đã hoàn thành bàn giao'}</span>
              </div>
            </div>

            {/* Nội dung mô tả / Tổng quan dự án */}
            {cleanSnippet && (
              <div className="project-description-card">
                <h3 className="project-desc-heading">Tổng Quan Công Trình</h3>
                <div className="project-desc-body">
                  {hasHtmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: project.content }} />
                  ) : (
                    <p>{project.content}</p>
                  )}
                </div>
              </div>
            )}

            {/* Nút hành động tư vấn */}
            <div className="project-actions-row">
              <button 
                type="button" 
                className="btn-primary project-cta-btn"
                onClick={onNavigateContact}
              >
                <span>Tư vấn kỹ thuật &amp; Báo giá công trình</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* CÁC DỰ ÁN KHÁC Ở DƯỚI (Phần này để nhỏ thôi theo yêu cầu) */}
        {relatedProjects.length > 0 && (
          <section className="related-projects-compact">
            <div className="related-compact-header">
              <h2 className="related-compact-title">Công Trình Tiêu Biểu Khác</h2>
              <button 
                type="button" 
                className="related-compact-viewall" 
                onClick={onNavigateBack}
              >
                Xem tất cả công trình →
              </button>
            </div>

            <div className="related-compact-grid">
              {relatedProjects.map((rel) => (
                <article 
                  key={rel.id || rel.slug} 
                  className="related-compact-card"
                  onClick={() => onSelectProject && onSelectProject(rel)}
                >
                  <div className="related-compact-thumb-wrap">
                    <img 
                      src={rel.thumbnail || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop'} 
                      alt={rel.title} 
                      className="related-compact-thumb" 
                      loading="lazy" 
                    />
                  </div>
                  <div className="related-compact-body">
                    <h3 className="related-compact-name" title={rel.title}>{rel.title}</h3>
                    {rel.location && (
                      <span className="related-compact-loc">📍 {rel.location}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Modal xem ảnh full màn hình khi bấm vào hình */}
      {isLightboxOpen && (
        <div 
          className="project-lightbox-backdrop" 
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh phóng to"
        >
          <div className="project-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="project-lightbox-close" 
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Đóng ảnh"
            >
              ✕
            </button>
            <img 
              src={activeImage || project.thumbnail} 
              alt={project.title} 
              className="project-lightbox-img" 
            />
            <div className="project-lightbox-caption">
              <h3>{project.title}</h3>
              {project.location && <span>📍 {project.location}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
