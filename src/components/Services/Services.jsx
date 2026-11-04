import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import './Services.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getProducts, MOCK_PRODUCTS } from '../../services/productService';

const CARD_WIDTH = 280;
const CARD_GAP = 24;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const PEEK_OFFSET = CARD_WIDTH / 2;

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80';

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

const getMaxIndex = (viewportWidth, totalItems) => {
  if (!totalItems || totalItems <= 0) return 0;
  const totalCards = totalItems + 2;
  const totalGaps = Math.max(0, totalCards - 1);
  const trackWidth = totalCards * CARD_WIDTH + totalGaps * CARD_GAP;
  const maxOffset = trackWidth - PEEK_OFFSET - viewportWidth;
  const maxIndex = Math.floor((maxOffset - PEEK_OFFSET) / CARD_STEP);
  return Math.max(0, maxIndex);
};

const Services = ({ onNavigateProducts, onSelectProduct }) => {
  const viewportRef = useRef(null);
  const [products, setProducts] = useState(() => MOCK_PRODUCTS.slice(0, 10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [, setLoading] = useState(false);
  const headerRef = useScrollReveal();

  // Móc API get products từ https://nguyen-phat-admin.onrender.com/
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getProducts({ limit: 50 })
      .then((res) => {
        if (isMounted && res?.products && res.products.length > 0) {
          setProducts(res.products);
        }
      })
      .catch((err) => {
        console.warn('Lỗi gọi API get products cho slider:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateMaxIndex = () => {
      const nextMaxIndex = getMaxIndex(viewport.clientWidth, products.length);
      setMaxIndex(nextMaxIndex);
      setCurrentIndex((index) => Math.min(index, nextMaxIndex));
    };

    updateMaxIndex();

    const resizeObserver = new ResizeObserver(updateMaxIndex);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, [products.length]);

  const handlePrev = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const handleNext = () => {
    setCurrentIndex((index) => Math.min(maxIndex, index + 1));
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

  const trackOffset = PEEK_OFFSET + currentIndex * CARD_STEP;
  const peekLeftProduct = products.length > 0 ? products[products.length - 1] : null;
  const peekRightProduct = products.length > 0 ? products[0] : null;

  return (
    <section className="services" id="product">
      <span id="services"></span>
      <div className="container">
        <div className="services-header" ref={headerRef}>
          <h2 className="section-title reveal delay-1">
            <span className="text-yellow">Sản phẩm</span> tiêu biểu
          </h2>
          <p className="services-subtitle reveal delay-3">
            Sản xuất và phân phối các loại tủ bảng điện công nghiệp, thang máng cáp và thiết bị đóng cắt chất lượng cao, đạt chuẩn quốc tế IEC 61439.
          </p>
        </div>
      </div>

      <div className="services-slider">
        <button
          type="button"
          className="services-slider-btn services-slider-btn-prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Sản phẩm trước"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="services-slider-viewport" ref={viewportRef}>
          <div
            className="services-slider-track"
            style={{ transform: `translateX(-${trackOffset}px)` }}
          >
            {peekLeftProduct && (
              <div 
                className="service-card card-offset service-card-peek"
                onClick={handlePrev}
              >
                <div className="service-image-wrap">
                  <img 
                    src={getProductThumbnail(peekLeftProduct)} 
                    alt={decodeMojibake(peekLeftProduct.name)} 
                    className="service-image" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="service-image-overlay" />
                </div>
                <div className="service-title-container">
                  <h4 className="service-title">{decodeMojibake(peekLeftProduct.name)}</h4>
                </div>
              </div>
            )}

            {products.map((product, index) => {
              const productName = decodeMojibake(product.name);
              const categoryName = decodeMojibake(product.category_name) || 'Tủ điện';
              const isOffset = index % 2 !== 0;

              return (
                <div
                  key={product.id || index}
                  className={`service-card ${isOffset ? 'card-offset' : ''} service-card-clickable`}
                  onClick={() => handleCardClick(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(product);
                    }
                  }}
                  title={`Xem chi tiết: ${productName}`}
                >
                  <div className="service-image-wrap">
                    <img
                      src={getProductThumbnail(product)}
                      alt={productName}
                      className="service-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="service-image-overlay" />
                    <span className="service-category-tag">
                      {categoryName}
                    </span>
                  </div>

                  <div className="service-title-container">
                    {product.code && (
                      <span className="service-card-code">{product.code}</span>
                    )}
                    <h4 className="service-title">{productName}</h4>
                    <div className="service-card-action">
                      <span>Xem chi tiết</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}

            {peekRightProduct && (
              <div 
                className="service-card service-card-peek"
                onClick={handleNext}
              >
                <div className="service-image-wrap">
                  <img 
                    src={getProductThumbnail(peekRightProduct)} 
                    alt={decodeMojibake(peekRightProduct.name)} 
                    className="service-image" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="service-image-overlay" />
                </div>
                <div className="service-title-container">
                  <h4 className="service-title">{decodeMojibake(peekRightProduct.name)}</h4>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="services-slider-btn services-slider-btn-next"
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          aria-label="Sản phẩm tiếp theo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {onNavigateProducts && (
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={onNavigateProducts}
            style={{ 
              padding: '14px 36px', 
              fontSize: '0.95rem', 
              fontWeight: 600,
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px',
              borderRadius: 'var(--border-radius-lg)',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 8px 20px rgba(255, 184, 0, 0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <span>Xem tất cả sản phẩm</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default Services;
