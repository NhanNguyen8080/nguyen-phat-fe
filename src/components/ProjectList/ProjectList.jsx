import React, { useEffect, useMemo, useState } from 'react';
import './ProjectList.css';
import { getProjects } from '../../services/projectService';

const ITEMS_PER_PAGE = 6;

const ProjectList = ({ onNavigateHome, onSelectProject }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  // Trích xuất danh mục động từ danh sách công trình
  const categories = useMemo(() => {
    const set = new Set();
    allProjects.forEach((p) => {
      if (p.category_name) set.add(p.category_name);
    });
    return ['all', ...Array.from(set)];
  }, [allProjects]);

  // Lọc và sắp xếp công trình tức thì (in-memory) không reload trang
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return allProjects
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          p.category_name === selectedCategory;

        const matchesSearch =
          !term ||
          (p.title && p.title.toLowerCase().includes(term)) ||
          (p.content && p.content.toLowerCase().includes(term)) ||
          (p.category_name && p.category_name.toLowerCase().includes(term));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        if (sortBy === 'name-asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'name-desc') {
          return (b.title || '').localeCompare(a.title || '');
        }
        return 0;
      });
  }, [allProjects, selectedCategory, searchTerm, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;

  const paginatedProjects = useMemo(() => {
    const start = (currentPageNum - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPageNum]);

  // Chọn danh mục: lọc tức thì, không reload, reset về trang 1
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
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
                <option value="newest">Mới cập nhật</option>
                <option value="name-asc">Tên: A - Z</option>
                <option value="name-desc">Tên: Z - A</option>
              </select>
            </div>
          </div>

          {/* Category Pills - thay đổi tức thì, không reload */}
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleSelectCategory(cat)}
              >
                {cat === 'all' ? 'Tất cả loại công trình' : cat}
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
