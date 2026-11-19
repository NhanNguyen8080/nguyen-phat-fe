import React, { useState, useEffect } from 'react';
import './Services.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { getProducts } from '../../services/productService';

const FALLBACK_IMAGE = '/images/products/tu-msb-3200a.png';

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
  const [row1Page, setRow1Page] = useState(0);
  const [row2Page, setRow2Page] = useState(0);
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

  // Phân tách sản phẩm trực tiếp từ API thành 2 hàng (không tự chèn thêm sản phẩm mẫu):
  // Hàng 1: TỦ ĐIỆN & THIẾT BỊ
  const row1List = allProducts.filter((p) => !isCableOrEnclosureProduct(p));

  // Hàng 2: THANG MÁNG CÁP VÀ VỎ TỦ
  const row2List = allProducts.filter((p) => isCableOrEnclosureProduct(p));

  const ITEMS_PER_ROW = 3;
  const maxRow1Page = Math.max(0, Math.ceil(row1List.length / ITEMS_PER_ROW) - 1);
  const maxRow2Page = Math.max(0, Math.ceil(row2List.length / ITEMS_PER_ROW) - 1);

  const visibleRow1 = row1List.slice(row1Page * ITEMS_PER_ROW, row1Page * ITEMS_PER_ROW + ITEMS_PER_ROW);
  const visibleRow2 = row2List.slice(row2Page * ITEMS_PER_ROW, row2Page * ITEMS_PER_ROW + ITEMS_PER_ROW);

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
        <div className="product-row-block reveal delay-1">
          <div className="product-row-header">
            <div className="product-row-heading-center">
              <h3
                className="product-row-title"
                onClick={() => onNavigateProducts && onNavigateProducts('e03442e0-789d-46f9-a334-5a5f1cc02642')}
                title="Xem danh mục Tủ điện"
              >
                TỦ ĐIỆN &amp; THIẾT BỊ
              </h3>
              <div className="product-row-ornament">
                <span className="ornament-line" />
                <span className="ornament-diamond" />
                <span className="ornament-line" />
              </div>
            </div>

            {maxRow1Page > 0 && (
              <div className="product-row-nav">
                <button
                  type="button"
                  className="row-nav-btn"
                  onClick={() => setRow1Page((p) => Math.max(0, p - 1))}
                  disabled={row1Page === 0}
                  aria-label="Hàng 1 trang trước"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="row-nav-btn"
                  onClick={() => setRow1Page((p) => Math.min(maxRow1Page, p + 1))}
                  disabled={row1Page >= maxRow1Page}
                  aria-label="Hàng 1 trang tiếp"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          <div className="product-wide-grid">
            {visibleRow1.map((product, index) => {
              const productName = decodeMojibake(product.name);
              const categoryName = decodeMojibake(product.category_name) || 'Tủ điện';

              return (
                <div
                  key={product.id || index}
                  className="product-wide-card"
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
                        e.target.src = FALLBACK_IMAGE;
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

        {/* ==================== HÀNG 2: THANG MÁNG CÁP VÀ VỎ TỦ ==================== */}
        <div className="product-row-block reveal delay-2">
          <div className="product-row-header">
            <div className="product-row-heading-center">
              <h3
                className="product-row-title"
                onClick={() => onNavigateProducts && onNavigateProducts('09048929-2ca1-48fb-a727-6fc6c259a0a7')}
                title="Xem danh mục Thang máng cáp & Vỏ tủ"
              >
                THANG MÁNG CÁP VÀ VỎ TỦ
              </h3>
              <div className="product-row-ornament">
                <span className="ornament-line" />
                <span className="ornament-diamond" />
                <span className="ornament-line" />
              </div>
            </div>

            {maxRow2Page > 0 && (
              <div className="product-row-nav">
                <button
                  type="button"
                  className="row-nav-btn"
                  onClick={() => setRow2Page((p) => Math.max(0, p - 1))}
                  disabled={row2Page === 0}
                  aria-label="Hàng 2 trang trước"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="row-nav-btn"
                  onClick={() => setRow2Page((p) => Math.min(maxRow2Page, p + 1))}
                  disabled={row2Page >= maxRow2Page}
                  aria-label="Hàng 2 trang tiếp"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          <div className="product-wide-grid">
            {visibleRow2.map((product, index) => {
              const productName = decodeMojibake(product.name);
              const categoryName = decodeMojibake(product.category_name) || 'Thang máng cáp & Vỏ tủ';

              return (
                <div
                  key={product.id || index}
                  className="product-wide-card"
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
                        e.target.src = '/images/products/thang-mang-cap-dien.png';
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
    </section>
  );
};

export default Services;
