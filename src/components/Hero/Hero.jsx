import React from 'react';
import './Hero.css';
import bannerImageFallback from '../../assets/banner-3.jpg';
import aboutImage from '../../assets/about-us.png';

const HERO_BANNER_URL = 'https://diennguyenphat.com/upload/files/chung/banner-3.jpg';

const Hero = ({ onNavigateAbout }) => {
  return (
    <section className="hero" id="home">
      <div className="container hero-container">
        {/* Nửa trên: Tiêu đề Hero & Banner công trình điện */}
        <div className="hero-top-section">
          <div className="hero-top-bar">
            <div className="hero-location">
              <p>
                Tọa lạc tại trung tâm <strong>TP. Hồ Chí Minh</strong>, chúng tôi là
                đơn vị cơ điện tiên phong kiến tạo công trình
              </p>
            </div>

            <div className="hero-headline-group">
              <h1 className="hero-title">
                <span className="text-yellow">Kiến Tạo</span> Tương Lai Bền Vững — Khởi Đầu <span className="text-yellow">Hôm Nay</span>
              </h1>
            </div>

            <div className="hero-actions">
              <a href="#product" className="btn-primary hero-btn">
                Khám phá ngay
              </a>
              <button
                type="button"
                className="btn-secondary hero-btn"
                onClick={onNavigateAbout}
              >
                Về chúng tôi
              </button>
            </div>
          </div>

          <div className="hero-banner-wrapper">
            <img
              src={HERO_BANNER_URL}
              alt="Thiết kế công trình điện công nghiệp Cơ Điện Nguyên Phát"
              className="hero-banner-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = bannerImageFallback;
              }}
            />
          </div>
        </div>

        {/* Nửa dưới (Gộp chung vào Trang chủ): Lời cảm ơn + Hình ảnh phóng to + Lĩnh vực hoạt động */}
        <div className="hero-showcase-grid">
          {/* Cột trái: Cảm ơn Quý khách hàng đã đồng hành */}
          <div className="hero-col-left">
            <span className="hero-badge">Về chúng tôi</span>
            <h2 className="hero-col-title">
              Cảm ơn Quý khách hàng <span className="text-yellow">đã đồng hành</span>
            </h2>
            <p className="hero-col-desc">
              Thành lập từ năm 2009, Cơ Điện Nguyên Phát đã trải qua hơn 15 năm xây dựng và phát triển trong lĩnh vực sản xuất, thiết kế và thi công hệ thống điện công nghiệp. Mỗi thành quả hôm nay đều có sự tin tưởng và đồng hành của Quý khách hàng, Quý đối tác. Xin chân thành cảm ơn Quý vị trong suốt thời gian qua. Chúng tôi tiếp tục làm việc với phương châm{' '}
              <strong className="hero-motto">Uy tín – Chất lượng – Bền vững</strong>.
            </p>

            <div className="hero-director-row">
              <div className="hero-director">
                <div className="director-avatar">
                  <img src="/images/logo.png" alt="Giám đốc Mai Hưng Hà" />
                </div>
                <div className="director-info">
                  <strong>Giám đốc Mai Hưng HÀ</strong>
                  <span>CÔNG TY TNHH SX - TM CƠ ĐIỆN NGUYÊN PHÁT</span>
                </div>
              </div>

              {onNavigateAbout && (
                <button
                  type="button"
                  className="btn-primary hero-more-btn"
                  onClick={onNavigateAbout}
                >
                  <span>Xem thêm</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Cột giữa: Hình ảnh được phóng to theo yêu cầu của khách hàng */}
          <div className="hero-col-center">
            <div className="hero-featured-photo-frame">
              <img
                src={aboutImage}
                alt="Đội ngũ kỹ sư Cơ Điện Nguyên Phát thi công công trình"
                className="hero-featured-photo"
              />
              <div className="hero-photo-badge">
                <strong>15+ Năm</strong>
                <span>Kinh nghiệm Cơ Điện Công Nghiệp (Từ 2009)</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Lĩnh vực hoạt động (thay cho Sứ mệnh & Tầm nhìn) */}
          <div className="hero-col-right">
            <div className="hero-field-card">
              <div className="hero-field-accent-bar" />
              <h3 className="hero-field-title">
                <span className="text-yellow">Lĩnh vực</span> hoạt động
              </h3>
              <p className="hero-field-desc">
                <strong>Nguyên Phát</strong> thiết kế, sản xuất tủ bảng điện (MSB, DB, ATS, VCB, tủ điều khiển, tủ tụ bù…) và thang máng cáp cho mọi quy mô dự án, đồng thời nhận lắp đặt hệ thống điện, thi công và lập trình PLC trọn gói.
              </p>
              <p className="hero-field-desc">
                Sản phẩm được chế tạo theo tiêu chuẩn <strong>TCVN và IEC</strong>, kiểm tra kỹ trước khi xuất xưởng, đảm bảo an toàn, bền bỉ và vận hành ổn định.
              </p>
              <div className="hero-field-highlight">
                <span className="highlight-dot" />
                <strong>Chất lượng cao – Đúng tiến độ – Giá hợp lý.</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
