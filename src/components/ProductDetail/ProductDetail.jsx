import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './ProductDetail.css';
import { getProductDetailData } from '../../services/productService';

const ProductDetail = ({
  productIdOrSlug,
  onNavigateBack,
  onNavigateCategory,
  onNavigateHome,
  onNavigateContact,
  onSelectProduct
}) => {
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery & Lightbox states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Micro-interaction states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Quick Inquiry Modal states
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    note: ''
  });

  const descriptionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadProduct = async () => {
      setLoading(true);
      const { product: detail, allProducts: list } = await getProductDetailData(productIdOrSlug);

      if (!isMounted) return;

      setProduct(detail);
      setAllProducts(list || []);
      setActiveImageIndex(0);
      setFailedImages({});
      setLoading(false);
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productIdOrSlug]);

  // Danh sách ảnh lấy đúng từ 2 trường `thumbnail` và `images` của API (loại bỏ trùng lặp & URL lỗi)
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const urls = [];
    if (product.thumbnail && !failedImages[product.thumbnail]) {
      urls.push(product.thumbnail);
    }
    if (Array.isArray(product.images)) {
      product.images.forEach((imgUrl) => {
        if (imgUrl && !urls.includes(imgUrl) && !failedImages[imgUrl]) {
          urls.push(imgUrl);
        }
      });
    }
    return urls;
  }, [product, failedImages]);

  // Đảm bảo activeImageIndex luôn nằm trong phạm vi hợp lệ nếu có ảnh bị lỗi tải
  const safeImageIndex = galleryImages.length > 0
    ? Math.min(activeImageIndex, galleryImages.length - 1)
    : 0;

  const currentImage = galleryImages[safeImageIndex] || '';

  const handleImageError = (url) => {
    if (!url) return;
    setFailedImages((prev) => ({ ...prev, [url]: true }));
  };

  const handlePrevImage = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev <= 0 ? galleryImages.length - 1 : prev - 1));
  }, [galleryImages.length]);

  const handleNextImage = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev >= galleryImages.length - 1 ? 0 : prev + 1));
  }, [galleryImages.length]);

  // Lọc sản phẩm liên quan dựa trên `category_id` hoặc `category_name` từ API
  const { relatedProducts, hasSameCategory } = useMemo(() => {
    if (!product || !Array.isArray(allProducts)) {
      return { relatedProducts: [], hasSameCategory: false };
    }

    const others = allProducts.filter(
      (item) => item.id !== product.id && item.slug !== product.slug
    );

    const sameCat = others.filter((item) => {
      if (product.category_id && item.category_id) {
        return item.category_id === product.category_id;
      }
      if (product.category_name && item.category_name) {
        return item.category_name === product.category_name;
      }
      return false;
    });

    const otherCat = others.filter((item) => !sameCat.includes(item));

    return {
      relatedProducts: [...sameCat, ...otherCat].slice(0, 3),
      hasSameCategory: sameCat.length > 0
    };
  }, [product, allProducts]);

  // Phân tích các đoạn văn / gạch đầu dòng từ trường `description` của API
  const descriptionBlocks = useMemo(() => {
    if (!product?.description) return [];
    return product.description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [product]);

  const isLongDescription = (product?.description || '').length > 220 || descriptionBlocks.length > 2;

  // Khóa cuộn body an toàn khi mở Lightbox hoặc Modal
  useEffect(() => {
    if (isLightboxOpen || isQuoteOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, isQuoteOpen]);

  // Điều hướng bàn phím cho Lightbox & Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
        if (isQuoteOpen) setIsQuoteOpen(false);
      } else if (isLightboxOpen && e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (isLightboxOpen && e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, isQuoteOpen, handlePrevImage, handleNextImage]);

  const handleCopyLink = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyId = (text) => {
    if (!text) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const scrollToDescription = () => {
    if (descriptionRef.current) {
      const top = descriptionRef.current.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = () => {
    const catKey = product?.category_name || product?.category_id;
    if (catKey && onNavigateCategory) {
      onNavigateCategory(catKey);
    } else if (onNavigateBack) {
      onNavigateBack();
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '—';
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return '—';
      const datePart = d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const timePart = d.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${datePart} • ${timePart}`;
    } catch {
      return '—';
    }
  };

  const shortenId = (id) => {
    if (!id || id.length <= 18) return id || '—';
    return `${id.slice(0, 8)}...${id.slice(-6)}`;
  };

  const openQuoteModal = () => {
    setQuoteSubmitted(false);
    setIsQuoteOpen(true);
  };

  const handleQuoteChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  // Shimmer Skeleton khi đang tải API
  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-subnav">
          <div className="container pd-subnav-inner">
            <div className="pd-skeleton pd-sk-pill"></div>
            <div className="pd-skeleton pd-sk-breadcrumb"></div>
          </div>
        </div>
        <div className="container pd-hero-grid pd-skeleton-wrap">
          <div className="pd-gallery-col">
            <div className="pd-skeleton pd-sk-main-img"></div>
            <div className="pd-sk-thumbs">
              <div className="pd-skeleton pd-sk-thumb"></div>
              <div className="pd-skeleton pd-sk-thumb"></div>
              <div className="pd-skeleton pd-sk-thumb"></div>
            </div>
          </div>
          <div className="pd-summary-col">
            <div className="pd-skeleton pd-sk-badge"></div>
            <div className="pd-skeleton pd-sk-title"></div>
            <div className="pd-skeleton pd-sk-title-short"></div>
            <div className="pd-skeleton pd-sk-paragraph"></div>
            <div className="pd-skeleton pd-sk-meta-box"></div>
            <div className="pd-skeleton pd-sk-cta"></div>
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="pd-empty-state container">
        <div className="pd-empty-icon-wrap">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <h2>Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm này không tồn tại hoặc đường dẫn đã được thay đổi trên hệ thống.</p>
        <button type="button" className="btn-primary" onClick={onNavigateBack}>
          ← Quay lại danh sách sản phẩm
        </button>
      </div>
    );
  }

  return (
    <div className="pd-page">
      {/* Thanh điều hướng phụ Sticky */}
      <div className="pd-subnav">
        <div className="container pd-subnav-inner">
          <div className="pd-subnav-left">
            <button
              type="button"
              className="pd-back-btn"
              onClick={onNavigateBack}
              title="Quay lại danh sách sản phẩm"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Danh sách sản phẩm</span>
            </button>

            <nav className="pd-breadcrumbs" aria-label="Breadcrumb">
              <button
                type="button"
                className="pd-crumb-link"
                onClick={() => onNavigateHome && onNavigateHome('#home')}
              >
                Trang chủ
              </button>
              <span className="pd-crumb-sep">/</span>
              <button
                type="button"
                className="pd-crumb-link"
                onClick={onNavigateBack}
              >
                Sản phẩm
              </button>
              {product.category_name && (
                <>
                  <span className="pd-crumb-sep">/</span>
                  <button
                    type="button"
                    className="pd-crumb-link"
                    onClick={handleCategoryClick}
                  >
                    {product.category_name}
                  </button>
                </>
              )}
              <span className="pd-crumb-sep">/</span>
              <span className="pd-crumb-current">{product.name}</span>
            </nav>
          </div>

          <button
            type="button"
            className={`pd-share-btn ${copiedLink ? 'copied' : ''}`}
            onClick={handleCopyLink}
            title="Sao chép đường dẫn sản phẩm"
          >
            {copiedLink ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Đã sao chép link</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>Chia sẻ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Nội dung chính */}
      <main className="container pd-main">
        {/* Khối Hero 2 cột hiển thị đúng trường API: thumbnail, images, category_name, name, description, id, slug, created_at, updated_at */}
        <section className="pd-hero-grid">
          {/* Cột Trái: Trình xem ảnh thích ứng (1 ảnh, nhiều ảnh, hoặc chưa có ảnh) */}
          <div className="pd-gallery-col">
            <div className="pd-gallery-sticky">
              {galleryImages.length > 0 ? (
                <>
                  <div
                    className="pd-main-stage"
                    onClick={() => setIsLightboxOpen(true)}
                    role="button"
                    tabIndex={0}
                    aria-label="Phóng to hình ảnh sản phẩm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsLightboxOpen(true);
                      }
                    }}
                  >
                    <img
                      key={currentImage}
                      src={currentImage}
                      alt={product.name}
                      className="pd-main-img"
                      onError={() => handleImageError(currentImage)}
                    />

                    <div className="pd-stage-top-bar">
                      {galleryImages.length > 1 ? (
                        <span className="pd-stage-counter">
                          {safeImageIndex + 1} / {galleryImages.length}
                        </span>
                      ) : (
                        <span />
                      )}

                      <span className="pd-zoom-hint">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                        Phóng to
                      </span>
                    </div>

                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="pd-stage-nav pd-stage-prev"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevImage();
                          }}
                          aria-label="Ảnh trước"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="pd-stage-nav pd-stage-next"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextImage();
                          }}
                          aria-label="Ảnh tiếp theo"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Dải ảnh thu nhỏ: chỉ hiển thị khi mảng images có thêm hình */}
                  {galleryImages.length > 1 && (
                    <div className="pd-thumbs-strip" role="tablist" aria-label="Danh sách hình ảnh sản phẩm">
                      {galleryImages.map((imgUrl, idx) => (
                        <button
                          key={imgUrl + idx}
                          type="button"
                          className={`pd-thumb-item ${safeImageIndex === idx ? 'active' : ''}`}
                          onClick={() => setActiveImageIndex(idx)}
                          aria-label={`Xem hình ${idx + 1}`}
                          aria-selected={safeImageIndex === idx}
                        >
                          <img
                            src={imgUrl}
                            alt={`${product.name} - ảnh ${idx + 1}`}
                            loading="lazy"
                            onError={() => handleImageError(imgUrl)}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Placeholder thanh lịch khi sản phẩm trên API chưa upload thumbnail & images: [] */
                <div className="pd-no-image-stage">
                  <div className="pd-no-image-icon">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <span>Chưa có hình ảnh cho sản phẩm này</span>
                </div>
              )}
            </div>
          </div>

          {/* Cột Phải: Thông tin định danh từ API & Hành động */}
          <div className="pd-summary-col">
            <div className="pd-badges-row">
              {product.category_name ? (
                <button
                  type="button"
                  className="pd-category-badge clickable"
                  onClick={handleCategoryClick}
                  title={`Xem các sản phẩm thuộc danh mục ${product.category_name}`}
                >
                  {product.category_name}
                </button>
              ) : (
                <span className="pd-category-badge">Sản phẩm</span>
              )}

              {(product.updated_at || product.created_at) && (
                <span className="pd-date-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Cập nhật: {formatDate(product.updated_at || product.created_at)}
                </span>
              )}
            </div>

            <h1 className="pd-title">{product.name}</h1>

            {/* Tóm tắt mô tả từ trường `description` */}
            <div className="pd-lead-wrap">
              {product.description ? (
                <>
                  <p className={`pd-lead-desc ${isLongDescription ? 'clamped' : ''}`}>
                    {descriptionBlocks[0]}
                  </p>
                  {isLongDescription && (
                    <button
                      type="button"
                      className="pd-readmore-btn"
                      onClick={scrollToDescription}
                    >
                      Xem đầy đủ mô tả chi tiết ↓
                    </button>
                  )}
                </>
              ) : (
                <p className="pd-lead-empty">
                  Thông tin mô tả chi tiết cho sản phẩm đang được cập nhật.
                </p>
              )}
            </div>

            {/* Bảng thông tin định danh trích xuất đúng 100% từ API Schema */}
            <div className="pd-meta-card">
              <div className="pd-meta-card-header">Thông tin sản phẩm</div>

              <div className="pd-meta-rows">
                <div className="pd-meta-row">
                  <span className="pd-meta-label">Danh mục</span>
                  <span className="pd-meta-value">
                    {product.category_name ? (
                      <button
                        type="button"
                        className="pd-meta-cat-link"
                        onClick={handleCategoryClick}
                      >
                        {product.category_name}
                      </button>
                    ) : (
                      'Chưa phân loại'
                    )}
                  </span>
                </div>

                {product.slug && (
                  <div className="pd-meta-row">
                    <span className="pd-meta-label">Đường dẫn (Slug)</span>
                    <code className="pd-meta-code">{product.slug}</code>
                  </div>
                )}

                {product.id && (
                  <div className="pd-meta-row">
                    <span className="pd-meta-label">Mã sản phẩm (ID)</span>
                    <div className="pd-meta-id-group">
                      <code className="pd-meta-code" title={product.id}>
                        {shortenId(product.id)}
                      </code>
                      <button
                        type="button"
                        className={`pd-copy-mini-btn ${copiedId ? 'copied' : ''}`}
                        onClick={() => handleCopyId(product.id)}
                        title="Sao chép mã ID đầy đủ"
                      >
                        {copiedId ? 'Đã chép ✓' : 'Sao chép'}
                      </button>
                    </div>
                  </div>
                )}

                {product.created_at && (
                  <div className="pd-meta-row">
                    <span className="pd-meta-label">Ngày đăng tải</span>
                    <span className="pd-meta-value">{formatDateTime(product.created_at)}</span>
                  </div>
                )}

                {product.updated_at && (
                  <div className="pd-meta-row">
                    <span className="pd-meta-label">Cập nhật gần nhất</span>
                    <span className="pd-meta-value">{formatDateTime(product.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Nhóm nút hành động chuyển đổi */}
            <div className="pd-cta-group">
              <button
                type="button"
                className="btn-primary pd-btn-quote"
                onClick={openQuoteModal}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Yêu Cầu Tư Vấn &amp; Báo Giá</span>
              </button>

              <button
                type="button"
                className="pd-btn-contact"
                onClick={onNavigateContact}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Liên hệ trực tiếp</span>
              </button>
            </div>
          </div>
        </section>

        {/* Phần Chi tiết Mô tả & Bộ sưu tập hình ảnh thực tế từ API */}
        <section className="pd-detail-layout" ref={descriptionRef}>
          <div className="pd-detail-main-col">
            <div className="pd-content-card">
              <h2 className="pd-section-heading">Mô Tả Chi Tiết Sản Phẩm</h2>

              {descriptionBlocks.length > 0 ? (
                <div className="pd-description-body">
                  {descriptionBlocks.map((block, idx) => {
                    const isBullet = /^[-•*]\s+/.test(block);
                    if (isBullet) {
                      return (
                        <div key={idx} className="pd-desc-bullet">
                          <span className="pd-bullet-dot" />
                          <span>{block.replace(/^[-•*]\s+/, '')}</span>
                        </div>
                      );
                    }
                    return <p key={idx}>{block}</p>;
                  })}
                </div>
              ) : (
                <div className="pd-description-placeholder">
                  <p>
                    Nội dung mô tả chi tiết cho sản phẩm <strong>{product.name}</strong> đang được cập nhật trên hệ thống. Quý khách vui lòng nhấn <strong>Yêu cầu tư vấn &amp; Báo giá</strong> để nhận thông tin trực tiếp từ Nguyên Phát.
                  </p>
                </div>
              )}
            </div>

            {/* Chỉ hiển thị Lưới Hình ảnh chi tiết khi API trả về nhiều hơn 1 hình ảnh */}
            {galleryImages.length > 1 && (
              <div className="pd-content-card">
                <div className="pd-gallery-section-head">
                  <h2 className="pd-section-heading" style={{ marginBottom: 0 }}>
                    Hình Ảnh Sản Phẩm ({galleryImages.length})
                  </h2>
                  <span className="pd-gallery-hint-text">Nhấn vào ảnh để xem kích thước lớn</span>
                </div>

                <div className="pd-images-showcase-grid">
                  {galleryImages.map((imgUrl, idx) => (
                    <div
                      key={imgUrl + idx}
                      className="pd-showcase-img-card"
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setIsLightboxOpen(true);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveImageIndex(idx);
                          setIsLightboxOpen(true);
                        }
                      }}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} - hình ${idx + 1}`}
                        loading="lazy"
                        onError={() => handleImageError(imgUrl)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cột bên: Thẻ hỗ trợ tư vấn nhanh */}
          <aside className="pd-detail-side-col">
            <div className="pd-support-card">
              <span className="pd-support-eyebrow">Tư vấn &amp; Báo giá</span>
              <h3>Quan tâm đến {product.name}?</h3>
              <p>
                Để lại thông tin liên hệ để đội ngũ Nguyên Phát gửi báo giá chi tiết và tư vấn trực tiếp theo nhu cầu thực tế của bạn.
              </p>
              <button
                type="button"
                className="btn-primary pd-support-btn"
                onClick={openQuoteModal}
              >
                Nhận Báo Giá Ngay
              </button>
              <button
                type="button"
                className="btn-secondary pd-support-secondary-btn"
                onClick={onNavigateContact}
              >
                Xem thông tin liên hệ
              </button>
            </div>
          </aside>
        </section>

        {/* Sản phẩm cùng danh mục (`category_id` / `category_name`) hoặc Sản phẩm khác từ API */}
        {relatedProducts.length > 0 && (
          <section className="pd-related-section">
            <div className="pd-related-header">
              <div>
                <h2 className="pd-section-heading" style={{ marginBottom: '4px' }}>
                  {hasSameCategory && product.category_name
                    ? `Sản Phẩm Cùng Danh Mục "${product.category_name}"`
                    : 'Sản Phẩm Khác'}
                </h2>
                <p className="pd-related-sub">
                  Khám phá thêm các sản phẩm khác từ danh mục hệ thống Nguyên Phát
                </p>
              </div>
              <button
                type="button"
                className="pd-view-all-btn"
                onClick={hasSameCategory ? handleCategoryClick : onNavigateBack}
              >
                {hasSameCategory && product.category_name
                  ? `Xem tất cả ${product.category_name} →`
                  : 'Xem tất cả sản phẩm →'}
              </button>
            </div>

            <div className="pd-related-grid">
              {relatedProducts.map((rel) => (
                <article
                  key={rel.id || rel.slug}
                  className="pd-related-card"
                  onClick={() => onSelectProduct && onSelectProduct(rel)}
                >
                  <div className="pd-related-thumb-wrap">
                    {rel.category_name && (
                      <span className="pd-related-badge">{rel.category_name}</span>
                    )}
                    {rel.thumbnail && !failedImages[rel.thumbnail] ? (
                      <img
                        src={rel.thumbnail}
                        alt={rel.name}
                        className="pd-related-thumb"
                        loading="lazy"
                        onError={() => handleImageError(rel.thumbnail)}
                      />
                    ) : (
                      <div className="pd-related-no-thumb">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="pd-related-body">
                    {rel.created_at && (
                      <span className="pd-related-date">{formatDate(rel.created_at)}</span>
                    )}
                    <h3 className="pd-related-title">{rel.name}</h3>
                    {rel.description && (
                      <p className="pd-related-desc">{rel.description}</p>
                    )}
                    <span className="pd-related-more">
                      Xem chi tiết
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
      </main>

      {/* Thanh CTA cố định đáy màn hình trên Mobile */}
      <div className="pd-mobile-sticky-bar">
        <button
          type="button"
          className="pd-mobile-contact-btn"
          onClick={onNavigateContact}
        >
          Liên hệ
        </button>
        <button
          type="button"
          className="btn-primary pd-mobile-quote-btn"
          onClick={openQuoteModal}
        >
          Yêu Cầu Báo Giá
        </button>
      </div>

      {/* Lightbox phóng to ảnh toàn màn hình */}
      {isLightboxOpen && galleryImages.length > 0 && (
        <div
          className="pd-lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh kích thước lớn"
        >
          <div className="pd-lightbox-topbar" onClick={(e) => e.stopPropagation()}>
            <span className="pd-lightbox-caption">
              {product.name}
              {galleryImages.length > 1 && ` (${safeImageIndex + 1}/${galleryImages.length})`}
            </span>
            <button
              type="button"
              className="pd-lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          <div className="pd-lightbox-stage" onClick={(e) => e.stopPropagation()}>
            {galleryImages.length > 1 && (
              <button
                type="button"
                className="pd-lightbox-arrow left"
                onClick={handlePrevImage}
                aria-label="Ảnh trước"
              >
                ‹
              </button>
            )}

            <img src={currentImage} alt={product.name} className="pd-lightbox-img" />

            {galleryImages.length > 1 && (
              <button
                type="button"
                className="pd-lightbox-arrow right"
                onClick={handleNextImage}
                aria-label="Ảnh sau"
              >
                ›
              </button>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="pd-lightbox-thumbs" onClick={(e) => e.stopPropagation()}>
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={imgUrl + idx}
                  type="button"
                  className={`pd-lightbox-thumb ${safeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={imgUrl} alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Yêu cầu báo giá gắn với dữ liệu thật của sản phẩm đang xem */}
      {isQuoteOpen && (
        <div
          className="pd-modal-overlay"
          onClick={() => setIsQuoteOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pd-quote-modal-title"
        >
          <div className="pd-quote-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pd-modal-close"
              onClick={() => setIsQuoteOpen(false)}
              aria-label="Đóng cửa sổ"
            >
              ✕
            </button>

            {quoteSubmitted ? (
              <div className="pd-quote-success">
                <div className="pd-success-icon">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>Đã Gửi Yêu Cầu Tư Vấn!</h3>
                <p>
                  Cảm ơn <strong>{quoteForm.fullName || 'Quý khách'}</strong>. Nguyên Phát đã ghi nhận yêu cầu tư vấn cho sản phẩm <strong>{product.name}</strong> và sẽ liên hệ lại qua số điện thoại <strong>{quoteForm.phone}</strong> sớm nhất.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsQuoteOpen(false)}
                >
                  Đóng
                </button>
              </div>
            ) : (
              <>
                <div className="pd-quote-header">
                  <span className="pd-quote-badge">Liên hệ báo giá</span>
                  <h3 id="pd-quote-modal-title">Yêu Cầu Tư Vấn &amp; Báo Giá Sản Phẩm</h3>
                </div>

                <div className="pd-quote-product-preview">
                  {galleryImages[0] && (
                    <img src={galleryImages[0]} alt={product.name} />
                  )}
                  <div className="pd-preview-info">
                    {product.category_name && (
                      <span className="pd-preview-cat">{product.category_name}</span>
                    )}
                    <h4>{product.name}</h4>
                    {product.slug && (
                      <span className="pd-preview-slug">Slug: {product.slug}</span>
                    )}
                  </div>
                </div>

                <form className="pd-quote-form" onSubmit={handleQuoteSubmit}>
                  <div className="pd-form-row">
                    <div className="pd-form-field">
                      <label htmlFor="quote-fullName">Họ và tên / Đơn vị *</label>
                      <input
                        id="quote-fullName"
                        name="fullName"
                        type="text"
                        required
                        placeholder="Nhập họ tên hoặc tên công ty"
                        value={quoteForm.fullName}
                        onChange={handleQuoteChange}
                      />
                    </div>
                    <div className="pd-form-field">
                      <label htmlFor="quote-phone">Số điện thoại *</label>
                      <input
                        id="quote-phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="Nhập số điện thoại liên hệ"
                        value={quoteForm.phone}
                        onChange={handleQuoteChange}
                      />
                    </div>
                  </div>

                  <div className="pd-form-field">
                    <label htmlFor="quote-email">Email (Tùy chọn)</label>
                    <input
                      id="quote-email"
                      name="email"
                      type="email"
                      placeholder="email@domain.com"
                      value={quoteForm.email}
                      onChange={handleQuoteChange}
                    />
                  </div>

                  <div className="pd-form-field">
                    <label htmlFor="quote-note">Nội dung cần tư vấn</label>
                    <textarea
                      id="quote-note"
                      name="note"
                      rows={3}
                      placeholder="Số lượng dự kiến, quy cách yêu cầu hoặc địa điểm giao hàng..."
                      value={quoteForm.note}
                      onChange={handleQuoteChange}
                    />
                  </div>

                  <div className="pd-quote-footer">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsQuoteOpen(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn-primary pd-quote-submit">
                      Gửi Yêu Cầu
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
