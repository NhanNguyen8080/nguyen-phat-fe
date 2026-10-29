import React from 'react';
import './News.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { MOCK_POSTS } from '../../services/newsService';

const News = ({ onNavigateNews }) => {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ threshold: 0.08 });

  // Lấy 3 bài viết mới nhất hiển thị trên Trang Chủ
  const featuredPosts = MOCK_POSTS.slice(0, 3);

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
    <section className="home-news-section" id="news">
      <span id="tin-tuc"></span>
      <div className="container">
        <div className="home-news-header" ref={headerRef}>
          <h2 className="section-title reveal delay-1">
            <span className="text-yellow">News</span>
          </h2>
          <p className="home-news-subtitle reveal delay-3">
            Cập nhật xu hướng kết cấu thép xanh, kỹ thuật xây dựng và tin tức nổi bật từ Nguyên Phát.
          </p>
        </div>

        <div className="home-news-grid" ref={gridRef}>
          {featuredPosts.map((post, index) => (
            <article 
              key={post.id} 
              className="home-news-card reveal"
              style={{ transitionDelay: `${index * 0.12}s`, cursor: 'pointer' }}
              onClick={onNavigateNews}
              title="Nhấn để xem chi tiết bài viết"
            >
              <div className="home-news-thumb-wrap">
                <img 
                  src={post.thumbnail} 
                  alt={post.title} 
                  className="home-news-thumb" 
                  loading="lazy" 
                />
                <span className="home-news-badge">{post.category_name}</span>
              </div>
              <div className="home-news-body">
                <div className="home-news-meta">
                  <span className="home-news-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {formatDate(post.created_at)}
                  </span>
                  {post.readTime && (
                    <span className="home-news-time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {post.readTime}
                    </span>
                  )}
                </div>
                <h3 className="home-news-title">{post.title}</h3>
                <p className="home-news-desc">{post.summary}</p>
                <div className="home-news-link">
                  Đọc tiếp
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="home-news-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <button 
            type="button" 
            className="btn-primary"
            onClick={onNavigateNews}
            style={{ 
              padding: '14px 36px', 
              fontSize: '1rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              borderRadius: '9999px',
              fontWeight: '600'
            }}
          >
            <span>Xem thêm</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;
