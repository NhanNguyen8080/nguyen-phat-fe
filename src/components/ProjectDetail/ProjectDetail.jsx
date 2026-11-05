import React, { useEffect, useState } from 'react';
import './ProjectDetail.css';
import { getProjectById, getProjects } from '../../services/projectService';
import { stripHtml } from '../../utils/textUtils';

const ProjectDetail = ({ projectIdOrSlug, onNavigateBack, onNavigateContact, onSelectProject }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProjects, setRelatedProjects] = useState([]);

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
        
        // Lọc 3 công trình liên quan khác
        if (allRes?.projects) {
          const others = allRes.projects.filter(p => p.id !== data?.id && p.slug !== data?.slug).slice(0, 3);
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

  if (loading) {
    return (
      <div className="page-loading-wrapper" aria-label="Đang tải thông tin chi tiết công trình">
        <div className="yellow-spinner" role="status"></div>
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

  return (
    <div className="project-detail-page">
      {/* Breadcrumb Navigation */}
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
            <span className="breadcrumb-item active">{project.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="project-detail-header container">
        <div className="project-detail-badge">{project.project_type || project.category_name || 'Công trình tiêu biểu'}</div>
        <h1 className="project-detail-title">{project.title}</h1>
        <div className="project-detail-meta-row">
          <span className="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {project.location || 'Việt Nam'}
          </span>
          <span className="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Năm hoàn thành: {project.completion_year || '2022'}
          </span>
          <span className="meta-item status-badge">
            <span className="status-dot"></span>
            Đã bàn giao nghiệm thu
          </span>
        </div>
      </div>

      {/* Main Content & Gallery */}
      <div className="container project-detail-main">
        {/* Gallery Section */}
        <div className="project-gallery">
          <div className="project-main-image-wrap">
            <img 
              key={activeImage || project.thumbnail}
              src={activeImage || project.thumbnail} 
              alt={project.title} 
              className="project-main-image"
            />

            {project.images && project.images.length > 1 && (
              <div className="project-thumbs-list">
                {project.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`project-thumb-btn ${activeImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                    aria-label={`Xem ảnh ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`${project.title} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Specifications Cards Grid */}
        <div className="project-specs-grid">
          <div className="spec-card">
            <div className="spec-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M3 9h18M9 21V9"></path>
              </svg>
            </div>
            <div className="spec-label">Phân Loại Dự Án</div>
            <div className="spec-value">{project.project_type || 'Nhà máy Sản xuất & KCN'}</div>
          </div>

          <div className="spec-card">
            <div className="spec-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="spec-label">Chủ Đầu Tư / Đối Tác</div>
            <div className="spec-value">{project.client || project.investor || 'Chủ đầu tư dự án'}</div>
          </div>

          <div className="spec-card">
            <div className="spec-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="spec-label">Năm Hoàn Thành</div>
            <div className="spec-value">{project.completion_year ? `Năm ${project.completion_year}` : 'Năm 2022'}</div>
          </div>

          <div className="spec-card">
            <div className="spec-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="spec-label">Tiêu Chuẩn Sản Xuất</div>
            <div className="spec-value">{project.standards || 'IEC 61439-1/2, TCVN'}</div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="project-info-layout">
          {/* Left Column: Full Content */}
          <div className="project-description-col">
            <section className="project-section">
              <h2 className="section-subtitle">Tổng Quan Dự Án</h2>
              <div className="project-text-block">
                {/<[a-z][\s\S]*>/i.test(project.content) ? (
                  <div dangerouslySetInnerHTML={{ __html: project.content }} />
                ) : (
                  <p>{project.content}</p>
                )}
              </div>
            </section>

            <section className="project-section">
              <h2 className="section-subtitle">Cam Kết Kỹ Thuật Cơ Điện Nguyên Phát</h2>
              <ul className="project-features-list">
                <li>
                  <strong>Hệ thống Tủ điện đạt chuẩn quốc tế:</strong> Sản xuất đồng bộ tủ điện MSB, ATS, tụ bù và tủ điều khiển theo tiêu chuẩn IEC 61439-1/2 và TCVN 7994, đảm bảo khả năng chịu dòng cắt ngắn mạch an toàn tuyệt đối.
                </li>
                <li>
                  <strong>Gia công cơ khí CNC chính xác:</strong> Thang máng cáp và khay cáp được chấn đột CNC từ tole mạ kẽm, sơn tĩnh điện hoặc Inox 304 kháng ăn mòn, lắp đặt ăn khớp từng khớp nối.
                </li>
                <li>
                  <strong>Kiểm định Type-test &amp; Bàn giao nghiệm thu:</strong> Kiểm tra nghiêm ngặt KCS trước khi xuất xưởng, hỗ trợ đấu nối, nghiệm thu đóng điện cùng chủ đầu tư và bảo hành chính hãng tận nơi 24 tháng.
                </li>
              </ul>
            </section>

            <div className="project-quote-box">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffb800" opacity="0.4">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p>
                "Sự chính xác trong gia công thiết bị tủ điện cùng năng lực điều phối lắp đặt chuyên nghiệp của Nguyên Phát đã giúp dự án về đích an toàn, đúng tiến độ và vượt trên kỳ vọng của ban quản lý."
              </p>
              <span>— Đánh giá từ Ban Quản Lý Dự Án</span>
            </div>
          </div>

          {/* Right Column: Project Sidebar / Card */}
          <aside className="project-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">Thông Tin Gói Thầu</h3>
              <div className="sidebar-specs">
                <div className="sidebar-spec-row">
                  <span className="spec-name">Chủ đầu tư:</span>
                  <span className="spec-data">{project.client || project.investor || 'Chủ đầu tư dự án'}</span>
                </div>
                <div className="sidebar-spec-row">
                  <span className="spec-name">Địa điểm:</span>
                  <span className="spec-data">{project.location || 'Việt Nam'}</span>
                </div>
                <div className="sidebar-spec-row">
                  <span className="spec-name">Hạng mục đảm nhận:</span>
                  <span className="spec-data">{project.scope_of_work || project.scope || 'Sản xuất, cung cấp và lắp đặt trọn gói hệ thống Tủ điện phân phối và Thang máng cáp'}</span>
                </div>
                <div className="sidebar-spec-row">
                  <span className="spec-name">Năm hoàn thành:</span>
                  <span className="spec-data">{project.completion_year ? `Năm ${project.completion_year}` : 'Năm 2022'}</span>
                </div>
                <div className="sidebar-spec-row">
                  <span className="spec-name">Tiêu chuẩn:</span>
                  <span className="spec-data">{project.standards || 'IEC 61439-1/2, TCVN 7994'}</span>
                </div>
              </div>

              <div className="sidebar-cta">
                <h4>Cần tư vấn thiết bị cơ điện cho công trình?</h4>
                <p>Kỹ sư Cơ Điện Nguyên Phát sẵn sàng hỗ trợ khảo sát mặt bằng và lên dự toán, bóc tách khối lượng tủ điện - thang máng cáp hoàn toàn miễn phí.</p>
                <button 
                  type="button" 
                  className="btn-primary sidebar-cta-btn"
                  onClick={onNavigateContact}
                >
                  Liên Hệ Tư Vấn Ngay
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <section className="related-projects-section">
            <h2 className="section-subtitle">Công Trình Tiêu Biểu Khác</h2>
            <div className="related-projects-grid">
              {relatedProjects.map((rel) => (
                <article 
                  key={rel.id} 
                  className="related-project-card"
                  onClick={() => onSelectProject && onSelectProject(rel)}
                >
                  <div className="related-thumb-wrap">
                    <img src={rel.thumbnail} alt={rel.title} className="related-thumb" />
                    <span className="related-badge">{rel.category_name}</span>
                  </div>
                  <div className="related-body">
                    <h3 className="related-title">{rel.title}</h3>
                    <p className="related-snippet">
                      {rel.content ? stripHtml(rel.content).slice(0, 100) + '...' : ''}
                    </p>
                    <span className="related-link">
                      Xem chi tiết
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
