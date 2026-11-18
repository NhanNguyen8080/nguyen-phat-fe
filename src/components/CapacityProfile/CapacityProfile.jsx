import React, { useState, useEffect } from 'react';
import './CapacityProfile.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const TOTAL_PAGES = 28;

const CERTIFICATES = [
  {
    id: 1,
    title: 'Giấy Chứng Nhận Đăng Ký Doanh Nghiệp (Mặt 1)',
    code: 'MSDN: 0307380016',
    image: '/images/certificates/cert-gpkd-1.jpg'
  },
  {
    id: 2,
    title: 'Giấy Chứng Nhận Đăng Ký Doanh Nghiệp (Mặt 2)',
    code: 'Sở KH&ĐT TP.HCM',
    image: '/images/certificates/cert-gpkd-2.jpg'
  },
  {
    id: 3,
    title: 'Hồ Sơ Pháp Lý & Định Danh Doanh Nghiệp',
    code: 'Chuẩn TCVN & IEC',
    image: '/images/certificates/cert-ho-so-phap-ly.jpg'
  },
  {
    id: 4,
    title: 'Chứng Nhận Năng Lực Sản Xuất & Cam Kết Chất Lượng',
    code: 'ISO 9001 / IEC 61439',
    image: '/images/certificates/cert-cam-ket-chat-luong.jpg'
  }
];

const CapacityProfile = ({ onNavigateCapacity }) => {
  const sectionRef = useScrollReveal({ threshold: 0.08 });
  const [spreadIndex, setSpreadIndex] = useState(0); // 0 => Trang 1 & 2
  const [activeCertIndex, setActiveCertIndex] = useState(null);

  const maxSpread = Math.ceil(TOTAL_PAGES / 2) - 1;
  const leftPage = spreadIndex * 2 + 1;
  const rightPage = Math.min(TOTAL_PAGES, leftPage + 1);

  // Khóa cuộn trang và hỗ trợ phím mũi tên / Escape khi đang mở ảnh Giấy chứng nhận Full màn hình
  useEffect(() => {
    if (activeCertIndex === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCertIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveCertIndex((prev) => (prev + 1) % CERTIFICATES.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveCertIndex((prev) => (prev - 1 + CERTIFICATES.length) % CERTIFICATES.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCertIndex]);

  const handlePrevSpread = (e) => {
    e.stopPropagation();
    setSpreadIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSpread = (e) => {
    e.stopPropagation();
    setSpreadIndex((prev) => Math.min(maxSpread, prev + 1));
  };

  const activeCert = activeCertIndex !== null ? CERTIFICATES[activeCertIndex] : null;

  return (
    <section className="capacity-section" id="capacity">
      <div className="container">
        <div className="capacity-wrapper" ref={sectionRef}>
          {/* Tiêu đề mục Hồ sơ năng lực */}
          <div className="capacity-header reveal">
            <h2 className="section-title">
              <span className="text-yellow">Hồ sơ</span> năng lực
            </h2>
            <p className="capacity-subtitle">
              Chứng nhận pháp lý, tiêu chuẩn quản lý chất lượng và ấn phẩm Catalogue Hồ Sơ Năng Lực chính thức của Cơ Điện Nguyên Phát.
            </p>
          </div>

          {/* Lưới chia đôi 50% Trái (4 tấm hình Giấy chứng nhận: 2 trên 2 dưới) | 50% Phải (Cuốn Catalogue) */}
          <div className="capacity-split-grid">
            {/* ==================== BÊN TRÁI (50%): 4 TẤM HÌNH GIẤY CHỨNG NHẬN (2 TRÊN 2 DƯỚI) ==================== */}
            <div className="capacity-certs-col reveal-left delay-1">
              <div className="capacity-col-heading">
                <span className="col-heading-dot" />
                <h3>GIẤY CHỨNG NHẬN &amp; HỒ SƠ PHÁP LÝ</h3>
                <span className="col-heading-note">(Bấm vào hình để phóng to toàn màn hình)</span>
              </div>

              <div className="capacity-certs-grid">
                {CERTIFICATES.map((cert, index) => (
                  <div
                    key={cert.id}
                    className="cert-card"
                    onClick={() => setActiveCertIndex(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveCertIndex(index);
                      }
                    }}
                    title={`Bấm để phóng to: ${cert.title}`}
                  >
                    <div className="cert-img-frame">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="cert-img"
                        loading="lazy"
                      />
                      <div className="cert-zoom-overlay">
                        <span className="cert-zoom-btn">🔍 Phóng to toàn màn hình</span>
                      </div>
                    </div>
                    <div className="cert-caption">
                      <span className="cert-title">{cert.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================== BÊN PHẢI (50%): CUỐN CATALOGUE HỒ SƠ NĂNG LỰC ==================== */}
            <div className="capacity-catalog-col reveal-right delay-2">
              <div className="capacity-col-heading">
                <span className="col-heading-dot" />
                <h3>CATALOGUE HỒ SƠ NĂNG LỰC NGUYÊN PHÁT</h3>
                <span className="col-heading-note">(Bấm vào cuốn Catalogue để mở xem)</span>
              </div>

              <div className="capacity-book-stage">
                <div
                  className="capacity-book-spread"
                  onClick={() => onNavigateCapacity && onNavigateCapacity(leftPage)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNavigateCapacity && onNavigateCapacity(leftPage);
                    }
                  }}
                  title="Bấm để mở trình đọc Hồ sơ năng lực toàn màn hình (28 trang)"
                >
                  <div className="capacity-page capacity-page-left">
                    <img
                      src={`/catalog/pages/${leftPage}.jpg`}
                      alt={`Hồ sơ năng lực trang ${leftPage}`}
                      loading="lazy"
                    />
                    <span className="page-number-badge left">Trang {leftPage}</span>
                  </div>

                  <div className="capacity-book-spine" />

                  <div className="capacity-page capacity-page-right">
                    <img
                      src={`/catalog/pages/${rightPage}.jpg`}
                      alt={`Hồ sơ năng lực trang ${rightPage}`}
                      loading="lazy"
                    />
                    <span className="page-number-badge right">Trang {rightPage}</span>
                  </div>

                  <div className="capacity-book-hover-hint">
                    <span>📖 Bấm để mở xem Catalogue (28 Trang)</span>
                  </div>
                </div>

                <div className="capacity-book-controls">
                  <button
                    type="button"
                    className="book-ctrl-btn"
                    onClick={handlePrevSpread}
                    disabled={spreadIndex === 0}
                    aria-label="Trang trước"
                  >
                    ‹ Trang trước
                  </button>

                  <div className="book-ctrl-center-actions">
                    <button
                      type="button"
                      className="btn-primary book-open-full-btn"
                      onClick={() => onNavigateCapacity && onNavigateCapacity(leftPage)}
                    >
                      📖 Xem Toàn Màn Hình ({leftPage}–{rightPage}/{TOTAL_PAGES})
                    </button>
                    <a
                      href="/catalog/ho-so-nang-luc-nguyen-phat.pdf"
                      download="Ho-So-Nang-Luc-Co-Dien-Nguyen-Phat.pdf"
                      className="btn-secondary book-download-pdf-btn"
                    >
                      ⬇ Tải PDF
                    </a>
                  </div>

                  <button
                    type="button"
                    className="book-ctrl-btn"
                    onClick={handleNextSpread}
                    disabled={spreadIndex === maxSpread}
                    aria-label="Trang tiếp theo"
                  >
                    Trang sau ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== LIGHTBOX PHÓNG TO GIẤY CHỨNG NHẬN FULL MÀN HÌNH ==================== */}
      {activeCert && (
        <div
          className="cert-lightbox-backdrop"
          onClick={() => setActiveCertIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeCert.title}
        >
          <div className="cert-lightbox-header" onClick={(e) => e.stopPropagation()}>
            <div className="cert-lightbox-info">
              <span className="cert-lightbox-count">
                Giấy chứng nhận {activeCertIndex + 1} / {CERTIFICATES.length}
              </span>
              <h4>{activeCert.title}</h4>
            </div>
            <button
              type="button"
              className="cert-lightbox-close"
              onClick={() => setActiveCertIndex(null)}
              aria-label="Đóng"
            >
              ✕ Đóng
            </button>
          </div>

          <button
            type="button"
            className="cert-lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              setActiveCertIndex((prev) => (prev - 1 + CERTIFICATES.length) % CERTIFICATES.length);
            }}
            aria-label="Giấy chứng nhận trước"
          >
            ‹
          </button>

          <div className="cert-lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeCert.image}
              alt={activeCert.title}
              className="cert-lightbox-img"
            />
          </div>

          <button
            type="button"
            className="cert-lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              setActiveCertIndex((prev) => (prev + 1) % CERTIFICATES.length);
            }}
            aria-label="Giấy chứng nhận tiếp theo"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
};

export default CapacityProfile;
