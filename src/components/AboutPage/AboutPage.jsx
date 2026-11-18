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
    title: 'Chất Lượng Chuẩn TCVN & IEC',
    desc: '100% sản phẩm tủ bảng điện và thang máng cáp được chế tạo theo tiêu chuẩn TCVN và IEC 61439, kiểm tra nghiêm ngặt trước khi xuất xưởng.'
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Đúng Tiến Độ Cam Kết',
    desc: 'Dây chuyền gia công cơ khí CNC, chấn, đột dập và sơn tĩnh điện đồng bộ giúp đáp ứng hoàn hảo tiến độ của mọi dự án công nghiệp.'
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
    title: 'Giải Pháp Kinh Tế Tối Ưu',
    desc: 'Cam kết tư vấn và cung cấp cho khách hàng những giải pháp có hiệu quả kinh tế cao, giá cả cạnh tranh dựa trên các tiêu chí kỹ thuật tối ưu.'
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
    title: 'Bảo Hành & Đồng Hành Bền Vững',
    desc: 'Đội ngũ kỹ sư cơ điện trực tiếp hỗ trợ kỹ thuật, lắp đặt, lập trình PLC và bảo hành bảo trì tận nơi 24/7 trên toàn quốc.'
  }
];

const processSteps = [
  {
    num: '01',
    title: 'Khảo Sát & Tư Vấn Kỹ Thuật',
    desc: 'Tiếp nhận yêu cầu phụ tải, khảo sát thực tế công trình và tư vấn giải pháp hệ thống điện tối ưu.'
  },
  {
    num: '02',
    title: 'Thiết Kế Bản Vẽ & Bóc Tách',
    desc: 'Thiết kế sơ đồ nguyên lý, bản vẽ bố trí tủ bảng điện (MSB, ATS, DB, MCC...) và hệ thống thang máng cáp.'
  },
  {
    num: '03',
    title: 'Sản Xuất Cơ Khí & Lắp Ráp',
    desc: 'Gia công vỏ tủ CNC, sơn tĩnh điện, lắp ráp khí cụ điện chính hãng (Schneider, Mitsubishi, LS, ABB, Shihlin, Chint...).'
  },
  {
    num: '04',
    title: 'Kiểm Định & Thi Công Lắp Đặt',
    desc: 'Test vận hành, đo kiểm cách điện theo chuẩn TCVN/IEC trước khi xuất xưởng và thi công lắp đặt tại dự án.'
  },
  {
    num: '05',
    title: 'Nghiệm Thu & Bảo Trì 24/7',
    desc: 'Bàn giao hồ sơ kỹ thuật hoàn công, hướng dẫn vận hành và thực hiện chế độ bảo hành, bảo trì định kỳ.'
  }
];

const AboutPage = ({ onNavigateHome }) => {
  return (
    <div className="about-page">
      <div className="about-page-title-wrap">
        <div className="container">
          <h1 className="section-title">Về <span className="text-yellow">Cơ Điện Nguyên Phát</span></h1>
          <p className="about-page-subtitle">
            Thành lập từ năm 2009 — Hơn 15 năm xây dựng và phát triển trong lĩnh vực sản xuất, thiết kế và thi công hệ thống điện công nghiệp với phương châm Uy tín – Chất lượng – Bền vững.
          </p>
        </div>
      </div>

      <main className="container">
        <section className="about-intro-section">
          <div className="about-intro-grid">
            <div className="about-intro-text">
              <h2>Cảm Ơn Quý Khách Hàng Đã Đồng Hành</h2>
              <p>
                Thành lập từ năm 2009, <strong>CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI CƠ ĐIỆN NGUYÊN PHÁT</strong> đã trải qua hơn 15 năm xây dựng và phát triển trong lĩnh vực sản xuất, thiết kế và thi công hệ thống điện công nghiệp. Mỗi thành quả hôm nay đều có sự tin tưởng và đồng hành của Quý khách hàng, Quý đối tác.
              </p>
              <p>
                <strong>Nguyên Phát</strong> chuyên thiết kế, sản xuất tủ bảng điện (MSB, DB, ATS, VCB, tủ điều khiển, tủ tụ bù…) và thang máng cáp cho mọi quy mô dự án, đồng thời nhận lắp đặt hệ thống điện, tư vấn thiết kế đường dây trạm biến áp, thi công và lập trình PLC trọn gói. Sản phẩm được chế tạo theo tiêu chuẩn <strong>TCVN và IEC</strong>, đảm bảo <strong>Chất lượng cao – Đúng tiến độ – Giá hợp lý</strong>.
              </p>
            </div>

            <div className="about-intro-image-wrap">
              <img src={aboutImage} alt="Đội ngũ kỹ sư Cơ Điện Nguyên Phát" className="about-intro-image" />
            </div>
          </div>
        </section>

        <section className="about-values-section">
          <div className="about-values-header">
            <h3>Giá Trị <span className="text-yellow">Cốt Lõi</span></h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem' }}>Những chuẩn mực kỹ thuật và cam kết chất lượng trong từng sản phẩm xuất xưởng</p>
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

        <section className="about-process-section">
          <div className="about-process-header">
            <h3>Quy Trình <span className="text-yellow">Sản Xuất &amp; Thi Công</span></h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginTop: '6px' }}>Khép kín từ khâu tư vấn thiết kế, chế tạo tại xưởng đến lắp đặt và bảo trì trọn gói</p>
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

        <section className="about-ceo-section">
          <div className="about-ceo-header">
            <h3>Thông Điệp Từ <span className="text-yellow">Ban Giám Đốc</span></h3>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginTop: '6px' }}>Tầm nhìn chiến lược và cam kết đồng hành bền vững cùng Quý khách hàng, Quý đối tác</p>
          </div>

          <div className="ceo-profile-card">
            <div className="ceo-photo-col">
              <div className="ceo-avatar-wrap" style={{ backgroundColor: '#fff5f5', padding: '18px' }}>
                <img 
                  src="/images/logo.png" 
                  alt="Giám đốc Mai Hưng HÀ - Cơ Điện Nguyên Phát" 
                  className="ceo-avatar-img"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span className="ceo-badge">Ban Giám Đốc</span>
              <h4 className="ceo-name">Giám đốc Mai Hưng HÀ</h4>
              <p className="ceo-title">CÔNG TY TNHH SX - TM CƠ ĐIỆN NGUYÊN PHÁT</p>
            </div>

            <div className="ceo-content-col">
              <blockquote className="ceo-quote-box">
                "Mỗi thành quả hôm nay của Cơ Điện Nguyên Phát đều có sự tin tưởng và đồng hành của Quý khách hàng, Quý đối tác. Chúng tôi cam kết tiếp tục làm việc với phương châm Uy tín – Chất lượng – Bền vững, cung cấp những giải pháp kỹ thuật tối ưu và hiệu quả kinh tế cao nhất."
              </blockquote>

              <div className="ceo-points-list">
                <div className="ceo-point-item">
                  <div className="ceo-point-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <div className="ceo-point-text">
                    <strong>Hơn 15 Năm Phát Triển Vững Mạnh (Từ 2009)</strong>
                    <p>Trực tiếp thiết kế, sản xuất và thi công hàng trăm dự án tủ bảng điện, thang máng cáp và hệ thống điện công nghiệp trên toàn quốc.</p>
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
                    <strong>Đổi Mới Công Nghệ &amp; Chuẩn Hóa Quốc Tế</strong>
                    <p>Không ngừng đẩy mạnh nghiên cứu công nghệ, nâng cao năng suất và kiểm soát chất lượng nghiêm ngặt theo tiêu chuẩn TCVN và IEC.</p>
                  </div>
                </div>

                <div className="ceo-point-item">
                  <div className="ceo-point-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                  <div className="ceo-point-text">
                    <strong>Hợp Tác Bền Vững &amp; Chuyên Nghiệp</strong>
                    <p>Hợp tác chặt chẽ và lâu dài với các doanh nghiệp trong và ngoài nước tại Việt Nam, phát huy sự chuyên nghiệp ngay từ những công việc đơn giản nhất.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-cta-section">
          <h3 className="about-cta-title">Sẵn Sàng Khởi Động Dự Án Cơ Điện Của Bạn?</h3>
          <p className="about-cta-desc">
            Hãy liên hệ ngay với đội ngũ kỹ sư Cơ Điện Nguyên Phát để được tư vấn phương án kỹ thuật tối ưu và nhận báo giá tốt nhất.
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
