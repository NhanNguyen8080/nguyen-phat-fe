import React from 'react';
import './Hero.css';
import bannerImageFallback from '../../assets/banner-3.jpg';
import aboutImage from '../../assets/about-us.png';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const HERO_BANNER_URL = 'https://diennguyenphat.com/upload/files/chung/banner-3.jpg';

const Hero = ({ onNavigateAbout }) => {
  const introRef = useScrollReveal({ threshold: 0.12 });

  return (
    <section className="hero-group" aria-label="Trang chủ">
      {/* ==================== MÀN HÌNH 1 CỦA MỤC TRANG CHỦ: HERO BANNER ==================== */}
      <div className="hero-screen hero-screen-1" id="home">
        <div className="container hero-container">
          <div className="hero-top">
            <div className="hero-location">
              <p>
                Tọa lạc tại trung tâm <strong>TP. Hồ Chí Minh</strong>, chúng tôi là
                <br />
                đơn vị cơ điện tiên phong kiến tạo công trình
              </p>
            </div>
            <div className="hero-title-main hero-title-main-top">
              <h1 className="hero-title">
                <span className="text-yellow">Kiến Tạo</span> Tương Lai Bền Vững
              </h1>
            </div>
            <div className="hero-title-main hero-title-main-bottom">
              <h1 className="hero-title">
                Khởi Đầu <span className="text-yellow">Hôm Nay</span>
              </h1>
            </div>
            <div className="hero-description">
              <p>
                Chúng tôi là doanh nghiệp cơ điện hàng đầu, chuyên cung cấp
                giải pháp tủ bảng điện và thang máng cáp chất lượng cao.
              </p>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img
              src={HERO_BANNER_URL}
              alt="Cơ Điện Nguyên Phát - Thiết kế công trình điện công nghiệp"
              className="hero-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = bannerImageFallback;
              }}
            />
          </div>
        </div>
      </div>

      {/* ==================== MÀN HÌNH 2 CỦA MỤC TRANG CHỦ: LỜI CẢM ƠN & LĨNH VỰC HOẠT ĐỘNG ==================== */}
      <div className="hero-screen hero-screen-2" id="home-intro">
        <div className="container hero-intro-container" ref={introRef}>
          {/* Cột trái: Cảm ơn Quý khách hàng đã đồng hành */}
          <div className="hero-intro-left reveal-left">
            <span className="hero-intro-badge">Về chúng tôi</span>
            <h2 className="hero-intro-title">
              Cảm ơn Quý khách hàng <span className="text-yellow">đã đồng hành</span>
            </h2>
            <p className="hero-intro-desc">
              Thành lập từ năm 2009, Cơ Điện Nguyên Phát đã trải qua hơn 15 năm xây dựng và phát triển trong lĩnh vực sản xuất, thiết kế và thi công hệ thống điện công nghiệp. Mỗi thành quả hôm nay đều có sự tin tưởng và đồng hành của Quý khách hàng, Quý đối tác. Xin chân thành cảm ơn Quý vị trong suốt thời gian qua. Chúng tôi tiếp tục làm việc với phương châm{' '}
              <strong className="hero-motto">Uy tín – Chất lượng – Bền vững</strong>.
            </p>

            <div className="hero-intro-author">
              <div className="hero-author-avatar">
                <img src="/images/logo.png" alt="Giám đốc Mai Hưng HÀ" />
              </div>
              <div className="hero-author-info">
                <strong>Giám đốc Mai Hưng HÀ</strong>
                <span>CÔNG TY TNHH SX - TM CƠ ĐIỆN NGUYÊN PHÁT</span>
              </div>
            </div>

            {onNavigateAbout && (
              <div style={{ marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={onNavigateAbout}
                  style={{
                    padding: '12px 30px',
                    fontSize: '0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: 'var(--border-radius-lg)',
                    cursor: 'pointer'
                  }}
                >
                  <span>Xem thêm</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Cột giữa: Hình ảnh được phóng to theo yêu cầu ("hình này long thấy hơi nhỏ, phóng to ra cho long nha") */}
          <div className="hero-intro-center reveal-scale">
            <div className="hero-intro-photo-wrap">
              <img
                src={aboutImage}
                alt="Kỹ sư Cơ Điện Nguyên Phát thi công lắp đặt"
                className="hero-intro-image"
                loading="lazy"
                decoding="async"
                width="540"
                height="640"
              />
            </div>
          </div>

          {/* Cột phải: Lĩnh vực hoạt động (thay cho Sứ mệnh & Tầm nhìn) */}
          <div className="hero-intro-right reveal-right">
            <div className="hero-activity-block reveal delay-2">
              <h3 className="hero-activity-title">
                <span className="text-yellow">Lĩnh vực</span> hoạt động
              </h3>
              <p className="hero-activity-desc">
                <strong>Nguyên Phát</strong> thiết kế, sản xuất tủ bảng điện (MSB, DB, ATS, VCB, tủ điều khiển, tủ tụ bù…) và thang máng cáp cho mọi quy mô dự án, đồng thời nhận lắp đặt hệ thống điện, thi công và lập trình PLC trọn gói.
              </p>
              <p className="hero-activity-desc">
                Sản phẩm được chế tạo theo tiêu chuẩn <strong>TCVN và IEC</strong>, kiểm tra kỹ trước khi xuất xưởng, đảm bảo an toàn, bền bỉ và vận hành ổn định.{' '}
                <strong className="hero-activity-tagline">Chất lượng cao – Đúng tiến độ – Giá hợp lý.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
