import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './ProductDetail.css';
import { getProductById, getProducts } from '../../services/productService';

const SUPPLY_OPTIONS = [
  {
    id: 'full-turnkey',
    label: 'Thi công & lắp dựng trọn gói',
    desc: 'Thiết kế, gia công và lắp dựng hoàn thiện'
  },
  {
    id: 'custom-fab',
    label: 'Gia công theo bản vẽ',
    desc: 'Sản xuất chuẩn Shop Drawing & KCS'
  },
  {
    id: 'material-only',
    label: 'Cung ứng vật tư / thiết bị',
    desc: 'Giao hàng tận chân công trình kèm CO/CQ'
  }
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Tiếp Nhận & Tư Vấn Giải Pháp',
    desc: 'Phân tích nhu cầu tải trọng, công năng nhà xưởng và đề xuất phương án vật tư tối ưu ngân sách đầu tư.'
  },
  {
    step: '02',
    title: 'Thiết Kế Bản Vẽ Shop Drawing',
    desc: 'Triển khai bản vẽ chi tiết cấu kiện trên phần mềm chuyên dụng Tekla / AutoCAD, bóc tách khối lượng minh bạch.'
  },
  {
    step: '03',
    title: 'Gia Công CNC & Kiểm Định KCS',
    desc: 'Sản xuất khép kín tại nhà máy, phun bi làm sạch bề mặt, siêu âm mối hàn và nghiệm thu xuất xưởng nghiêm ngặt.'
  },
  {
    step: '04',
    title: 'Vận Chuyển & Lắp Dựng An Toàn',
    desc: 'Điều phối vận chuyển đến chân công trình, thi công lắp dựng đúng tiến độ cam kết và bàn giao hồ sơ hoàn công.'
  }
];

const ProductDetail = ({
  productIdOrSlug,
  onNavigateBack,
  onNavigateHome,
  onNavigateContact,
  onSelectProduct
}) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery & Lightbox states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Interactive UI states
  const [selectedOption, setSelectedOption] = useState(SUPPLY_OPTIONS[0].id);
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick Quote Modal states
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    scale: '',
    note: ''
  });

  const tabsRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchDetailData = async () => {
      setLoading(true);
      const [detailData, listResult] = await Promise.all([
        getProductById(productIdOrSlug),
        getProducts(null)
      ]);

      if (!isMounted) return;

      setProduct(detailData);
      setActiveImageIndex(0);
      setActiveTab('overview');
      setOpenFaqIndex(0);

      if (detailData && Array.isArray(listResult?.products)) {
        const others = listResult.products.filter(
          (item) => item.id !== detailData.id && item.slug !== detailData.slug
        );
        // Ưu tiên sản phẩm cùng danh mục lên đầu
        const sameCategory = others.filter(
          (item) => item.category_name === detailData.category_name
        );
        const diffCategory = others.filter(
          (item) => item.category_name !== detailData.category_name
        );
        setRelatedProducts([...sameCategory, ...diffCategory].slice(0, 3));
      } else {
        setRelatedProducts([]);
      }

      setLoading(false);
    };

    fetchDetailData();

    return () => {
      isMounted = false;
    };
  }, [productIdOrSlug]);

  // Danh sách ảnh gallery chuẩn hóa
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const list = [];
    if (product.thumbnail) list.push(product.thumbnail);
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [product]);

  const handlePrevImage = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  }, [galleryImages.length]);

  const handleNextImage = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  }, [galleryImages.length]);

  // Quản lý khóa cuộn trang khi mở Modal / Lightbox
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
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  const handleJumpToSpecs = () => {
    setActiveTab('specs');
    if (tabsRef.current) {
      const headerOffset = 140;
      const top = tabsRef.current.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const openQuoteModal = () => {
    setQuoteSubmitted(false);
    setIsQuoteOpen(true);
  };

  const handleQuoteInputChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Đang cập nhật';
    try {
      return new Date(isoString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Đang cập nhật';
    }
  };

  const activeSupplyOption = useMemo(
    () => SUPPLY_OPTIONS.find((opt) => opt.id === selectedOption) || SUPPLY_OPTIONS[0],
    [selectedOption]
  );

  // Skeleton Loading mượt mà (Zero Layout Shift)
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
              <div className="pd-skeleton pd-sk-thumb"></div>
            </div>
          </div>
          <div className="pd-summary-col">
            <div className="pd-skeleton pd-sk-badge"></div>
            <div className="pd-skeleton pd-sk-title"></div>
            <div className="pd-skeleton pd-sk-title-short"></div>
            <div className="pd-skeleton pd-sk-Paragraph"></div>
            <div className="pd-sk-cards">
              <div className="pd-skeleton pd-sk-card"></div>
              <div className="pd-skeleton pd-sk-card"></div>
              <div className="pd-skeleton pd-sk-card"></div>
              <div className="pd-skeleton pd-sk-card"></div>
            </div>
            <div className="pd-skeleton pd-sk-cta"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty / Not Found State
  if (!product) {
    return (
      <div className="pd-empty-state container">
        <div className="pd-empty-icon-wrap">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <h2>Không tìm thấy thông tin sản phẩm</h2>
        <p>Sản phẩm bạn đang tìm kiếm có thể đã thay đổi đường dẫn hoặc ngừng kinh doanh.</p>
        <button type="button" className="btn-primary pd-back-primary-btn" onClick={onNavigateBack}>
          ← Quay lại danh mục sản phẩm
        </button>
      </div>
    );
  }

  const currentImage = galleryImages[activeImageIndex] || product.thumbnail;

  return (
    <div className="pd-page">
      {/* Sticky Breadcrumb & Quick Actions Bar */}
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
              <span>Sản phẩm</span>
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
                {product.category_name || 'Danh mục'}
              </button>
              <span className="pd-crumb-sep">/</span>
              <span className="pd-crumb-current">{product.name}</span>
            </nav>
          </div>

          <button
            type="button"
            className={`pd-share-btn ${copiedLink ? 'copied' : ''}`}
            onClick={handleCopyLink}
            title="Sao chép liên kết sản phẩm"
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

      {/* Main Above-the-Fold Split Layout */}
      <main className="container pd-main">
        <section className="pd-hero-grid">
          {/* Left Column: Interactive Gallery */}
          <div className="pd-gallery-col">
            <div className="pd-gallery-sticky">
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
                />

                {/* Top Overlay Badges */}
                <div className="pd-stage-top-bar">
                  <span className="pd-stage-counter">
                    {activeImageIndex + 1} / {galleryImages.length}
                  </span>
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

                {/* Prev / Next Navigation Controls */}
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

              {/* Thumbnail Strip */}
              {galleryImages.length > 1 && (
                <div className="pd-thumbs-strip" role="tablist" aria-label="Ảnh thu nhỏ sản phẩm">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={imgUrl + idx}
                      type="button"
                      className={`pd-thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`Xem góc chụp ${idx + 1}`}
                      aria-selected={activeImageIndex === idx}
                    >
                      <img src={imgUrl} alt={`${product.name} - góc ${idx + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Quality Assurance Banner under Gallery */}
              <div className="pd-gallery-assurance">
                <div className="pd-assurance-chip">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                  <span>Kiểm định KCS 100% xuất xưởng</span>
                </div>
                <div className="pd-assurance-chip">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  <span>Đầy đủ chứng chỉ CO / CQ vật liệu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Summary & Conversion Panel */}
          <div className="pd-summary-col">
            <div className="pd-badges-row">
              <span className="pd-category-badge">{product.category_name || 'Sản phẩm Nguyên Phát'}</span>
              <span className="pd-stock-badge">
                <span className="pd-pulse-dot"></span>
                Sẵn sàng gia công &amp; cung ứng
              </span>
              <span className="pd-sku-tag">Mã: <strong>{product.sku}</strong></span>
            </div>

            <h1 className="pd-title">{product.name}</h1>

            {/* Engineering Rating & Standards Strip */}
            <div className="pd-trust-meta">
              <div className="pd-stars" aria-label="Đánh giá 5 trên 5 sao kỹ thuật">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                <strong className="pd-rating-score">5.0</strong>
              </div>
              <span className="pd-meta-divider">•</span>
              <span className="pd-meta-text">Chuẩn ISO 9001:2015 / ASTM</span>
              <span className="pd-meta-divider">•</span>
              <span className="pd-meta-text">Cập nhật: {formatDate(product.updated_at || product.created_at)}</span>
            </div>

            <p className="pd-lead-desc">{product.description}</p>

            {/* 2x2 Key Technical Highlights */}
            {Array.isArray(product.highlights) && product.highlights.length > 0 && (
              <div className="pd-highlights-grid">
                {product.highlights.map((item, index) => (
                  <div key={index} className="pd-highlight-card">
                    <span className="pd-highlight-label">{item.label}</span>
                    <strong className="pd-highlight-val">{item.value}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Solution Scope Configurator */}
            <div className="pd-config-block">
              <div className="pd-config-header">
                <span className="pd-config-label">Chọn phương án triển khai dự kiến:</span>
                <button
                  type="button"
                  className="pd-spec-jump-btn"
                  onClick={handleJumpToSpecs}
                >
                  Bảng thông số kỹ thuật ↓
                </button>
              </div>
              <div className="pd-options-list" role="radiogroup" aria-label="Phương án triển khai">
                {SUPPLY_OPTIONS.map((opt) => {
                  const isActive = selectedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      className={`pd-option-card ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedOption(opt.id)}
                    >
                      <span className="pd-option-radio">
                        {isActive && <span className="pd-option-radio-dot" />}
                      </span>
                      <span className="pd-option-text">
                        <strong>{opt.label}</strong>
                        <small>{opt.desc}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary & Secondary Call-To-Action Buttons */}
            <div className="pd-cta-group">
              <button
                type="button"
                className="btn-primary pd-btn-quote"
                onClick={openQuoteModal}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Nhận Báo Giá &amp; Tư Vấn Kỹ Thuật</span>
              </button>

              <button
                type="button"
                className="pd-btn-contact"
                onClick={onNavigateContact}
                title="Chuyển đến trang Liên hệ bộ phận dự án"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Liên hệ trực tiếp</span>
              </button>
            </div>

            {/* Service Commitments Card */}
            <div className="pd-commitments-box">
              <div className="pd-commitment-item">
                <span className="pd-commit-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Miễn phí tư vấn phương án kết cấu &amp; lập khái toán chi phí</span>
              </div>
              <div className="pd-commitment-item">
                <span className="pd-commit-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Gia công trực tiếp tại nhà máy Nguyên Phát, không qua trung gian</span>
              </div>
              <div className="pd-commitment-item">
                <span className="pd-commit-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Đáp ứng vận chuyển &amp; lắp dựng an toàn cho dự án FDI toàn quốc</span>
              </div>
            </div>
          </div>
        </section>

        {/* Below-the-Fold Structured Tabs Section */}
        <section className="pd-tabs-section" ref={tabsRef}>
          <div className="pd-tabs-header" role="tablist" aria-label="Thông tin chi tiết sản phẩm">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'overview'}
              className={`pd-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan &amp; Ưu điểm
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'specs'}
              className={`pd-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Thông số kỹ thuật
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'process'}
              className={`pd-tab-btn ${activeTab === 'process' ? 'active' : ''}`}
              onClick={() => setActiveTab('process')}
            >
              Quy trình triển khai
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'faq'}
              className={`pd-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              Câu hỏi thường gặp
            </button>
          </div>

          <div className="pd-tab-panel" key={activeTab}>
            {activeTab === 'overview' && (
              <div className="pd-overview-layout">
                <div className="pd-overview-intro">
                  <h2 className="pd-section-heading">Giải Pháp Kỹ Thuật Chuẩn Công Nghiệp Hiện Đại</h2>
                  <p>
                    <strong>{product.name}</strong> thuộc nhóm giải pháp <em>{product.category_name}</em> chủ lực do Nguyên Phát trực tiếp nghiên cứu, tính toán thiết kế và tổ chức sản xuất đồng bộ. {product.description}
                  </p>
                  <p>
                    Mỗi hạng mục trước khi bàn giao đều trải qua quy trình kiểm soát chất lượng đa tầng từ nguyên liệu đầu vào, độ chính xác kích thước hình học CNC cho đến khả năng chịu lực và chống ăn mòn trong điều kiện khí hậu nhiệt đới ẩm tại Việt Nam.
                  </p>
                </div>

                {/* 3 Key Features Grid */}
                {Array.isArray(product.features) && (
                  <div className="pd-features-grid">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="pd-feature-card">
                        <div className="pd-feature-num">0{idx + 1}</div>
                        <h3>{feat.title}</h3>
                        <p>{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Practical Applications Box */}
                {Array.isArray(product.applications) && (
                  <div className="pd-applications-box">
                    <div className="pd-app-header">
                      <h3>Phạm Vi Ứng Dụng Thực Tế</h3>
                      <p>Phù hợp triển khai linh hoạt cho đa dạng loại hình công trình công nghiệp và thương mại:</p>
                    </div>
                    <div className="pd-app-grid">
                      {product.applications.map((app, idx) => (
                        <div key={idx} className="pd-app-item">
                          <span className="pd-app-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                          </span>
                          <span>{app}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="pd-specs-layout">
                <div className="pd-specs-header-row">
                  <div>
                    <h2 className="pd-section-heading">Bảng Thông Số Kỹ Thuật Tiêu Chuẩn</h2>
                    <p className="pd-specs-sub">
                      Các thông số có thể được tùy chỉnh linh hoạt theo yêu cầu tải trọng và bản vẽ thiết kế riêng của từng dự án.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary pd-download-spec-btn"
                    onClick={openQuoteModal}
                  >
                    Yêu cầu Hồ sơ Kỹ thuật &amp; Bản vẽ mẫu
                  </button>
                </div>

                <div className="pd-specs-table-wrap">
                  <table className="pd-specs-table">
                    <tbody>
                      <tr>
                        <th>Mã định danh sản phẩm</th>
                        <td>{product.sku} ({product.slug || product.id})</td>
                      </tr>
                      <tr>
                        <th>Nhóm danh mục</th>
                        <td>{product.category_name || 'Kết cấu & Vật tư công nghiệp'}</td>
                      </tr>
                      {Array.isArray(product.specs) &&
                        product.specs.map((row, idx) => (
                          <tr key={idx}>
                            <th>{row.label}</th>
                            <td>{row.value}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'process' && (
              <div className="pd-process-layout">
                <h2 className="pd-section-heading">Quy Trình Cung Ứng &amp; Thi Công Khép Kín</h2>
                <p className="pd-specs-sub">
                  Đảm bảo tính đồng bộ tuyệt đối từ khâu thiết kế kỹ thuật tại văn phòng đến lắp dựng thực tế ngoài công trường.
                </p>

                <div className="pd-workflow-grid">
                  {WORKFLOW_STEPS.map((item) => (
                    <div key={item.step} className="pd-workflow-card">
                      <div className="pd-workflow-top">
                        <span className="pd-workflow-badge">Bước {item.step}</span>
                        <span className="pd-workflow-line"></span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="pd-faq-layout">
                <h2 className="pd-section-heading">Giải Đáp Thắc Mắc Kỹ Thuật &amp; Báo Giá</h2>
                <div className="pd-faq-list">
                  {Array.isArray(product.faqs) &&
                    product.faqs.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div key={idx} className={`pd-faq-item ${isOpen ? 'open' : ''}`}>
                          <button
                            type="button"
                            className="pd-faq-question"
                            onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                            aria-expanded={isOpen}
                          >
                            <span>{faq.question}</span>
                            <svg
                              className="pd-faq-chevron"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </button>
                          <div className="pd-faq-answer-wrapper">
                            <div className="pd-faq-answer-inner">
                              <p>{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* High-Contrast Engineering Consultation Banner */}
        <section className="pd-consult-banner">
          <div className="pd-consult-content">
            <span className="pd-consult-eyebrow">Hỗ Trợ Kỹ Thuật Chuyên Sâu 24/7</span>
            <h2>Bạn Cần Tính Toán Khối Lượng &amp; Báo Giá Cho Công Trình Thực Tế?</h2>
            <p>
              Gửi thông số diện tích hoặc bản vẽ sơ bộ, đội ngũ kỹ sư kết cấu Nguyên Phát sẽ phản hồi phương án tối ưu chi phí trong vòng 24 giờ làm việc.
            </p>
          </div>
          <div className="pd-consult-actions">
            <button type="button" className="btn-primary pd-consult-btn" onClick={openQuoteModal}>
              Gửi Yêu Cầu Báo Giá Ngay
            </button>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="pd-related-section">
            <div className="pd-related-header">
              <div>
                <h2 className="pd-section-heading" style={{ marginBottom: '6px' }}>
                  Sản Phẩm &amp; Giải Pháp Liên Quan
                </h2>
                <p className="pd-specs-sub" style={{ marginBottom: 0 }}>
                  Các hạng mục kết cấu và thiết bị đồng bộ thường được triển khai cùng dự án
                </p>
              </div>
              <button type="button" className="pd-view-all-btn" onClick={onNavigateBack}>
                Xem tất cả sản phẩm →
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
                    <span className="pd-related-badge">{rel.category_name || 'Sản phẩm'}</span>
                    <img
                      src={rel.thumbnail}
                      alt={rel.name}
                      className="pd-related-thumb"
                      loading="lazy"
                    />
                  </div>
                  <div className="pd-related-body">
                    <h3 className="pd-related-title">{rel.name}</h3>
                    <p className="pd-related-desc">{rel.description}</p>
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

      {/* Mobile Sticky Bottom CTA Bar */}
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
          Nhận Báo Giá Ngay
        </button>
      </div>

      {/* Fullscreen Image Lightbox */}
      {isLightboxOpen && (
        <div
          className="pd-lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh phóng to"
        >
          <div className="pd-lightbox-topbar" onClick={(e) => e.stopPropagation()}>
            <span className="pd-lightbox-caption">
              {product.name} ({activeImageIndex + 1}/{galleryImages.length})
            </span>
            <button
              type="button"
              className="pd-lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Đóng chế độ phóng to"
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
                  key={idx}
                  type="button"
                  className={`pd-lightbox-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={imgUrl} alt={`Thumb ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Quote Request Modal */}
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
              aria-label="Đóng cửa sổ báo giá"
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
                <h3>Đã Ghi Nhận Yêu Cầu Báo Giá!</h3>
                <p>
                  Cảm ơn <strong>{quoteForm.fullName || 'Quý khách'}</strong>. Phòng Kỹ Thuật &amp; Dự Toán Nguyên Phát đã nhận thông tin quan tâm hạng mục <strong>{product.name}</strong> ({activeSupplyOption.label}) và sẽ liên hệ lại qua số <strong>{quoteForm.phone}</strong> trong thời gian sớm nhất.
                </p>
                <div className="pd-success-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setIsQuoteOpen(false)}
                  >
                    Hoàn tất
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="pd-quote-header">
                  <span className="pd-quote-badge">Phản hồi nhanh trong 24h</span>
                  <h3 id="pd-quote-modal-title">Yêu Cầu Báo Giá &amp; Tư Vấn Kỹ Thuật</h3>
                </div>

                {/* Selected Product Context Card */}
                <div className="pd-quote-product-preview">
                  <img src={product.thumbnail} alt={product.name} />
                  <div>
                    <span className="pd-preview-sku">{product.sku} • {product.category_name}</span>
                    <h4>{product.name}</h4>
                    <span className="pd-preview-option">Phương án: {activeSupplyOption.label}</span>
                  </div>
                </div>

                <form className="pd-quote-form" onSubmit={handleQuoteSubmit}>
                  <div className="pd-form-row">
                    <div className="pd-form-field">
                      <label htmlFor="quote-fullName">Họ tên / Tên doanh nghiệp *</label>
                      <input
                        id="quote-fullName"
                        name="fullName"
                        type="text"
                        required
                        placeholder="VD: Nguyễn Văn A - Công ty TNHH..."
                        value={quoteForm.fullName}
                        onChange={handleQuoteInputChange}
                      />
                    </div>
                    <div className="pd-form-field">
                      <label htmlFor="quote-phone">Số điện thoại liên hệ *</label>
                      <input
                        id="quote-phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="VD: 0909 123 456"
                        value={quoteForm.phone}
                        onChange={handleQuoteInputChange}
                      />
                    </div>
                  </div>

                  <div className="pd-form-row">
                    <div className="pd-form-field">
                      <label htmlFor="quote-email">Email nhận hồ sơ báo giá</label>
                      <input
                        id="quote-email"
                        name="email"
                        type="email"
                        placeholder="email@congty.com"
                        value={quoteForm.email}
                        onChange={handleQuoteInputChange}
                      />
                    </div>
                    <div className="pd-form-field">
                      <label htmlFor="quote-scale">Quy mô / Khối lượng dự kiến</label>
                      <input
                        id="quote-scale"
                        name="scale"
                        type="text"
                        placeholder="VD: 3.000 m² hoặc 80 tấn"
                        value={quoteForm.scale}
                        onChange={handleQuoteInputChange}
                      />
                    </div>
                  </div>

                  <div className="pd-form-field">
                    <label htmlFor="quote-note">Yêu cầu kỹ thuật hoặc địa điểm công trình</label>
                    <textarea
                      id="quote-note"
                      name="note"
                      rows={3}
                      placeholder="Mô tả ngắn gọn địa điểm lắp dựng, khẩu độ yêu cầu hoặc tiến độ dự kiến..."
                      value={quoteForm.note}
                      onChange={handleQuoteInputChange}
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
                      Gửi Yêu Cầu Báo Giá
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
