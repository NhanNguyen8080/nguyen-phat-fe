import React, { useState, useEffect, useRef, useCallback } from 'react';
import St from 'page-flip';
import './CapacityProfilePage.css';

const PageFlip = St?.PageFlip || St;

const TOTAL_PAGES = 28;

const CHAPTERS = [
  { id: 1, title: 'Bìa & Giới Thiệu Chung', page: 1, desc: 'Ấn phẩm Hồ sơ năng lực & Thư ngỏ Ban Giám Đốc' },
  { id: 2, title: 'Hồ Sơ Pháp Lý & Giấy ĐKKD', page: 3, desc: 'Giấy chứng nhận ĐKKD, MSDN: 0307380016' },
  { id: 3, title: 'Sơ Đồ Cơ Cấu & Nhân Sự', page: 5, desc: 'Sơ đồ tổ chức phòng ban & Năng lực kỹ sư MEP' },
  { id: 4, title: 'Cơ Sở Vật Chất & Máy CNC', page: 9, desc: 'Hệ thống xưởng gia công, máy cắt đột chấn CNC' },
  { id: 5, title: 'Sản Phẩm Tủ Điện Công Nghiệp', page: 13, desc: 'Tủ MSB, ATS, DB, VCB, Tụ bù đạt chuẩn IEC 61439' },
  { id: 6, title: 'Thang Máng Cáp & Phụ Kiện', page: 17, desc: 'Thang máng cáp sơn tĩnh điện, mạ kẽm nhúng nóng' },
  { id: 7, title: 'Dự Án Công Trình Tiêu Biểu', page: 21, desc: 'Hệ thống dự án công nghiệp, nhà máy & cao ốc' },
  { id: 8, title: 'Khách Hàng & Đối Tác Chiến Lược', page: 27, desc: 'Đối tác thiết bị Schneider, LS, ABB & Liên hệ' }
];

// Trình phát âm thanh lật giấy siêu nhẹ bằng Web Audio API (mô phỏng tiếng xột xoạt giấy khi người lật chậm rãi)
const playPaperFlipSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const duration = 0.42;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      const env = Math.sin(t * Math.PI) * Math.exp(-t * 2.0);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(820, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.1, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {
    // Trình duyệt chặn audio tự động
  }
};

const PAGE_IMAGES = Array.from(
  { length: TOTAL_PAGES },
  (_, i) => `/catalog/pages/${i + 1}.jpg`
);

const CapacityProfilePage = ({ initialPage = 1, onNavigateHome }) => {
  // Trang hiện tại (1-indexed: 1 đến 28)
  const [currentPage, setCurrentPage] = useState(() => {
    const p = Number(initialPage) || 1;
    return Math.min(TOTAL_PAGES, Math.max(1, p));
  });

  // Hướng hiển thị ('landscape' - 2 trang đôi hoặc 'portrait' - 1 trang đơn)
  const [orientation, setOrientation] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth > 860 ? 'landscape' : 'portrait'
  );

  // Giao diện: 'dark' (Phòng đọc Studio đêm cao cấp) hoặc 'light' (Phòng đọc sáng)
  const [theme, setTheme] = useState('dark');

  // Mức phóng to
  const [zoom, setZoom] = useState(1);

  // Âm thanh lật sách
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Tự động lật sách (Auto-play slideshow)
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Toàn màn hình
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Trạng thái đang lật trang (flip animation in progress)
  const [isFlipping, setIsFlipping] = useState(false);

  // Hướng lật: 'next' (tiến) hoặc 'prev' (lùi) để đồng bộ hiệu ứng mở/đóng sách
  const [flipDirection, setFlipDirection] = useState('next');

  // Mở Drawer Mục lục (TOC)
  const [showToc, setShowToc] = useState(false);

  const containerRef = useRef(null);
  const bookMountRef = useRef(null);
  const pageFlipRef = useRef(null);

  // Khởi tạo FlipBuilder-style HTML5 Canvas PageFlip engine
  useEffect(() => {
    if (!bookMountRef.current) return;

    // Tạo phần tử con wrapper để PageFlip mount vào an toàn
    const bookWrapper = document.createElement('div');
    bookWrapper.className = 'cp-flipbook-root';
    bookMountRef.current.appendChild(bookWrapper);

    let pageFlipInstance = null;

    try {
      pageFlipInstance = new PageFlip(bookWrapper, {
        width: 550,
        height: 785,
        size: 'stretch',
        minWidth: 260,
        maxWidth: 680,
        minHeight: 370,
        maxHeight: 980,
        maxShadowOpacity: 0.6,
        showCover: true,
        mobileScrollSupport: false,
        useMouseEvents: true,
        showPageCorners: true,
        flippingTime: 650, // Chuẩn FlipBuilder
        startPage: Math.max(0, Math.min(TOTAL_PAGES - 1, currentPage - 1)),
      });

      pageFlipInstance.loadFromImages(PAGE_IMAGES);
      pageFlipRef.current = pageFlipInstance;

      // Khi trang lật hoàn tất
      pageFlipInstance.on('flip', (e) => {
        const pageIndex = Number(e.data);
        setCurrentPage(pageIndex + 1);
        if (soundEnabled) {
          playPaperFlipSound();
        }
      });

      // Lắng nghe trạng thái lật trang để tự động đồng bộ hiệu ứng mở/đóng sách 3D
      pageFlipInstance.on('changeState', (e) => {
        const st = String(e.data || '');
        const isTurning = st === 'flipping' || st === 'user_fold';
        setIsFlipping(isTurning);
        if (isTurning) {
          try {
            const dir = pageFlipInstance.getFlipController()?.getCalculation()?.getDirection();
            setFlipDirection(dir === 1 ? 'prev' : 'next');
          } catch {
            // fallback
          }
        }
      });

      // Khi hướng trang thay đổi
      pageFlipInstance.on('changeOrientation', (e) => {
        setOrientation(e.data);
      });
    } catch (err) {
      console.error('Lỗi khởi tạo PageFlip:', err);
    }

    return () => {
      if (pageFlipInstance) {
        try {
          pageFlipInstance.destroy();
        } catch {
          // ignore
        }
        pageFlipRef.current = null;
      }
      if (bookWrapper.parentNode) {
        bookWrapper.parentNode.removeChild(bookWrapper);
      }
    };
  }, []);

  // Lắng nghe sự kiện Fullscreen thay đổi
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Điều hướng trang
  const handleNext = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext('bottom');
    }
  }, []);

  const handlePrev = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev('bottom');
    }
  }, []);

  const handleGoToPage = useCallback((pageNumber) => {
    const page = Math.max(1, Math.min(TOTAL_PAGES, Number(pageNumber) || 1));
    if (pageFlipRef.current) {
      pageFlipRef.current.flip(page - 1, 'bottom');
    }
  }, []);

  // Tự động lật (Auto-play slideshow)
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      if (pageFlipRef.current) {
        if (currentPage >= TOTAL_PAGES) {
          setIsAutoPlay(false);
        } else {
          pageFlipRef.current.flipNext('bottom');
        }
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, currentPage]);

  // Phím tắt bàn phím
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleGoToPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        handleGoToPage(TOTAL_PAGES);
      } else if (e.key === 'Escape') {
        if (showToc) setShowToc(false);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleGoToPage, showToc]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Nhãn hiển thị số trang đang xem
  const getPageLabel = () => {
    if (orientation === 'portrait') {
      return `${currentPage} / ${TOTAL_PAGES}`;
    }
    if (currentPage === 1) {
      return `1 / ${TOTAL_PAGES} (Bìa trước)`;
    }
    if (currentPage === TOTAL_PAGES) {
      return `${TOTAL_PAGES} / ${TOTAL_PAGES} (Bìa sau)`;
    }
    const left = currentPage % 2 === 0 ? currentPage : currentPage - 1;
    const right = Math.min(TOTAL_PAGES, left + 1);
    return `${left} - ${right} / ${TOTAL_PAGES}`;
  };

  // Các trạng thái mở / đóng bìa sách:
  const isClosedFront = orientation === 'landscape' && !isFlipping && currentPage === 1;
  const isClosedBack = orientation === 'landscape' && !isFlipping && currentPage === TOTAL_PAGES;
  const isClosingToFront = orientation === 'landscape' && isFlipping && flipDirection === 'prev' && currentPage <= 2;
  const isClosingToBack = orientation === 'landscape' && isFlipping && flipDirection === 'next' && currentPage >= TOTAL_PAGES - 1;

  // Phân loại chế độ hiển thị khung sách:
  // - Khi chưa lật ở trang bìa: chỉ hiển thị 1 trang duy nhất, căn giữa như 1 cuốn sách thật kèm gáy sách 3D
  // - Khi lật hoặc các trang ruột: mở rộng thành 2 trang đôi trải rộng (Spread)
  const getStageClass = () => {
    if (orientation === 'portrait') {
      return 'is-portrait';
    }
    if (isClosedFront || isClosingToFront) {
      return `is-landscape is-closed-front ${isClosingToFront ? 'is-animating-close' : ''}`;
    }
    if (isClosedBack || isClosingToBack) {
      return `is-landscape is-closed-back ${isClosingToBack ? 'is-animating-close' : ''}`;
    }
    return 'is-landscape is-open-spread';
  };

  return (
    <div
      ref={containerRef}
      className={`cp-viewer-app cp-theme-${theme} ${isFullscreen ? 'is-fullscreen' : ''}`}
    >
      {/* ==============================================================
          1. HEADER BAR: Breadcrumb, Tên tài liệu & Nút điều khiển nhanh
          ============================================================== */}
      <header className="cp-header-bar">
        <div className="cp-header-left">
          <button
            type="button"
            className="cp-home-back-btn"
            onClick={() => onNavigateHome && onNavigateHome('#home')}
            title="Quay lại Trang Chủ"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="cp-back-text">Trang chủ</span>
          </button>
          <span className="cp-header-sep">/</span>
          <div className="cp-doc-heading">
            <h1 className="cp-doc-title">Hồ Sơ Năng Lực Cơ Điện Nguyên Phát</h1>
            <span className="cp-doc-badge">28 Trang</span>
          </div>
        </div>

        {/* Thanh điều hướng trang ở Header trung tâm */}
        <div className="cp-header-center-nav">
          <button
            type="button"
            className="cp-head-nav-btn"
            onClick={() => handleGoToPage(1)}
            disabled={currentPage <= 1}
            title="Trang đầu (Home)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          </button>

          <button
            type="button"
            className="cp-head-nav-btn"
            onClick={handlePrev}
            disabled={currentPage <= 1}
            title="Trang trước (Mũi tên trái)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="cp-head-page-box">
            <span className="cp-head-page-lbl">Trang</span>
            <input
              type="number"
              min="1"
              max={TOTAL_PAGES}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= TOTAL_PAGES) {
                  handleGoToPage(val);
                }
              }}
              aria-label="Nhập số trang để nhảy đến"
            />
            <span className="cp-head-page-total">/ {TOTAL_PAGES}</span>
            <span className="cp-head-spread-badge">({getPageLabel()})</span>
          </div>

          <button
            type="button"
            className="cp-head-nav-btn"
            onClick={handleNext}
            disabled={currentPage >= TOTAL_PAGES}
            title="Trang sau (Mũi tên phải)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <button
            type="button"
            className="cp-head-nav-btn"
            onClick={() => handleGoToPage(TOTAL_PAGES)}
            disabled={currentPage >= TOTAL_PAGES}
            title="Trang cuối (End)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          </button>
        </div>

        <div className="cp-header-right">
          {/* Tự động lật (Slideshow Auto Play) */}
          <button
            type="button"
            className={`cp-tool-btn cp-autoplay-tool-btn ${isAutoPlay ? 'active' : ''}`}
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            title={isAutoPlay ? 'Dừng tự động lật' : 'Tự động lật trang (Trình chiếu)'}
          >
            {isAutoPlay ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                <span>Dừng</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Tự lật</span>
              </>
            )}
          </button>

          {/* Cụm Zoom In / Reset / Zoom Out */}
          <div className="cp-header-zoom-group">
            <button
              type="button"
              className="cp-zoom-btn"
              onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
              title="Thu nhỏ (-)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button
              type="button"
              className="cp-zoom-percent"
              onClick={() => setZoom(1)}
              title="Đặt lại kích thước gốc 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              className="cp-zoom-btn"
              onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))))}
              title="Phóng to (+)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          {/* Nút Mục Lục (TOC) */}
          <button
            type="button"
            className={`cp-tool-btn ${showToc ? 'active' : ''}`}
            onClick={() => setShowToc(!showToc)}
            title="Mục lục các chương"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span>Mục lục</span>
          </button>

          {/* Bật / Tắt Âm thanh lật sách */}
          <button
            type="button"
            className={`cp-tool-btn ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Tắt âm thanh lật sách' : 'Bật âm thanh lật sách'}
          >
            {soundEnabled ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            )}
          </button>

          {/* Đổi Theme: Đêm / Ngày */}
          <button
            type="button"
            className="cp-tool-btn cp-theme-toggle-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối showroom'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Nút Toàn màn hình */}
          <button
            type="button"
            className="cp-tool-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng toàn màn hình'}
          >
            {isFullscreen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="4 14 10 14 10 20"></polyline>
                <polyline points="20 10 14 10 14 4"></polyline>
                <line x1="14" y1="10" x2="21" y2="3"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            )}
          </button>

          {/* Tải PDF */}
          <a
            href="/catalog/ho-so-nang-luc-nguyen-phat.pdf"
            download="Ho-So-Nang-Luc-Co-Dien-Nguyen-Phat.pdf"
            className="cp-download-action-btn"
            title="Tải tệp PDF chất lượng cao"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span className="cp-download-text">Tải PDF</span>
          </a>
        </div>
      </header>

      {/* ==============================================================
          2. SÂN KHẤU LẬT SÁCH TOÀN MÀN HÌNH (HTML5 Canvas PageFlip Stage)
          ============================================================== */}
      <main className="cp-main-stage">
        {/* Nút Lật Trang Trước (Mũi tên trái) */}
        <button
          type="button"
          className="cp-side-arrow prev"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          aria-label="Lật trang trước"
          title="Lật trang trước (hoặc kéo mép góc trang sách)"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Khung sách PageFlip HTML5 Canvas với bóng đổ và góc gấp trang 3D */}
        <div
          className={`cp-book-stage-inner ${getStageClass()}`}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          onClick={() => {
            if (isClosedFront) handleNext();
          }}
          title={isClosedFront ? 'Nhấp để mở sách' : undefined}
        >
          <div ref={bookMountRef} className="cp-flipbook-mount" />

          {/* Badge chỉ dẫn mở sách khi sách đang đóng bìa trước */}
          {isClosedFront && (
            <div
              className="cp-cover-action-badge"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              title="Nhấp để mở sách"
            >
              <span className="cp-badge-dot" />
              <span>Nhấp để mở sách</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          )}
        </div>

        {/* Nút Lật Trang Tiếp Theo (Mũi tên phải) */}
        <button
          type="button"
          className="cp-side-arrow next"
          onClick={handleNext}
          disabled={currentPage >= TOTAL_PAGES}
          aria-label="Lật trang tiếp theo"
          title="Lật trang sau (hoặc kéo mép góc trang sách)"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </main>

      {/* ==============================================================
          6. MODAL / DRAWER MỤC LỤC CHI TIẾT (TOC Sidebar Modal)
          ============================================================== */}
      {showToc && (
        <div className="cp-toc-backdrop" onClick={() => setShowToc(false)}>
          <aside className="cp-toc-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cp-toc-header">
              <div className="cp-toc-title-wrap">
                <span className="cp-toc-dot" />
                <h2>Mục Lục Hồ Sơ Năng Lực</h2>
              </div>
              <button
                type="button"
                className="cp-toc-close-btn"
                onClick={() => setShowToc(false)}
                aria-label="Đóng mục lục"
              >
                ✕
              </button>
            </div>

            <p className="cp-toc-desc">
              Ấn bản tổng hợp 28 trang giới thiệu năng lực sản xuất, quy mô nhà xưởng máy móc CNC và các dự án cơ điện trọng điểm của Cơ Điện Nguyên Phát.
            </p>

            <div className="cp-toc-list">
              {CHAPTERS.map((ch) => {
                const isActive =
                  currentPage >= ch.page &&
                  (ch.id === CHAPTERS.length || currentPage < CHAPTERS[ch.id]?.page);
                return (
                  <div
                    key={ch.id}
                    className={`cp-toc-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      handleGoToPage(ch.page);
                      setShowToc(false);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="cp-toc-thumb-preview">
                      <img src={`/catalog/pages/${ch.page}.jpg`} alt={ch.title} />
                      <span className="cp-toc-page-tag">Trang {ch.page}</span>
                    </div>
                    <div className="cp-toc-info">
                      <div className="cp-toc-item-top">
                        <span className="cp-toc-item-num">Chương 0{ch.id}</span>
                        {isActive && <span className="cp-toc-active-label">Đang xem</span>}
                      </div>
                      <h3 className="cp-toc-item-title">{ch.title}</h3>
                      <p className="cp-toc-item-desc">{ch.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CapacityProfilePage;
