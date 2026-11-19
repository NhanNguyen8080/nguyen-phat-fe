import React, { useState, useEffect } from 'react';
import './Footer.css';



const LOCATIONS = {
  office: {
    id: 'office',
    label: 'Văn Phòng Đại Diện',
    badge: 'Trụ sở chính',
    address: 'F4/8L Ấp 6, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP. Hồ Chí Minh',
    embedUrl: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1zRjQvOEwg4bqkcCA2LCBYw6MgVsSpbmggTOG7mWMgQSwgSHV54buHbiBCw6xuaCBDaMOhbmgsIFRQLiBI4buTIENow60gTWluaA!6i15',
    searchUrl: 'https://www.google.com/maps/search/?api=1&query=F4%2F8L+%E1%BA%A4p+6%2C+X%C3%A3+V%C4%A9nh+L%E1%BB%99c+A%2C+Huy%E1%BB%87n+B%C3%ACnh+Ch%C3%A1nh%2C+TP.+H%E1%BB%93+Ch%C3%AD+Minh'
  },
  factory: {
    id: 'factory',
    label: 'Xưởng Sản Xuất',
    badge: 'Nhà máy',
    address: 'F5/4 đường Liên Ấp 26, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP. Hồ Chí Minh',
    embedUrl: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1zRjUvNCBMacOqbiDhuqRwIDI2LCBWxKluaCBM4buZYyBBLCBCw6xuaCBDaMOhbmgsIFRQLiBI4buTIENow60gTWluaA!6i15',
    searchUrl: 'https://www.google.com/maps/search/?api=1&query=F5%2F4+%C4%91%C6%B0%E1%BB%9Dng+Li%C3%AAn+%E1%BA%A4p+26%2C+X%C3%A3+V%C4%A9nh+L%E1%BB%99c+A%2C+Huy%E1%BB%87n+B%C3%ACnh+Ch%C3%A1nh%2C+TP.+H%E1%BB%93+Ch%C3%AD+Minh'
  },
  blueprint: {
    id: 'blueprint',
    label: 'Sơ Đồ Gốc (Lưu Trữ)',
    badge: 'diennguyenphat.com',
    address: 'Sơ đồ định vị xưởng & văn phòng cào từ website cũ của Nguyên Phát',
    imageUrl: '/images/footer/map-footer.jpg',
    searchUrl: 'https://www.google.com/maps/search/?api=1&query=F4%2F8L+%E1%BA%A4p+6%2C+X%C3%A3+V%C4%A9nh+L%E1%BB%99c+A%2C+Huy%E1%BB%87n+B%C3%ACnh+Ch%C3%A1nh%2C+TP.+H%E1%BB%93+Ch%C3%AD+Minh'
  }
};

const Footer = ({
  onNavigateHome,
  onNavigateAbout,
  onNavigateProducts,
  onNavigateProjects,
  onNavigateCapacity
}) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [activeMapTab, setActiveMapTab] = useState('office');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showMapModal) {
        setShowMapModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMapModal]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e, callback, hash) => {
    e.preventDefault();
    if (callback) {
      callback();
    } else if (onNavigateHome) {
      onNavigateHome(hash || '#home');
    }
  };

  const handleOpenCatalog = (e) => {
    e.preventDefault();
    if (onNavigateCapacity) {
      onNavigateCapacity(1);
    } else {
      window.location.hash = '#/capacity-profile';
    }
  };

  const currentLoc = LOCATIONS[activeMapTab] || LOCATIONS.office;

  return (
    <>
      <footer className="site-footer" id="footer">
        {/* ===================== MAIN FOOTER ===================== */}
        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">
              {/* Column 1: Company Profile */}
              <div className="footer-col footer-col-company">
                <div
                  className="footer-logo"
                  onClick={(e) => handleLinkClick(e, onNavigateHome, '#home')}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src="/images/logo.png"
                    alt="Logo Cơ Điện Nguyên Phát"
                    className="footer-logo-img"
                    width="38"
                    height="38"
                  />
                  <span className="logo-text">
                    Nguyên <span className="text-yellow">Phát</span>
                  </span>
                </div>

                <h4 className="company-fullname">
                  CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI CƠ ĐIỆN NGUYÊN PHÁT
                </h4>

                <p className="company-desc">
                  Chuyên tư vấn thiết kế, sản xuất và thi công lắp đặt hệ thống tủ bảng điện công nghiệp (MSB, ATS, tủ bù công suất, tủ bơm biến tần...), thang máng cáp và các giải pháp tự động hóa M&amp;E chất lượng cao.
                </p>

                <div className="company-highlights">
                  <div className="highlight-pill">
                    <span className="highlight-check">✓</span>
                    <span>Chuẩn IEC 61439</span>
                  </div>
                  <div className="highlight-pill">
                    <span className="highlight-check">✓</span>
                    <span>Quy Trình ISO 9001</span>
                  </div>
                  <div className="highlight-pill">
                    <span className="highlight-check">✓</span>
                    <span>Bảo Hành Tận Nơi 24/7</span>
                  </div>
                </div>

                <div className="footer-social-links">
                  <a
                    href="https://zalo.me/0903625628"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn zalo-btn"
                    title="Liên hệ qua Zalo: 0903 625 628"
                  >
                    <span className="social-text">Zalo Chat</span>
                  </a>
                  <a
                    href="tel:0903625628"
                    className="social-btn call-btn"
                    title="Gọi Hotline: 0903 625 628"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                    <span>Gọi Ngay</span>
                  </a>
                  <a
                    href="mailto:codiennguyenphat@gmail.com"
                    className="social-btn mail-btn"
                    title="Gửi Email tới codiennguyenphat@gmail.com"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Column 2: Contact & Addresses */}
              <div className="footer-col footer-col-contact">
                <h4 className="footer-col-title">
                  Thông Tin <span className="text-yellow">Trụ Sở &amp; Xưởng</span>
                </h4>

                <ul className="footer-contact-list">
                  <li className="footer-contact-item">
                    <div className="contact-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M10 11h2M10 15h2M14 11h2M14 15h2M18 11h2M18 15h2M9 3l3-2 3 2v4H9z" />
                      </svg>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-label">Văn phòng đại diện:</span>
                      <p className="contact-val">
                        F4/8L Ấp 6, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </li>

                  <li className="footer-contact-item">
                    <div className="contact-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-6h6v6" />
                      </svg>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-label">Xưởng sản xuất:</span>
                      <p className="contact-val">
                        F5/4 đường Liên Ấp 26, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </li>

                  <li className="footer-contact-item">
                    <div className="contact-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-label">Hotline tư vấn 24/7:</span>
                      <p className="contact-val">
                        <a href="tel:0903625628" className="contact-link highlight-phone">0903 625 628</a>
                        <span className="sep"> - </span>
                        <a href="tel:0903625629" className="contact-link highlight-phone">0903 625 629</a>
                      </p>
                    </div>
                  </li>

                  <li className="footer-contact-item">
                    <div className="contact-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-label">Điện thoại cố định / Fax:</span>
                      <p className="contact-val">
                        <span>Tel: </span>
                        <a href="tel:02837655395" className="contact-link">(028) 3765 5395</a>
                        <span className="sep"> | </span>
                        <span>Fax: </span>
                        <span className="contact-plain">(028) 3765 5385</span>
                      </p>
                    </div>
                  </li>

                  <li className="footer-contact-item">
                    <div className="contact-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className="contact-detail">
                      <span className="contact-label">Email &amp; Website chính thức:</span>
                      <p className="contact-val">
                        <a href="mailto:codiennguyenphat@gmail.com" className="contact-link">
                          codiennguyenphat@gmail.com
                        </a>
                        <br />
                        <a href="https://diennguyenphat.com" target="_blank" rel="noopener noreferrer" className="contact-link">
                          diennguyenphat.com
                        </a>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Column 3: Quick Navigation */}
              <div className="footer-col footer-col-links">
                <h4 className="footer-col-title">
                  Liên Kết <span className="text-yellow">Nhanh</span>
                </h4>

                <ul className="footer-nav-list">
                  <li>
                    <a href="#home" onClick={(e) => handleLinkClick(e, onNavigateHome, '#home')}>
                      <span className="nav-bullet">›</span> Trang chủ
                    </a>
                  </li>
                  <li>
                    <a href="#about" onClick={(e) => handleLinkClick(e, onNavigateAbout)}>
                      <span className="nav-bullet">›</span> Giới thiệu về Nguyên Phát
                    </a>
                  </li>
                  <li>
                    <a href="#products" onClick={(e) => handleLinkClick(e, onNavigateProducts)}>
                      <span className="nav-bullet">›</span> Danh mục sản phẩm tủ điện
                    </a>
                  </li>
                  <li>
                    <a href="#projects" onClick={(e) => handleLinkClick(e, onNavigateProjects)}>
                      <span className="nav-bullet">›</span> Dự án &amp; Công trình thực tế
                    </a>
                  </li>
                  <li>
                    <a href="#capacity" onClick={(e) => handleLinkClick(e, onNavigateCapacity)}>
                      <span className="nav-bullet">›</span> Hồ sơ năng lực (Profile &amp; Catalog)
                    </a>
                  </li>
                  <li>
                    <a href="#contact" onClick={(e) => handleLinkClick(e, null, '#contact')}>
                      <span className="nav-bullet">›</span> Liên hệ &amp; Nhận báo giá
                    </a>
                  </li>
                </ul>

                <div className="footer-working-hours">
                  <h5 className="working-hours-title">Thời Gian Làm Việc</h5>
                  <p className="working-hours-text">Thứ Hai - Thứ Bảy: <strong>08:00 - 17:30</strong></p>
                  <p className="working-hours-text">Chủ Nhật: <strong>Nghỉ (Hỗ trợ Hotline 24/7)</strong></p>
                </div>
              </div>

              {/* Column 4: Map & Location */}
              <div className="footer-col footer-col-map">
                <h4 className="footer-col-title">
                  Vị Trí <span className="text-yellow">Nhà Xưởng &amp; Bản Đồ</span>
                </h4>

                <p className="map-intro-text">
                  Vị trí thuận tiện tại Bình Chánh kết nối nhanh các trục giao thông trọng điểm TP.HCM và các tỉnh lân cận.
                </p>

                <div className="footer-map-card">
                  <div
                    className="map-thumbnail-wrap"
                    onClick={() => {
                      setActiveMapTab('office');
                      setShowMapModal(true);
                    }}
                    title="Bấm để xem bản đồ chỉ đường chi tiết"
                  >
                    <img
                      src="/images/footer/map-footer.jpg"
                      alt="Bản đồ vị trí Cơ điện Nguyên Phát"
                      className="map-thumbnail"
                      loading="lazy"
                      decoding="async"
                      width="320"
                      height="180"
                    />
                    <div className="map-overlay">
                      <span className="map-overlay-icon">📍</span>
                      <span className="map-overlay-text">Bấm mở bản đồ vị trí</span>
                    </div>
                  </div>

                  <div className="map-actions">
                    <button
                      type="button"
                      className="btn-map-action btn-map-view"
                      onClick={() => {
                        setActiveMapTab('office');
                        setShowMapModal(true);
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                      <span>Xem Bản Đồ</span>
                    </button>

                    <a
                      href={LOCATIONS.office.searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-map-action btn-map-direct"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                      </svg>
                      <span>Chỉ Đường</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== FOOTER BOTTOM ===================== */}
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-inner">
              <div className="copyright-text">
                © 2016 - 2026 <strong>CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI CƠ ĐIỆN NGUYÊN PHÁT</strong>. All rights reserved.
              </div>

              <div className="footer-stats-wrap">
                <div className="stat-item" title="Tổng lượt truy cập hệ thống">
                  <span className="stat-label">Lượt truy cập:</span>
                  <div className="stat-counter-digits">
                    <span className="digit">3</span>
                    <span className="digit">6</span>
                    <span className="digit">8</span>
                    <span className="digit">3</span>
                    <span className="digit">7</span>
                    <span className="digit">5</span>
                  </div>
                </div>

                <div className="stat-item online-stat" title="Số lượng người dùng đang truy cập trực tuyến">
                  <span className="online-indicator"></span>
                  <span className="stat-label">Online:</span>
                  <strong className="online-count">3</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================== MAP MODAL ===================== */}
      {showMapModal && (
        <div className="footer-modal-backdrop" onClick={() => setShowMapModal(false)}>
          <div className="footer-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="footer-modal-header">
              <div className="modal-title-wrap">
                <span className="modal-title-icon">📍</span>
                <div>
                  <h4 className="footer-modal-title">Bản Đồ Vị Trí Cơ Điện Nguyên Phát</h4>
                  <p className="footer-modal-subtitle">{currentLoc.address}</p>
                </div>
              </div>
              <button
                type="button"
                className="footer-modal-close"
                onClick={() => setShowMapModal(false)}
                aria-label="Đóng bản đồ"
              >
                ✕
              </button>
            </div>

            <div className="footer-modal-tabs">
              <button
                type="button"
                className={`modal-tab-btn ${activeMapTab === 'office' ? 'active' : ''}`}
                onClick={() => setActiveMapTab('office')}
              >
                🏢 Văn Phòng Đại Diện
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${activeMapTab === 'factory' ? 'active' : ''}`}
                onClick={() => setActiveMapTab('factory')}
              >
                🏭 Xưởng Sản Xuất
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${activeMapTab === 'blueprint' ? 'active' : ''}`}
                onClick={() => setActiveMapTab('blueprint')}
              >
                🗺️ Sơ Đồ Gốc (Lưu Trữ)
              </button>
            </div>

            <div className="footer-modal-body">
              {activeMapTab === 'blueprint' ? (
                <div className="modal-blueprint-wrap">
                  <img
                    src={LOCATIONS.blueprint.imageUrl}
                    alt="Sơ đồ vị trí Nguyên Phát gốc"
                    className="modal-blueprint-img"
                  />
                  <div className="blueprint-caption">
                    <span>Sơ đồ chỉ dẫn đường đến xưởng và văn phòng Cơ điện Nguyên Phát tại Bình Chánh.</span>
                  </div>
                </div>
              ) : (
                <iframe
                  key={currentLoc.id}
                  title={`Bản đồ ${currentLoc.label}`}
                  src={currentLoc.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              )}
            </div>

            <div className="footer-modal-footer">
              <span className="modal-note">
                Hotline hỗ trợ chỉ đường: <strong>0903 625 628</strong>
              </span>
              <div className="modal-actions">
                <a
                  href={currentLoc.searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary modal-action-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ marginRight: 6 }}>
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                  Mở Google Maps Chỉ Đường
                </a>
                <button
                  type="button"
                  className="btn-secondary modal-close-btn"
                  onClick={() => setShowMapModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== FLOATING QUICK CONTACT BAR ===================== */}
      <div className="floating-contact-bar">
        {/* 1. Bong bóng Catalog đặt trên đầu — bấm là vào luôn */}
        <a
          href="#/capacity-profile"
          onClick={handleOpenCatalog}
          className="floating-btn floating-catalog"
          title="Xem Hồ Sơ Năng Lực & Catalog Nguyên Phát"
          aria-label="Xem Hồ Sơ Năng Lực & Catalog"
        >
          <span className="catalog-pulse-ring"></span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span className="floating-tooltip">Catalog / Hồ Sơ Năng Lực</span>
        </a>

        {/* 2. Bong bóng Facebook */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-facebook"
          title="Facebook Cơ Điện Nguyên Phát"
          aria-label="Facebook"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
          </svg>
          <span className="floating-tooltip">Facebook</span>
        </a>

        {/* 3. Bong bóng YouTube */}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-youtube"
          title="YouTube Cơ Điện Nguyên Phát"
          aria-label="YouTube"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.51 2.51 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z" />
          </svg>
          <span className="floating-tooltip">YouTube</span>
        </a>

        {/* 4. Bong bóng TikTok */}
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-tiktok"
          title="TikTok Cơ Điện Nguyên Phát"
          aria-label="TikTok"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
          <span className="floating-tooltip">TikTok</span>
        </a>

        {/* 5. Bong bóng Zalo */}
        <a
          href="https://zalo.me/0903625628"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-zalo"
          title="Chat Zalo cùng Nguyên Phát (0903 625 628)"
        >
          <img
            src="/images/footer/zalo-icon.png"
            alt="Zalo"
            className="floating-zalo-img"
            loading="lazy"
            decoding="async"
            width="32"
            height="32"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.zalo-text-icon')) {
                const s = document.createElement('span');
                s.className = 'zalo-text-icon';
                s.textContent = 'Zalo';
                parent.appendChild(s);
              }
            }}
          />
          <span className="floating-tooltip">Chat Zalo</span>
        </a>

        {/* 6. Bong bóng Hotline */}
        <a
          href="tel:0903625628"
          className="floating-btn floating-hotline"
          title="Gọi Hotline hỗ trợ: 0903 625 628"
        >
          <div className="hotline-pulse-wave"></div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span className="floating-tooltip">0903 625 628</span>
        </a>

        {/* 7. Nút cuộn lên đầu trang */}
        {showScrollTop && (
          <button
            type="button"
            className="floating-btn floating-scroll-top"
            onClick={scrollToTop}
            title="Cuộn lên đầu trang"
            aria-label="Cuộn lên đầu trang"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default Footer;
