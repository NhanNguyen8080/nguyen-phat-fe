import React, { useState } from 'react';
import './AboutPage.css';

// Dữ liệu 4 Giá Trị Cốt Lõi (Trích chính xác từ doc feedback)
const coreValues = [
  {
    step: '01',
    title: 'Chất Lượng Là Nền Tảng',
    desc: 'Chú trọng chất lượng từ khâu lựa chọn vật tư, gia công cơ khí đến lắp ráp hoàn thiện. Mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi bàn giao.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    )
  },
  {
    step: '02',
    title: 'Kỹ Thuật & Đổi Mới',
    desc: 'Không ngừng cải tiến công nghệ sản xuất, nâng cao năng lực thiết kế và gia công, mang đến những giải pháp tủ điện tối ưu, chính xác và phù hợp với từng công trình.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    )
  },
  {
    step: '03',
    title: 'Uy Tín & Tiến Độ',
    desc: 'Luôn đặt trách nhiệm và cam kết lên hàng đầu. Chủ động trong kế hoạch sản xuất, đảm bảo tiến độ giao hàng và phối hợp chặt chẽ với khách hàng.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    )
  },
  {
    step: '04',
    title: 'Đồng Hành & Phát Triển',
    desc: 'Lắng nghe nhu cầu khách hàng, tư vấn giải pháp phù hợp và xây dựng mối quan hệ hợp tác lâu dài trên cơ sở minh bạch, tận tâm và cùng phát triển.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  }
];

// Dữ liệu Quy Trình 5 Bước chuẩn cơ điện (Trích chính xác từ doc feedback)
const processSteps = [
  {
    num: '01',
    title: 'Tiếp Nhận Yêu Cầu',
    desc: 'Tiếp nhận thông tin từ khách hàng, tìm hiểu nhu cầu sử dụng, quy cách sản phẩm, kích thước, thông số kỹ thuật và tiến độ yêu cầu.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    )
  },
  {
    num: '02',
    title: 'Tư Vấn & Thiết Kế Kỹ Thuật',
    desc: 'Đội ngũ kỹ thuật tư vấn giải pháp phù hợp, triển khai bản vẽ thiết kế 2D, 3D và bố trí thiết bị theo yêu cầu của từng dự án.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )
  },
  {
    num: '03',
    title: 'Báo Giá & Xác Nhận',
    desc: 'Lập báo giá chi tiết về vật tư, thiết bị và phương án sản xuất. Thống nhất bản vẽ, cấu hình kỹ thuật, chi phí và thời gian giao hàng.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  {
    num: '04',
    title: 'Gia Công & Lắp Ráp',
    desc: 'Triển khai gia công cắt, đột, chấn, hàn, xử lý bề mặt và sơn hoàn thiện. Tiến hành lắp đặt thiết bị, đấu nối theo bản vẽ đối với các sản phẩm tủ điện hoàn chỉnh.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    )
  },
  {
    num: '05',
    title: 'Kiểm Tra & Bàn Giao',
    desc: 'Kiểm tra chất lượng, kích thước, kết cấu và các hạng mục kỹ thuật theo yêu cầu. Hoàn thiện hồ sơ, bàn giao sản phẩm và thực hiện chính sách bảo hành.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    )
  }
];

// Dữ liệu Hình ảnh hoạt động thực tế (3 giai đoạn ngắn gọn: Văn phòng -> Nhà xưởng -> Lắp đặt thiết bị)
const workMoments = [
  {
    id: 1,
    title: 'Thiết Kế & Lập Trình Tại Văn Phòng',
    desc: 'Đội ngũ kỹ sư tập trung bóc tách bản vẽ 2D/3D, tính toán phụ tải và lập trình PLC chính xác cho từng dự án.',
    badge: 'Khối Văn Phòng',
    imgUrl: '/catalog/pages/14.jpg',
    tag: 'Thiết Kế 3D',
    highlights: [
      'Bóc tách bản vẽ và tối ưu sơ đồ nguyên lý',
      'Tính toán phụ tải tiết kiệm chi phí',
      'Lập trình điều khiển tự động hóa PLC'
    ]
  },
  {
    id: 2,
    title: 'Gia Công & Lắp Ráp Tại Nhà Xưởng',
    desc: 'Thợ lành nghề gia công vỏ tủ CNC, uốn thanh cái đồng Busbar và đấu nối khí cụ điện chính hãng.',
    badge: 'Xưởng Sản Xuất',
    imgUrl: '/catalog/pages/15.jpg',
    tag: 'Cơ Khí CNC',
    highlights: [
      'Gia công vỏ tủ & thang máng cáp CNC',
      'Đấu nối thanh cái đồng đỏ nguyên chất',
      'Kiểm định an toàn đạt chuẩn TCVN/IEC'
    ]
  },
  {
    id: 3,
    title: 'Lắp Đặt Thiết Bị Tại Công Trường',
    desc: 'Kỹ sư hiện trường trực tiếp cẩu lắp đặt tủ điện, kéo rải thang máng cáp và đóng điện vận hành an toàn.',
    badge: 'Hiện Trường Dự Án',
    imgUrl: '/catalog/pages/13.jpg',
    tag: 'Lắp Đặt Thực Tế',
    highlights: [
      'Định vị bệ móng & cẩu lắp an toàn',
      'Đấu nối cáp nguồn & thử tải liên động',
      'Bàn giao hoàn thiện & bảo hành 24/7'
    ]
  }
];

// Dữ liệu 3 Khối Văn Hóa Công Ty Nguyên Phát (Trích chính xác từ doc feedback)
const cultureItems = [
  {
    id: 1,
    title: 'Chăm Sóc Sức Khỏe & Phúc Lợi Toàn Diện',
    desc: 'Chúng tôi luôn chú trọng xây dựng môi trường làm việc chuyên nghiệp, an toàn và thân thiện. Đảm bảo các chế độ phúc lợi theo quy định như BHXH, BHYT và các quyền lợi liên quan.',
    highlight: 'Khám sức khỏe định kỳ & Bảo hộ lao động tối đa',
    badge: 'Môi Trường An Toàn',
    imageUrl: '/images/culture/kham-suc-khoe.jpg',
    placeholderText: 'Hình ảnh nhân viên đi khám sức khỏe định kỳ',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Giao Lưu Thể Thao & Gắn Kết Tập Thể',
    desc: 'Công ty thường xuyên tổ chức các hoạt động giao lưu thể thao, đặc biệt là bóng đá, góp phần nâng cao sức khỏe, gắn kết tập thể và phát huy tinh thần đồng đội.',
    highlight: 'Giải bóng đá nội bộ & Phong trào thể thao gắn kết',
    badge: 'Tinh Thần Đồng Đội',
    imageUrl: '/images/culture/giao-luu-bong-da.jpg',
    placeholderText: 'Hình ảnh giải đấu bóng đá giao lưu công ty',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m4.93 4.93 4.24 4.24"/>
        <path d="m14.83 9.17 4.24-4.24"/>
        <path d="m14.83 14.83 4.24 4.24"/>
        <path d="m9.17 14.83-4.24 4.24"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Du Lịch Thường Niên & Tái Tạo Năng Lượng',
    desc: 'Hằng năm, Cơ Điện Nguyên Phát đều tổ chức các chuyến du lịch, nghỉ dưỡng cho cán bộ, nhân viên nhằm tái tạo năng lượng, nâng cao đời sống tinh thần và tạo động lực cho những chặng đường phát triển tiếp theo.',
    highlight: 'Kỳ nghỉ teambuilding thường niên & Gắn kết gia đình',
    badge: 'Tái Tạo Năng Lượng',
    imageUrl: '/images/culture/du-lich-nghi-duong.jpg',
    placeholderText: 'Hình ảnh chuyến du lịch nghỉ dưỡng toàn thể nhân viên',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
    )
  }
];


const AboutPage = ({ onNavigateHome }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="about-page">
      {/* --- Breadcrumb & Page Banner --- */}
      <section className="about-hero-banner">
        <div className="container">
          <div className="about-breadcrumb">
            <button 
              type="button" 
              className="breadcrumb-home-link"
              onClick={() => onNavigateHome('#home')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Trang Chủ
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Giới Thiệu</span>
          </div>

          <div className="about-banner-content">
            <span className="about-banner-badge">HƠN 15 NĂM HÌNH THÀNH &amp; PHÁT TRIỂN (2009 - NAY)</span>
            <h1 className="about-banner-title">
              Về <span className="highlight-red">Cơ Điện Nguyên Phát</span>
            </h1>
            <p className="about-banner-subtitle">
              Đối tác tin cậy hàng đầu trong lĩnh vực sản xuất tủ bảng điện, thang máng cáp và cung cấp giải pháp cơ điện công nghiệp toàn diện theo tiêu chuẩn TCVN &amp; IEC.
            </p>
          </div>
        </div>
      </section>

      <main className="about-main-content">
        {/* =========================================================
            MỤC 1: LỜI MỞ ĐẦU & BAN GIÁM ĐỐC & ĐỐI TÁC TIN CẬY (Dải Bình Thường)
            ========================================================= */}
        <section className="about-section intro-leadership-section section-band-transparent">
          <div className="container">
            <div className="intro-leadership-grid">
            {/* Cột Trái: Lời Mở Đầu & Đối Tác Tin Cậy */}
            <div className="intro-text-column">
              <div className="intro-card-primary">
                <div className="section-label-chip">
                  <span className="chip-dot" />
                  LỜI MỞ ĐẦU
                </div>
                <blockquote className="intro-quote">
                  "Công ty TNHH SX - TM Cơ Điện Nguyên Phát trân trọng gửi lời chào, lời chúc sức khỏe và lời cảm ơn chân thành đến Quý khách hàng đã luôn tin tưởng sử dụng sản phẩm, dịch vụ của chúng tôi."
                </blockquote>
              </div>

              <div className="partner-trust-card">
                <h2 className="partner-trust-title">
                  Đối Tác Tin Cậy Cho <span className="highlight-red">Mọi Hệ Thống Điện</span>
                </h2>
                <div className="partner-trust-paragraphs">
                  <p>
                    Thành lập từ năm 2009, <strong>Công ty TNHH SX - TM Cơ Điện Nguyên Phát</strong> đã có nhiều năm kinh nghiệm trong lĩnh vực sản xuất tủ bảng điện, thang máng cáp và các giải pháp cơ điện. Với đội ngũ kỹ sư giàu chuyên môn và kinh nghiệm thực tiễn, chúng tôi luôn đáp ứng hiệu quả các yêu cầu đa dạng của khách hàng.
                  </p>
                  <p>
                    Sở hữu hệ thống máy móc, thiết bị sản xuất hiện đại cùng quy trình kiểm soát chất lượng chặt chẽ, Nguyên Phát cam kết mang đến những sản phẩm đạt tiêu chuẩn <strong>IEC, ISO và TCVN</strong> hiện hành, đảm bảo độ an toàn, độ bền và chất lượng cho mọi công trình.
                  </p>
                </div>

                <div className="intro-stats-row">
                  <div className="intro-stat-item">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">Năm Phát Triển (Từ 2009)</span>
                  </div>
                  <div className="intro-stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Chuẩn TCVN &amp; IEC 61439</span>
                  </div>
                  <div className="intro-stat-item">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Bảo Hành &amp; Hỗ Trợ Tận Nơi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột Phải: Thẻ Ban Giám Đốc (Thay thế ảnh cũ theo feedback image13) */}
            <div className="director-card-column">
              <div className="director-executive-card">
                <div className="director-card-header-accent" />


                <div className="director-info-box">
                  <span className="director-badge-pill">Ban Giám Đốc</span>
                  <h3 className="director-name">Giám đốc Mai Hưng HÀ</h3>
                  <p className="director-company-name">CÔNG TY TNHH SX - TM CƠ ĐIỆN NGUYÊN PHÁT</p>
                  
                  <div className="director-motto-box">
                    <span className="motto-quote-mark">“</span>
                    <p className="motto-text">
                      Lấy <strong>Uy tín – Chất lượng – Bền vững</strong> làm kim chỉ nam. Mỗi sản phẩm xuất xưởng là một lời cam kết về an toàn và hiệu quả kinh tế lâu dài cho khách hàng.
                    </p>
                  </div>

                  <div className="director-commitments-list">
                    <div className="commitment-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Trực tiếp chỉ đạo quy trình sản xuất &amp; kiểm soát chất lượng</span>
                    </div>
                    <div className="commitment-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Thiết bị chính hãng, chế tạo chính xác theo tiêu chuẩn quốc tế</span>
                    </div>
                    <div className="commitment-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Luôn đồng hành bền vững cùng Quý khách hàng &amp; Quý đối tác</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* =========================================================
            MỤC 2: GIÁ TRỊ CỐT LÕI (Dải Đục - Frosted Glass Band)
            ========================================================= */}
        <section className="about-section values-section section-band-opaque">
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-mini-tag">NGUYÊN TẮC HOẠT ĐỘNG</span>
              <h2 className="section-main-heading">
                Giá Trị <span className="highlight-red">Cốt Lõi</span>
              </h2>
              <p className="section-sub-heading">
                Những giá trị tạo nên chất lượng sản phẩm và uy tín của Cơ Điện Nguyên Phát trên mỗi công trình
              </p>
            </div>

          <div className="values-cards-grid">
            {coreValues.map((val) => (
              <div key={val.step} className="core-value-card">
                <div className="value-card-top">
                  <div className="value-icon-box">{val.icon}</div>
                  <span className="value-step-pill">{val.step}</span>
                </div>
                <h3 className="value-card-title">{val.title}</h3>
                <p className="value-card-desc">{val.desc}</p>
                <div className="value-card-bottom-line" />
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* =========================================================
            MỤC 3: QUY TRÌNH SẢN XUẤT & THI CÔNG (Dải Bình Thường)
            ========================================================= */}
        <section className="about-section process-section section-band-transparent">
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-mini-tag">CHUẨN HÓA QUY TRÌNH</span>
              <h2 className="section-main-heading">
                Quy Trình <span className="highlight-red">Sản Xuất &amp; Thi Công</span>
              </h2>
              <p className="section-sub-heading">
                Quy trình 5 bước khép kín đảm bảo chất lượng, tính chính xác và đúng tiến độ cam kết
              </p>
            </div>

            <div className="process-timeline-grid">
              {processSteps.map((step, idx) => (
                <div key={step.num} className="process-card-step">
                  <div className="process-step-header">
                    <span className="process-step-num">{step.num}</span>
                    <div className="process-step-icon">{step.icon}</div>
                    {idx < processSteps.length - 1 && <span className="process-connector-arrow">→</span>}
                  </div>
                  <h3 className="process-step-title">{step.title}</h3>
                  <p className="process-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            MỤC 4: HÌNH ẢNH THỰC TẾ (Dải Đục - Frosted Glass Band)
            ========================================================= */}
        <section className="about-section moments-section section-band-opaque">
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-mini-tag">HOẠT ĐỘNG THỰC TẾ</span>
              <h2 className="section-main-heading">
                Hình Ảnh <span className="highlight-red">Thực Tế</span>
              </h2>
              <p className="section-sub-heading">
                Hành trình làm việc tận tâm từ nghiên cứu thiết kế tại văn phòng đến chế tạo xưởng và lắp đặt thiết bị tại công trường
              </p>
            </div>

            <div className="moments-alternating-list">
            {workMoments.map((item, index) => {
              const isReversed = index % 2 === 1; // Hàng lẻ: ảnh trái chữ phải; Hàng chẵn: chữ trái ảnh phải
              return (
                <div 
                  key={item.id} 
                  className={`moment-alt-row ${isReversed ? 'is-reversed' : ''}`}
                >
                  {/* Cột Ảnh */}
                  <div 
                    className="moment-alt-image-col"
                    onClick={() => setSelectedPhoto(item)}
                  >
                    <div className="moment-alt-img-wrap">
                      <img 
                        src={item.imgUrl} 
                        alt={item.title} 
                        className="moment-alt-img"
                        loading="lazy"
                      />
                      <div className="moment-alt-overlay">
                        <span className="moment-alt-view-btn">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            <line x1="11" y1="8" x2="11" y2="14"/>
                            <line x1="8" y1="11" x2="14" y2="11"/>
                          </svg>
                          Xem Ảnh Chi Tiết
                        </span>
                      </div>
                      <span className="moment-alt-tag-badge">{item.tag}</span>
                    </div>
                  </div>

                  {/* Cột Chữ & Thông Tin Kỹ Thuật */}
                  <div className="moment-alt-text-col">
                    <div className="moment-alt-header-line">
                      <span className="moment-alt-step-chip">0{index + 1}</span>
                      <span className="moment-alt-badge">{item.badge}</span>
                    </div>
                    <h3 className="moment-alt-title">{item.title}</h3>
                    <p className="moment-alt-desc">{item.desc}</p>
                    
                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="moment-alt-highlights-list">
                        {item.highlights.map((hl, hIdx) => (
                          <li key={hIdx} className="moment-alt-highlight-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    )}


                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </section>

        {/* =========================================================
            MỤC 5: SƠ ĐỒ TỔ CHỨC CÔNG TY (Dải Bình Thường)
            ========================================================= */}
        <section className="about-section orgchart-section section-band-transparent">
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-mini-tag">CƠ CẤU BỘ MÁY ĐIỀU HÀNH</span>
              <h2 className="section-main-heading">
                Sơ Đồ <span className="highlight-red">Tổ Chức Doanh Nghiệp</span>
              </h2>
              <p className="section-sub-heading">
                Bộ máy quản trị tinh gọn, phân quyền minh bạch, phối hợp chặt chẽ từ ban lãnh đạo chiến lược đến đội ngũ sản xuất và thi công hiện trường
              </p>
            </div>

            <div className="orgchart-board-card">
            {/* Header kỹ thuật theo sơ đồ */}
            <div className="orgchart-board-header">
              <div className="orgchart-board-title-line">
                <div className="orgchart-header-symbol">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" y1="3" x2="6" y2="15"/>
                    <circle cx="18" cy="6" r="3"/>
                    <circle cx="6" cy="18" r="3"/>
                    <path d="M18 9a9 9 0 0 1-9 9"/>
                  </svg>
                </div>
                <div className="orgchart-header-texts">
                  <span className="orgchart-board-red-title">SƠ ĐỒ TỔ CHỨC BỘ MÁY NGUYÊN PHÁT</span>
                  <span className="orgchart-board-sub-badge">5 Cấp Quản Trị • 11 Bộ Phận Chuyên Trách • Vận Hành Khép Kín</span>
                </div>
                <div className="orgchart-board-red-bar" />
              </div>

              <div className="orgchart-actions-group">
                <button 
                  type="button" 
                  className="orgchart-view-original-btn"
                  onClick={() => setSelectedPhoto({
                    imgUrl: '/images/so-do-to-chuc.png',
                    title: 'Sơ Đồ Tổ Chức - Cơ Điện Nguyên Phát',
                    badge: 'Bản Vẽ Gốc',
                    desc: 'Sơ đồ tổ chức cơ cấu bộ máy từ Ban Giám Đốc, Giám Đốc, Ban Quản Lý Dự Án đến các bộ phận chức năng và đội ngũ công nhân trực tiếp sản xuất, lắp đặt.'
                  })}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                  Xem Bản Gốc (Ảnh)
                </button>
              </div>
            </div>

            {/* Canvas sơ đồ dạng cây tương tác chuẩn theo sơ đồ */}
            <div className="orgchart-canvas-scroll">
              <div className="orgchart-canvas-inner">
                {/* ================= CẤP 1: BAN GIÁM ĐỐC ================= */}
                <div className="org-tree-level org-tree-level-1">
                  <div className="org-card org-card-director org-card-top-exec">
                    <div className="org-card-body-row">
                      <div className="org-card-icon-box box-crimson">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </div>
                      <h4 className="org-card-title">BAN GIÁM ĐỐC</h4>
                    </div>
                  </div>
                </div>

                {/* Mũi tên từ Cấp 1 xuống Cấp 2 (Trục điều hành trung tâm) */}
                <div className="org-connector-single">
                  <div className="org-stem-line is-accent-spine" />
                  <div className="org-stem-arrow is-accent-spine" />
                </div>

                {/* ================= CẤP 2: GIÁM ĐỐC ================= */}
                <div className="org-tree-level org-tree-level-2">
                  <div className="org-card org-card-director org-card-ceo">
                    <div className="org-card-body-row">
                      <div className="org-card-icon-box box-crimson">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <polyline points="16 11 18 13 22 9"/>
                        </svg>
                      </div>
                      <h4 className="org-card-title">GIÁM ĐỐC</h4>
                    </div>
                  </div>
                </div>

                {/* Phân nhánh từ GIÁM ĐỐC xuống CẤP 3 (5 Bộ phận chức năng) */}
                <div className="org-branch-wrap">
                  <div className="org-branch-upper-stem is-accent-spine" />
                  <div className="org-branch-row">
                    {/* Cột 1: Hành chính */}
                    <div className="org-branch-col is-first">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem" />
                      <div className="org-branch-arrow" />
                    </div>
                    {/* Cột 2: Tài chính - Kế toán */}
                    <div className="org-branch-col is-middle">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem" />
                      <div className="org-branch-arrow" />
                    </div>
                    {/* Cột 3: Ban Quản Lý Dự Án (Trục trung tâm) */}
                    <div className="org-branch-col is-center">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem is-accent-spine" />
                      <div className="org-branch-arrow is-accent-spine" />
                    </div>
                    {/* Cột 4: Kinh doanh */}
                    <div className="org-branch-col is-middle">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem" />
                      <div className="org-branch-arrow" />
                    </div>
                    {/* Cột 5: Thiết kế */}
                    <div className="org-branch-col is-last">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem" />
                      <div className="org-branch-arrow" />
                    </div>
                  </div>
                </div>

                {/* ================= CẤP 3: 5 KHỐI PHÒNG BAN CHỨC NĂNG ================= */}
                <div className="org-cards-row-5">
                  {/* 1. Bộ phận Hành chính */}
                  <div className="org-card org-card-dept border-slate">
                    <div className="org-dept-icon-circle bg-slate-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                        <path d="M9 22v-4h6v4"/>
                        <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title">BỘ PHẬN<br />HÀNH CHÍNH</h5>
                  </div>

                  {/* 2. Bộ phận Tài chính - Kế toán */}
                  <div className="org-card org-card-dept border-blue">
                    <div className="org-dept-icon-circle bg-blue-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title">BỘ PHẬN<br />TÀI CHÍNH - KẾ TOÁN</h5>
                  </div>

                  {/* 3. Ban Quản Lý Dự Án (Trục Chỉ Huy Trung Tâm) */}
                  <div className="org-card org-card-dept border-red-spine org-card-dept-highlight">
                    <div className="org-dept-icon-circle bg-red-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title highlight-red-text">BAN QUẢN LÝ<br />DỰ ÁN</h5>
                  </div>

                  {/* 4. Bộ phận Kinh doanh */}
                  <div className="org-card org-card-dept border-emerald">
                    <div className="org-dept-icon-circle bg-emerald-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                        <polyline points="17 6 23 6 23 12"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title">BỘ PHẬN<br />KINH DOANH</h5>
                  </div>

                  {/* 5. Bộ phận Thiết kế */}
                  <div className="org-card org-card-dept border-purple">
                    <div className="org-dept-icon-circle bg-purple-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title">BỘ PHẬN<br />THIẾT KẾ</h5>
                  </div>
                </div>

                {/* Phân nhánh từ BAN QUẢN LÝ DỰ ÁN xuống CẤP 4 (5 Bộ phận hiện trường/kho/bảo dưỡng) */}
                <div className="org-branch-wrap">
                  <div className="org-branch-upper-stem is-accent-spine" />
                  <div className="org-branch-row">
                    {/* Cột 1: Thi công điện */}
                    <div className="org-branch-col is-first">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem" />
                      <div className="org-branch-arrow" />
                    </div>
                    {/* Cột 2: Thi công cơ khí */}
                    <div className="org-branch-col is-middle">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem" />
                      <div className="org-branch-arrow" />
                    </div>
                    {/* Cột 3: BP Quản lý kho (Trục trung tâm) */}
                    <div className="org-branch-col is-center">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem is-accent-spine" />
                      <div className="org-branch-arrow is-accent-spine" />
                    </div>
                    {/* Cột 4: BP Mua bán hàng hóa */}
                    <div className="org-branch-col is-middle">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem" />
                      <div className="org-branch-arrow" />
                    </div>
                    {/* Cột 5: Bộ phận bảo dưỡng */}
                    <div className="org-branch-col is-last">
                      <div className="org-branch-line-h" />
                      <div className="org-branch-stem" />
                      <div className="org-branch-arrow" />
                    </div>
                  </div>
                </div>

                {/* ================= CẤP 4: 5 BỘ PHẬN KỸ THUẬT & VẬN HÀNH ================= */}
                <div className="org-cards-row-5">
                  {/* 1. Bộ phận Thi công điện */}
                  <div className="org-card org-card-subdept border-amber">
                    <div className="org-subdept-icon bg-amber-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title">BỘ PHẬN<br />THI CÔNG ĐIỆN</h5>
                  </div>

                  {/* 2. Bộ phận Thi công cơ khí */}
                  <div className="org-card org-card-subdept border-teal">
                    <div className="org-subdept-icon bg-teal-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title">BỘ PHẬN<br />THI CÔNG CƠ KHÍ</h5>
                  </div>

                  {/* 3. BP Quản lý kho (Trục hậu cần trung tâm) */}
                  <div className="org-card org-card-subdept border-orange-spine org-card-subdept-highlight">
                    <div className="org-subdept-icon bg-orange-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title highlight-orange-text">BP. QUẢN LÝ<br />KHO</h5>
                  </div>

                  {/* 4. BP Mua bán hàng hóa */}
                  <div className="org-card org-card-subdept border-indigo">
                    <div className="org-subdept-icon bg-indigo-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title">BP MUA BÁN<br />HÀNG HÓA</h5>
                  </div>

                  {/* 5. Bộ phận Bảo dưỡng */}
                  <div className="org-card org-card-subdept border-emerald">
                    <div className="org-subdept-icon bg-emerald-subtle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <polyline points="9 12 11 14 15 10"/>
                      </svg>
                    </div>
                    <h5 className="org-card-title">BỘ PHẬN<br />BẢO DƯỠNG</h5>
                  </div>
                </div>

                {/* Mũi tên từ BP. QUẢN LÝ KHO xuống CẤP 5 (Trục chuyển giao sản xuất) */}
                <div className="org-connector-single">
                  <div className="org-stem-line is-accent-spine" />
                  <div className="org-stem-arrow is-accent-spine" />
                </div>

                {/* ================= CẤP 5: ĐỘI NGŨ CN TRỰC TIẾP SẢN XUẤT, LẮP ĐẶT ================= */}
                <div className="org-tree-level org-tree-level-5">
                  <div className="org-card org-card-workers-pro">
                    <div className="workers-content-wrap">
                      <div className="workers-icon-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 18h20"/>
                          <path d="M5 18a7 7 0 0 1 14 0"/>
                          <line x1="12" y1="4" x2="12" y2="8"/>
                          <line x1="8" y1="6" x2="8" y2="8"/>
                          <line x1="16" y1="6" x2="16" y2="8"/>
                        </svg>
                      </div>
                      <div className="workers-texts">
                        <h4 className="workers-title">ĐỘI NGŨ CN TRỰC TIẾP SẢN XUẤT, LẮP ĐẶT</h4>
                        <div className="workers-sub-tags-row">
                          <span className="worker-tag-item">Nhà Xưởng Cơ Khí CNC</span>
                          <span className="worker-tag-dot">•</span>
                          <span className="worker-tag-item">Tổ Đấu Nối Tủ Điện</span>
                          <span className="worker-tag-dot">•</span>
                          <span className="worker-tag-item">Đội Kéo Rải Cáp &amp; Đóng Điện</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chỉ dẫn vuốt chạm trên màn hình nhỏ */}
            <div className="orgchart-mobile-swipe-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <span>Vuốt ngang để xem toàn bộ sơ đồ tổ chức</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
          </div>
        </section>

        {/* =========================================================
            MỤC 6: VĂN HÓA DOANH NGHIỆP CƠ ĐIỆN NGUYÊN PHÁT (Dải Đục - Frosted Glass Band)
            ========================================================= */}
        <section className="about-section culture-section section-band-opaque">
          <div className="container">
            {/* Banner Văn Hóa & Đội Ngũ - Ảnh Nền Bao Trùm Cả Title Văn Hóa Công Ty */}
            <div className="culture-team-hero-banner">
              <div className="culture-team-banner-overlay" />
              <div className="culture-team-banner-content">
                {/* Phần Title Văn Hóa Doanh Nghiệp được ảnh nền bao trùm */}
                <div className="culture-banner-header">
                  <span className="section-mini-tag culture-banner-mini-tag">CON NGƯỜI LÀ CỐT LÕI</span>
                  <h2 className="culture-banner-main-heading">
                    Văn Hóa <span className="highlight-brand-orange">Cơ Điện Nguyên Phát</span>
                  </h2>
                  <p className="culture-banner-sub-heading">
                    Xây dựng môi trường làm việc nhân văn, chuyên nghiệp, gắn kết bền vững và luôn lấy con người làm trọng tâm phát triển
                  </p>
                </div>

                {/* Đường chỉ phân cách mềm giữa Title và Đội ngũ */}
                <div className="culture-team-divider-line" />

                {/* Khối Đoạn Văn Đội Ngũ (Nội dung cập nhật mới) */}
                <div className="culture-team-accent-line" />
                <h3 className="culture-team-banner-title">ĐỘI NGŨ</h3>
                <div className="culture-team-banner-text">
                  <p>
                    Tại <strong className="brand-orange">Cơ Điện</strong> <strong className="brand-blue">Nguyên Phát</strong>, con người là yếu tố cốt lõi tạo nên chất lượng và sự phát triển bền vững. Chúng tôi không ngừng xây dựng đội ngũ kỹ sư, kỹ thuật viên có chuyên môn cao, giàu kinh nghiệm và luôn sẵn sàng đáp ứng những yêu cầu kỹ thuật khắt khe của khách hàng.
                  </p>
                  <p>
                    Với tinh thần học hỏi, sáng tạo và trách nhiệm, mỗi thành viên tại <strong className="brand-orange">Nguyên</strong> <strong className="brand-blue">Phát</strong> đều góp phần tạo nên những sản phẩm chất lượng, mang đến giá trị bền vững cho khách hàng và đối tác.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Thẻ Hoạt Động Văn Hóa Doanh Nghiệp */}
            <div className="culture-cards-grid">
              {cultureItems.map((item) => (
                <div key={item.id} className="culture-card">
                  <div 
                    className="culture-card-banner"
                    onClick={() => setSelectedPhoto({
                      id: `culture-${item.id}`,
                      imgUrl: item.imageUrl,
                      title: item.title,
                      badge: item.badge,
                      desc: item.desc
                    })}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="culture-card-img"
                      loading="lazy"
                    />
                    <div className="culture-card-img-overlay">
                      <span className="culture-view-photo-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          <line x1="11" y1="8" x2="11" y2="14"/>
                          <line x1="8" y1="11" x2="14" y2="11"/>
                        </svg>
                        Xem Ảnh Chi Tiết
                      </span>
                    </div>
                    <span className="culture-badge-overlay">{item.badge}</span>
                  </div>

                  <div className="culture-card-body">
                    <div className="culture-card-header">
                      <div className="culture-icon-mini">{item.icon}</div>
                      <h3 className="culture-card-title">{item.title}</h3>
                    </div>
                    <p className="culture-card-desc">{item.desc}</p>
                    <div className="culture-highlight-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{item.highlight}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nút Điều Hướng Trở Lại / Khám Phá Sản Phẩm & Hồ Sơ Năng Lực (Dải Bình Thường) */}
        <section className="about-footer-nav-section section-band-transparent">
          <div className="container">
            <div className="about-nav-buttons-wrap">
              <button 
                type="button" 
                className="btn-outline-back"
                onClick={() => onNavigateHome('#home')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Quay Về Trang Chủ
              </button>
              <button 
                type="button" 
                className="btn-primary-contact"
                onClick={() => onNavigateHome('#contact')}
              >
                Liên Hệ &amp; Nhận Báo Giá
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Phóng To Ảnh Khi Click */}
      {selectedPhoto && (
        <div className="about-lightbox-backdrop" onClick={() => setSelectedPhoto(null)}>
          <div className="about-lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="lightbox-close-btn"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Đóng"
            >
              ✕
            </button>
            <img 
              src={selectedPhoto.imgUrl} 
              alt={selectedPhoto.title} 
              className="lightbox-full-img"
            />
            <div className="lightbox-caption">
              <span className="lightbox-badge">{selectedPhoto.badge}</span>
              <h4 className="lightbox-title">{selectedPhoto.title}</h4>
              <p className="lightbox-desc">{selectedPhoto.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
