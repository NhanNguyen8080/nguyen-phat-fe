import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './ProductDetail.css';
import { getProductDetailData } from '../../services/productService';
import { getExcerpt, stripHtml, formatHtmlContent } from '../../utils/textUtils';

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
  onNavigateHome: _onNavigateHome,
  onNavigateContact: _onNavigateContact,
  onSelectProduct
}) => {
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: 'specs' | 'desc' | 'gallery'
  const [activeTab, setActiveTab] = useState('specs');

  // Gallery & Lightbox states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [slideTransition, setSlideTransition] = useState({
    prevImage: '',
    direction: 'next',
    step: 0
  });
  const [failedImages, setFailedImages] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);


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
      setSlideTransition({ prevImage: '', direction: 'next', step: 0 });
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
  const isCableTray = Boolean(
    product?.product_type === 'cable_tray' ||
    product?.category_name === 'Thang máng cáp' ||
    product?.category_id === '09048929-2ca1-48fb-a727-6fc6c259a0a7' ||
    product?.category_id === 'thang-mang-cap'
  );

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

  const handleSelectImage = useCallback((targetIndex, explicitDirection) => {
    if (galleryImages.length <= 1) return;
    const nextSafe = ((targetIndex % galleryImages.length) + galleryImages.length) % galleryImages.length;
    if (nextSafe === safeImageIndex) return;

    const dir = explicitDirection || (nextSafe > safeImageIndex ? 'next' : 'prev');
    setSlideTransition((prev) => ({
      prevImage: currentImage,
      direction: dir,
      step: prev.step + 1
    }));
    setActiveImageIndex(nextSafe);
  }, [galleryImages.length, safeImageIndex, currentImage]);

  const handlePrevImage = useCallback(() => {
    if (galleryImages.length <= 1) return;
    const nextSafe = safeImageIndex <= 0 ? galleryImages.length - 1 : safeImageIndex - 1;
    handleSelectImage(nextSafe, 'prev');
  }, [galleryImages.length, safeImageIndex, handleSelectImage]);

  const handleNextImage = useCallback(() => {
    if (galleryImages.length <= 1) return;
    const nextSafe = safeImageIndex >= galleryImages.length - 1 ? 0 : safeImageIndex + 1;
    handleSelectImage(nextSafe, 'next');
  }, [galleryImages.length, safeImageIndex, handleSelectImage]);

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

  // Lọc và hợp nhất danh sách thông số kỹ thuật thực tế (chỉ hiển thị những mục có dữ liệu)
  // Thu dòng lên khi không có giá trị, không tạo nhóm hay khung cố định trống
  const effectiveSpecs = useMemo(() => {
    if (!product) return [];

    const isValidValue = (v) => {
      if (v === null || v === undefined) return false;
      const s = String(v).trim();
      return s !== '' && s !== '-' && s !== 'N/A' && s !== 'null' && s !== 'undefined';
    };

    const list = [];
    const seenLabels = new Set();

    const addSpec = (label, rawVal, formattedVal) => {
      if (!isValidValue(rawVal)) return;
      const cleanLabel = String(label).trim();
      const normalizedKey = cleanLabel.toLowerCase();
      if (seenLabels.has(normalizedKey)) return;
      seenLabels.add(normalizedKey);
      list.push({
        key: cleanLabel,
        label: cleanLabel,
        value: formattedVal !== undefined ? formattedVal : String(rawVal).trim()
      });
    };

    if (isCableTray) {
      addSpec('Kích thước tiêu chuẩn', product.dimensions);
      addSpec('Vật liệu chế tạo', product.material);
      addSpec('Độ dày tôn', product.thickness);
      addSpec('Xử lý bề mặt & Sơn', product.surface_finish);
      addSpec('Cấp bảo vệ (IP Rating)', product.ip_rating);
      addSpec('Tiêu chuẩn sản xuất', product.standards);
      addSpec('Chi tiết phụ kiện cấu thành', product.main_components);
      addSpec('Thương hiệu / Phân phối', product.brand);
      if (product.warranty_months) {
        addSpec('Chế độ bảo hành', product.warranty_months, `Chính hãng ${product.warranty_months} tháng tận nơi công trình`);
      }
    } else {
      addSpec('Điện áp định mức', product.rated_voltage);
      addSpec('Dòng điện định mức (In)', product.rated_current);
      addSpec('Tần số làm việc', product.frequency);
      addSpec('Dòng cắt ngắn mạch (Icu / Icw)', product.short_circuit_current);
      addSpec('Cấp bảo vệ (IP Rating)', product.ip_rating);
      addSpec('Tiêu chuẩn sản xuất', product.standards);
      addSpec('Kích thước tiêu chuẩn', product.dimensions);
      addSpec('Vật liệu chế tạo', product.material);
      addSpec('Độ dày tôn', product.thickness);
      addSpec('Xử lý bề mặt & Sơn', product.surface_finish);
      addSpec('Thiết bị chính tích hợp', product.main_components);
      addSpec('Thương hiệu / Phân phối', product.brand);
      if (product.warranty_months) {
        addSpec('Chế độ bảo hành', product.warranty_months, `Chính hãng ${product.warranty_months} tháng tận nơi công trình`);
      }
    }

    // Dynamic specs dictionary entered in admin (specifications)
    if (product.specifications && typeof product.specifications === 'object') {
      Object.entries(product.specifications).forEach(([key, val]) => {
        addSpec(key, val);
      });
    }

    return list;
  }, [product, isCableTray]);

  // Lock scroll when lightbox is active
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
      } else if (isLightboxOpen && e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (isLightboxOpen && e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handlePrevImage, handleNextImage]);

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

  if (loading) {
    return (
      <div className="page-loading-wrapper" aria-label="Đang tải thông tin sản phẩm">
        <div className="yellow-spinner" role="status"></div>
        <span className="loading-text">Đang tải thông tin sản phẩm...</span>
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
          <nav className="pd-breadcrumbs" aria-label="Đường dẫn điều hướng">
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
                    {slideTransition.step > 0 &&
                      slideTransition.prevImage &&
                      slideTransition.prevImage !== currentImage && (
                        <img
                          key={`out-${slideTransition.step}`}
                          src={slideTransition.prevImage}
                          alt=""
                          aria-hidden="true"
                          className={`pd-main-img pd-main-img-outgoing is-${slideTransition.direction}`}
                        />
                      )}

                    <img
                      key={`in-${safeImageIndex}-${slideTransition.step}`}
                      src={currentImage}
                      alt={product.name}
                      className={`pd-main-img pd-main-img-incoming ${
                        slideTransition.step > 0 ? `is-${slideTransition.direction}` : ''
                      }`}
                      onError={() => handleImageError(currentImage)}
                    />


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
                          onClick={() => handleSelectImage(idx)}
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
            {product.code ? (
              <div className="pd-code-strip">
                <span className="pd-code-label">Mã sản phẩm:</span>
                <code className="pd-code-value">
                  {product.code}
                </code>
              </div>
            ) : null}

            {/* Vùng nhận xét/mô tả sản phẩm (cmt sản phẩm) theo yêu cầu file doc:
                Bỏ hết 6 ô cứng, thay bằng khối mô tả thoáng đãng, danh sách đặc điểm và liên hệ nhanh */}
            <div className="pd-summary-desc-box">
              {product.description && stripHtml(product.description) ? (
                <div
                  className="pd-summary-desc-text"
                  dangerouslySetInnerHTML={{ __html: formatHtmlContent(product.description) }}
                />
              ) : (
                <p className="pd-summary-desc-text">
                  Sản phẩm được gia công và lắp ráp tại xưởng Cơ Điện Nguyên Phát theo quy trình quản lý chất lượng nghiêm ngặt, đảm bảo độ an toàn vận hành, độ bền cơ học cao và tính thẩm mỹ tối ưu cho mọi công trình.
                </p>
              )}
            </div>

            {/* Đặc điểm kỹ thuật then chốt dạng gạch đầu dòng gọn đẹp (mẫu tham khảo Đạt Vĩnh Tiến) */}
            <ul className="pd-highlights-list" aria-label="Đặc điểm nổi bật">
              <li className="pd-highlight-item">
                <span className="pd-highlight-bullet">-</span>
                <span>Tuân thủ tiêu chuẩn chất lượng &amp; an toàn điện IEC 61439-1/2, IEC 60529 &amp; TCVN.</span>
              </li>
              <li className="pd-highlight-item">
                <span className="pd-highlight-bullet">-</span>
                <span>Thanh cái đồng mạ thiếc 99.9%, tôn chấn CNC sắc nét, bề mặt sơn tĩnh điện chống ăn mòn.</span>
              </li>
              <li className="pd-highlight-item">
                <span className="pd-highlight-bullet">-</span>
                <span>Tích hợp thiết bị đóng cắt chính hãng (Schneider, LS, ABB, Mitsubishi) đầy đủ chứng chỉ CO/CQ.</span>
              </li>
              <li className="pd-highlight-item">
                <span className="pd-highlight-bullet">-</span>
                <span>Hỗ trợ khảo sát bản vẽ, tư vấn thiết kế kỹ thuật và nghiệm thu đóng điện tận nơi công trình.</span>
              </li>
            </ul>

            {/* Khối liên hệ & Báo giá nhanh (mẫu Đạt Vĩnh Tiến) */}
            <div className="pd-quick-contact-box">
              <div className="pd-quick-contact-info">
                <div className="pd-contact-row">
                  <span className="pd-contact-label">Hotline tư vấn kỹ thuật:</span>
                  <a href="tel:0909238679" className="pd-contact-link pd-contact-hotline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    0909 238 679
                  </a>
                </div>
                <div className="pd-contact-row">
                  <span className="pd-contact-label">Email tiếp nhận dự án:</span>
                  <a href="mailto:codiennguyenphat2018@gmail.com" className="pd-contact-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    codiennguyenphat2018@gmail.com
                  </a>
                </div>
              </div>

              <div className="pd-quick-contact-actions">
                <a
                  href="tel:0909238679"
                  className="pd-contact-action-btn pd-btn-quote"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Yêu Cầu Báo Giá Dự Án
                </a>
                <button
                  type="button"
                  className="pd-contact-action-btn pd-btn-specs"
                  onClick={() => scrollToTabs('specs')}
                >
                  Xem Thông Số Kỹ Thuật ↓
                </button>
              </div>
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
                TAB 1: THÔNG SỐ KỸ THUẬT (THU GỌN, CHỈ HIỂN THỊ DÒNG CÓ DỮ LIỆU)
                ============================================= */}
            {activeTab === 'specs' && (
              <div className="pd-tab-pane pd-specs-pane">
                <div className="pd-compact-specs-wrapper">
                  <div className="pd-compact-specs-header">
                    <h3 className="pd-compact-specs-title">Bảng Thông Số Kỹ Thuật</h3>
                    {effectiveSpecs.length > 0 && (
                      <span className="pd-compact-specs-badge">
                        {effectiveSpecs.length} thông số ghi nhận
                      </span>
                    )}
                  </div>

                  {effectiveSpecs.length > 0 ? (
                    <table className="pd-compact-specs-table">
                      <tbody>
                        {effectiveSpecs.map((item, index) => (
                          <tr key={item.key || index} className="pd-compact-spec-row">
                            <th className="pd-spec-th">{item.label}</th>
                            <td className="pd-spec-td">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="pd-specs-empty-notice">
                      <p>Thông số kỹ thuật chi tiết của sản phẩm đang được ban kỹ sư Cơ Điện Nguyên Phát cập nhật theo từng mã thiết bị hoặc yêu cầu bản vẽ công trình.</p>
                      <a href="tel:0909238679" className="pd-contact-action-btn pd-btn-quote" style={{ display: 'inline-flex', marginTop: '12px' }}>
                        Liên hệ tư vấn kỹ thuật: 0909 238 679
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =============================================
                TAB 2: MÔ TẢ KỸ THUẬT & ĐẶC ĐIỂM NỔI BẬT
                ============================================= */}
            {activeTab === 'desc' && (
              <div className="pd-tab-pane pd-desc-pane">
                <div className="pd-desc-content-card">
                  {product.description && stripHtml(product.description) ? (
                    <div 
                      className="pd-html-description"
                      dangerouslySetInnerHTML={{ __html: formatHtmlContent(product.description) }}
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
                    {rel.category_name && (
                      <span className="pd-related-badge">{rel.category_name}</span>
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
              key={`lb-${safeImageIndex}-${slideTransition.step}`}
              src={galleryImages[safeImageIndex]}
              alt={`${product.name} - ảnh phóng to`}
              className={`pd-lightbox-img ${
                slideTransition.step > 0 ? `is-${slideTransition.direction}` : ''
              }`}
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