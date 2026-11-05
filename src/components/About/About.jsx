import React from 'react';
import './About.css';
import aboutImage from '../../assets/about-us.png';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const About = ({ onNavigateAbout }) => {
  const containerRef = useScrollReveal();

  return (
    <section className="about" id="about">
      <div className="container about-container" ref={containerRef}>
        
        <div className="about-left reveal-left">
          <span className="about-badge">Về chúng tôi</span>
          <h2 className="about-title">Chúng tôi là ai?</h2>
          <p className="about-description">
            Tại Nguyên Phát, chúng tôi tự hào quy tụ đội ngũ hơn 1.500 chuyên gia, kỹ sư và kỹ thuật viên giàu kinh nghiệm, tận tâm với nghề. Mỗi thành viên đóng góp những kỹ năng và giải pháp kỹ thuật độc đáo, xây dựng môi trường làm việc hợp tác và đổi mới sáng tạo không ngừng. Cùng nhau, chúng tôi nỗ lực hướng tới mục tiêu chung: mang đến các giải pháp tủ bảng điện và hệ thống cơ điện toàn diện, tối ưu và chuẩn xác nhất cho mọi dự án của đối tác.
          </p>
          <div className="about-author">
            <div className="author-avatar"></div>
            <div className="author-info">
              <strong>George Brian</strong>
              <span>Tổng Giám Đốc / Nguyên Phát</span>
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

        <div className="about-center reveal-scale">
          <img 
            src={aboutImage}
            alt="Kỹ sư Cơ Điện Nguyên Phát thi công lắp đặt" 
            className="about-image"
          />
        </div>

        <div className="about-right reveal-right">
          <div className="mission-vision reveal delay-2">
            <h3 className="mv-title">Sứ <span className="text-yellow">Mệnh</span></h3>
            <p className="mv-description">
              Chúng tôi phát huy năng lực của tập thể hơn 1.500 nhân sự nhiệt huyết, không ngừng cải tiến và sáng tạo. Cam kết cung cấp giải pháp cơ điện và tủ bảng điện đạt chuẩn chất lượng quốc tế, đáp ứng toàn diện tiến độ và độ an toàn của mỗi dự án.
            </p>
          </div>
          <div className="mission-vision reveal delay-4">
            <h3 className="mv-title">Tầm <span className="text-yellow">Nhìn</span></h3>
            <p className="mv-description">
              Trở thành thương hiệu hàng đầu trong lĩnh vực sản xuất tủ điện và thiết bị cơ điện công nghiệp tại Việt Nam, mang đến giá trị thực chất và đồng hành lâu dài cùng khách hàng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
