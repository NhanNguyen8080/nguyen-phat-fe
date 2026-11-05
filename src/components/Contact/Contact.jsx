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
                <p className="contact-info-text">kinhdoanh@diennguyenphat.com</p>
              </div>
              <div className="contact-info-item">
                <h4 className="contact-info-title">Hotline / Điện thoại</h4>
                <p className="contact-info-text">0903.333.333 / (028) 3750 8888</p>
              </div>
              <div className="contact-info-item">
                <h4 className="contact-info-title">Trụ sở &amp; Nhà máy</h4>
                <p className="contact-info-text">
                  Khu Công Nghiệp Tân Tạo,
                  <br />
                  Quận Bình Tân, TP. Hồ Chí Minh
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
