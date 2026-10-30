import React, { useEffect, useMemo, useState } from 'react';
import './ProductList.css';
import { getProducts } from '../../services/productService';

const ITEMS_PER_PAGE = 6;

const ProductList = ({ onNavigateHome, onSelectProduct, initialCategory = 'all' }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');

  useEffect(() => {
    setSelectedCategory(initialCategory || 'all');
    setCurrentPageNum(1);
  }, [initialCategory]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Load toàn bộ sản phẩm 1 lần duy nhất khi mount
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setLoading(true);
      const result = await getProducts(null);
      if (isMounted) {
        setAllProducts(result.products || []);
        setLoading(false);
      }
    };
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Trích xuất danh mục động từ danh sách sản phẩm
  const categories = useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) => {
      if (p.category_name) set.add(p.category_name);
    });
    return ['all', ...Array.from(set)];
  }, [allProducts]);

  // Lọc và sắp xếp sản phẩm tức thì (in-memory) không load lại trang
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return allProducts
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' ||
          p.category_name === selectedCategory ||
          p.category_id === selectedCategory;

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
  }, [allProducts, selectedCategory, searchTerm, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPageNum - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPageNum]);

  // Chọn danh mục: đổi ngay lập tức, không reload, reset về trang 1
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

  return (
    <div className="product-page">
      {/* Tiêu đề ngắn gọn duy nhất: Product */}
      <div className="product-page-title-wrap">
        <div className="container">
          <h1 className="section-title"><span className="text-yellow">Product</span></h1>
        </div>
      </div>

      {/* Main Container */}
      <main className="container products-grid-section">
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
                placeholder="Tìm kiếm theo tên sản phẩm, danh mục..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Mới cập nhật</option>
                <option value="name-asc">Tên: A - Z</option>
                <option value="name-desc">Tên: Z - A</option>
              </select>
            </div>
          </div>

          {/* Category Pills - thay đổi tức thì, không reload */}
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleSelectCategory(cat)}
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
            {totalPages > 1 && ` (Trang ${currentPageNum}/${totalPages})`}
            {searchTerm && ` cho từ khóa "${searchTerm}"`}
          </span>
        </div>

        {/* Loading / Grid / Empty */}
        {loading ? (
          <div className="product-empty">
            <p className="product-empty-desc">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="product-empty">
            <div className="product-empty-icon">🔍</div>
            <h3 className="product-empty-title">Không tìm thấy sản phẩm nào</h3>
            <p className="product-empty-desc">Vui lòng thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {paginatedProducts.map((product) => (
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

            {/* Phân trang */}
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
                  <div><strong>Trạng thái:</strong> Tiêu chuẩn kiểm định xây dựng</div>
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
