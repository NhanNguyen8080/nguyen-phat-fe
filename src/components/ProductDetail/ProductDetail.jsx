import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './ProductDetail.css';
import { getProductDetailData } from '../../services/productService';

const IMAGE_VIEW_META = [
  { tag: 'Phối cảnh toàn diện', desc: 'Kiến trúc & kết cấu tổng quan tủ điện' },
  { tag: 'Mặt trước cánh tủ', desc: 'Bố trí thiết bị đo lường, đồng hồ & đèn báo' },
  { tag: 'Nội thất & Thiết bị chính', desc: 'Thiết bị đóng cắt ACB/MCCB & Busbar đồng' },
  { tag: 'Thanh cái đồng (Busbar)', desc: 'Gia công uốn CNC & mạ thiếc cách điện' },
  { tag: 'Lắp ráp tại nhà máy', desc: 'Quy trình đấu nối & kiểm tra Type-test' },
  { tag: 'Nghiệm thu tại công trình', desc: 'Lắp đặt bàn giao chuẩn kỹ thuật IEC' }
];

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

  // Active Tab: 'specs' | 'desc' | 'gallery'
  const [activeTab, setActiveTab] = useState('specs');

  // Gallery & Lightbox states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // RFQ (Request For Quotation) Modal states
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    projectLocation: '',
    note: ''
  });

  const detailTabsRef = useRef(null);

  // Fetch product data
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
      setActiveTab('specs');
      setLoading(false);
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productIdOrSlug]);

  // Gallery images merged from thumbnail + images
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

  // Related products
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

  // Lock scroll when modal or lightbox is active
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

  // Keyboard navigation
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

  const scrollToTabs = (tabKey) => {
    if (tabKey) setActiveTab(tabKey);
    if (detailTabsRef.current) {
      const top = detailTabsRef.current.getBoundingClientRect().top + window.pageYOffset - 130;
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

  // Shimmer Skeleton
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

  // Not found state
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
      {/* Sticky Secondary Navigation Bar */}
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

        </div>
      </div>

      {/* Main Container */}
      <main className="container pd-main">
        {/* =============================================
            HERO SECTION: GALLERY (LEFT) + SUMMARY (RIGHT)
            ============================================= */}
        <section className="pd-hero-grid">
          {/* Cột Trái: Trình xem ảnh đa góc nhìn */}
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
                      <div className="pd-stage-badge-group">
                        <span className="pd-stage-perspective-tag">
                          {IMAGE_VIEW_META[safeImageIndex % IMAGE_VIEW_META.length].tag}
                        </span>
                        {galleryImages.length > 1 && (
                          <span className="pd-stage-counter">
                            {safeImageIndex + 1} / {galleryImages.length}
                          </span>
                        )}
                      </div>

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

                  {/* Dải ảnh thu nhỏ */}
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
                <div className="pd-no-image-stage">
                  <div className="pd-no-image-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <span>Hình ảnh tủ điện đang được cập nhật</span>
                </div>
              )}

              {/* Cam kết kỹ thuật mini dưới Gallery */}
              <div className="pd-gallery-trust-strip">
                <div className="pd-trust-item">
                  <span>100% Type-tested IEC</span>
                </div>
                <div className="pd-trust-item">
                  <span>Đồng mạ thiếc 99.99%</span>
                </div>
                <div className="pd-trust-item">
                  <span>CO/CQ chính hãng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Thông tin định danh kỹ thuật & Hành động */}
          <div className="pd-summary-col">
            {/* Top Badges */}
            <div className="pd-badges-row">
              {product.category_name && (
                <button
                  type="button"
                  className="pd-category-badge clickable"
                  onClick={handleCategoryClick}
                >
                  {product.category_name}
                </button>
              )}
            </div>

            {/* Product Title */}
            <h1 className="pd-title">{product.name}</h1>

            {/* Product Code Line */}
            <div className="pd-code-strip">
              <span className="pd-code-label">Mã sản phẩm:</span>
              <code className="pd-code-value">
                {product.code || 'NP-STD'}
              </code>
            </div>

            {/* 6 Hero Highlights: Thẻ thông số điện - cơ then chốt (giao diện kỹ thuật sạch sẽ) */}
            <div className="pd-hero-specs-grid">
              <div className="pd-hero-spec-card">
                <span className="pd-spec-name">Điện áp định mức</span>
                <span className="pd-spec-val">{product.rated_voltage || '380V - 415V AC'}</span>
              </div>

              <div className="pd-hero-spec-card highlight">
                <span className="pd-spec-name">Dòng điện định mức</span>
                <span className="pd-spec-val">{product.rated_current || 'Theo yêu cầu thiết kế'}</span>
              </div>

              <div className="pd-hero-spec-card">
                <span className="pd-spec-name">Cấp bảo vệ vỏ tủ</span>
                <span className="pd-spec-val">{product.ip_rating || 'IP43 / IP54'}</span>
              </div>

              <div className="pd-hero-spec-card">
                <span className="pd-spec-name">Dòng cắt ngắn mạch</span>
                <span className="pd-spec-val">{product.short_circuit_current || 'Theo thiết kế (kA)'}</span>
              </div>

              <div className="pd-hero-spec-card">
                <span className="pd-spec-name">Tiêu chuẩn sản xuất</span>
                <span className="pd-spec-val">{product.standards || 'IEC 61439-1/2'}</span>
              </div>

              <div className="pd-hero-spec-card">
                <span className="pd-spec-name">Tần số làm việc</span>
                <span className="pd-spec-val">{product.frequency || '50Hz / 60Hz'}</span>
              </div>
            </div>

            {/* Lead Description Preview */}
            <div className="pd-lead-wrap">
              <p className="pd-lead-desc">
                {product.description
                  ? product.description.replace(/<[^>]+>/g, ' ').slice(0, 190) + '...'
                  : 'Sản phẩm tủ điện công nghiệp chế tạo theo tiêu chuẩn quốc tế IEC, đáp ứng nghiêm ngặt an toàn vận hành và thẩm mỹ công trình.'}
              </p>
              <button
                type="button"
                className="pd-jump-desc-btn"
                onClick={() => scrollToTabs('desc')}
              >
                Xem chi tiết mô tả kỹ thuật ↓
              </button>
            </div>
          </div>
        </section>

        {/* =============================================
            TABS SECTION: FULL SPECS, DESCRIPTION, GALLERY
            ============================================= */}
        <section className="pd-tabs-section" ref={detailTabsRef}>
          {/* Tab Navigation Headers */}
          <div className="pd-tabs-nav" role="tablist">
            <button
              type="button"
              className={`pd-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
              role="tab"
              aria-selected={activeTab === 'specs'}
            >
              <span>Thông Số Kỹ Thuật</span>
            </button>

            <button
              type="button"
              className={`pd-tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
              onClick={() => setActiveTab('desc')}
              role="tab"
              aria-selected={activeTab === 'desc'}
            >
              <span>Mô Tả &amp; Tính Năng</span>
            </button>

            <button
              type="button"
              className={`pd-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
              role="tab"
              aria-selected={activeTab === 'gallery'}
            >
              <span>Hình Ảnh Thực Tế ({galleryImages.length})</span>
            </button>

          </div>

          {/* Tab Panels */}
          <div className="pd-tabs-content">
            {/* =============================================
                TAB 1: THÔNG SỐ KỸ THUẬT TOÀN DIỆN (4 NHÓM)
                ============================================= */}
            {activeTab === 'specs' && (
              <div className="pd-tab-pane pd-specs-pane">
                <div className="pd-specs-groups">
                  {/* Nhóm 1: Hệ thống Điện Khí & Vận Hành */}
                  <div className="pd-specs-group-card">
                    <div className="pd-specs-group-head">
                      <h3>1. Thông Số Điện Khí &amp; Vận Hành</h3>
                    </div>
                    <table className="pd-specs-table">
                      <tbody>
                        <tr>
                          <th>Điện áp định mức (Rated Voltage)</th>
                          <td>{product.rated_voltage || '380V - 415V AC / 3P + N + PE'}</td>
                        </tr>
                        <tr>
                          <th>Dòng điện định mức (Rated Current)</th>
                          <td><strong>{product.rated_current || 'Tùy chọn cấu hình theo phụ tải'}</strong></td>
                        </tr>
                        <tr>
                          <th>Tần số làm việc (Frequency)</th>
                          <td>{product.frequency || '50Hz / 60Hz'}</td>
                        </tr>
                        <tr>
                          <th>Dòng cắt ngắn mạch (Icu / Icw)</th>
                          <td>{product.short_circuit_current || '36kA / 50kA / 65kA (1s)'}</td>
                        </tr>
                        <tr>
                          <th>Tiêu chuẩn áp dụng (Standards)</th>
                          <td>{product.standards || 'IEC 61439-1/2, IEC 60947-2, TCVN 7994'}</td>
                        </tr>
                        {product.specifications?.['Cấp cách điện'] && (
                          <tr>
                            <th>Cấp cách điện</th>
                            <td>{product.specifications['Cấp cách điện']}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Nhóm 2: Cơ Khí & Quy Cách Vỏ Tủ */}
                  <div className="pd-specs-group-card">
                    <div className="pd-specs-group-head">
                      <h3>2. Quy Cách Cơ Khí &amp; Vỏ Tủ</h3>
                    </div>
                    <table className="pd-specs-table">
                      <tbody>
                        <tr>
                          <th>Kích thước tiêu chuẩn (H x W x D)</th>
                          <td>{product.dimensions || 'Gia công linh hoạt theo mặt bằng trạm điện'}</td>
                        </tr>
                        <tr>
                          <th>Vật liệu chế tạo (Material)</th>
                          <td>{product.material || 'Thép cán nguội tiêu chuẩn JIS / Inox 304 theo yêu cầu'}</td>
                        </tr>
                        <tr>
                          <th>Đ度 dày tôn vỏ tủ (Thickness)</th>
                          <td>{product.thickness || '1.5mm - 2.0mm - 2.5mm'}</td>
                        </tr>
                        <tr>
                          <th>Xử lý bề mặt &amp; Sơn (Surface Finish)</th>
                          <td>{product.surface_finish || 'Sơn tĩnh điện công nghiệp RAL 7032 / RAL 7035'}</td>
                        </tr>
                        <tr>
                          <th>Cấp bảo vệ vỏ tủ (IP Rating)</th>
                          <td><strong>{product.ip_rating || 'IP43 (Trong nhà) / IP54 (Ngoài trời)'}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Nhóm 3: Thiết Bị Chính & Cấu Hình Đóng Cắt */}
                  <div className="pd-specs-group-card">
                    <div className="pd-specs-group-head">
                      <h3>3. Cấu Hình Thiết Bị Đóng Cắt &amp; Linh Kiện</h3>
                    </div>
                    <table className="pd-specs-table">
                      <tbody>
                        <tr>
                          <th>Thiết bị chính tích hợp</th>
                          <td>{product.main_components || 'ACB, MCCB, Contactor, Rơ le bảo vệ kỹ thuật số, biến dòng CT'}</td>
                        </tr>
                        <tr>
                          <th>Thương hiệu linh kiện</th>
                          <td>{product.brand || 'Schneider / ABB / Mitsubishi / LS / Siemens (Tùy chọn)'}</td>
                        </tr>
                        <tr>
                          <th>Vật liệu thanh cái (Busbar)</th>
                          <td>Đồng thanh cái đỏ 99.99% mạ thiếc, bọc màng co nhiệt phân pha tiêu chuẩn</td>
                        </tr>
                        <tr>
                          <th>Chế độ bảo hành</th>
                          <td>Chính hãng <strong>{product.warranty_months || 24} tháng</strong> tận nơi công trình</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Nhóm 4: Thông Số Mở Rộng (Specifications Dynamic Dictionary) */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="pd-specs-group-card">
                      <div className="pd-specs-group-head">
                        <h3>4. Thông Số Bổ Sung &amp; Tiêu Chuẩn Dự Án</h3>
                      </div>
                      <table className="pd-specs-table">
                        <tbody>
                          {Object.entries(product.specifications).map(([key, val]) => (
                            <tr key={key}>
                              <th>{key}</th>
                              <td>{String(val)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Banner Kêu gọi RFQ trong Tab Specs */}
                <div className="pd-specs-rfq-banner">
                  <div className="pd-rfq-banner-text">
                    <h4>Cần tùy biến thông số hoặc thiết kế theo sơ đồ một sợi (SLD) riêng?</h4>
                    <p>Kỹ sư Cơ Điện Nguyên Phát sẵn sàng bóc tách khối lượng và lên bản vẽ sơ bộ miễn phí trong 24h.</p>
                  </div>
                  <div className="pd-rfq-banner-actions">
                    <button type="button" className="btn-primary" onClick={openQuoteModal}>
                      Gửi Yêu Cầu Thiết Kế Ngay
                    </button>
                    {onNavigateContact && (
                      <button type="button" className="btn-secondary" onClick={onNavigateContact}>
                        Liên Hệ Kỹ Sư Trực Tiếp
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* =============================================
                TAB 2: MÔ TẢ KỸ THUẬT & ĐẶC ĐIỂM NỔI BẬT
                ============================================= */}
            {activeTab === 'desc' && (
              <div className="pd-tab-pane pd-desc-pane">
                <div className="pd-desc-content-card">
                  {product.description ? (
                    <div 
                      className="pd-html-description"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <div className="pd-desc-empty">
                      <p>Nội dung mô tả kỹ thuật chi tiết đang được ban kỹ sư Cơ Điện Nguyên Phát hoàn thiện.</p>
                    </div>
                  )}
                </div>

                {/* Cam kết chất lượng Nguyên Phát */}
                <div className="pd-quality-commitments-grid">
                  <div className="pd-commitment-card">
                    <h4>Đạt Chuẩn Quốc Tế IEC</h4>
                    <p>Toàn bộ sản phẩm xuất xưởng tuân thủ nghiêm ngặt IEC 61439-1/2, đảm bảo khả năng chịu dòng ngắn mạch và độ tăng nhiệt an toàn.</p>
                  </div>

                  <div className="pd-commitment-card">
                    <h4>Gia Công CNC Chính Xác</h4>
                    <p>Vỏ tủ sản xuất trên dây chuyền đột dập và chấn bẻ CNC tự động, sơn tĩnh điện ngoài trời chống ăn mòn hóa chất và hơi muối biển.</p>
                  </div>

                  <div className="pd-commitment-card">
                    <h4>Hỗ Trợ Kỹ Thuật Tận Nơi</h4>
                    <p>Đội ngũ kỹ sư Cơ Điện Nguyên Phát đồng hành tư vấn, giám sát lắp đặt, đấu nối và nghiệm thu đóng điện cùng chủ đầu tư.</p>
                  </div>
                </div>
              </div>
            )}

            {/* =============================================
                TAB 3: BỘ SƯU TẬP HÌNH ẢNH THỰC TẾ & BENTO GRID
                ============================================= */}
            {activeTab === 'gallery' && (
              <div className="pd-tab-pane pd-gallery-pane">
                <div className="pd-gallery-section-head">
                  <div>
                    <h3 className="pd-gallery-title">Bộ Sưu Tập Hình Ảnh Chế Tạo &amp; Lắp Đặt Thực Tế</h3>
                    <p className="pd-gallery-sub">
                      Góc chụp chân thực từ phân xưởng sản xuất cơ khí, đấu nối thiết bị đến quy trình nghiệm thu bàn giao tại các dự án trọng điểm.
                    </p>
                  </div>

                  {galleryImages.length > 0 && (
                    <button
                      type="button"
                      className="pd-slideshow-trigger-btn"
                      onClick={() => setIsLightboxOpen(true)}
                    >
                      <span>Xem Toàn Màn Hình</span>
                    </button>
                  )}
                </div>

                {galleryImages.length > 1 ? (
                  <div className="pd-bento-gallery">
                    {/* Featured Large Item */}
                    <div
                      className="pd-bento-item pd-bento-featured"
                      onClick={() => {
                        setActiveImageIndex(0);
                        setIsLightboxOpen(true);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={galleryImages[0]}
                        alt={`${product.name} - ${IMAGE_VIEW_META[0].tag}`}
                        loading="lazy"
                        onError={() => handleImageError(galleryImages[0])}
                      />
                      <div className="pd-bento-overlay">
                        <div className="pd-bento-badges">
                          <span className="pd-bento-num">01</span>
                          <span className="pd-bento-tag">{IMAGE_VIEW_META[0].tag}</span>
                        </div>
                        <div className="pd-bento-bottom-info">
                          <p className="pd-bento-caption">{IMAGE_VIEW_META[0].desc}</p>
                          <span className="pd-bento-zoom-pill">Phóng to chi tiết</span>
                        </div>
                      </div>
                    </div>

                    {/* Subgrid */}
                    <div className="pd-bento-subgrid">
                      {galleryImages.slice(1).map((imgUrl, idx) => {
                        const imageIndex = idx + 1;
                        const meta = IMAGE_VIEW_META[imageIndex % IMAGE_VIEW_META.length];
                        return (
                          <div
                            key={imgUrl + idx}
                            className="pd-bento-item pd-bento-regular"
                            onClick={() => {
                              setActiveImageIndex(imageIndex);
                              setIsLightboxOpen(true);
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <img
                              src={imgUrl}
                              alt={`${product.name} - ${meta.tag}`}
                              loading="lazy"
                              onError={() => handleImageError(imgUrl)}
                            />
                            <div className="pd-bento-overlay">
                              <div className="pd-bento-badges">
                                <span className="pd-bento-num">0{imageIndex + 1}</span>
                                <span className="pd-bento-tag">{meta.tag}</span>
                              </div>
                              <div className="pd-bento-bottom-info">
                                <span className="pd-bento-zoom-pill">Chi tiết</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : galleryImages.length === 1 ? (
                  <div className="pd-single-hero-card" onClick={() => setIsLightboxOpen(true)}>
                    <img src={galleryImages[0]} alt={product.name} />
                    <div className="pd-single-overlay">
                      <span className="pd-single-badge">Hình ảnh sản phẩm chính thức</span>
                      <span className="pd-single-zoom">Nhấn để xem kích thước lớn</span>
                    </div>
                  </div>
                ) : (
                  <div className="pd-gallery-empty-state">
                    <p>Hình ảnh cho sản phẩm này đang được ban kỹ thuật số hóa và cập nhật.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

        {/* =============================================
            SIDEBAR & RELATED PRODUCTS
            ============================================= */}
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
                  Khám phá thêm các hệ thống tủ điện &amp; thiết bị cơ điện chất lượng cao của Nguyên Phát
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
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="pd-related-body">
                    {rel.code && (
                      <span className="pd-related-code">{rel.code}</span>
                    )}
                    <h3 className="pd-related-title">{rel.name}</h3>
                    <div className="pd-related-specs">
                      {rel.rated_voltage && <span>{rel.rated_voltage}</span>}
                      {rel.rated_current && <span>{rel.rated_current}</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* =============================================
          MODAL YÊU CẦU BÁO GIÁ KỸ THUẬT (RFQ)
          ============================================= */}
      {isQuoteOpen && (
        <div className="pd-modal-overlay" onClick={() => setIsQuoteOpen(false)}>
          <div className="pd-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pd-modal-close"
              onClick={() => setIsQuoteOpen(false)}
              aria-label="Đóng bảng báo giá"
            >
              ✕
            </button>

            {!quoteSubmitted ? (
              <form className="pd-quote-form" onSubmit={handleQuoteSubmit}>
                <div className="pd-modal-header">
                  <span className="pd-modal-eyebrow">Yêu Cầu Báo Giá Kỹ Thuật (RFQ)</span>
                  <h3 className="pd-modal-title">{product.name}</h3>
                  <div className="pd-modal-code-badge">
                    Mã thiết bị: <strong>{product.code || 'NP-STD'}</strong> • {product.category_name || 'Tủ điện'}
                  </div>
                </div>

                <div className="pd-form-grid">
                  <div className="pd-form-group">
                    <label>Họ và tên kỹ sư / Phụ trách mua hàng *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={quoteForm.fullName}
                      onChange={handleQuoteChange}
                    />
                  </div>

                  <div className="pd-form-group">
                    <label>Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Ví dụ: 0912 345 678"
                      value={quoteForm.phone}
                      onChange={handleQuoteChange}
                    />
                  </div>

                  <div className="pd-form-group">
                    <label>Email nhận hồ sơ báo giá *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Ví dụ: engineer@company.com"
                      value={quoteForm.email}
                      onChange={handleQuoteChange}
                    />
                  </div>

                  <div className="pd-form-group">
                    <label>Công ty / Dự án thi công</label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Ví dụ: Công ty Cơ Điện Delta / Nhà máy Foxconn"
                      value={quoteForm.company}
                      onChange={handleQuoteChange}
                    />
                  </div>
                </div>

                <div className="pd-form-group">
                  <label>Thông số kỹ thuật bổ sung hoặc file đính kèm SLD</label>
                  <textarea
                    name="note"
                    rows="3"
                    placeholder="Ví dụ: Cần dòng định mức 3200A, thiết bị chính ABB, cấp bảo vệ IP54 ngoài trời..."
                    value={quoteForm.note}
                    onChange={handleQuoteChange}
                  ></textarea>
                </div>

                <div className="pd-modal-actions">
                  <button type="submit" className="btn-primary pd-submit-rfq-btn">
                    Gửi Yêu Cầu Kỹ Thuật Ngay
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsQuoteOpen(false)}
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            ) : (
              <div className="pd-quote-success">
                <div className="pd-success-icon">✓</div>
                <h3>Yêu Cầu Báo Giá Đã Được Gửi Thành Công!</h3>
                <p>
                  Cảm ơn Quý khách <strong>{quoteForm.fullName || 'bạn'}</strong>. Ban Kỹ thuật Cơ Điện Nguyên Phát sẽ rà soát thông số thiết bị <strong>{product.code || product.name}</strong> và gửi bảng dự toán chi tiết tới email <strong>{quoteForm.email}</strong> trong vòng 24 giờ.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsQuoteOpen(false)}
                >
                  Hoàn tất &amp; Đóng
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =============================================
          FULLSCREEN LIGHTBOX
          ============================================= */}
      {isLightboxOpen && galleryImages.length > 0 && (
        <div className="pd-lightbox" onClick={() => setIsLightboxOpen(false)}>
          <button
            type="button"
            className="pd-lightbox-close"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Đóng trình xem ảnh"
          >
            ✕
          </button>

          <div className="pd-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[safeImageIndex]}
              alt={`${product.name} - ảnh phóng to`}
              className="pd-lightbox-img"
            />

            <div className="pd-lightbox-footer">
              <span className="pd-lightbox-tag">
                {IMAGE_VIEW_META[safeImageIndex % IMAGE_VIEW_META.length].tag}
              </span>
              <span className="pd-lightbox-count">
                {safeImageIndex + 1} / {galleryImages.length}
              </span>
            </div>
          </div>

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                className="pd-lightbox-nav prev"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                aria-label="Ảnh trước"
              >
                ‹
              </button>
              <button
                type="button"
                className="pd-lightbox-nav next"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                aria-label="Ảnh tiếp theo"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;