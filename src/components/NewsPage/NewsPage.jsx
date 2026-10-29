import React, { useEffect, useMemo, useState } from 'react';
import './NewsPage.css';
import { getPosts } from '../../services/newsService';

const ITEMS_PER_PAGE = 6;

const NewsPage = ({ onNavigateHome }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // Load toàn bộ tin tức 1 lần duy nhất khi mount
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setLoading(true);
      const result = await getPosts(null);
      if (isMounted) {
        setAllPosts(result.posts || []);
        setLoading(false);
      }
    };
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Trích xuất danh mục động từ danh sách bài viết
  const categories = useMemo(() => {
    const set = new Set();
    allPosts.forEach((p) => {
      if (p.category_name) set.add(p.category_name);
    });
    return ['all', ...Array.from(set)];
  }, [allPosts]);

  // Lọc và sắp xếp tin tức tức thì (in-memory) không reload trang
  const filteredPosts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return allPosts
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          p.category_name === selectedCategory;

        const matchesSearch =
          !term ||
          (p.title && p.title.toLowerCase().includes(term)) ||
          (p.summary && p.summary.toLowerCase().includes(term)) ||
          (p.content && p.content.toLowerCase().includes(term)) ||
          (p.category_name && p.category_name.toLowerCase().includes(term));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        }
        if (sortBy === 'title-asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'title-desc') {
          return (b.title || '').localeCompare(a.title || '');
        }
        return 0;
      });
  }, [allPosts, selectedCategory, searchTerm, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;

  const paginatedPosts = useMemo(() => {
    const start = (currentPageNum - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPageNum]);

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
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const openDetail = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  };

  const closeDetail = () => {
    setSelectedPost(null);
    document.body.style.overflow = '';
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

  return (
    <div className="news-page">
      {/* Tiêu đề ngắn gọn duy nhất: News */}
      <div className="news-page-title-wrap">
        <div className="container">
          <h1 className="section-title"><span className="text-yellow">News</span></h1>
        </div>
      </div>

      {/* Main Container */}
      <main className="container news-grid-section">
        {/* Search & Filters */}
        <div className="news-controls">
          <div className="news-search-row">
            <div className="search-box-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                className="news-search-input"
                placeholder="Tìm kiếm theo tiêu đề, chủ đề, nội dung bài viết..."
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
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="title-asc">Tiêu đề: A - Z</option>
                <option value="title-desc">Tiêu đề: Z - A</option>
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
                {cat === 'all' ? 'Tất Cả' : cat}
                {cat === 'all' ? ` (${allPosts.length})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải tin tức mới nhất...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h3>Không tìm thấy bài viết phù hợp</h3>
            <p>Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn lại chuyên mục.</p>
            <button 
              type="button"
              className="btn-primary" 
              onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <>
            {/* News Cards Grid */}
            <div className="news-cards-grid">
              {paginatedPosts.map((post) => (
                <article 
                  key={post.id} 
                  className="news-card"
                  onClick={() => openDetail(post)}
                >
                  <div className="news-thumbnail-wrap">
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      className="news-thumbnail"
                      loading="lazy"
                    />
                    <span className="news-badge">{post.category_name || 'Tin tức'}</span>
                  </div>

                  <div className="news-body">
                    <div className="news-meta">
                      <span className="news-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {formatDate(post.created_at)}
                      </span>
                      {post.readTime && (
                        <span className="news-read-time">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {post.readTime}
                        </span>
                      )}
                    </div>

                    <h2 className="news-title">{post.title}</h2>
                    <p className="news-summary">
                      {post.summary || (post.content ? post.content.slice(0, 140) + '...' : '')}
                    </p>

                    <div className="news-footer">
                      <span className="news-read-more">
                        Đọc tiếp
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-wrap">
                <button
                  type="button"
                  className="page-btn page-arrow"
                  disabled={currentPageNum === 1}
                  onClick={() => handlePageChange(currentPageNum - 1)}
                  aria-label="Trang trước"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`page-btn ${currentPageNum === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="page-btn page-arrow"
                  disabled={currentPageNum === totalPages}
                  onClick={() => handlePageChange(currentPageNum + 1)}
                  aria-label="Trang tiếp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal chi tiết bài viết */}
      {selectedPost && (
        <div className="modal-backdrop" onClick={closeDetail}>
          <div 
            className="post-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeDetail} aria-label="Đóng">
              &times;
            </button>

            <div className="post-modal-header">
              <div className="post-modal-category">{selectedPost.category_name || 'Tin tức'}</div>
              <h2 className="post-modal-title">{selectedPost.title}</h2>
              <div className="post-modal-meta">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Ngày đăng: {formatDate(selectedPost.created_at)}
                </span>
                {selectedPost.author && (
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Tác giả: {selectedPost.author}
                  </span>
                )}
                {selectedPost.readTime && (
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Thời gian đọc: {selectedPost.readTime}
                  </span>
                )}
              </div>
            </div>

            {selectedPost.thumbnail && (
              <div className="post-modal-img-wrap">
                <img 
                  src={selectedPost.thumbnail} 
                  alt={selectedPost.title}
                  className="post-modal-img"
                />
              </div>
            )}

            <div className="post-modal-body">
              {selectedPost.summary && (
                <div className="post-modal-summary">
                  <p>{selectedPost.summary}</p>
                </div>
              )}

              <div className="post-modal-text">
                {selectedPost.content ? (
                  selectedPost.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>Nội dung đang được cập nhật...</p>
                )}
              </div>
            </div>

            <div className="post-modal-footer">
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => {
                  closeDetail();
                  if (onNavigateHome) onNavigateHome();
                }}
              >
                Liên hệ hợp tác &amp; Tư vấn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
