import React, { useEffect, useMemo, useState } from 'react';
import './ProductList.css';
import { getProducts } from '../../services/productService';

const ProductList = ({ onNavigateHome }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({ isLive: false, message: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Cấu hình token nếu muốn kết nối trực tiếp với backend yêu cầu Bearer auth
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [customToken, setCustomToken] = useState(localStorage.getItem('np_admin_token') || '');

  const loadData = async (cat = null, token = null) => {
    setLoading(true);
    const result = await getProducts(cat === 'all' ? null : cat, token);
    setProducts(result.products || []);
    setApiStatus({
      isLive: result.isLive,
      message: result.message
    });
    setLoading(false);
  };

  useEffect(() => {
    loadData(selectedCategory, customToken);
  }, [selectedCategory]);

  const handleSaveToken = (e) => {
    e.preventDefault();
    localStorage.setItem('np_admin_token', customToken);
    loadData(selectedCategory, customToken);
  };

  // Trích xuất danh mục động từ danh sách sản phẩm
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category_name) set.add(p.category_name);
    });
    return ['all', ...Array.from(set)];
  }, [products]);

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          p.category_name === selectedCategory ||
          p.category_id === selectedCategory;

        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term)) ||
          (p.category_name && p.category_name.toLowerCase().includes(term));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
        if (sortBy === 'name-asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'name-desc') {
          return (b.name || '').localeCompare(a.name || '');
        }
        return 0;
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  const openDetail = (product) => {
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

  return (
    <div className="product-page">
      {/* Top Navigation Bar */}
      <header className="product-nav-bar">
        <div className="container product-nav-container">
          <div className="product-nav-left">
            <div 
              className="logo" 
              style={{ cursor: 'pointer' }}
              onClick={onNavigateHome}
              title="Về trang chủ"
            >
              <span className="logo-text">C<span className="text-yellow">&amp;</span>A</span>
            </div>

            <button 
              type="button" 
              className="back-home-btn"
              onClick={onNavigateHome}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Trang Chủ
            </button>
          </div>

          <div className="product-nav-actions">
            <button 
              type="button" 
              className="btn-primary"
              onClick={onNavigateHome}
            >
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="product-hero">
        <div className="container">
          <div className="product-hero-inner">
            <span className="product-badge">Nguyên Phát Portfolio &amp; Products</span>
            <h1 className="product-hero-title">
              Giải Pháp &amp; <span className="text-yellow">Sản Phẩm</span> Tiêu Biểu
            </h1>
            <p className="product-hero-desc">
              Hệ thống kết cấu thép tiền chế, panel cách nhiệt, giải pháp sàn công nghiệp và trang thiết bị phụ trợ xây dựng đạt tiêu chuẩn kiểm định quốc tế.
            </p>

            <div className="product-stats">
              <div className="product-stat-item">
                <span className="stat-number">500<span>+</span></span>
                <span className="stat-label">Công trình thực hiện</span>
              </div>
              <div className="product-stat-item">
                <span className="stat-number">100<span>%</span></span>
                <span className="stat-label">Kiểm định ASTM / ISO</span>
              </div>
              <div className="product-stat-item">
                <span className="stat-number">50<span>+</span></span>
                <span className="stat-label">Năm tuổi thọ kết cấu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="container products-grid-section">
        {/* API Info & Token Bar */}
        <div className={`api-status-banner ${apiStatus.isLive ? 'is-live' : ''}`}>
          <div className="api-status-left">
            <span className="api-status-dot"></span>
            <span>
              <strong>Nguồn dữ liệu:</strong>{' '}
              <span className="api-endpoint-tag">/api/v1/products/</span> – {apiStatus.message}
            </span>
          </div>
          <button 
            type="button" 
            className="api-toggle-btn"
            onClick={() => setShowTokenInput(!showTokenInput)}
          >
            {showTokenInput ? 'Đóng cấu hình' : 'Cấu hình Token'}
          </button>
        </div>

        {showTokenInput && (
          <form className="api-token-form" onSubmit={handleSaveToken}>
            <input 
              type="text" 
              className="api-token-input"
              placeholder="Dán Bearer Access Token vào đây nếu có tài khoản Admin..."
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>
              Đồng bộ API
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ padding: '8px 16px' }}
              onClick={() => {
                setCustomToken('');
                localStorage.removeItem('np_admin_token');
                loadData(selectedCategory, '');
              }}
            >
              Đặt lại
            </button>
          </form>
        )}

        {/* Search & Filters */}
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
                placeholder="Tìm kiếm theo tên sản phẩm, mã, danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Mới cập nhật</option>
                <option value="name-asc">Tên: A - Z</option>
                <option value="name-desc">Tên: Z - A</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Tất cả danh mục' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Counter Header */}
        <div className="products-grid-header">
          <span className="products-count">
            Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
            {searchTerm && ` cho từ khóa "${searchTerm}"`}
          </span>
        </div>

        {/* Loading / Grid / Empty */}
        {loading ? (
          <div className="product-empty">
            <p className="product-empty-desc">Đang đồng bộ dữ liệu từ API Nguyên Phát...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="product-empty">
            <div className="product-empty-icon">🔍</div>
            <h3 className="product-empty-title">Không tìm thấy sản phẩm nào</h3>
            <p className="product-empty-desc">Vui lòng thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article key={product.id || product.slug} className="product-card">
                <div 
                  className="product-card-thumb-wrap"
                  onClick={() => openDetail(product)}
                >
                  <span className="product-card-badge">
                    {product.category_name || 'Sản phẩm'}
                  </span>
                  <img 
                    src={product.thumbnail || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop'} 
                    alt={product.name} 
                    className="product-card-thumb"
                    loading="lazy"
                  />
                </div>

                <div className="product-card-body">
                  <h3 
                    className="product-card-title"
                    onClick={() => openDetail(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="product-card-desc">{product.description}</p>

                  <div className="product-card-footer">
                    <button 
                      type="button" 
                      className="btn-card-detail"
                      onClick={() => openDetail(product)}
                    >
                      Chi tiết
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <button 
                      type="button" 
                      className="btn-card-quote"
                      onClick={onNavigateHome}
                    >
                      Báo giá
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal Quick View */}
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
              {/* Gallery column */}
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

              {/* Info column */}
              <div className="modal-info">
                <span className="modal-category">
                  {selectedProduct.category_name || 'Nguyên Phát'}
                </span>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <p className="modal-desc">{selectedProduct.description}</p>

                <div className="modal-meta">
                  <div><strong>Mã nhận diện (Slug):</strong> {selectedProduct.slug || selectedProduct.id}</div>
                  <div><strong>Thời gian đăng ký:</strong> {selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleDateString('vi-VN') : 'Đang cập nhật'}</div>
                  <div><strong>Trạng thái kiểm định:</strong> Đạt tiêu chuẩn kỹ thuật xây dựng</div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      closeDetail();
                      onNavigateHome();
                    }}
                  >
                    Yêu cầu tư vấn &amp; Báo giá
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
