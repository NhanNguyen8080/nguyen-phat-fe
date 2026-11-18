import React, { useState } from 'react';
import './About.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import bannerImageFallback from '../../assets/banner-3.jpg';

const FIELDS_OF_ACTIVITY = [
  {
    id: '01',
    title: 'Thiết kế và Sản xuất tủ điện',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <path d="M11 14l-2 3h4l-2 3" />
      </svg>
    )
  },
  {
    id: '02',
    title: 'Phân phối và thương mại',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  },
  {
    id: '03',
    title: 'Tư vấn, thiết kế đường dây Trạm biến áp',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L6 22h12L12 2z" />
        <line x1="4" y1="8" x2="20" y2="8" />
        <line x1="2" y1="13" x2="22" y2="13" />
      </svg>
    )
  },
  {
    id: '04',
    title: 'Lắp đặt và thi công Hệ thống điện',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  },
  {
    id: '05',
    title: 'Dịch vụ bảo hành và bảo trì',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    )
  }
];

const About = ({ onNavigateAbout }) => {
  const containerRef = useScrollReveal({ threshold: 0.08 });
  const [showVideoNotice, setShowVideoNotice] = useState(false);

  return (
    <section className="about" id="about">
      <div className="container about-infographic-container" ref={containerRef}>
        {/* Thanh tiêu đề nhỏ gọn của mục Giới thiệu */}
        <div className="about-top-heading reveal">
          <div className="about-heading-left">
            <span className="about-red-tag">TỔNG QUAN DOANH NGHIỆP</span>
            <h2 className="about-main-title">
              Giới Thiệu <span className="text-yellow">Cơ Điện Nguyên Phát</span>
            </h2>
          </div>
          {onNavigateAbout && (
            <button
              type="button"
              className="btn-secondary about-detail-link"
              onClick={onNavigateAbout}
            >
              <span>Xem trang Giới thiệu chi tiết</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          )}
        </div>

        {/* 1. KHUNG VIDEO DEMO HOẠT ĐỘNG CÔNG TY — KÉO DÀI GẤP ĐÔI (FULL 100% CHIỀU NGANG CONTAINER) */}
        <div
          className="about-video-box about-video-fullwidth reveal delay-1"
          onClick={() => setShowVideoNotice((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowVideoNotice((prev) => !prev);
            }
          }}
          title="Video demo hoạt động sản xuất và thi công của Cơ Điện Nguyên Phát"
        >
          <img
            src="/catalog/pages/2.jpg"
            alt="Video demo hoạt động nhà máy Cơ Điện Nguyên Phát"
            className="about-video-thumb"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = bannerImageFallback;
            }}
          />
          <div className="about-video-overlay">
            <div className="video-top-row">
              <div className="video-live-badge">
                <span className="live-dot" />
                <span>VIDEO DEMO HOẠT ĐỘNG NHÀ MÁY &amp; THI CÔNG CÔNG TRÌNH</span>
              </div>
              <span className="video-duration-pill">Full HD • Xưởng Sản Xuất Nguyên Phát</span>
            </div>

            <div className="video-play-center">
              <div className="video-play-btn">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              </div>
              <div className="video-caption-text">
                <strong>Video Demo Hoạt Động Công Ty Đang Làm Việc</strong>
                <span>
                  {showVideoNotice
                    ? 'Đang cập nhật file video thực tế từ xưởng sản xuất Cơ Điện Nguyên Phát'
                    : 'Toàn cảnh quy trình gia công cơ khí CNC, sơn tĩnh điện, lắp ráp tủ bảng điện MSB/ATS/MCC & kiểm định chất lượng xuất xưởng'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LƯỚI 2 CỘT BÊN DƯỚI VIDEO: BÊN TRÁI (5 LĨNH VỰC HOẠT ĐỘNG) | BÊN PHẢI (4 MỤC TIÊU) */}
        <div className="about-bento-grid">
          {/* CỘT TRÁI: Khối LĨNH VỰC HOẠT ĐỘNG */}
          <div className="about-fields-panel reveal-left delay-2">
            <div className="panel-diagonal-header">
              <span className="panel-header-icon">⚡</span>
              <h3>LĨNH VỰC HOẠT ĐỘNG</h3>
            </div>

            <div className="about-fields-grid">
              {FIELDS_OF_ACTIVITY.map((field) => (
                <div key={field.id} className="about-field-pill">
                  <div className="field-pill-icon">{field.icon}</div>
                  <div className="field-pill-content">
                    <span className="field-pill-num">{field.id}</span>
                    <span className="field-pill-title">{field.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: Khối MỤC TIÊU (4 thẻ ngang vát chéo viền đỏ) */}
          <div className="about-goals-panel reveal-right delay-2">
            <div className="panel-diagonal-header goals-header">
              <span className="panel-header-icon">🎯</span>
              <h3>MỤC TIÊU</h3>
            </div>

            <div className="about-goals-list">
              <div className="about-goal-card">
                <div className="goal-icon-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
                <p className="goal-text">
                  Mục tiêu sản xuất ra các sản phẩm <strong>đạt chất lượng tốt và giá cả cạnh tranh</strong> và <strong>thân thiện với môi trường</strong> được nhiều Doanh nghiệp tin tưởng sử dụng.
                </p>
              </div>

              <div className="about-goal-card">
                <div className="goal-icon-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 18h8" />
                    <path d="M3 22h18" />
                    <path d="M14 22a7 7 0 1 0 0-14h-1" />
                    <path d="M9 14h2" />
                    <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                  </svg>
                </div>
                <p className="goal-text">
                  Tăng cường đẩy mạnh <strong>nghiên cứu công nghệ</strong>, quy trình sản xuất, quy trình đánh giá chất lượng, không ngừng bồi dưỡng và nâng cao trình độ cho cán bộ công nhân viên, duy trì và đảm bảo môi trường làm việc, nhằm <strong>nâng cao chất lượng cũng như năng suất</strong>, đáp ứng mọi yêu cầu của khách hàng.
                </p>
              </div>

              <div className="about-goal-card">
                <div className="goal-icon-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M11 17a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z" />
                    <path d="m2 12 5 3" />
                    <path d="m22 12-5 3" />
                    <path d="M7 18h10" />
                  </svg>
                </div>
                <p className="goal-text">
                  Phấn đấu thỏa mãn <strong>tối đa nhu cầu khách hàng</strong>, sản phẩm hoàn thiện đúng tiến độ, đảm bảo chất lượng yêu cầu kỹ thuật, mỹ thuật, an toàn và hiệu quả kinh tế cao.
                </p>
              </div>

              <div className="about-goal-card">
                <div className="goal-icon-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <p className="goal-text">
                  Trong xu thế hội nhập và cạnh tranh, <strong>CÔNG TY TNHH SX - TM CƠ ĐIỆN NGUYÊN PHÁT</strong> mong muốn hợp tác chặt chẽ và lâu dài với các doanh nghiệp sản xuất tại Việt Nam và các doanh nghiệp nước ngoài muốn đầu tư vào Việt Nam cũng như là đã có mặt tại Việt Nam để cùng nhau phát triển công nghệ và hợp tác thực hiện các dự án lớn.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DẢI ĐÁY NỀN ĐỎ CHỦ ĐẠO: SỨ MỆNH VÀ CAM KẾT */}
        <div className="about-commitment-banner reveal delay-3">
          <div className="commitment-title-pill">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span>SỨ MỆNH VÀ CAM KẾT</span>
          </div>

          <div className="commitment-cards-row">
            <div className="commitment-item">
              <div className="commitment-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
              </div>
              <p>
                <strong>CÔNG TY TNHH SX - TM CƠ ĐIỆN NGUYÊN PHÁT</strong> cam kết tư vấn và cung cấp cho khách hàng những giải pháp có hiệu quả kinh tế cao, dựa trên các tiêu chí kỹ thuật tối ưu và khách quan.
              </p>
            </div>

            <div className="commitment-item">
              <div className="commitment-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <p>
                <strong>NGUYÊN PHÁT</strong> không ngừng tiếp cận các công nghệ mới để nâng cao năng lực và độ tin cậy, đồng thời tiếp tục phát huy thế mạnh của mình là sự chuyên nghiệp ngay trong những công việc đơn giản nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
