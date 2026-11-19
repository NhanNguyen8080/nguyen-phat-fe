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

// Dữ liệu Hình ảnh hoạt động thực tế của anh em trong công ty
const workMoments = [
  {
    id: 1,
    title: 'Khảo Sát & Giám Sát Công Trường',
    desc: 'Kỹ sư Cơ Điện Nguyên Phát trực tiếp khảo sát thực địa công trình, kiểm tra mặt bằng, không gian và phụ tải thực tế trước khi lên phương án bố trí hệ thống điện.',
    badge: 'Kỹ Sư Hiện Trường',
    imgUrl: '/catalog/pages/13.jpg',
    tag: 'Hiện Trường',
    highlights: [
      'Khảo sát chi tiết mặt bằng bệ móng và tuyến đường cáp dẫn',
      'Tư vấn phương án bố trí tủ điện và thang máng cáp tối ưu không gian',
      'Giám sát chặt chẽ quy chuẩn an toàn lao động và kỹ thuật thi công'
    ]
  },
  {
    id: 2,
    title: 'Thiết Kế Sơ Đồ Nguyên Lý 3D & Bóc Tách Bản Vẽ',
    desc: 'Đội ngũ kỹ sư R&D thiết kế chi tiết sơ đồ nguyên lý điện một sợi (Single Line), phối cảnh 3D tủ bảng điện và hệ thống phân phối cáp.',
    badge: 'Phòng Kỹ Thuật',
    imgUrl: '/catalog/pages/14.jpg',
    tag: 'Bản Vẽ 3D',
    highlights: [
      'Ứng dụng phần mềm chuyên dụng AutoCAD Electrical & 3D SolidWorks',
      'Bóc tách vật tư chính xác, tối ưu hóa kích thước vỏ tủ và thanh cái đồng',
      'Đồng bộ giải pháp kỹ thuật theo yêu cầu thiết kế của chủ đầu tư'
    ]
  },
  {
    id: 3,
    title: 'Gia Công Cơ Khí Vỏ Tủ & Thang Máng Cáp CNC',
    desc: 'Dây chuyền máy chấn, đột dập CNC tự động và buồng sơn tĩnh điện công nghệ cao đảm bảo độ chính xác cơ khí tuyệt đối.',
    badge: 'Nhà Máy Sản Xuất',
    imgUrl: '/catalog/pages/15.jpg',
    tag: 'Cơ Khí CNC',
    highlights: [
      'Gia công cơ khí CNC đạt cấp bảo vệ IP43, IP54 chống bụi nước',
      'Sơn tĩnh điện chống ăn mòn bề mặt, độ bền cao trong mọi môi trường',
      'Thép tấm tiêu chuẩn chất lượng cao độ dày từ 1.2mm đến 2.5mm'
    ]
  },
  {
    id: 4,
    title: 'Lắp Ráp Khí Cụ & Đấu Nối Thanh Cái Đồng Busbar',
    desc: 'Kỹ thuật viên lành nghề trực tiếp lắp ráp các thiết bị đóng cắt và gia công uốn ép thanh cái đồng nguyên chất chuẩn xác.',
    badge: 'Đấu Nối Tủ Điện',
    imgUrl: '/catalog/pages/16.jpg',
    tag: 'Lắp Ráp Tủ',
    highlights: [
      '100% thanh cái đồng đỏ nguyên chất mạ thiếc, bọc co nhiệt tiêu chuẩn',
      'Tích hợp khí cụ điện chính hãng Schneider, Mitsubishi, ABB, LS, Shihlin, Chint',
      'Đấu nối hệ thống nhị thứ, rơ-le điều khiển và đánh số thứ tự dây thẩm mỹ'
    ]
  },
  {
    id: 5,
    title: 'Đo Kiểm Cách Điện & Thử Nghiệm Vận Hành Xuất Xưởng',
    desc: 'Quy trình kiểm định chất lượng nghiêm ngặt của phòng QA/QC theo chuẩn TCVN và IEC 61439 trước khi xuất xưởng.',
    badge: 'Phòng QA/QC',
    imgUrl: '/catalog/pages/17.jpg',
    tag: 'Kiểm Định',
    highlights: [
      'Đo điện trở cách điện Megohmmeter và thử nghiệm phóng điện cao áp',
      'Kiểm tra liên động cơ khí khóa an toàn (Interlock ATS/MTS)',
      'Lập biên bản thử nghiệm nghiệm thu xuất xưởng (FAT) cho từng sản phẩm'
    ]
  },
  {
    id: 6,
    title: 'Vận Chuyển, Cẩu Lắp & Bàn Giao Dự Án',
    desc: 'Đội ngũ kỹ thuật hỗ trợ cẩu lắp đặt vào vị trí, hướng dẫn đấu nối, chạy thử liên động và bàn giao hồ sơ hoàn công.',
    badge: 'Hợp Tác Bền Vững',
    imgUrl: '/catalog/pages/18.jpg',
    tag: 'Bàn Giao',
    highlights: [
      'Phương tiện vận chuyển chuyên dụng bọc bảo vệ chống trầy xước',
      'Hỗ trợ đóng điện chạy thử và hướng dẫn vận hành trực tiếp tại công trình',
      'Bàn giao đầy đủ catalog, sơ đồ nguyên lý và chính sách bảo hành 24/7'
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
    placeholderText: 'Hình ảnh nhân viên đi khám sức khỏe định kỳ (Đang cập nhật)',
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
    placeholderText: 'Hình ảnh giải đấu bóng đá giao lưu công ty (Đang cập nhật)',
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
    placeholderText: 'Hình ảnh chuyến du lịch nghỉ dưỡng toàn thể nhân viên (Đang cập nhật)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
    )
  }
];

// Sơ Đồ Tổ Chức Công Ty
const orgDepartments = [
  {
    title: 'Phòng Kỹ Thuật & R&D',
    role: 'Tư Vấn & Thiết Kế',
    desc: 'Khảo sát hiện trường, bóc tách khối lượng, thiết kế bản vẽ 2D/3D tủ điện và lập trình tự động hóa PLC.'
  },
  {
    title: 'Nhà Máy Sản Xuất',
    role: 'Gia Công & Chế Tạo',
    desc: 'Phân xưởng đột dập chấn CNC cơ khí vỏ tủ, thang máng cáp và phân xưởng lắp ráp thiết bị, thanh cái đồng.'
  },
  {
    title: 'Phòng Quản Lý Chất Lượng',
    role: 'Kiểm Định QA/QC',
    desc: 'Đo kiểm cách điện, kiểm định an toàn theo chuẩn TCVN/IEC và cấp chứng thư xuất xưởng nghiêm ngặt.'
  },
  {
    title: 'Phòng Thi Công & Dự Án',
    role: 'Lắp Đặt Hiện Trường',
    desc: 'Cẩu lắp tủ điện tại dự án, đấu nối cáp, nghiệm thu đóng điện an toàn và bảo hành bảo trì 24/7 toàn quốc.'
  },
  {
    title: 'Phòng Kinh Doanh & Dịch Vụ',
    role: 'Báo Giá & Hỗ Trợ',
    desc: 'Tiếp nhận yêu cầu, tư vấn giải pháp kỹ thuật tối ưu chi phí và chăm sóc Quý khách hàng, Quý đối tác.'
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

      <main className="container about-main-content">
        {/* =========================================================
            MỤC 1: LỜI MỞ ĐẦU & BAN GIÁM ĐỐC & ĐỐI TÁC TIN CẬY
            ========================================================= */}
        <section className="about-section intro-leadership-section">
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
                <div className="director-avatar-wrapper">
                  <div className="director-avatar-ring">
                    <img 
                      src="/images/logo.png" 
                      alt="Giám đốc Mai Hưng HÀ - Cơ Điện Nguyên Phát" 
                      className="director-avatar-img"
                    />
                  </div>
                </div>

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
        </section>

        {/* =========================================================
            MỤC 2: GIÁ TRỊ CỐT LÕI (Từ feedback image16)
            ========================================================= */}
        <section className="about-section values-section">
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
        </section>

        {/* =========================================================
            MỤC 3: QUY TRÌNH SẢN XUẤT & THI CÔNG (Từ feedback image17)
            ========================================================= */}
        <section className="about-section process-section">
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
        </section>

        {/* =========================================================
            MỤC 4: HÌNH ẢNH THỰC TẾ (Thiết kế xen kẽ ảnh - chữ theo yêu cầu)
            ========================================================= */}
        <section className="about-section moments-section">
          <div className="section-title-wrap">
            <span className="section-mini-tag">HOẠT ĐỘNG THỰC TẾ</span>
            <h2 className="section-main-heading">
              Hình Ảnh <span className="highlight-red">Thực Tế</span>
            </h2>
            <p className="section-sub-heading">
              Hình ảnh thực tế anh em kỹ sư, kỹ thuật viên Cơ Điện Nguyên Phát trực tiếp làm việc, sản xuất và giám sát tại nhà máy &amp; công trường
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

                    <button 
                      type="button" 
                      className="moment-alt-lightbox-btn"
                      onClick={() => setSelectedPhoto(item)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/>
                        <line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                      Xem Phóng To Ảnh
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            MỤC 5: SƠ ĐỒ TỔ CHỨC CÔNG TY (Theo yêu cầu sơ đồ tổ chức nhỏ nhỏ)
            ========================================================= */}
        <section className="about-section orgchart-section">
          <div className="section-title-wrap">
            <span className="section-mini-tag">CƠ CẤU BỘ MÁY</span>
            <h2 className="section-main-heading">
              Sơ Đồ <span className="highlight-red">Tổ Chức Công Ty</span>
            </h2>
            <p className="section-sub-heading">
              Cơ cấu tổ chức tinh gọn, phối hợp nhịp nhàng, tối ưu hóa năng suất và kiểm soát chất lượng chặt chẽ
            </p>
          </div>

          <div className="orgchart-tree-container">
            {/* Cấp 1: Ban Giám Đốc */}
            <div className="orgchart-level-root">
              <div className="orgchart-node root-node">
                <div className="node-icon-crown">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div className="node-role-badge">CẤP QUẢN TRỊ CAO NHẤT</div>
                <h3 className="node-title">BAN GIÁM ĐỐC</h3>
                <p className="node-sub">Giám đốc Mai Hưng HÀ</p>
              </div>
            </div>

            {/* Đường Nối Phân Cấp */}
            <div className="orgchart-connector-vertical" />
            <div className="orgchart-connector-horizontal" />

            {/* Cấp 2: Các Phòng Ban Chức Năng */}
            <div className="orgchart-level-departments">
              {orgDepartments.map((dept, index) => (
                <div key={index} className="orgchart-node-wrapper">
                  <div className="orgchart-dept-stem" />
                  <div className="orgchart-node dept-node">
                    <span className="dept-num-badge">0{index + 1}</span>
                    <span className="dept-role-pill">{dept.role}</span>
                    <h4 className="dept-title">{dept.title}</h4>
                    <p className="dept-desc">{dept.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            MỤC 6: VĂN HÓA DOANH NGHIỆP CƠ ĐIỆN NGUYÊN PHÁT (Từ feedback image20 & text)
            ========================================================= */}
        <section className="about-section culture-section">
          <div className="section-title-wrap">
            <span className="section-mini-tag">CON NGƯỜI LÀ CỐT LÕI</span>
            <h2 className="section-main-heading">
              Văn Hóa <span className="highlight-red">Cơ Điện Nguyên Phát</span>
            </h2>
            <p className="section-sub-heading">
              Xây dựng môi trường làm việc nhân văn, chuyên nghiệp, gắn kết bền vững và luôn lấy con người làm trọng tâm phát triển
            </p>
          </div>

          {/* Khối Đoạn Văn Mở Đầu Văn Hóa (Trích chính xác từ doc feedback) */}
          <div className="culture-intro-card">
            <div className="culture-intro-accent-bar" />
            <div className="culture-intro-text-body">
              <p>
                Tại <strong>Cơ Điện Nguyên Phát</strong>, con người là yếu tố cốt lõi tạo nên chất lượng và sự phát triển bền vững. Chúng tôi không ngừng xây dựng đội ngũ kỹ sư, kỹ thuật viên có chuyên môn cao, giàu kinh nghiệm và luôn sẵn sàng đáp ứng những yêu cầu kỹ thuật khắt khe của khách hàng.
              </p>
              <p>
                Với tinh thần học hỏi, sáng tạo và trách nhiệm, mỗi thành viên tại Nguyên Phát đều góp phần tạo nên những sản phẩm chất lượng, mang đến giá trị bền vững cho khách hàng và đối tác.
              </p>
            </div>
          </div>

          {/* 3 Thẻ Hoạt Động Văn Hóa Doanh Nghiệp */}
          <div className="culture-cards-grid">
            {cultureItems.map((item) => (
              <div key={item.id} className="culture-card">
                <div className="culture-card-banner">
                  <div className="culture-img-placeholder">
                    <div className="placeholder-icon">{item.icon}</div>
                    <span className="placeholder-badge">{item.badge}</span>
                    <p className="placeholder-note">{item.placeholderText}</p>
                  </div>
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
        </section>

        {/* Nút Điều Hướng Trở Lại / Khám Phá Sản Phẩm & Hồ Sơ Năng Lực */}
        <section className="about-footer-nav-section">
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
