import React, { useEffect, useState } from 'react';
import './NewsDetail.css';
import { getPostById, getPosts } from '../../services/newsService';

const NewsDetail = ({ postIdOrSlug, onNavigateBack, onNavigateContact, onSelectNews }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadData = async () => {
      setLoading(true);
      const data = await getPostById(postIdOrSlug);
      const allRes = await getPosts();

      if (isMounted) {
        setPost(data);

        // Lấy 3 bài viết liên quan khác
        if (allRes?.posts) {
          const others = allRes.posts.filter(p => p.id !== data?.id && p.slug !== data?.slug).slice(0, 3);
          setRelatedPosts(others);
        }
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [postIdOrSlug]);

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

  if (loading) {
    return (
      <div className="news-detail-loading container">
        <div className="spinner"></div>
        <p>Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="news-detail-empty container">
        <h2>Không tìm thấy bài viết</h2>
        <p>Bài viết này có thể đã được gỡ bỏ hoặc không tồn tại.</p>
        <button type="button" className="btn-primary" onClick={onNavigateBack}>
          ← Quay lại danh sách tin tức
        </button>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      {/* Top Breadcrumb Nav */}
      <div className="news-detail-nav">
        <div className="container news-detail-nav-inner">
          <button 
            type="button" 
            className="back-btn" 
            onClick={onNavigateBack}
            title="Quay lại danh sách tin tức"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Quay lại danh sách</span>
          </button>

          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <span className="breadcrumb-item" onClick={onNavigateBack} style={{ cursor: 'pointer' }}>News</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="container news-detail-article">
        {/* Header */}
        <header className="news-article-header">
          <div className="news-article-badge">{post.category_name || 'Tin tức'}</div>
          <h1 className="news-article-title">{post.title}</h1>

          <div className="news-article-meta">
            <span className="meta-author">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {post.author || 'Ban Kỹ Thuật Nguyên Phát'}
            </span>
            <span className="meta-date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {formatDate(post.created_at)}
            </span>
            {post.readTime && (
              <span className="meta-read-time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {post.readTime}
              </span>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.thumbnail && (
          <div className="news-featured-image-wrap">
            <img 
              src={post.thumbnail} 
              alt={post.title} 
              className="news-featured-image" 
            />
          </div>
        )}

        {/* Article Summary Box */}
        {post.summary && (
          <div className="news-lead-box">
            <p>{post.summary}</p>
          </div>
        )}

        {/* Article Body */}
        <div className="news-article-content">
          {post.content ? (
            post.content.split('\n\n').map((paragraph, index) => {
              // Highlight tiêu đề con hoặc danh sách nếu có
              if (paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('-')) {
                return (
                  <div key={index} className="content-highlight-block">
                    {paragraph.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className="content-list-item">{line}</p>
                    ))}
                  </div>
                );
              }
              return <p key={index} className="content-paragraph">{paragraph}</p>;
            })
          ) : (
            <p>Nội dung bài viết đang được cập nhật...</p>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="news-tags-wrap">
            <span className="tags-label">Chủ đề:</span>
            {post.tags.map((tag, idx) => (
              <span key={idx} className="news-tag-pill">#{tag}</span>
            ))}
          </div>
        )}

        {/* Consultation Callout Box */}
        <div className="news-cta-box">
          <div className="news-cta-text">
            <h3>Đồng Hành Cùng Doanh Nghiệp Trong Mọi Công Trình Thép Tiền Chế</h3>
            <p>
              Nguyên Phát cung cấp giải pháp tư vấn kỹ thuật, thiết kế kết cấu tối ưu tải trọng và thi công lắp dựng trọn gói nhà xưởng theo tiêu chuẩn quốc tế.
            </p>
          </div>
          <button 
            type="button" 
            className="btn-primary news-cta-btn"
            onClick={onNavigateContact}
          >
            Liên Hệ Tư Vấn Kỹ Thuật
          </button>
        </div>

        {/* Related News Section */}
        {relatedPosts.length > 0 && (
          <section className="related-news-section">
            <h2 className="related-news-heading">Bài Viết Liên Quan</h2>
            <div className="related-news-grid">
              {relatedPosts.map((item) => (
                <article 
                  key={item.id} 
                  className="related-news-card"
                  onClick={() => onSelectNews && onSelectNews(item)}
                >
                  <div className="related-news-thumb-wrap">
                    <img src={item.thumbnail} alt={item.title} className="related-news-thumb" />
                    <span className="related-news-badge">{item.category_name}</span>
                  </div>
                  <div className="related-news-body">
                    <div className="related-news-date">{formatDate(item.created_at)}</div>
                    <h3 className="related-news-title">{item.title}</h3>
                    <span className="related-news-link">
                      Đọc tiếp
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
      </article>
    </div>
  );
};

export default NewsDetail;
