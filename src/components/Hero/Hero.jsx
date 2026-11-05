import React from 'react';
import './Hero.css';
import heroImage from '../../assets/hero.png';

const Hero = ({ onNavigateAbout }) => {
  return (
    <section className="hero" id="home">
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

        <div className="hero-actions">
          <a href="#product" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Khám phá ngay</a>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onNavigateAbout}
          >
            Về chúng tôi
          </button>
        </div>

        <div className="hero-image-wrapper">
          <img 
            src={heroImage} 
            alt="Đội ngũ kỹ sư Cơ Điện Nguyên Phát trên công trường" 
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
