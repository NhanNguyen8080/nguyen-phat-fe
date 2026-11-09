import React from 'react';
import './Contact.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Contact = () => {
  const panelRef = useScrollReveal({ threshold: 0.08 });

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-panel" ref={panelRef}>
          <div className="contact-header reveal">
            <h2 className="section-title">
              Liên Hệ <span className="text-yellow">Với Chúng Tôi</span>
            </h2>
            <p className="contact-subtitle">
              Sẵn sàng bắt đầu dự án tiếp theo của bạn? Hãy kết nối ngay với đội ngũ kỹ sư của Nguyên Phát để được tư vấn phương án kỹ thuật và nhận báo giá tốt nhất.
            </p>
          </div>

          <div className="contact-content">
            <div className="contact-info reveal-left delay-2">
              <div className="contact-info-item">
                <h4 className="contact-info-title">Email</h4>
                <p className="contact-info-text">
                  <a href="mailto:codiennguyenphat@gmail.com" style={{ color: 'inherit' }}>
                    codiennguyenphat@gmail.com
                  </a>
                </p>
              </div>
              <div className="contact-info-item">
                <h4 className="contact-info-title">Hotline / Điện thoại</h4>
                <p className="contact-info-text">
                  <a href="tel:0903625628" style={{ color: 'inherit', fontWeight: '600' }}>0903 625 628</a> - <a href="tel:0903625629" style={{ color: 'inherit', fontWeight: '600' }}>0903 625 629</a>
                  <br />
                  <span>Tel: (028) 3765 5395 - Fax: (028) 3765 5385</span>
                </p>
              </div>
              <div className="contact-info-item">
                <h4 className="contact-info-title">Văn phòng &amp; Xưởng sản xuất</h4>
                <p className="contact-info-text">
                  <strong>VP:</strong> F4/8L Ấp 6, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP. HCM
                  <br />
                  <strong>Xưởng:</strong> F5/4 Liên Ấp 26, Xã Vĩnh Lộc A, Huyện Bình Chánh, TP. HCM
                </p>
              </div>
            </div>

            <form className="contact-form reveal-right delay-3" onSubmit={(e) => e.preventDefault()}>
              <div className="contact-form-row">
                <input type="text" className="contact-input" placeholder="Họ và tên của bạn" />
                <input type="email" className="contact-input" placeholder="Địa chỉ email" />
              </div>
              <textarea
                className="contact-input contact-textarea"
                placeholder="Mô tả nhu cầu dự án hoặc yêu cầu báo giá của bạn..."
                rows={5}
              />
              <button type="submit" className="btn-primary contact-submit">
                Gửi Tin Nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
