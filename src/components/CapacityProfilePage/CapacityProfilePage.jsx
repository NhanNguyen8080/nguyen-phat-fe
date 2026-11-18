import React, { useState, useEffect } from 'react';
import './CapacityProfilePage.css';

const TOTAL_PAGES = 28;

const CHAPTERS = [
  { label: 'Bìa & Giới thiệu', page: 1 },
  { label: 'Thư ngỏ & Pháp lý', page: 3 },
  { label: 'Sơ đồ tổ chức', page: 5 },
  { label: 'Năng lực máy móc', page: 9 },
  { label: 'Sản phẩm Tủ điện', page: 13 },
  { label: 'Thang máng cáp', page: 17 },
  { label: 'Dự án tiêu biểu', page: 21 },
  { label: 'Đối tác & Liên hệ', page: 27 }
];

const CapacityProfilePage = ({ initialPage = 1, onNavigateHome }) => {
  const [currentPage, setCurrentPage] = useState(() => {
    const p = Number(initialPage) || 1;
    return Math.min(TOTAL_PAGES, Math.max(1, p));
  });
  const [viewMode, setViewMode] = useState(() => (typeof window !== 'undefined' && window.innerWidth > 900 ? 'spread' : 'single'));
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const p = Number(initialPage) || 1;
    setCurrentPage(Math.min(TOTAL_PAGES, Math.max(1, p)));
  }, [initialPage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const leftPage = viewMode === 'spread' ? (currentPage % 2 === 0 ? currentPage - 1 : currentPage) : currentPage;
  const rightPage = viewMode === 'spread' ? Math.min(TOTAL_PAGES, leftPage + 1) : currentPage;

  const handlePrev = () => {
    const step = viewMode === 'spread' ? 2 : 1;
    setCurrentPage((prev) => Math.max(1, prev - step));
  };

  const handleNext = () => {
    const step = viewMode === 'spread' ? 2 : 1;
    setCurrentPage((prev) => Math.min(TOTAL_PAGES, prev + step));
  };

  return (
    <div className="cp-page">
      <div className="container">
        {/* Breadcrumb & Header */}
        <div className="cp-topbar">
          <div className="cp-breadcrumb">
            <button type="button" className="cp-back-link" onClick={() => onNavigateHome && onNavigateHome('#home')}>
              ← Trang chủ
            </button>
            <span className="cp-sep">/</span>
            <span className="cp-current">Hồ sơ năng lực (Nguyen Phat Profile)</span>
          </div>

          <div className="cp-top-actions">
            <div className="cp-view-toggle">
              <button
                type="button"
                className={`cp-toggle-btn ${viewMode === 'spread' ? 'active' : ''}`}
                onClick={() => setViewMode('spread')}
              >
                📖 2 Trang đôi
              </button>
              <button
                type="button"
                className={`cp-toggle-btn ${viewMode === 'single' ? 'active' : ''}`}
                onClick={() => setViewMode('single')}
              >
                📄 1 Trang đơn
              </button>
            </div>

            <div className="cp-zoom-controls">
              <button
                type="button"
                className="cp-icon-btn"
                onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.15).toFixed(2))))}
                title="Thu nhỏ"
              >
                −
              </button>
              <span className="cp-zoom-val">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                className="cp-icon-btn"
                onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
                title="Phóng to"
              >
                +
              </button>
            </div>

            <a
              href="/catalog/ho-so-nang-luc-nguyen-phat.pdf"
              download="Ho-So-Nang-Luc-Co-Dien-Nguyen-Phat.pdf"
              className="btn-primary cp-download-btn"
            >
              ⬇ Tải PDF (28 Trang)
            </a>
          </div>
        </div>

        <div className="cp-title-banner">
          <h1>
            Hồ Sơ Năng Lực <span className="text-yellow">Cơ Điện Nguyên Phát</span>
          </h1>
          <p>
            Ấn phẩm giới thiệu năng lực sản xuất tủ bảng điện, thang máng cáp, trang thiết bị cơ khí và các dự án công trình trọng điểm.
          </p>
        </div>

        {/* Quick Chapter Pills */}
        <div className="cp-chapters-bar">
          {CHAPTERS.map((ch, idx) => {
            const isActive = currentPage >= ch.page && (idx === CHAPTERS.length - 1 || currentPage < CHAPTERS[idx + 1].page);
            return (
              <button
                key={idx}
                type="button"
                className={`cp-chapter-pill ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentPage(ch.page)}
              >
                {ch.label}
              </button>
            );
          })}
        </div>

        {/* Main Flipbook Stage */}
        <div className="cp-reader-stage">
          <button
            type="button"
            className="cp-nav-arrow prev"
            onClick={handlePrev}
            disabled={leftPage <= 1}
            aria-label="Trang trước"
          >
            ‹
          </button>

          <div
            className={`cp-book-canvas ${viewMode === 'spread' ? 'is-spread' : 'is-single'}`}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <div className="cp-sheet">
              <img
                src={`/catalog/pages/${leftPage}.jpg`}
                alt={`Trang ${leftPage}`}
                className="cp-sheet-img"
              />
              <span className="cp-sheet-num left">Trang {leftPage} / {TOTAL_PAGES}</span>
            </div>

            {viewMode === 'spread' && rightPage !== leftPage && (
              <>
                <div className="cp-center-fold" />
                <div className="cp-sheet">
                  <img
                    src={`/catalog/pages/${rightPage}.jpg`}
                    alt={`Trang ${rightPage}`}
                    className="cp-sheet-img"
                  />
                  <span className="cp-sheet-num right">Trang {rightPage} / {TOTAL_PAGES}</span>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="cp-nav-arrow next"
            onClick={handleNext}
            disabled={rightPage >= TOTAL_PAGES}
            aria-label="Trang tiếp theo"
          >
            ›
          </button>
        </div>

        {/* Page Thumbnails Strip */}
        <div className="cp-thumbs-section">
          <div className="cp-thumbs-header">
            <span>Danh sách toàn bộ 28 trang (Bấm vào trang bất kỳ để chuyển nhanh):</span>
            <strong>
              Đang xem: Trang {viewMode === 'spread' ? `${leftPage}–${rightPage}` : leftPage} / {TOTAL_PAGES}
            </strong>
          </div>
          <div className="cp-thumbs-strip">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((pageNum) => {
              const isSelected = pageNum === leftPage || (viewMode === 'spread' && pageNum === rightPage);
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`cp-thumb-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  <img
                    src={`/catalog/pages/${pageNum}.jpg`}
                    alt={`Thumb trang ${pageNum}`}
                    loading="lazy"
                  />
                  <span className="cp-thumb-num">{pageNum}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacityProfilePage;
