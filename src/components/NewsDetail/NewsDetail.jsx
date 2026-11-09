import React, { useEffect, useState, useMemo } from 'react';
import './NewsDetail.css';
import { getPostById, getPosts, MOCK_POSTS, DEFAULT_THUMBNAILS } from '../../services/newsService';
import { stripHtml } from '../../utils/textUtils';

const NewsDetail = ({ postIdOrSlug, onNavigateBack, onNavigateContact, onSelectNews }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [sidebarPosts, setSidebarPosts] = useState([]);
  const [activeTocId, setActiveTocId] = useState('');

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadData = async () => {
      setLoading(true);
      const data = await getPostById(postIdOrSlug);
      const allRes = await getPosts();

      if (isMounted) {
        setPost(data);

        // 1. Bài viết liên quan ở chân trang: ưu tiên related_posts từ API
        let related = [];
        if (data?.related_posts && Array.isArray(data.related_posts) && data.related_posts.length > 0) {
          related = data.related_posts;
        } else if (allRes?.posts) {
          related = allRes.posts.filter(p => p.id !== data?.id && p.slug !== data?.slug).slice(0, 3);
        }
        setRelatedPosts(related);

        // 2. Bài viết cho Sidebar: ưu tiên bài có is_featured hoặc lượt views cao
        const allList = (allRes?.posts && allRes.posts.length > 0) ? allRes.posts : MOCK_POSTS;
        const others = allList.filter(p => p.id !== data?.id && p.slug !== data?.slug);

        const sortedForSidebar = [...others].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (b.views || 0) - (a.views || 0);
        });

        setSidebarPosts(sortedForSidebar.slice(0, 4));
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

  // Mục lục bài viết (Table of Contents) - Ưu tiên từ API, fallback tự động phân tích
  const tocItems = useMemo(() => {
    if (!post) return [];

    // 1. Ưu tiên mục lục trực tiếp từ API Backend
    if (Array.isArray(post.toc) && post.toc.length > 0) {
      return post.toc.map(item => ({
        id: item.id,
        label: item.title || item.label || 'Mục lục'
      }));
    }

    // 2. Fallback: Tự động phân tích từ content/summary
    const items = [];
    if (post.summary) {
      items.push({ id: 'sec-summary', label: 'Tóm tắt bài viết' });
    }

    if (post.content) {
      const headingMatches = [...post.content.matchAll(/<h[23][^>]*id=["']([^"']+)["'][^>]*>(.*?)<\/h[23]>/gi)];
      if (headingMatches.length > 0) {
        headingMatches.forEach(m => {
          const cleanText = stripHtml(m[2]);
          items.push({ id: m[1], label: cleanText });
        });
      } else {
        const paragraphs = post.content.split('\n\n');
        paragraphs.forEach((p, idx) => {
          const trimmed = p.trim();
          if (
            trimmed.startsWith('1.') || 
            trimmed.startsWith('2.') || 
            trimmed.startsWith('3.') || 
            trimmed.startsWith('4.') || 
            trimmed.startsWith('-')
          ) {
            const firstLine = trimmed.split('\n')[0].replace(/\*\*/g, '').replace(/###/g, '').trim();
            const cleanLabel = firstLine.length > 45 ? firstLine.slice(0, 42) + '...' : firstLine;
            items.push({ id: `sec-block-${idx}`, label: cleanLabel });
          }
        });
      }
    }

    if (items.length <= 1) {
      items.push({ id: 'sec-content-main', label: 'Nội dung chi tiết & Đánh giá' });
    }

    items.push({ id: 'sec-consultation', label: 'Giải pháp & Tư vấn cơ điện' });
    return items;
  }, [post]);

  const scrollToSection = (id) => {
    setActiveTocId(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isHtmlContent = Boolean(post?.content && /<[a-z][\s\S]*>/i.test(post.content));

  if (loading) {
    return (
      <div className="page-loading-wrapper" aria-label="Đang tải nội dung bài viết">
        <div className="yellow-spinner" role="status"></div>
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
          <nav className="breadcrumbs" aria-label="Đường dẫn điều hướng">
            <button 
              type="button" 
              className="breadcrumb-item breadcrumb-link" 
              onClick={onNavigateBack}
            >
              Tin Tức
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="container news-detail-layout-container">
        <div className="news-detail-main-layout">
          {/* CỘT TRÁI - NỘI DUNG BÀI VIẾT (MAIN CONTENT) */}
          <article className="news-detail-article">
            {/* Header */}
            <header className="news-article-header">
              {post.category_name && (
                <div className="news-article-badge">{post.category_name}</div>
              )}
              <h1 className="news-article-title">{post.title}</h1>

              <div className="news-article-meta">
                {post.author && (
                  <span className="meta-author">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {post.author}
                  </span>
                )}
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
                {typeof post.views === 'number' && post.views > 0 && (
                  <span className="meta-views">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    {post.views.toLocaleString('vi-VN')} lượt xem
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
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_THUMBNAILS[0];
                  }}
                />
              </div>
            )}

            {/* Article Summary Box */}
            {post.summary && (
              <div id="sec-summary" className="news-lead-box">
                <p>{post.summary}</p>
              </div>
            )}

            {/* Article Body */}
            {isHtmlContent ? (
              <div 
                id="sec-content-main" 
                className="news-article-content news-article-html-body"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            ) : (
              <div id="sec-content-main" className="news-article-content">
                {post.content ? (
                  post.content.split('\n\n').map((paragraph, index) => {
                    if (
                      paragraph.startsWith('1.') || 
                      paragraph.startsWith('2.') || 
                      paragraph.startsWith('3.') || 
                      paragraph.startsWith('4.') || 
                      paragraph.startsWith('-')
                    ) {
                      return (
                        <div key={index} id={`sec-block-${index}`} className="content-highlight-block">
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
            )}

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
            <div id="sec-consultation" className="news-cta-box">
              <div className="news-cta-text">
                <h3>Đồng Hành Cùng Doanh Nghiệp Trong Mọi Giải Pháp Cơ Điện & Tủ Bảng Điện</h3>
                <p>
                  Nguyên Phát cung cấp giải pháp tư vấn kỹ thuật chuyên sâu, sản xuất tủ điện theo tiêu chuẩn IEC và thi công lắp đặt trọn gói hệ thống điện công nghiệp.
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
          </article>

          {/* CỘT PHẢI - STICKY SIDEBAR */}
          <aside className="news-detail-sidebar">
            <div className="news-sidebar-sticky-wrapper">
              {/* Widget 1: Mục Lục Bài Viết (TOC) */}
              {tocItems.length > 0 && (
                <div className="news-sidebar-widget widget-toc">
                  <h4 className="sidebar-widget-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Mục Lục Bài Viết
                  </h4>
                  <ul className="sidebar-toc-list">
                    {tocItems.map((item, idx) => (
                      <li 
                        key={item.id} 
                        className={`sidebar-toc-item ${activeTocId === item.id ? 'active' : ''}`}
                        onClick={() => scrollToSection(item.id)}
                      >
                        <span className="toc-number">{idx + 1}</span>
                        <span className="toc-text">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Widget 2: Tin Tức Tiêu Biểu / Xem Nhiều */}
              {sidebarPosts.length > 0 && (
                <div className="news-sidebar-widget widget-trending">
                  <h4 className="sidebar-widget-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Tin Tức Nổi Bật
                  </h4>
                  <div className="sidebar-news-list">
                    {sidebarPosts.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="sidebar-news-item" 
                        onClick={() => onSelectNews && onSelectNews(item)}
                      >
                        <div className="sidebar-news-thumb-wrap">
                          <img 
                            src={item.thumbnail} 
                            alt={item.title} 
                            className="sidebar-news-thumb"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_THUMBNAILS[(idx + 1) % DEFAULT_THUMBNAILS.length];
                            }}
                          />
                        </div>
                        <div className="sidebar-news-info">
                          <span className="sidebar-news-cat">{item.category_name}</span>
                          <h5 className="sidebar-news-title" title={item.title}>{item.title}</h5>
                          <div className="sidebar-news-meta-row">
                            <span className="sidebar-news-date">{formatDate(item.created_at)}</span>
                            {typeof item.views === 'number' && item.views > 0 && (
                              <span className="sidebar-news-views">• {item.views} lượt xem</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget 3: Hộp Tư Vấn & Hotline Nhanh */}
              <div className="news-sidebar-widget widget-consultation">
                <div className="consultation-badge">Hỗ Trợ Kỹ Thuật 24/7</div>
                <h4 className="consultation-title">Cần Báo Giá & Tư Vấn Kỹ Thuật?</h4>
                <p className="consultation-desc">
                  Kỹ sư Cơ Điện Nguyên Phát sẵn sàng bóc tách khối lượng và lên phương án kỹ thuật miễn phí trong 24h.
                </p>
                <div className="consultation-hotline">
                  <div className="hotline-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="hotline-label">Hotline Kỹ Thuật Trực Tiếp:</span>
                    <a href="tel:0903625628" className="hotline-number">0903 625 628</a>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="consultation-btn"
                  onClick={onNavigateContact}
                >
                  Gửi Yêu Cầu Tư Vấn Ngay
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Phần Bài Viết Liên Quan Khác Ở Chân Trang */}
        {relatedPosts.length > 0 && (
          <section className="related-news-section">
            <div className="related-news-header-wrap">
              <h2 className="related-news-heading">Bài Viết Cùng Chuyên Mục</h2>
              <span className="related-news-sub">Khám phá các bài viết kỹ thuật & giải pháp cơ điện mới nhất</span>
            </div>
            <div className="related-news-grid">
              {relatedPosts.map((item, idx) => (
                <article 
                  key={item.id} 
                  className="related-news-card"
                  onClick={() => onSelectNews && onSelectNews(item)}
                >
                  <div className="related-news-thumb-wrap">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="related-news-thumb"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_THUMBNAILS[(idx + 2) % DEFAULT_THUMBNAILS.length];
                      }}
                    />
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
      </div>
    </div>
  );
};

export default NewsDetail;
