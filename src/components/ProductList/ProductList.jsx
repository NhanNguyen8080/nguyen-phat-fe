import React, { useEffect, useMemo, useState } from 'react';
import './ProductList.css';
import { getProducts, getCategories } from '../../services/productService';

const ITEMS_PER_PAGE = 6;

const ProductList = ({ onNavigateHome: _onNavigateHome, onSelectProduct, initialCategory = 'all' }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setSelectedCategory(initialCategory || 'all');
    setCurrentPageNum(1);
  }, [initialCategory]);

  // Load danh sách sản phẩm & danh mục cha từ API (có fallback sang Mock Layer)
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      if (isMounted) {
        setAllProducts(prodRes.products || []);
        setIsLiveApi(Boolean(prodRes.isLive));
        setParentCategories(catRes || []);
        setLoading(false);
      }
    };
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Danh mục: Chỉ giữ 1 phân cấp cha, lọc bỏ tất cả phân cấp con, phân cấp cha bỏ mục hình ảnh thiết bị
  const categoryPills = useMemo(() => {
    const list = [{ id: 'all', name: 'Tất cả danh mục' }];
    parentCategories.forEach((cat) => {
      if (!list.some((item) => item.name === cat.name)) {
        list.push({
          id: cat.id || cat.slug || cat.name,
          name: cat.name,
          slug: cat.slug
        });
      }
    });
    return list;
  }, [parentCategories]);

  // Thống kê số lượng sản phẩm thuộc từng danh mục cha
  const categoryCounts = useMemo(() => {
    const counts = { all: allProducts.length };
    allProducts.forEach((p) => {
      if (p.category_name) {
        counts[p.category_name] = (counts[p.category_name] || 0) + 1;
      }
    });
    return counts;
  }, [allProducts]);

  // Lọc và sắp xếp sản phẩm tức thì theo đúng các trường kỹ thuật của 2 API
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return allProducts
      .filter((p) => {
        // Lọc danh mục cha (đã quy chuẩn hoá 1 cấp duy nhất)
        const matchesCategory =
          selectedCategory === 'all' ||
          p.category_name === selectedCategory ||
          p.category_id === selectedCategory;

        // Tìm kiếm theo tên, mã code, danh mục, tiêu chuẩn, thương hiệu
        const matchesSearch =
          !term ||
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.code && p.code.toLowerCase().includes(term)) ||
          (p.brand && p.brand.toLowerCase().includes(term)) ||
          (p.standards && p.standards.toLowerCase().includes(term)) ||
          (p.category_name && p.category_name.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'code-asc') {
          return (a.code || '').localeCompare(b.code || '');
        }
        if (sortBy === 'name-asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'name-desc') {
          return (b.name || '').localeCompare(a.name || '');
        }
        // Mặc định: Mới nhất
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
  }, [allProducts, selectedCategory, searchTerm, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPageNum - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPageNum]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentPageNum(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPageNum(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPageNum(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPageNum(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDetail = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
      return;
    }
    setSelectedProduct(product);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeDetail = () => {
    setSelectedProduct(null);
    document.body.style.overflow = '';
  };

  const galleryImages = useMemo(() => {
    if (!selectedProduct) return [];
    const list = [];
    if (selectedProduct.thumbnail) list.push(selectedProduct.thumbnail);
    if (Array.isArray(selectedProduct.images)) {
      selectedProduct.images.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [selectedProduct]);

  // Strip HTML tags for card description preview
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  return (
    <div className="product-page">
      {/* Tiêu đề trang & Huy hiệu hệ thống */}
      <div className="product-page-title-wrap">
        <div className="container">
          <div className="product-header-badge-row">
            <span className="product-brand-tag">Cơ Điện Nguyên Phát</span>
            {isLiveApi ? (
              <span className="api-status-pill live">
                <span className="status-dot green"></span>
                Dữ liệu trực tiếp (Live API)
              </span>
            ) : (
              <span className="api-status-pill mock">
                <span className="status-dot yellow"></span>
                Dữ liệu mô phỏng (Mock API)
              </span>
            )}
          </div>
          <h1 className="section-title">
            Danh Mục <span className="text-yellow">Sản Phẩm &amp; Thiết Bị</span>
          </h1>
          <p className="product-page-subtitle">
            Hệ thống tủ điện công nghiệp, tủ phân phối MSB, tủ điều khiển và thiết bị cơ điện chế tạo theo tiêu chuẩn quốc tế IEC 61439-1/2 &amp; TCVN.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <main className="container products-grid-section">
        {/* Search, Filter & Controls */}
        <div className="product-controls">
          <div className="product-search-row">
            <div className="search-box-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                className="product-search-input"
                placeholder="Tìm kiếm theo mã tủ (code), tên sản phẩm, tiêu chuẩn (IEC)..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="product-controls-right">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Mới cập nhật</option>
                <option value="code-asc">Mã sản phẩm: A - Z</option>
                <option value="name-asc">Tên: A - Z</option>
                <option value="name-desc">Tên: Z - A</option>
              </select>
            </div>
          </div>

          {/* Category Pills: 1 phân cấp cha duy nhất, lọc bỏ toàn bộ phân cấp con & bỏ hình ảnh thiết bị */}
          <div className="category-pills">
            {categoryPills.map((cat) => {
              const isSelected =
                (cat.id === 'all' && selectedCategory === 'all') ||
                selectedCategory === cat.name ||
                selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? allProducts.length
                  : categoryCounts[cat.name] || 0;

              return (
                <button
                  key={cat.id || cat.name}
                  type="button"
                  className={`category-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectCategory(cat.id === 'all' ? 'all' : cat.name)}
                >
                  <span>{cat.name}</span>
                  {count > 0 && <span className="cat-pill-count">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter Header */}
        <div className="products-grid-header">
          <span className="products-count">
            Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
            {totalPages > 1 && ` (Trang ${currentPageNum}/${totalPages})`}
            {searchTerm && ` cho từ khóa "${searchTerm}"`}
          </span>
        </div>

        {/* Loading / Grid / Empty State */}
        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="product-card-skeleton">
                <div className="skeleton-thumb"></div>
                <div className="skeleton-body">
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line title"></div>
                  <div className="skeleton-line desc"></div>
                  <div className="skeleton-specs"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="product-empty">
            <h3 className="product-empty-title">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="product-empty-desc">
              Vui lòng thử tìm với từ khóa khác (ví dụ: MSB, ATS, 3200A, IEC...) hoặc đặt lại bộ lọc danh mục.
            </p>
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '16px' }}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {paginatedProducts.map((product) => (
                <article 
                  key={product.id || product.slug} 
                  className="product-card"
                  onClick={() => openDetail(product)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Thumbnail & Badges */}
                  <div className="product-card-thumb-wrap">
                    <div className="product-card-top-badges">
                      <span className="product-card-badge">
                        {product.category_name || 'Tủ điện'}
                      </span>
                    </div>

                    <img 
                      src={product.thumbnail || 'https://diennguyenphat.com/upload/files/baiviet/thuydiensongbung2-w350%5B1%5D.jpg'} 
                      alt={product.name} 
                      className="product-card-thumb"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  </div>

                  {/* Body Content */}
                  <div className="product-card-body">
                    {/* Mã sản phẩm (Code) & Thương hiệu (Brand) */}
                    <div className="product-card-meta-line">
                      {product.code ? (
                        <span className="product-card-code">{product.code}</span>
                      ) : (
                        <span className="product-card-code">NP-STD</span>
                      )}
                      <span className="product-card-brand">{product.brand || 'Nguyên Phát'}</span>
                    </div>

                    {/* Tên sản phẩm */}
                    <h3 
                      className="product-card-title"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Quick Specs Chips: Bỏ icon, hiển thị thông số tinh gọn */}
                    <div className="product-card-specs-row">
                      {product.rated_voltage && (
                        <span className="spec-pill" title="Điện áp định mức">
                          {product.rated_voltage}
                        </span>
                      )}
                      {product.rated_current && (
                        <span className="spec-pill" title="Dòng điện định mức">
                          {product.rated_current}
                        </span>
                      )}
                      {product.ip_rating && (
                        <span className="spec-pill" title="Cấp bảo vệ">
                          {product.ip_rating}
                        </span>
                      )}
                      {product.standards && (
                        <span className="spec-pill" title="Tiêu chuẩn sản xuất">
                          {product.standards.split(',')[0]}
                        </span>
                      )}
                    </div>

                    <p className="product-card-desc">
                      {stripHtml(product.description) || 'Thiết bị cơ điện chất lượng cao sản xuất theo tiêu chuẩn quốc tế IEC.'}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPageNum - 1)}
                  disabled={currentPageNum === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Trước
                </button>

                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`pagination-page-btn ${currentPageNum === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPageNum + 1)}
                  disabled={currentPageNum === totalPages}
                >
                  Sau
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Quick View Modal (nếu người dùng bấm xem nhanh khi không có router chuyển trang) */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="modal-close-btn" 
              onClick={closeDetail}
              aria-label="Đóng popup"
            >
              ✕
            </button>

            <div className="modal-body">
              <div className="modal-gallery">
                <div className="modal-main-image-wrap">
                  <img 
                    src={galleryImages[activeImageIndex] || selectedProduct.thumbnail} 
                    alt={selectedProduct.name} 
                    className="modal-main-image"
                  />
                </div>

                {galleryImages.length > 1 && (
                  <div className="modal-thumbs-row">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`modal-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(idx)}
                      >
                        <img src={img} alt="Thumbnail preview" className="modal-thumb-img" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-info">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="modal-category">
                    {selectedProduct.category_name || 'Cơ Điện'}
                  </span>
                  {selectedProduct.code && (
                    <span className="product-card-code">{selectedProduct.code}</span>
                  )}
                </div>

                <h2 className="modal-title">{selectedProduct.name}</h2>
                <p className="modal-desc">{stripHtml(selectedProduct.description)}</p>

                <div className="modal-meta">
                  {selectedProduct.rated_voltage && (
                    <div><strong>Điện áp định mức:</strong> {selectedProduct.rated_voltage}</div>
                  )}
                  {selectedProduct.rated_current && (
                    <div><strong>Dòng điện định mức:</strong> {selectedProduct.rated_current}</div>
                  )}
                  {selectedProduct.standards && (
                    <div><strong>Tiêu chuẩn sản xuất:</strong> {selectedProduct.standards}</div>
                  )}
                  {selectedProduct.warranty_months && (
                    <div><strong>Bảo hành:</strong> {selectedProduct.warranty_months} tháng chính hãng</div>
                  )}
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      closeDetail();
                      if (onSelectProduct) onSelectProduct(selectedProduct);
                    }}
                  >
                    Xem Toàn Bộ Chi Tiết Kỹ Thuật
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={closeDetail}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
