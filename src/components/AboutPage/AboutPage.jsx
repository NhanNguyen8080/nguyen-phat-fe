import React from 'react';
import './AboutPage.css';
import aboutImage from '../../assets/about-us.png';

const coreValues = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Chất Lượng Vượt Trội',
    desc: '100% cấu kiện thép gia công kiểm định siêu âm, mối hàn đạt chuẩn ASTM/TCVN, bề mặt xử lý phun bi và sơn epoxy kháng ăn mòn cao.'
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Tiến Độ Cam Kết',
    desc: 'Quy trình sản xuất tự động hóa kết hợp lắp dựng cơ giới hóa hiện đại, cam kết bàn giao đúng hoặc vượt tiến độ thi công đã thỏa thuận.'
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: 'Giải Pháp Tối Ưu',
    desc: 'Thiết kế tối ưu tải trọng và khẩu độ nhịp, tiết kiệm từ 15% - 25% tổng chi phí đầu tư xây dựng nhà xưởng cho chủ doanh nghiệp.'
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'An Toàn Tuyệt Đối',
    desc: 'Tuân thủ nghiêm ngặt tiêu chuẩn an toàn lao động quốc tế ISO 45001, trang thiết bị bảo hộ chuẩn chỉnh và quy trình kiểm soát rủi ro 24/7.'
  }
];

const processSteps = [
  {
    num: '01',
    title: 'Khảo Sát & Tư Vấn',
    desc: 'Tiếp nhận yêu cầu, khảo sát địa chất thực địa và đề xuất phương án kết cấu tối ưu ngân sách.'
  },
  {
    num: '02',
    title: 'Thiết Kế 3D BIM',
    desc: 'Mô hình hóa chi tiết kiến trúc và tải trọng kết cấu thép 3D, bóc tách khối lượng chính xác 100%.'
  },
  {
    num: '03',
    title: 'Gia Công Tại Nhà Máy',
    desc: 'Cắt plasma CNC, gá đính tự động, hàn cổng tự động và phun bi làm sạch đạt độ nhám tiêu chuẩn Sa 2.5.'
  },
  {
    num: '04',
    title: 'Lắp Dựng Công Trường',
    desc: 'Vận chuyển cấu kiện, sử dụng cẩu chuyên dụng lắp ráp chính xác từng bu lông liên kết theo bản vẽ.'
  },
  {
    num: '05',
    title: 'Nghiệm Thu & Bảo Hành',
    desc: 'Bàn giao hồ sơ hoàn công, nghiệm thu PCCC và kích hoạt chính sách bảo hành kết cấu dài hạn 10 - 20 năm.'
  }
];

const AboutPage = ({ onNavigateHome }) => {
  return (
    <div className="about-page">
      {/* Tiêu đề trang sạch sẽ */}
      <div className="about-page-title-wrap">
        <div className="container">
          <h1 className="section-title">About <span className="text-yellow">Us</span></h1>
          <p className="about-page-subtitle">
            Hơn 15 năm kiến tạo giải pháp nhà thép tiền chế và xây dựng công nghiệp bền vững, đồng hành cùng sự thịnh vượng của hàng trăm doanh nghiệp.
          </p>
        </div>
      </div>

      <main className="container">
        {/* Câu chuyện & Giới thiệu chung */}
        <section className="about-intro-section">
          <div className="about-intro-grid">
            <div className="about-intro-text">
              <h2>Đối Tác Tổng Thầu Tin Cậy Của Mọi Công Trình</h2>
              <p>
                Được thành lập với sứ mệnh tiên phong trong lĩnh vực kết cấu thép tiền chế và tổng thầu xây dựng công nghiệp, Nguyên Phát (C&amp;A) tự hào quy tụ đội ngũ hơn 1.500 kỹ sư, kiến trúc sư và thợ lành nghề giàu kinh nghiệm.
              </p>
              <p>
                Chúng tôi sở hữu nhà máy gia công cơ khí hiện đại với hệ thống máy cắt Plasma CNC, máy hàn tự động dầm H và dây chuyền cán tôn panel cách nhiệt công nghệ cao, đáp ứng mọi yêu cầu kỹ thuật khắt khe nhất từ các chủ đầu tư trong và ngoài nước.
              </p>
            </div>

            <div className="about-intro-image-wrap">
              <img src={aboutImage} alt="Đội ngũ Nguyên Phát thi công trên công trường" className="about-intro-image" />
            </div>
          </div>
        </section>

        {/* Giá trị cốt lõi */}
        <section className="about-values-section">
          <div className="about-values-header">
            <h3>Giá Trị <span className="text-yellow">Cốt Lõi</span></h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem' }}>Những nguyên tắc định hướng chất lượng trong từng mối hàn và bản vẽ</p>
          </div>

          <div className="values-grid">
            {coreValues.map((val, idx) => (
              <div key={idx} className="value-card">
                <div className="value-icon">{val.icon}</div>
                <h4 className="value-title">{val.title}</h4>
                <p className="value-desc">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quy trình làm việc 5 bước */}
        <section className="about-process-section">
          <div className="about-process-header">
            <h3>Quy Trình <span className="text-yellow">Triển Khai Chuyên Nghiệp</span></h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginTop: '6px' }}>Đồng bộ từ khâu ý tưởng, tính toán kết cấu đến bàn giao hoàn thiện</p>
          </div>

          <div className="process-steps">
            {processSteps.map((step) => (
              <div key={step.num} className="process-step-item">
                <span className="step-number">{step.num}</span>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Thông tin CEO & Lãnh đạo */}
        <section className="about-ceo-section">
          <div className="about-ceo-header">
            <h3>Thông Điệp Từ <span className="text-yellow">CEO &amp; Nhà Sáng Lập</span></h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginTop: '6px' }}>Tầm nhìn chiến lược và cam kết đồng hành bền vững cùng khách hàng</p>
          </div>

          <div className="ceo-profile-card">
            {/* Cột hình ảnh & chức danh */}
            <div className="ceo-photo-col">
              <div className="ceo-avatar-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" 
                  alt="George Brian - CEO C&A" 
                  className="ceo-avatar-img"
                />
              </div>
              <span className="ceo-badge">CEO &amp; Founder</span>
              <h4 className="ceo-name">George Brian</h4>
              <p className="ceo-title">Tổng Giám Đốc / Nhà Sáng Lập C&amp;A</p>
            </div>

            {/* Cột thông điệp & profile */}
            <div className="ceo-content-col">
              <blockquote className="ceo-quote-box">
                "Tại Nguyên Phát, mỗi công trình thép được dựng lên không đơn thuần là một dự án xây dựng, mà là hiện thân của sự an toàn tuyệt đối, độ chính xác kỹ thuật cao và cam kết gắn bó lâu dài cùng sự thịnh vượng của mỗi đối tác."
              </blockquote>

              <div className="ceo-points-list">
                <div className="ceo-point-item">
                  <div className="ceo-point-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <div className="ceo-point-text">
                    <strong>Hơn 20 Năm Kinh Nghiệm Lãnh Đạo</strong>
                    <p>Trực tiếp chỉ huy và cố vấn kỹ thuật cho hơn 500+ dự án nhà xưởng công nghiệp, kho bãi logistics và trung tâm thương mại quy mô lớn.</p>
                  </div>
                </div>

                <div className="ceo-point-item">
                  <div className="ceo-point-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                  <div className="ceo-point-text">
                    <strong>Nền Tảng Kỹ Thuật Chuyên Sâu</strong>
                    <p>Thạc sĩ Kỹ thuật Xây dựng &amp; Quản lý Dự án, thành viên Hiệp hội Kết cấu Thép Quốc tế (AISC), tiên phong ứng dụng công nghệ 3D BIM và tự động hóa CNC.</p>
                  </div>
                </div>

                <div className="ceo-point-item">
                  <div className="ceo-point-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                  <div className="ceo-point-text">
                    <strong>Triết Lý Kinh Doanh Bền Vững</strong>
                    <p>Lấy con người làm trọng tâm, chất lượng làm danh dự và an toàn là ưu tiên số một trong mọi quyết định phát triển công trình.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="about-cta-section">
          <h3 className="about-cta-title">Sẵn Sàng Khởi Động Dự Án Của Bạn?</h3>
          <p className="about-cta-desc">
            Hãy liên hệ ngay với đội ngũ kỹ sư của Nguyên Phát để được tư vấn giải pháp kết cấu thép và nhận dự toán kinh phí chi tiết, chính xác nhất.
          </p>
          <button 
            type="button" 
            className="btn-primary"
            onClick={() => onNavigateHome('#contact')}
            style={{ padding: '14px 40px', fontSize: '1rem', cursor: 'pointer' }}
          >
            Liên Hệ Tư Vấn Ngay
          </button>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
