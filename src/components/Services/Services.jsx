import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Services.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getProducts, MOCK_PRODUCTS } from '../../services/productService';

const FALLBACK_IMAGE = '/images/products/tu-msb-3200a.png';

const getVisibleColumns = () => {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 992) return 2;
  return 3;
};

const getProductThumbnail = (product) => {
  if (!product) return FALLBACK_IMAGE;
  if (Array.isArray(product.images)) {
    const spImg = product.images.find(
      (img) => typeof img === 'string' && img.includes('/sanpham/')
    );
    if (spImg) return spImg;
  }
  if (product.thumbnail && !product.thumbnail.includes('thuydiensongbung2')) {
    return product.thumbnail;
  }
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }
  return product.thumbnail || FALLBACK_IMAGE;
};

const decodeMojibake = (str) => {
  if (!str || typeof str !== 'string') return str;
  if (/[\u00C0-\u00FF][\u0080-\u00BF]/.test(str)) {
    try {
      const bytes = new Uint8Array([...str].map((ch) => ch.charCodeAt(0) & 0xff));
      const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      if (decoded) return decoded.replace(/\uFFFD!/g, 'ệ');
    } catch {
      // Giữ nguyên chuỗi gốc nếu lỗi
    }
  }
  return str;
};

const isCableOrEnclosureProduct = (product) => {
  if (!product) return false;
  const name = decodeMojibake(product.name || '').toLowerCase();
  const cat = decodeMojibake(product.category_name || '').toLowerCase();
  const type = (product.product_type || '').toLowerCase();
  return (
    cat.includes('thang') ||
    cat.includes('máng cáp') ||
    cat.includes('vỏ tủ') ||
    name.includes('thang cáp') ||
    name.includes('thang máng cáp') ||
    name.includes('máng cáp') ||
    name.includes('khay cáp') ||
    name.includes('tray cáp') ||
    name.includes('vỏ tủ') ||
    type === 'cable_containment' ||
    type === 'enclosure'
  );
};

const Services = ({ onNavigateProducts, onSelectProduct }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [visibleCols, setVisibleCols] = useState(() => getVisibleColumns());
  const [row1Index, setRow1Index] = useState(0);
  const [row2Index, setRow2Index] = useState(0);
  const [row1Animating, setRow1Animating] = useState(false);
  const [row2Animating, setRow2Animating] = useState(false);
  const row1TouchX = useRef(null);
  const row2TouchX = useRef(null);
  const sectionRef = useScrollReveal({ threshold: 0.08 });

  useEffect(() => {
    let isMounted = true;

    getProducts({ limit: 50 })
      .then((res) => {
        if (isMounted && res?.products) {
          setAllProducts(res.products);
        }
      })
      .catch((err) => {
        console.warn('Lỗi gọi API get products cho trang chủ:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCols(getVisibleColumns());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Phân tách sản phẩm thành 2 hàng chuẩn theo yêu cầu trong file doc:
  // Hàng 1: TỦ ĐIỆN & THIẾT BỊ
  const row1List = useMemo(() => {
    const list = allProducts.filter((p) => !isCableOrEnclosureProduct(p));
    // Đảm bảo hàng 1 luôn có tối thiểu 3 sản phẩm tủ điện sắc nét
    if (list.length < 3) {
      const existingIds = new Set(list.map((p) => p.id || p.slug));
      const mockCabinets = (MOCK_PRODUCTS || []).filter((p) => !isCableOrEnclosureProduct(p));
      for (const m of mockCabinets) {
        if (!existingIds.has(m.id) && !existingIds.has(m.slug)) {
          list.push(m);
          existingIds.add(m.id);
        }
        if (list.length >= 6) break;
      }
    }
    return list;
  }, [allProducts]);

  // Hàng 2: THANG MÁNG CÁP VÀ VỎ TỦ
  const row2List = useMemo(() => {
    const list = allProducts.filter((p) => isCableOrEnclosureProduct(p));
    // Đảm bảo hàng 2 luôn có tối thiểu 3 sản phẩm thang máng cáp & vỏ tủ đúng mẫu ảnh tham khảo
    if (list.length < 3) {
      const existingIds = new Set(list.map((p) => p.id || p.slug));
      const mockCables = (MOCK_PRODUCTS || []).filter((p) => isCableOrEnclosureProduct(p));
      for (const m of mockCables) {
        if (!existingIds.has(m.id) && !existingIds.has(m.slug)) {
          list.push(m);
          existingIds.add(m.id);
        }
        if (list.length >= 6) break;
      }
    }
    return list;
  }, [allProducts]);

  const maxRow1Index = Math.max(0, row1List.length - visibleCols);
  const maxRow2Index = Math.max(0, row2List.length - visibleCols);

  const safeRow1Index = Math.min(row1Index, maxRow1Index);
  const safeRow2Index = Math.min(row2Index, maxRow2Index);

  const triggerRow1Slide = (nextIdx) => {
    const clamped = Math.max(0, Math.min(maxRow1Index, nextIdx));
    if (clamped === safeRow1Index) return;
    setRow1Animating(true);
    setRow1Index(clamped);
    setTimeout(() => setRow1Animating(false), 620);
  };

  const triggerRow2Slide = (nextIdx) => {
    const clamped = Math.max(0, Math.min(maxRow2Index, nextIdx));
    if (clamped === safeRow2Index) return;
    setRow2Animating(true);
    setRow2Index(clamped);
    setTimeout(() => setRow2Animating(false), 620);
  };

  const handleCardClick = (product) => {
    if (!product) return;
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onNavigateProducts) {
      onNavigateProducts();
    } else {
      const idOrSlug = product.slug || product.id;
      window.location.hash = `#/products/${idOrSlug}`;
    }
  };

  const renderProductRow = ({
    title,
    categoryId,
    products,
    currentIndex,
    maxIndex,
    isAnimating,
    onSlide,
    touchRef,
    fallbackImg,
    defaultBadge,
    delayClass
  }) => (
    <div className={`product-row-block reveal ${delayClass}`}>
      <div className="product-row-header">
        <div className="product-row-heading-center">
          <h3
            className="product-row-title"
            onClick={() => onNavigateProducts && onNavigateProducts(categoryId)}
            title={`Xem danh mục ${title}`}
          >
            {title}
          </h3>
          <div className="product-row-ornament">
            <span className="ornament-line" />
            <span className="ornament-square" />
            <span className="ornament-square" />
            <span className="ornament-line" />
          </div>
        </div>

        {maxIndex > 0 && (
          <div className="product-row-nav">
            <div className="row-dots-indicator">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`row-dot ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => onSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="row-nav-btn"
              onClick={() => onSlide(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="Sản phẩm trước"
            >
              ‹
            </button>
            <button
              type="button"
              className="row-nav-btn"
              onClick={() => onSlide(currentIndex + 1)}
              disabled={currentIndex >= maxIndex}
              aria-label="Sản phẩm tiếp theo"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div
        className="product-slider-viewport"
        onTouchStart={(e) => {
          if (e.touches && e.touches.length > 0) {
            touchRef.current = e.touches[0].clientX;
          }
        }}
        onTouchEnd={(e) => {
          if (touchRef.current === null) return;
          if (e.changedTouches && e.changedTouches.length > 0) {
            const diff = touchRef.current - e.changedTouches[0].clientX;
            if (diff > 40) onSlide(currentIndex + 1);
            else if (diff < -40) onSlide(currentIndex - 1);
          }
          touchRef.current = null;
        }}
      >
        <div
          className={`product-slider-track ${isAnimating ? 'is-sliding' : ''}`}
          style={{
            '--slide-index': currentIndex,
            '--visible-cols': visibleCols
          }}
        >
          {products.map((product, index) => {
            const productName = decodeMojibake(product.name);
            const categoryName = decodeMojibake(product.category_name) || defaultBadge;
            const isVisibleCard = index >= currentIndex && index < currentIndex + visibleCols;

            return (
              <div
                key={product.id || index}
                className={`product-wide-card ${isVisibleCard ? 'is-in-view' : 'is-out-of-view'}`}
                onClick={() => handleCardClick(product)}
                role="button"
                tabIndex={isVisibleCard ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(product);
                  }
                }}
                title={`Xem chi tiết: ${productName}`}
              >
                <div className="product-wide-img-box">
                  <span className="product-wide-badge">{categoryName}</span>
                  <img
                    src={getProductThumbnail(product)}
                    alt={productName}
                    className="product-wide-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImg;
                    }}
                  />
                </div>
                <div className="product-wide-title-bar">
                  <h4 className="product-wide-title">{productName}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section className="services" id="product">
      <span id="services"></span>
      <div className="container services-container" ref={sectionRef}>
        {/* Tiêu đề chính của mục Sản phẩm */}
        <div className="services-top-bar reveal">
          <div className="services-title-group">
            <h2 className="section-title services-main-title">
              <span className="text-yellow">Sản phẩm</span> tiêu biểu
            </h2>
            <p className="services-subtitle">
              Thiết kế, chế tạo tủ bảng điện công nghiệp, thang máng cáp và vỏ tủ điện theo tiêu chuẩn TCVN &amp; IEC 61439.
            </p>
          </div>

          {onNavigateProducts && (
            <button
              type="button"
              className="btn-primary services-view-all-btn"
              onClick={() => onNavigateProducts('all')}
            >
              <span>Xem tất cả sản phẩm</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          )}
        </div>

        {/* ==================== HÀNG 1: TỦ ĐIỆN ==================== */}
        {renderProductRow({
          title: 'TỦ ĐIỆN',
          categoryId: 'e03442e0-789d-46f9-a334-5a5f1cc02642',
          products: row1List,
          currentIndex: safeRow1Index,
          maxIndex: maxRow1Index,
          isAnimating: row1Animating,
          onSlide: triggerRow1Slide,
          touchRef: row1TouchX,
          fallbackImg: FALLBACK_IMAGE,
          defaultBadge: 'Tủ điện',
          delayClass: 'delay-1'
        })}

        {/* ==================== HÀNG 2: THANG MÁNG CÁP VÀ VỎ TỦ ==================== */}
        {renderProductRow({
          title: 'THANG MÁNG CÁP VÀ VỎ TỦ',
          categoryId: '09048929-2ca1-48fb-a727-6fc6c259a0a7',
          products: row2List,
          currentIndex: safeRow2Index,
          maxIndex: maxRow2Index,
          isAnimating: row2Animating,
          onSlide: triggerRow2Slide,
          touchRef: row2TouchX,
          fallbackImg: '/images/products/thang-mang-cap-dien.png',
          defaultBadge: 'Thang máng cáp & Vỏ tủ',
          delayClass: 'delay-2'
        })}
      </div>
    </section>
  );
};

export default Services;
