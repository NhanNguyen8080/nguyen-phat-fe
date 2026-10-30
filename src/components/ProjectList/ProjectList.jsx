import React, { useEffect, useMemo, useState } from 'react';
import './ProjectList.css';
import { getProjects } from '../../services/projectService';

const ITEMS_PER_PAGE = 6;

const TIME_FILTERS = [
  { id: 'all', label: 'Tất cả thời gian' },
  { id: '7days', label: '7 ngày gần đây', days: 7 },
  { id: '15days', label: '15 ngày gần đây', days: 15 },
  { id: '30days', label: '30 ngày gần đây', days: 30 },
];

const ProjectList = ({ onNavigateHome, onSelectProject }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');
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

  // Mốc thời gian tham chiếu để lọc theo khoảng thời gian
  const referenceTimestamp = useMemo(() => {
    if (!allProjects.length) return Date.now();
    const maxItemTime = Math.max(
      ...allProjects.map((p) => new Date(p.created_at || 0).getTime() || 0)
    );
    return maxItemTime > 0 ? maxItemTime : Date.now();
  }, [allProjects]);

  // Lọc và sắp xếp công trình theo thời gian (luôn ưu tiên mới tạo nhất đứng đầu)
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const activeFilter = TIME_FILTERS.find((f) => f.id === selectedTimeFilter);

    return allProjects
      .filter((p) => {
        let matchesTime = true;
        if (activeFilter && activeFilter.days) {
          const itemTime = new Date(p.created_at || 0).getTime();
          const diffMs = referenceTimestamp - itemTime;
          matchesTime = diffMs <= activeFilter.days * 24 * 60 * 60 * 1000;
        }

        const matchesSearch =
          !term ||
          (p.title && p.title.toLowerCase().includes(term)) ||
          (p.content && p.content.toLowerCase().includes(term)) ||
          (p.category_name && p.category_name.toLowerCase().includes(term));

        return matchesTime && matchesSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        if (sortBy === 'oldest') {
          return timeA - timeB;
        }
        // Mặc định luôn cho những items được tạo mới nhất đứng đầu
        return timeB - timeA;
      });
  }, [allProjects, selectedTimeFilter, referenceTimestamp, searchTerm, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;

  const paginatedProjects = useMemo(() => {
    const start = (currentPageNum - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPageNum]);

  // Chọn bộ lọc thời gian: lọc tức thì, không reload, reset về trang 1
  const handleSelectTimeFilter = (filterId) => {
    setSelectedTimeFilter(filterId);
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

  return (
    <div className="project-page">
      {/* Tiêu đề ngắn gọn duy nhất: Công trình */}
      <div className="project-page-title-wrap">
        <div className="container">
          <h1 className="section-title"><span className="text-yellow">Công trình</span></h1>
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

          {/* Time Filter Pills - lọc theo thời gian tạo */}
          <div className="category-pills">
            {TIME_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`category-pill ${selectedTimeFilter === filter.id ? 'active' : ''}`}
                onClick={() => handleSelectTimeFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
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

        {/* Loading / Grid / Empty */}
        {loading ? (
          <div className="project-empty">
            <p className="project-empty-desc">Đang tải danh sách công trình...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="project-empty">
            <div className="project-empty-icon">🏗️</div>
            <h3 className="project-empty-title">Không tìm thấy công trình nào</h3>
            <p className="project-empty-desc">Vui lòng thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
          </div>
        ) : (
          <>
            <div className="projects-grid">
              {paginatedProjects.map((project) => (
                <article key={project.id || project.slug} className="project-card">
                  <div 
                    className="project-card-thumb-wrap"
                    onClick={() => handleProjectClick(project)}
                  >
                    <span className="project-card-badge">
                      {project.category_name || 'Công trình'}
                    </span>
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop'} 
                      alt={project.title} 
                      className="project-card-thumb"
                      loading="lazy"
                    />
                  </div>

                  <div className="project-card-body">
                    {project.created_at && (
                      <div className="project-card-meta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{formatDate(project.created_at)}</span>
                      </div>
                    )}
                    <h3 
                      className="project-card-title"
                      onClick={() => handleProjectClick(project)}
                    >
                      {project.title}
                    </h3>
                    <p className="project-card-desc">{project.content}</p>

                    <div className="project-card-footer">
                      <button 
                        type="button" 
                        className="btn-card-detail"
                        onClick={() => handleProjectClick(project)}
                      >
                        Chi tiết
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                      <button 
                        type="button" 
                        className="btn-card-quote"
                        onClick={onNavigateHome}
                      >
                        Tư vấn
                      </button>
                    </div>
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
                <span className="modal-category">
                  {selectedProject.category_name || 'Nguyên Phát'}
                </span>
                <h2 className="modal-title">{selectedProject.title}</h2>
                <p className="modal-desc">{selectedProject.content}</p>

                <div className="modal-meta">
                  <div><strong>Mã công trình:</strong> {selectedProject.slug || selectedProject.id}</div>
                  <div><strong>Thời gian hoàn thành:</strong> {selectedProject.created_at ? new Date(selectedProject.created_at).toLocaleDateString('vi-VN') : 'Đang cập nhật'}</div>
                  <div><strong>Tiêu chuẩn nghiệm thu:</strong> Kiểm định an toàn chất lượng ASTM / TCVN</div>
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
