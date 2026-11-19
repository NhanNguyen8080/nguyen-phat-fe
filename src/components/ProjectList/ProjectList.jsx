import React, { useEffect, useMemo, useState } from 'react';
import './ProjectList.css';
import { getProjects } from '../../services/projectService';
import { stripHtml } from '../../utils/textUtils';

const ITEMS_PER_PAGE = 6;

const PROJECT_CATEGORIES = [
  { id: 'industrial', label: 'Công trình công nghiệp và Nhà máy', keywords: ['công nghiệp', 'nhà máy', 'kcn', 'sản xuất', 'xưởng', 'khu công nghiệp'] },
  { id: 'building_civil', label: 'Tòa nhà & Dân dụng', keywords: ['tòa nhà', 'dân dụng', 'chung cư', 'đô thị', 'dân cư', 'văn phòng', 'khu dân cư'] },
  { id: 'commercial_hotel', label: 'Thương mại & Khách sạn', keywords: ['thương mại', 'khách sạn', 'resort', 'hotel', 'trung tâm thương mại'] },
  { id: 'infrastructure_energy', label: 'Hạ tầng, Giao thông & Năng lượng', keywords: ['hạ tầng', 'giao thông', 'năng lượng', 'điện mặt trời', 'trạm biến áp', 'cảng', 'đường', 'cầu'] },
];

const ProjectList = ({ onNavigateHome, onSelectProject }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);

  // Load toàn bộ công trình 1 lần duy nhất khi mount
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setLoading(true);
      const result = await getProjects(null);
      if (isMounted) {
        setAllProjects(result.projects || []);
        setLoading(false);
      }
    };
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lọc và sắp xếp công trình theo danh mục (toggle chọn/bỏ chọn) và tìm kiếm
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const activeCat = selectedCategory ? PROJECT_CATEGORIES.find((c) => c.id === selectedCategory) : null;

    return allProjects
      .filter((p) => {
        let matchesCategory = true;
        if (activeCat) {
          const typeStr = (p.project_type || '').toLowerCase();
          const catStr = (p.category_name || '').toLowerCase();
          const titleStr = (p.title || '').toLowerCase();
          const contentStr = (p.content || '').toLowerCase();
          const scopeStr = (p.scope_of_work || '').toLowerCase();
          const combined = `${typeStr} ${catStr} ${titleStr} ${contentStr} ${scopeStr}`;

          matchesCategory = activeCat.keywords.some((kw) => combined.includes(kw));
        }

        const matchesSearch =
          !term ||
          (p.title && p.title.toLowerCase().includes(term)) ||
          (p.content && p.content.toLowerCase().includes(term)) ||
          (p.category_name && p.category_name.toLowerCase().includes(term)) ||
          (p.project_type && p.project_type.toLowerCase().includes(term)) ||
          (p.client && p.client.toLowerCase().includes(term)) ||
          (p.location && p.location.toLowerCase().includes(term));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        if (sortBy === 'oldest') {
          return timeA - timeB;
        }
        return timeB - timeA;
      });
  }, [allProjects, selectedCategory, searchTerm, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;

  const paginatedProjects = useMemo(() => {
    const start = (currentPageNum - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPageNum]);

  // Chọn bộ lọc danh mục: bấm để chọn, bấm lại lần nữa để bỏ chọn (hiện tất cả)
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
    setCurrentPageNum(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPageNum(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPageNum(1);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPageNum(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectClick = (project) => {
    if (onSelectProject) {
      onSelectProject(project);
    } else {
      setSelectedProject(project);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDetail = () => {
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  if (loading) {
    return (
      <div className="page-loading-wrapper" aria-label="Đang tải danh sách công trình">
        <div className="yellow-spinner" role="status"></div>
        <span className="loading-text">Đang tải danh sách công trình...</span>
      </div>
    );
  }

  return (
    <div className="project-page">
      {/* Tiêu đề: Công trình + Dải danh mục lọc ngay bên dưới */}
      <div className="project-page-title-wrap">
        <div className="container">
          <h1 className="section-title"><span className="text-yellow">Công trình</span></h1>

          {/* 4 Phân loại công trình ngay bên dưới chữ Công trình */}
          <div className="category-pills project-top-category-pills" role="tablist" aria-label="Lọc theo loại công trình">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleSelectCategory(cat.id)}
                role="tab"
                aria-selected={selectedCategory === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="container projects-grid-section">
        {/* Search & Filters */}
        <div className="project-controls">
          <div className="project-search-row">
            <div className="search-box-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                className="project-search-input"
                placeholder="Tìm kiếm theo tên dự án, địa điểm, quy mô..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Mới nhất (Mặc định)</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Counter Header */}
        <div className="projects-grid-header">
          <span className="projects-count">
            Hiển thị <strong>{filteredProjects.length}</strong> công trình
            {totalPages > 1 && ` (Trang ${currentPageNum}/${totalPages})`}
            {searchTerm && ` cho từ khóa "${searchTerm}"`}
          </span>
        </div>

        {/* Grid / Empty */}
        {filteredProjects.length === 0 ? (
          <div className="project-empty">
            <div className="project-empty-icon">🏗️</div>
            <h3 className="project-empty-title">Không tìm thấy công trình nào</h3>
            <p className="project-empty-desc">Vui lòng thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
          </div>
        ) : (
          <>
            <div className="projects-grid">
              {paginatedProjects.map((project) => (
                <article 
                  key={project.id || project.slug} 
                  className="project-card"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="project-card-thumb-wrap">
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop'} 
                      alt={project.title} 
                      className="project-card-thumb"
                      loading="lazy"
                    />
                  </div>

                  <div className="project-card-body">
                    <h3 
                      className="project-card-title"
                      title={project.title}
                    >
                      {project.title}
                    </h3>
                    <p className="project-card-desc">{stripHtml(project.content)}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPageNum - 1)}
                  disabled={currentPageNum === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Trước
                </button>

                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`pagination-page-btn ${currentPageNum === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPageNum + 1)}
                  disabled={currentPageNum === totalPages}
                >
                  Sau
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Quick View */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="modal-close-btn" 
              onClick={closeDetail}
              aria-label="Đóng popup"
            >
              ✕
            </button>

            <div className="modal-body">
              {/* Image column */}
              <div className="modal-gallery">
                <div className="modal-main-image-wrap">
                  <img 
                    src={selectedProject.thumbnail} 
                    alt={selectedProject.title} 
                    className="modal-main-image"
                  />
                </div>
              </div>

              {/* Info column */}
              <div className="modal-info">
                {(selectedProject.project_type || selectedProject.category_name) && (
                  <span className="modal-category">
                    {selectedProject.project_type || selectedProject.category_name}
                  </span>
                )}
                <h2 className="modal-title">{selectedProject.title}</h2>
                {Boolean(selectedProject.content && stripHtml(selectedProject.content)) && (
                  <p className="modal-desc">{stripHtml(selectedProject.content)}</p>
                )}

                <div className="modal-meta">
                  {Boolean(selectedProject.client || selectedProject.investor) && (
                    <div><strong>Chủ đầu tư / Đối tác:</strong> {selectedProject.client || selectedProject.investor}</div>
                  )}
                  {Boolean(selectedProject.scope_of_work || selectedProject.scope) && (
                    <div><strong>Hạng mục đảm nhận:</strong> {selectedProject.scope_of_work || selectedProject.scope}</div>
                  )}
                  {selectedProject.completion_year ? (
                    <div><strong>Thời gian hoàn thành:</strong> Năm {selectedProject.completion_year}</div>
                  ) : null}
                  {selectedProject.standards && (
                    <div><strong>Tiêu chuẩn nghiệm thu:</strong> {selectedProject.standards}</div>
                  )}
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      closeDetail();
                      onNavigateHome();
                    }}
                  >
                    Tư vấn dự án tương tự
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={closeDetail}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
