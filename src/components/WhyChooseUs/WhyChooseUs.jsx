import React from 'react';
import './WhyChooseUs.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const WhyChooseUs = () => {
  const panelRef = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="wcu-panel" ref={panelRef}>
          <div className="wcu-header reveal">
            <h2 className="section-title">Tại sao chọn <span className="text-yellow">Nguyên Phát?</span></h2>
            <p className="wcu-subtitle">
              Chúng tôi tự hào với đội ngũ hơn 1.500 chuyên gia và kỹ sư tay nghề cao, luôn tận tâm mang đến những giải pháp cơ điện và tủ bảng điện tối ưu, an toàn và bền vững nhất.
            </p>
          </div>

          <div className="wcu-features">
            <div className="wcu-feature reveal delay-2">
              <div className="feature-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 className="feature-title">Đội Ngũ Kỹ Sư Giàu Kinh Nghiệm</h4>
              <p className="feature-desc">
                Hợp tác cùng Nguyên Phát là đồng hành cùng đội ngũ kỹ thuật lành nghề, luôn đưa ra các giải pháp thiết kế và lắp đặt tối ưu hiệu suất cho từng hệ thống điện.
              </p>
            </div>

            <div className="wcu-feature reveal delay-3">
              <div className="feature-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="18" rx="1" />
                  <rect x="14" y="8" width="7" height="13" rx="1" />
                  <path d="M6 7h1" />
                  <path d="M6 11h1" />
                  <path d="M6 15h1" />
                  <path d="M17 12h1" />
                  <path d="M17 16h1" />
                </svg>
              </div>
              <h4 className="feature-title">Chất Lượng Đạt Chuẩn Quốc Tế</h4>
              <p className="feature-desc">
                Mỗi tủ điện và hệ thống thang máng cáp đều được sản xuất, kiểm định nghiêm ngặt theo tiêu chuẩn quốc tế IEC 61439-1/2 và quy chuẩn kỹ thuật an toàn.
              </p>
            </div>

            <div className="wcu-feature reveal delay-4">
              <div className="feature-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  <path d="m3 21 7-7" />
                  <path d="m13 3 8 8" />
                </svg>
              </div>
              <h4 className="feature-title">Trang Thiết Bị Cơ Khí Hiện Đại</h4>
              <p className="feature-desc">
                Nhà máy trang bị hệ thống máy đột dập CNC, máy chấn tự động và công nghệ sơn tĩnh điện tiên tiến giúp đảm bảo độ chính xác cơ khí cao nhất.
              </p>
            </div>
          </div>

          <div className="wcu-footer reveal delay-5">
            <a href="#contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Bắt Đầu Dự Án</a>
            <span className="wcu-footer-text">Đơn vị uy tín hàng đầu cung cấp giải pháp cơ điện và tủ bảng điện chuyên nghiệp.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
