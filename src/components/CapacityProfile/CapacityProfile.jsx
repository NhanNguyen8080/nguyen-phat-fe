import React, { useState } from 'react';
import './CapacityProfile.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const TOTAL_PAGES = 28;

const PROFILE_HIGHLIGHTS = [
  {
    icon: '🏭',
    title: 'Năng Lực Nhà Máy & Thiết Bị',
    desc: 'Hệ thống máy đột dập CNC, máy chấn, cắt laser và dây chuyền sơn tĩnh điện khép kín.'
  },
  {
    icon: '📜',
    title: 'Hồ Sơ Pháp Lý & Chứng Nhận',
    desc: 'Đạt chuẩn quản lý chất lượng ISO 9001:2015 và tiêu chuẩn tủ bảng điện quốc tế IEC 61439.'
  },
  {
    icon: '⚡',
    title: 'Hệ Sinh Thái Sản Phẩm Chủ Lực',
    desc: 'Tủ điện tổng MSB, ATS, tủ bù công suất, tủ điều khiển MCC, biến tần và thang máng cáp.'
  },
  {
    icon: '🏗️',
    title: 'Dự Án Công Nghiệp Tiêu Biểu',
    desc: 'Hồ sơ nghiệm thu thực tế tại các KCN, nhà máy, tòa nhà cao tầng và trạm biến áp toàn quốc.'
  }
];

const QUICK_SPREADS = [
  { label: 'Bìa & Giới thiệu', leftPage: 1, rightPage: 2 },
  { label: 'Thư ngỏ & Pháp lý', leftPage: 3, rightPage: 4 },
  { label: 'Sơ đồ tổ chức', leftPage: 5, rightPage: 6 },
  { label: 'Năng lực sản xuất', leftPage: 9, rightPage: 10 },
  { label: 'Sản phẩm tủ điện', leftPage: 13, rightPage: 14 },
  { label: 'Công trình tiêu biểu', leftPage: 21, rightPage: 22 }
];

const CapacityProfile = ({ onNavigateCapacity }) => {
  const sectionRef = useScrollReveal({ threshold: 0.08 });
  const [spreadIndex, setSpreadIndex] = useState(0); // 0 => pages 1 & 2, 1 => pages 3 & 4, ...
  const maxSpread = Math.ceil(TOTAL_PAGES / 2) - 1;

  const leftPage = spreadIndex * 2 + 1;
  const rightPage = Math.min(TOTAL_PAGES, leftPage + 1);

  const handlePrevSpread = () => {
    setSpreadIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSpread = () => {
    setSpreadIndex((prev) => Math.min(maxSpread, prev + 1));
  };

  return (
    <section className="capacity-section" id="capacity">
      <div className="container">
        <div className="capacity-wrapper" ref={sectionRef}>
          <div className="capacity-header reveal">
            <span className="capacity-badge">Cơ Điện Nguyên Phát — Profile &amp; Catalog</span>
            <h2 className="section-title">
              <span className="text-yellow">Hồ sơ</span> năng lực
            </h2>
            <p className="capacity-subtitle">
              Khám phá toàn diện quy mô nhà xưởng, năng lực kỹ thuật và danh mục sản phẩm chuẩn quốc tế của Cơ Điện Nguyên Phát qua ấn phẩm Hồ sơ năng lực chính thức (28 trang).
            </p>
          </div>

          <div className="capacity-grid">
            {/* Cột trái: Điểm nhấn năng lực & Hành động */}
            <div className="capacity-info-col reveal-left delay-1">
              <div className="capacity-highlights-list">
                {PROFILE_HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="capacity-highlight-card">
                    <div className="capacity-highlight-icon">{item.icon}</div>
                    <div className="capacity-highlight-body">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="capacity-quick-tabs">
                <span className="quick-tabs-label">Chuyển nhanh mục lục:</span>
                <div className="quick-tabs-pills">
                  {QUICK_SPREADS.map((q, idx) => {
                    const targetSpread = Math.floor((q.leftPage - 1) / 2);
                    const isActive = spreadIndex === targetSpread;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`quick-tab-pill ${isActive ? 'active' : ''}`}
                        onClick={() => setSpreadIndex(targetSpread)}
                      >
                        {q.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="capacity-actions">
                <button
                  type="button"
                  className="btn-primary capacity-btn-main"
                  onClick={() => onNavigateCapacity && onNavigateCapacity(leftPage)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <span>Đọc Toàn Màn Hình (28 Trang)</span>
                </button>

                <a
                  href="/catalog/ho-so-nang-luc-nguyen-phat.pdf"
                  download="Ho-So-Nang-Luc-Co-Dien-Nguyen-Phat.pdf"
                  className="btn-secondary capacity-btn-download"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Tải PDF Hồ Sơ</span>
                </a>
              </div>
            </div>

            {/* Cột phải: Trình lật trang trực tiếp trên trang chủ */}
            <div className="capacity-preview-col reveal-right delay-2">
              <div className="capacity-book-stage">
                <div
                  className="capacity-book-spread"
                  onClick={() => onNavigateCapacity && onNavigateCapacity(leftPage)}
                  title="Bấm để mở trình đọc Hồ sơ năng lực toàn màn hình"
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
                    <span>🔍 Bấm để phóng to &amp; lật trang</span>
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

                  <span className="book-ctrl-status">
                    Trang <strong>{leftPage}–{rightPage}</strong> / {TOTAL_PAGES}
                  </span>

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
    </section>
  );
};

export default CapacityProfile;
