import React, { useState } from 'react';
import './About.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import bannerImageFallback from '../../assets/banner-3.jpg';

const ARC_NODES = [
  {
    id: 1,
    posClass: 'rising-node-1',
    title: 'Thiết kế và\nSản xuất tủ điện',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="6" width="20" height="24" rx="2" />
        <line x1="10" y1="11" x2="22" y2="11" />
        <line x1="10" y1="16" x2="18" y2="16" />
        <path d="M14 20l-2 4h4l-2 4" />
        <path d="M23 18l6-6 3 3-6 6-4 1 1-4z" />
      </svg>
    )
  },
  {
    id: 2,
    posClass: 'rising-node-2',
    title: 'Phân phối và\nthương mại',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="7" y="5" width="22" height="26" rx="2" />
        <line x1="7" y1="24" x2="29" y2="24" />
        <path d="M19 9l-4 6h5l-3 6" strokeWidth="2.2" />
        <circle cx="12" cy="27.5" r="1" fill="currentColor" />
        <circle cx="18" cy="27.5" r="1" fill="currentColor" />
        <circle cx="24" cy="27.5" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 3,
    posClass: 'rising-node-3',
    title: 'Tư vấn, thiết kế đường\ndây Trạm biến áp',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 30V18l5-3v15" />
        <rect x="6" y="20" width="10" height="10" />
        <path d="M24 8l-5 22h10L24 8z" />
        <line x1="17" y1="14" x2="31" y2="14" />
        <line x1="16" y1="19" x2="32" y2="19" />
        <line x1="4" y1="30" x2="33" y2="30" />
      </svg>
    )
  },
  {
    id: 4,
    posClass: 'rising-node-4',
    title: 'Lắp đặt và thi công\nHệ thống điện',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="18" r="7" />
        <path d="M19 13l-3 5h4l-2 5" strokeWidth="2.2" />
        <path d="M18 6v3M18 27v3M6 18h3M27 18h3M9.5 9.5l2.2 2.2M24.3 24.3l2.2 2.2M26.5 9.5l-2.2 2.2M11.7 24.3l-2.2 2.2" strokeWidth="2.2" />
      </svg>
    )
  },
  {
    id: 5,
    posClass: 'rising-node-5',
    title: 'Dịch vụ bảo hành\nvà bảo trì',
    icon: (
      <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 15a6 6 0 0 1 12 0H10z" />
        <line x1="8" y1="15" x2="24" y2="15" />
        <circle cx="16" cy="19" r="3.5" />
        <path d="M8 29c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" />
        <path d="M26 16l5 2v4c0 3.5-2.2 6-5 7-2.8-1-5-3.5-5-7v-4l5-2z" />
        <polyline points="23.8 22 25.5 23.8 28.5 20.5" />
      </svg>
    )
  }
];

const About = ({ onNavigateAbout }) => {
  const containerRef = useScrollReveal({ threshold: 0.08 });
  const [showVideoNotice, setShowVideoNotice] = useState(false);

  const handleOpenAboutDetail = () => {
    if (onNavigateAbout) {
      onNavigateAbout();
    } else {
      window.location.hash = '#/about';
    }
  };

  return (
    <section className="about" id="about">
      <div className="container about-outer-container" ref={containerRef}>
        <div className="about-master-layout">
          {/* CỘT TRÁI: VIDEO DEMO HOẠT ĐỘNG CÔNG TY (Khối 3D nổi trực tiếp trên nền trang) */}
          <div
            className="about-video-sidebar reveal-left"
            onClick={() => setShowVideoNotice((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowVideoNotice((prev) => !prev);
              }
            }}
            title="Video demo hoạt động công ty đang làm việc"
          >
            <img
              src="/catalog/pages/2.jpg"
              alt="Video demo hoạt động công ty Cơ Điện Nguyên Phát"
              className="about-video-bg-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.target.src = bannerImageFallback;
              }}
            />
            <div className="about-video-sidebar-overlay">
              <div className="video-sidebar-badge">
                <span className="video-rec-dot" />
                <span>VIDEO DEMO HOẠT ĐỘNG</span>
              </div>

              <div className="video-sidebar-center">
                <div className="video-sidebar-play">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="7 4 21 12 7 20 7 4" />
                  </svg>
                </div>
                <h4>Hoạt Động Công Ty Đang Làm Việc</h4>
                <p>
                  {showVideoNotice
                    ? 'Đang chờ bổ sung file video thực tế từ nhà xưởng Nguyên Phát'
                    : 'Gia công tủ bảng điện, thang máng cáp & lắp đặt hệ thống điện công nghiệp'}
                </p>
              </div>

              <div className="video-sidebar-footer">
                <span>CƠ ĐIỆN NGUYÊN PHÁT</span>
                <span>Chuẩn TCVN &amp; IEC</span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CÁC KHỐI NỔI 3D TRỰC TIẾP TRÊN NỀN TRẮNG (KHÔNG ĐÓNG KHUNG NỀN) */}
          <div className="np-infographic-board reveal-right delay-1">
            {/* ==================== TẦNG 1 (TRÊN CÙNG): SỨ MỆNH VÀ CAM KẾT (KHỐI NỔI 3D) ==================== */}
            <div className="infographic-top-mission-zone">
              <div className="mission-top-badge-row">
                <div className="infographic-pill-badge mission-top-pill">
                  <span className="pill-badge-icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </span>
                  <h3>SỨ MỆNH VÀ CAM KẾT</h3>
                </div>
                <div className="mission-red-line" />
                <button
                  type="button"
                  className="about-detail-3d-btn"
                  onClick={handleOpenAboutDetail}
                >
                  <span>Xem chi tiết giới thiệu</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>

              <div className="mission-white-card card-3d-surface">
                <div className="mission-col">
                  <div className="mission-circle-icon badge-3d-red">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 11l5-5 5 2 5-2 5 5-5 6-5-2-5 2z" />
                      <path d="M9 14l3 3 5-5" />
                    </svg>
                  </div>
                  <p>
                    <strong>CÔNG TY TNHH SX - TM CƠ ĐIỆN NGUYÊN PHÁT</strong> cam kết tư vấn và cung cấp cho khách hàng những giải pháp có hiệu quả kinh tế cao, dựa trên các tiêu chí kỹ thuật tối ưu và khách quan.
                  </p>
                </div>

                <div className="mission-divider" />

                <div className="mission-col">
                  <div className="mission-circle-icon badge-3d-red">
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M18.4 5.6l-2.2 2.2M7.8 16.2l-2.2 2.2" />
                    </svg>
                  </div>
                  <p>
                    <strong>NGUYÊN PHÁT</strong> không ngừng tiếp cận các công nghệ mới để nâng cao năng lực và độ tin cậy, đồng thời tiếp tục phát huy thế mạnh của mình là sự chuyên nghiệp ngay trong những công việc đơn giản nhất.
                  </p>
                </div>
              </div>
            </div>

            {/* ==================== TẦNG 2 (DƯỚI): BÊN TRÁI (MỤC TIÊU 3D) | BÊN PHẢI (SƠ ĐỒ VÒM CUNG 3D LĨNH VỰC HOẠT ĐỘNG) ==================== */}
            <div className="infographic-main-split">
              {/* KHỐI DƯỚI TRÁI: MỤC TIÊU */}
              <div className="infographic-goals-col">
                <div className="infographic-section-header">
                  <div className="infographic-pill-badge">
                    <span className="pill-badge-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="5" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                        <path d="M16 8l5-5M18 3h3v3" />
                      </svg>
                    </span>
                    <h3>MỤC TIÊU</h3>
                  </div>
                  <div className="infographic-header-line" />
                </div>

                <div className="infographic-goals-stack">
                  <div className="infographic-goal-pill card-3d-pill">
                    <div className="goal-pill-circle-icon badge-3d-red">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="9" r="6" />
                        <polyline points="9.5 9 11.2 10.8 14.8 7.2" />
                        <path d="M8.5 14.2L7 21l5-2.5L17 21l-1.5-6.8" />
                      </svg>
                    </div>
                    <p>
                      Mục tiêu sản xuất ra các sản phẩm <strong>đạt chất lượng tốt và giá cả cạnh tranh</strong> và <strong>thân thiện với môi trường</strong> được nhiều Doanh nghiệp tin tưởng sử dụng.
                    </p>
                  </div>

                  <div className="infographic-goal-pill card-3d-pill">
                    <div className="goal-pill-circle-icon badge-3d-red">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M6 18h8" />
                        <path d="M3 21h18" />
                        <path d="M14 21a6 6 0 0 0 0-12h-1" />
                        <path d="M9 13a2 2 0 0 1-2-2V6h5v5a2 2 0 0 1-2 2z" />
                      </svg>
                    </div>
                    <p>
                      Tăng cường đẩy mạnh <strong>nghiên cứu công nghệ</strong>, quy trình sản xuất, quy trình đánh giá chất lượng, không ngừng bồi dưỡng và nâng cao trình độ cho cán bộ công nhân viên, duy trì và đảm bảo môi trường làm việc, nhằm <strong>nâng cao chất lượng cũng như năng suất</strong>, đáp ứng mọi yêu cầu của khách hàng.
                    </p>
                  </div>

                  <div className="infographic-goal-pill card-3d-pill">
                    <div className="goal-pill-circle-icon badge-3d-red">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M11 17l-4-4 3-3 4 4" />
                        <path d="M2 11l5-5 5 2 5-2 5 5-5 6-5-2-5 2z" />
                      </svg>
                    </div>
                    <p>
                      Phấn đấu thỏa mãn <strong>tối đa nhu cầu khách hàng</strong>, sản phẩm hoàn thiện đúng tiến độ, đảm bảo chất lượng yêu cầu kỹ thuật, mỹ thuật, an toàn và hiệu quả kinh tế cao.
                    </p>
                  </div>

                  <div className="infographic-goal-pill card-3d-pill">
                    <div className="goal-pill-circle-icon badge-3d-red">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="12" r="9" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <path d="M12 3a14 14 0 0 1 3.5 9A14 14 0 0 1 12 21a14 14 0 0 1-3.5-9A14 14 0 0 1 12 3z" />
                      </svg>
                    </div>
                    <p>
                      Trong xu thế hội nhập và cạnh tranh, <strong>CÔNG TY TNHH SX - TM CƠ ĐIỆN NGUYÊN PHÁT</strong> mong muốn hợp tác chặt chẽ và lâu dài với các doanh nghiệp sản xuất tại Việt Nam và các doanh nghiệp nước ngoài muốn đầu tư vào Việt Nam cũng như là đã có mặt tại Việt Nam để cùng nhau phát triển công nghệ và hợp tác thực hiện các dự án lớn.
                    </p>
                  </div>
                </div>
              </div>

              {/* KHỐI DƯỚI PHẢI: SƠ ĐỒ VÒM CUNG 3D NỔI (RISING 3D HUB) LĨNH VỰC HOẠT ĐỘNG */}
              <div className="infographic-fan-col">
                <div className="fan-diagram-stage rising-fan-stage">
                  {/* Các mũi tên đỏ 3D có đổ bóng tỏa từ Trục Trung Tâm phía dưới (205, 250) hướng lên 5 vòng tròn con */}
                  <svg className="fan-arrows-svg" viewBox="0 0 410 330" fill="none" aria-hidden="true">
                    <defs>
                      <marker id="redArrowHeadUp" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#d32f2f" />
                      </marker>
                      <filter id="arrowShadow3D" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#991b1b" floodOpacity="0.28" />
                      </filter>
                    </defs>
                    {/* Đế bóng đổ 3D dưới chân trụ trung tâm */}
                    <ellipse cx="205" cy="316" rx="74" ry="10" fill="rgba(15, 23, 42, 0.12)" />
                    {/* Vòng cung quỹ đạo kết nối 5 lĩnh vực */}
                    <path d="M 52 175 A 158 158 0 0 1 358 175" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 5" opacity="0.45" />
                    {/* 5 mũi tên 3D hướng từ tâm (205, 250) tỏa lên 5 vòng tròn */}
                    <g filter="url(#arrowShadow3D)">
                      <line x1="146" y1="226" x2="96" y2="196" stroke="#d32f2f" strokeWidth="3" markerEnd="url(#redArrowHeadUp)" />
                      <line x1="168" y1="200" x2="136" y2="138" stroke="#d32f2f" strokeWidth="3" markerEnd="url(#redArrowHeadUp)" />
                      <line x1="205" y1="186" x2="205" y2="114" stroke="#d32f2f" strokeWidth="3" markerEnd="url(#redArrowHeadUp)" />
                      <line x1="242" y1="200" x2="274" y2="138" stroke="#d32f2f" strokeWidth="3" markerEnd="url(#redArrowHeadUp)" />
                      <line x1="264" y1="226" x2="314" y2="196" stroke="#d32f2f" strokeWidth="3" markerEnd="url(#redArrowHeadUp)" />
                    </g>
                  </svg>

                  {/* 5 Vòng tròn con 3D nổi xếp thành vòm cung hướng lên trên */}
                  {ARC_NODES.map((node) => (
                    <div key={node.id} className={`fan-sub-node node-3d-sphere ${node.posClass}`}>
                      <div className="sub-node-icon">{node.icon}</div>
                      <span className="sub-node-text">{node.title}</span>
                    </div>
                  ))}

                  {/* Khối Trụ Tròn 3D Trung Tâm đặt ở chân vòm cung: LĨNH VỰC HOẠT ĐỘNG */}
                  <div className="fan-center-hub rising-center-hub hub-3d-cylinder">
                    <div className="fan-center-inner">
                      <img src="/images/logo.png" alt="" className="fan-hub-mini-logo" />
                      <span>LĨNH VỰC</span>
                      <span>HOẠT ĐỘNG</span>
                      <i className="fan-hub-line" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
