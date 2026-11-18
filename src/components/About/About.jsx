import React, { useState } from 'react';
import './About.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import bannerImageFallback from '../../assets/banner-3.jpg';

const ARC_NODES = [
  {
    id: 1,
    posClass: 'arc-node-1',
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
    posClass: 'arc-node-2',
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
    posClass: 'arc-node-3',
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
    posClass: 'arc-node-4',
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
    posClass: 'arc-node-5',
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

const About = () => {
  const containerRef = useScrollReveal({ threshold: 0.08 });
  const [showVideoNotice, setShowVideoNotice] = useState(false);

  return (
    <section className="about" id="about">
      <div className="container about-outer-container" ref={containerRef}>
        <div className="about-master-layout">
          {/* CỘT TRÁI: VIDEO DEMO HOẠT ĐỘNG CÔNG TY (Chiều cao dài xuyên suốt bên cạnh Infographic) */}
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

          {/* CỘT PHẢI: BẢNG INFOGRAPHIC THIẾT KẾ GIỐNG ẢNH MẪU (LĨNH VỰC HOẠT ĐỘNG + MỤC TIÊU + SỨ MỆNH VÀ CAM KẾT) */}
          <div className="np-infographic-board reveal-right delay-1">
            {/* Họa tiết góc trên trái (Sóng đỏ đô + viền vàng kim giống ảnh mẫu) */}
            <svg className="infographic-top-wave" viewBox="0 0 260 130" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,0 L240,0 C150,25 75,65 0,125 Z" fill="#8b1111" />
              <path d="M0,115 C75,58 150,22 230,0 L255,0 C165,26 85,68 0,130 Z" fill="#d4a537" opacity="0.85" />
            </svg>

            {/* Họa tiết nền mờ phía dưới: Cột điện cao thế + Đường chân trời tòa nhà + Tua-bin gió */}
            <svg className="infographic-bg-skyline" viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true">
              {/* Cột điện cao thế bên trái */}
              <g stroke="#b4533c" strokeWidth="1.6" opacity="0.26" fill="none">
                <line x1="75" y1="35" x2="35" y2="260" />
                <line x1="75" y1="35" x2="115" y2="260" />
                <line x1="25" y1="75" x2="125" y2="75" />
                <line x1="15" y1="115" x2="135" y2="115" />
                <line x1="58" y1="75" x2="92" y2="115" />
                <line x1="92" y1="75" x2="58" y2="115" />
                <line x1="52" y1="115" x2="98" y2="165" />
                <line x1="98" y1="115" x2="52" y2="165" />
                <line x1="45" y1="165" x2="105" y2="220" />
                <line x1="105" y1="165" x2="45" y2="220" />
                <path d="M125,75 Q260,150 420,125" strokeDasharray="3 3" />
                <path d="M135,115 Q260,185 420,155" strokeDasharray="3 3" />
              </g>
              {/* Đường chân trời đô thị ở giữa */}
              <g fill="#c97a63" opacity="0.16">
                <rect x="210" y="160" width="28" height="100" />
                <rect x="242" y="135" width="34" height="125" />
                <rect x="280" y="175" width="24" height="85" />
                <rect x="310" y="145" width="38" height="115" />
                <rect x="352" y="165" width="26" height="95" />
                <rect x="382" y="150" width="30" height="110" />
                <rect x="418" y="170" width="25" height="90" />
                <rect x="448" y="155" width="32" height="105" />
              </g>
              {/* Tua-bin gió ở giữa-phải */}
              <g stroke="#b4533c" strokeWidth="1.8" opacity="0.25" fill="none">
                <line x1="445" y1="95" x2="445" y2="250" />
                <line x1="445" y1="95" x2="415" y2="55" />
                <line x1="445" y1="95" x2="490" y2="85" />
                <line x1="445" y1="95" x2="435" y2="140" />

                <line x1="395" y1="135" x2="395" y2="250" strokeWidth="1.3" />
                <line x1="395" y1="135" x2="375" y2="110" strokeWidth="1.3" />
                <line x1="395" y1="135" x2="425" y2="128" strokeWidth="1.3" />
                <line x1="395" y1="135" x2="388" y2="168" strokeWidth="1.3" />
              </g>
            </svg>

            {/* Dải sóng đỏ đậm uốn lượn ở phần đáy giống ảnh mẫu */}
            <svg className="infographic-bottom-wave" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0,25 C240,85 450,115 740,85 C860,72 940,55 1000,45 L1000,220 L0,220 Z" fill="url(#bottomRedGrad)" />
              <path d="M0,185 C260,225 520,210 780,175 L1000,155 L1000,220 L0,220 Z" fill="#6b0808" opacity="0.55" />
              <path d="M0,192 C280,225 560,215 840,185" stroke="#d4a537" strokeWidth="3" fill="none" opacity="0.8" />
              <defs>
                <linearGradient id="bottomRedGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7f0d0d" />
                  <stop offset="55%" stopColor="#a11616" />
                  <stop offset="100%" stopColor="#c83e2b" />
                </linearGradient>
              </defs>
            </svg>

            {/* ==================== PHẦN TRÊN: TRÁI (SƠ ĐỒ TỎA TRÒN LĨNH VỰC HOẠT ĐỘNG) | PHẢI (MỤC TIÊU) ==================== */}
            <div className="infographic-top-row">
              {/* KHỐI TRÁI TRÊN: SƠ ĐỒ HÌNH QUẠT LĨNH VỰC HOẠT ĐỘNG */}
              <div className="infographic-fan-col">
                <div className="fan-diagram-stage">
                  {/* Các mũi tên đỏ tỏa ra 5 vòng tròn con */}
                  <svg className="fan-arrows-svg" viewBox="0 0 420 330" fill="none" aria-hidden="true">
                    <defs>
                      <marker id="redArrowHead" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                        <polygon points="0 0, 7 3.5, 0 7" fill="#991b1b" />
                      </marker>
                    </defs>
                    {/* 5 mũi tên từ vòng tròn trung tâm (210, 82) tới 5 vòng tròn con */}
                    <line x1="152" y1="108" x2="97" y2="142" stroke="#991b1b" strokeWidth="2.8" markerEnd="url(#redArrowHead)" />
                    <line x1="174" y1="134" x2="139" y2="198" stroke="#991b1b" strokeWidth="2.8" markerEnd="url(#redArrowHead)" />
                    <line x1="210" y1="146" x2="210" y2="218" stroke="#991b1b" strokeWidth="2.8" markerEnd="url(#redArrowHead)" />
                    <line x1="246" y1="134" x2="281" y2="198" stroke="#991b1b" strokeWidth="2.8" markerEnd="url(#redArrowHead)" />
                    <line x1="268" y1="108" x2="323" y2="142" stroke="#991b1b" strokeWidth="2.8" markerEnd="url(#redArrowHead)" />
                  </svg>

                  {/* Vòng tròn lớn trung tâm: LĨNH VỰC HOẠT ĐỘNG */}
                  <div className="fan-center-hub">
                    <div className="fan-center-inner">
                      <span>LĨNH VỰC</span>
                      <span>HOẠT ĐỘNG</span>
                      <i className="fan-hub-line" />
                    </div>
                  </div>

                  {/* 5 Vòng tròn con xếp cánh cung */}
                  {ARC_NODES.map((node) => (
                    <div key={node.id} className={`fan-sub-node ${node.posClass}`}>
                      <div className="sub-node-icon">{node.icon}</div>
                      <span className="sub-node-text">{node.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KHỐI PHẢI TRÊN: MỤC TIÊU */}
              <div className="infographic-goals-col">
                <div className="infographic-section-header">
                  <div className="infographic-pill-badge">
                    <span className="pill-badge-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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
                  <div className="infographic-goal-pill">
                    <div className="goal-pill-circle-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="12" cy="9" r="6" />
                        <polyline points="9.5 9 11.2 10.8 14.8 7.2" />
                        <path d="M8.5 14.2L7 21l5-2.5L17 21l-1.5-6.8" />
                      </svg>
                    </div>
                    <p>
                      Mục tiêu sản xuất ra các sản phẩm <strong>đạt chất lượng tốt và giá cả cạnh tranh</strong> và <strong>thân thiện với môi trường</strong> được nhiều Doanh nghiệp tin tưởng sử dụng.
                    </p>
                  </div>

                  <div className="infographic-goal-pill">
                    <div className="goal-pill-circle-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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

                  <div className="infographic-goal-pill">
                    <div className="goal-pill-circle-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M11 17l-4-4 3-3 4 4" />
                        <path d="M2 11l5-5 5 2 5-2 5 5-5 6-5-2-5 2z" />
                      </svg>
                    </div>
                    <p>
                      Phấn đấu thỏa mãn <strong>tối đa nhu cầu khách hàng</strong>, sản phẩm hoàn thiện đúng tiến độ, đảm bảo chất lượng yêu cầu kỹ thuật, mỹ thuật, an toàn và hiệu quả kinh tế cao.
                    </p>
                  </div>

                  <div className="infographic-goal-pill">
                    <div className="goal-pill-circle-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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
            </div>

            {/* ==================== PHẦN DƯỚI: SỨ MỆNH VÀ CAM KẾT + QUẢ ĐỊA CẦU XANH ==================== */}
            <div className="infographic-bottom-row">
              <div className="infographic-mission-wrap">
                <div className="mission-header-bar">
                  <div className="infographic-pill-badge mission-pill">
                    <span className="pill-badge-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                    </span>
                    <h3>SỨ MỆNH VÀ CAM KẾT</h3>
                  </div>
                  <div className="mission-white-line" />
                </div>

                <div className="mission-white-card">
                  <div className="mission-col">
                    <div className="mission-circle-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <div className="mission-circle-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

              {/* Quả địa cầu xanh & năng lượng sạch ở góc dưới phải như ảnh mẫu */}
              <div className="infographic-eco-corner" aria-hidden="true">
                <div className="eco-globe-circle">
                  <svg viewBox="0 0 120 120" className="eco-globe-svg">
                    <defs>
                      <radialGradient id="globeGrad" cx="35%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#d9f99d" />
                        <stop offset="45%" stopColor="#65a30d" />
                        <stop offset="100%" stopColor="#15803d" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="60" cy="108" rx="48" ry="8" fill="#4d7c0f" opacity="0.45" />
                    <circle cx="60" cy="58" r="42" fill="url(#globeGrad)" stroke="#ffffff" strokeWidth="2" />
                    {/* Lục địa cách điệu */}
                    <path d="M40,32 C52,28 64,35 60,46 C56,56 72,58 68,72 C64,82 48,84 42,74 C36,64 30,42 40,32 Z" fill="#3f6212" opacity="0.55" />
                    <path d="M74,36 C84,40 92,52 86,66 C80,76 72,68 74,54 Z" fill="#3f6212" opacity="0.55" />
                    {/* Vòng quỹ đạo trắng quanh quả địa cầu */}
                    <ellipse cx="60" cy="102" rx="44" ry="7" fill="none" stroke="#ecfccb" strokeWidth="2" />
                  </svg>
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
