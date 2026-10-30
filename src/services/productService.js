/**
 * Service kết nối và Mock API Sản phẩm Cơ Điện Nguyên Phát
 * 
 * 2 API chuẩn theo OpenAPI Specification:
 * 1. GET https://nguyen-phat-admin.onrender.com/api/v1/products/
 *    (Hỗ trợ query: category_id, product_type, is_featured, search, skip, limit)
 * 2. GET https://nguyen-phat-admin.onrender.com/api/v1/products/{product_id}
 *    (Chi tiết đầy đủ thông số kỹ thuật của 1 sản phẩm)
 * 
 * Schema ProductResponse gồm 28 trường kỹ thuật chuẩn:
 * - id: string (uuid)
 * - name: string
 * - slug: string
 * - code: string | null
 * - brand: string | null
 * - product_type: string | null
 * - category_id: string (uuid) | null
 * - category_name: string | null
 * - description: string | null
 * - thumbnail: string | null
 * - images: string[]
 * - rated_voltage: string | null
 * - rated_current: string | null
 * - frequency: string | null
 * - ip_rating: string | null
 * - standards: string | null
 * - short_circuit_current: string | null
 * - material: string | null
 * - thickness: string | null
 * - surface_finish: string | null
 * - dimensions: string | null
 * - main_components: string | null
 * - specifications: object | null
 * - documents: array | null
 * - is_featured: boolean | null
 * - warranty_months: integer | null
 * - created_at: string (date-time)
 * - updated_at: string (date-time)
 */

const API_BASE_URL = 'https://nguyen-phat-admin.onrender.com/api/v1';

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cache ngắn hạn trong bộ nhớ phiên giúp chuyển trang mượt mà không giật layout
let cachedProductsList = null;

// =========================================================================
// MOCK DATA: Chuẩn hóa 100% cấu trúc 28 trường của ProductResponse
// Phản ánh chính xác các dòng tủ điện và thiết bị cơ điện công nghiệp Nguyên Phát
// =========================================================================
export const MOCK_PRODUCTS = [
  {
    id: "ecafb991-ee93-46d8-91ea-9927a2229965",
    name: "Tủ MSB 3200A - NHÀ MÁY SX CỌC VÁCH NHỰA UPVC",
    slug: "tu-msb-3200a-nha-may-sx-coc-vach-nhua-upvc-250",
    code: "NP-MSB-3200",
    brand: "Nguyên Phát",
    product_type: "switchboard",
    category_id: "874efedc-72c8-48a6-90d3-ffe78035ac3b",
    category_name: "Tủ điện hạ thế MSB",
    description: `<h3>Tủ Phân Phối Tổng MSB 3200A - Chuẩn IEC 61439-1/2</h3>
<p><strong>Tủ MSB 3200A</strong> là sản phẩm thiết bị cơ điện chất lượng cao được sản xuất và lắp ráp bởi <strong>Công ty TNHH SX-TM Cơ Điện Nguyên Phát</strong> trên dây chuyền công nghệ CNC hiện đại, tuân thủ nghiêm ngặt các tiêu chuẩn kỹ thuật IEC 61439-1/2, IEC 60529, TCVN 7994.</p>
<h4>Ưu điểm nổi bật:</h4>
<ul>
  <li>Chế tạo từ vật liệu Thép cán nguội tiêu chuẩn (Tole), độ dày 1.5mm - 2.0mm chắc chắn, chịu lực va đập và chống ăn mòn hiệu quả.</li>
  <li>Bề mặt hoàn thiện Sơn tĩnh điện sần tiêu chuẩn công nghiệp (RAL 7032 / RAL 7035), thẩm mỹ cao và bền bỉ trong môi trường khí hậu nhiệt đới Việt Nam.</li>
  <li>Lắp đặt đồng bộ với thiết bị đóng cắt chính hãng ACB / MCCB từ Schneider, LS, ABB, Mitsubishi.</li>
  <li>Thanh cái đồng đỏ nguyên chất mạ thiếc 99.9% đảm bảo độ dẫn điện tối ưu và khả năng chịu dòng ngắn mạch 50kA/1s.</li>
  <li>Được kiểm tra chất lượng và thử nghiệm xuất xưởng KCS nghiêm ngặt trước khi bàn giao công trình.</li>
</ul>`,
    thumbnail: "https://diennguyenphat.com/upload/files/baiviet/thuydiensongbung2-w350%5B1%5D.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/baiviet/img20160617151604-w350%5B1%5D.jpg",
      "https://diennguyenphat.com/upload/files/baiviet/182854-news-bworldbank%5B1%5D.jpg",
      "https://diennguyenphat.com/upload/files/image004.jpg",
      "https://diennguyenphat.com/upload/files/image008.jpg",
      "https://diennguyenphat.com/upload/files/image009.jpg",
      "https://diennguyenphat.com/upload/files/image011.jpg"
    ],
    rated_voltage: "220V/380V - 440V",
    rated_current: "3200A",
    frequency: "50 Hz",
    ip_rating: "IP42 (tiêu chuẩn trong nhà)",
    standards: "IEC 61439-1/2, IEC 60529, TCVN 7994",
    short_circuit_current: "25kA - 50kA/1s",
    material: "Thép cán nguội tiêu chuẩn (Tole) chất lượng cao",
    thickness: "1.5mm - 2.0mm",
    surface_finish: "Sơn tĩnh điện sần tiêu chuẩn công nghiệp (RAL 7032 / RAL 7035)",
    dimensions: "H2200 x W3200 x D1000 mm (Tùy biến theo mặt bằng)",
    main_components: "Thiết bị đóng cắt ACB/MCCB, phụ kiện tủ điện của Schneider, LS, ABB, Mitsubishi",
    specifications: {
      "Chức năng chính": "Tủ phân phối tổng (Main Switchboard) cấp nguồn hạ thế cho toàn dự án",
      "Kiểu cách lắp đặt": "Form tủ: Form 2B / Form 3B / Form 4B theo IEC 61439",
      "Cấu hình thanh cái": "Thanh cái đồng đỏ mạ thiếc 99.9%, bố trí theo chuẩn quốc tế",
      "Bảo vệ quá dòng": "Tích hợp Rơ le bảo vệ kỹ thuật số đa chức năng",
      "Hệ thống đo lường": "Đồng hồ đa năng hiển thị V, A, Hz, PF, kWh tích hợp truyền thông RS485"
    },
    documents: [
      {
        title: "Catalogue Tủ Điện Phân Phối Tổng MSB Nguyên Phát",
        file_name: "Catalogue_Tu_Dien_MSB_Nguyen_Phat.pdf",
        file_size: "3.8 MB",
        file_type: "pdf"
      },
      {
        title: "Bản vẽ bố trí kết cấu & Kích thước hình học tủ MSB 3200A",
        file_name: "Drawing_MSB_3200A_Layout.dwg",
        file_size: "2.4 MB",
        file_type: "cad"
      },
      {
        title: "Biên bản kiểm tra nghiệm thu xuất xưởng KCS",
        file_name: "KCS_Certificate_Test_Report.pdf",
        file_size: "1.2 MB",
        file_type: "pdf"
      }
    ],
    is_featured: true,
    warranty_months: 24,
    created_at: "2026-10-30T01:11:14.627Z",
    updated_at: "2026-10-30T01:11:14.627Z"
  },
  {
    id: "567db2f7-13fb-4a7b-82b6-a4e0c55fc775",
    name: "Tủ Bơm Biến Tần VFD - NHÀ MÁY SX CỌC VÁCH NHỰA UPVC",
    slug: "tu-bom-bien-tan-nha-may-sx-coc-vach-nhua-upvc-251",
    code: "NP-CTRL-VFD",
    brand: "Nguyên Phát",
    product_type: "switchboard",
    category_id: "874efedc-72c8-48a6-90d3-ffe78035ac3b",
    category_name: "Tủ điều khiển & Biến tần",
    description: `<h3>Tủ Điều Khiển Bơm Biến Tần Inverter VFD</h3>
<p><strong>Tủ Bơm Biến Tần VFD</strong> do <strong>Công ty TNHH SX-TM Cơ Điện Nguyên Phát</strong> thiết kế chuyên dụng cho hệ thống máy bơm cấp nước, chiller và quạt thông gió công nghiệp.</p>
<h4>Tính năng kỹ thuật:</h4>
<ul>
  <li>Tích hợp biến tần thế hệ mới (Schneider / Danfoss / Yaskawa / ABB) điều khiển vòng kín PID ổn định áp suất đường ống.</li>
  <li>Tiết kiệm từ 25% - 40% điện năng tiêu thụ so với phương thức khởi động trực tiếp.</li>
  <li>Chức năng luân phiên và gọi thêm bơm thông minh khi lưu lượng yêu cầu tăng đột biến.</li>
  <li>Khởi động mềm giảm rung chấn, tránh hiện tượng búa nước phá hủy đường ống.</li>
</ul>`,
    thumbnail: "https://diennguyenphat.com/upload/files/baiviet/thuydiensongbung2-w350%5B1%5D.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/baiviet/img20160617151604-w350%5B1%5D.jpg",
      "https://diennguyenphat.com/upload/files/sanpham/image005.jpg",
      "https://diennguyenphat.com/upload/files/image008.jpg",
      "https://diennguyenphat.com/upload/files/image009.jpg"
    ],
    rated_voltage: "220V/380V - 440V",
    rated_current: "450A",
    frequency: "50 Hz",
    ip_rating: "IP42 (tiêu chuẩn trong nhà)",
    standards: "IEC 61439-1/2, IEC 60529, TCVN 7994",
    short_circuit_current: "25kA - 50kA/1s",
    material: "Thép cán nguội tiêu chuẩn (Tole)",
    thickness: "1.5mm - 2.0mm",
    surface_finish: "Sơn tĩnh điện sần tiêu chuẩn công nghiệp (RAL 7032 / RAL 7035)",
    dimensions: "H2000 x W1000 x D600 mm",
    main_components: "Biến tần Inverter (Danfoss/Yaskawa/Schneider), PLC Mitsubishi/Siemens, Khởi động từ",
    specifications: {
      "Chức năng chính": "Điều khiển khởi động mềm và ổn định áp suất/lưu lượng hệ thống bơm biến tần",
      "Chế độ vận hành": "Tự động (Auto qua cảm biến áp suất) / Bằng tay (Manual)",
      "Bảo vệ": "Bảo vệ quá tải, mất pha, ngắn mạch, thấp áp và chống chạy khô"
    },
    documents: [
      {
        title: "Tài liệu kỹ thuật vận hành Tủ Bơm Biến Tần VFD",
        file_name: "Manual_VFD_Pump_Controller.pdf",
        file_size: "2.1 MB",
        file_type: "pdf"
      }
    ],
    is_featured: false,
    warranty_months: 12,
    created_at: "2026-10-30T01:11:14.627Z",
    updated_at: "2026-10-30T01:11:14.627Z"
  },
  {
    id: "6b98a7ad-b31b-4326-87b0-c792809e673a",
    name: "Tủ MSB (ATS 4P - 400A) - KHU TÁI ĐỊNH CƯ TÂN HÒA ĐÔNG",
    slug: "tu-msb-ats-4p-400a-khu-tai-dinh-cu-tan-hoa-dong-252",
    code: "NP-MSB-400",
    brand: "Nguyên Phát",
    product_type: "switchboard",
    category_id: "874efedc-72c8-48a6-90d3-ffe78035ac3b",
    category_name: "Tủ chuyển nguồn tự động ATS",
    description: `<h3>Tủ Chuyển Nguồn Tự Động ATS 4P 400A</h3>
<p><strong>Tủ MSB tích hợp bộ chuyển nguồn ATS 4P 400A</strong> đảm bảo nguồn điện cấp liên tục 24/7 cho các phụ tải ưu tiên tại khu dân cư và tòa nhà công cộng.</p>
<h4>Ưu điểm:</h4>
<ul>
  <li>Tự động nhận diện mất nguồn lưới và phát tín hiệu khởi động máy phát điện trong vòng 3 - 5 giây.</li>
  <li>Chuyển đổi nguồn an toàn với cơ cấu khóa liên động cơ khí (Mechanical Interlock) và liên động điện (Electrical Interlock).</li>
  <li>Bảo vệ chống dòng thứ tự không và cách ly dây trung tính hoàn toàn nhờ thiết kế bộ đóng cắt 4 cực (4 Poles).</li>
</ul>`,
    thumbnail: "https://diennguyenphat.com/upload/files/baiviet/thuydiensongbung2-w350%5B1%5D.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/baiviet/img20160617151604-w350%5B1%5D.jpg",
      "https://diennguyenphat.com/upload/files/sanpham/image007%5B1%5D.jpg",
      "https://diennguyenphat.com/upload/files/image008.jpg",
      "https://diennguyenphat.com/upload/files/image011.jpg"
    ],
    rated_voltage: "220V/380V - 440V",
    rated_current: "400A",
    frequency: "50 Hz",
    ip_rating: "IP42 (tiêu chuẩn trong nhà)",
    standards: "IEC 61439-1/2, IEC 60529, TCVN 7994",
    short_circuit_current: "25kA - 50kA/1s",
    material: "Thép cán nguội tiêu chuẩn (Tole)",
    thickness: "1.5mm - 2.0mm",
    surface_finish: "Sơn tĩnh điện sần tiêu chuẩn công nghiệp (RAL 7032 / RAL 7035)",
    dimensions: "H1800 x W800 x D600 mm",
    main_components: "Thiết bị đóng cắt ACB/MCCB, bộ chuyển đổi nguồn ATS Socomec/Osung/Schneider",
    specifications: {
      "Số cực (Poles)": "4P (3 Pha + 1 Trung tính)",
      "Thời gian chuyển nguồn": "0.5s - 30s (Có thể cài đặt tùy biến)",
      "Chức năng chính": "Tự động chuyển nguồn lưới - máy phát và phân phối hạ thế",
      "Kiểu cách lắp đặt": "Form tủ: Form 2B / Form 3B theo IEC 61439"
    },
    documents: [
      {
        title: "Sơ đồ nguyên lý điện Tủ ATS 4P 400A",
        file_name: "Schematic_ATS_400A.pdf",
        file_size: "1.5 MB",
        file_type: "pdf"
      }
    ],
    is_featured: true,
    warranty_months: 24,
    created_at: "2026-10-30T01:11:14.627Z",
    updated_at: "2026-10-30T01:11:14.627Z"
  },
  {
    id: "0982fdde-41af-4057-b084-8f56e8045580",
    name: "Tủ MSB (ATS 4P - 400A) - KCN LONG ĐỨC-ĐỒNG NAI",
    slug: "tu-msb-ats-4p-400a-kcn-long-duc-dong-nai-253",
    code: "NP-MSB-400-LD",
    brand: "Nguyên Phát",
    product_type: "switchboard",
    category_id: "874efedc-72c8-48a6-90d3-ffe78035ac3b",
    category_name: "Tủ chuyển nguồn tự động ATS",
    description: `<h3>Tủ MSB Kèm ATS 400A Cho Khu Công Nghiệp Long Đức</h3>
<p>Sản phẩm thiết kế chuyên dụng cho các nhà xưởng khu công nghiệp có mật độ thiết bị tải trọng liên tục, yêu cầu tính ổn định và an toàn điện ở mức cao nhất.</p>`,
    thumbnail: "https://diennguyenphat.com/upload/files/baiviet/thuydiensongbung2-w350%5B1%5D.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/baiviet/img20160617151604-w350%5B1%5D.jpg",
      "https://diennguyenphat.com/upload/files/image008.jpg",
      "https://diennguyenphat.com/upload/files/image009.jpg"
    ],
    rated_voltage: "220V/380V - 440V",
    rated_current: "400A",
    frequency: "50 Hz",
    ip_rating: "IP42 (tiêu chuẩn trong nhà)",
    standards: "IEC 61439-1/2, IEC 60529, TCVN 7994",
    short_circuit_current: "25kA - 50kA/1s",
    material: "Thép cán nguội tiêu chuẩn (Tole)",
    thickness: "1.5mm - 2.0mm",
    surface_finish: "Sơn tĩnh điện sần tiêu chuẩn công nghiệp (RAL 7032 / RAL 7035)",
    dimensions: "H1800 x W800 x D600 mm",
    main_components: "Thiết bị đóng cắt ACB/MCCB, bộ chuyển đổi nguồn ATS",
    specifications: {
      "Số cực (Poles)": "4P (3 Pha + 1 Trung tính)",
      "Chức năng chính": "Tủ phân phối tổng cấp nguồn và tự động đảo nguồn máy phát",
      "Kiểu cách lắp đặt": "Form tủ: Form 2B / Form 3B theo IEC 61439"
    },
    documents: [],
    is_featured: true,
    warranty_months: 24,
    created_at: "2026-10-30T01:11:14.627Z",
    updated_at: "2026-10-30T01:11:14.627Z"
  },
  {
    id: "2b5e5277-a9d0-4f36-80cd-ba20251e2baf",
    name: "TỦ VCB 24kV - NHÀ MÁY ĐƯỜNG SƠN DƯƠNG - TUYÊN QUANG",
    slug: "tu-vcb-nha-may-duong-son-duong-tuyen-quang-254",
    code: "NP-VCB-24KV",
    brand: "Nguyên Phát",
    product_type: "switchboard",
    category_id: "874efedc-72c8-48a6-90d3-ffe78035ac3b",
    category_name: "Tủ điện trung thế VCB / RMU",
    description: `<h3>Tủ Máy Cắt Chân Không Trung Thế VCB 24kV</h3>
<p><strong>Tủ VCB 24kV</strong> là giải pháp phân phối và đóng cắt trung thế bảo vệ đầu vào trạm biến áp, trạm biến áp phân phối nhà máy sản xuất công nghiệp nặng.</p>
<h4>Đặc điểm nổi bật:</h4>
<ul>
  <li>Sử dụng máy cắt chân không (Vacuum Circuit Breaker) tuổi thọ điện cao, dập hồ quang an toàn tuyệt đối.</li>
  <li>Hệ thống liên động cơ khí thông minh ngăn chặn mọi thao tác đóng cắt nhầm lẫn khi cửa tủ mở.</li>
  <li>Khoang cáp lực, khoang máy cắt và khoang hạ thế độc lập an toàn theo chuẩn ngăn cách kim loại LSC2B-PM.</li>
</ul>`,
    thumbnail: "https://diennguyenphat.com/upload/files/baiviet/thuydiensongbung2-w350%5B1%5D.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/baiviet/img20160617151604-w350%5B1%5D.jpg",
      "https://diennguyenphat.com/upload/files/image012.jpg",
      "https://diennguyenphat.com/upload/files/image008.jpg",
      "https://diennguyenphat.com/upload/files/sanpham/image014.jpg"
    ],
    rated_voltage: "24 kV",
    rated_current: "630A - 1250A",
    frequency: "50 Hz",
    ip_rating: "IP4X",
    standards: "IEC 62271-200, IEC 62271-1, TCVN",
    short_circuit_current: "25kA/3s",
    material: "Thép tấm Aluzinc mạ hợp kim nhôm kẽm kháng ăn mòn",
    thickness: "2.0mm",
    surface_finish: "Sơn tĩnh điện chất lượng cao chống phóng điện hồ quang",
    dimensions: "H2200 x W800 x D1500 mm",
    main_components: "Máy cắt chân không VCB ABB/Schneider/LS, biến dòng CT, biến điện áp PT",
    specifications: {
      "Chức năng chính": "Tủ máy cắt chân không trung thế bảo vệ trạm biến áp và lưới 22kV - 24kV",
      "Điện áp cách điện": "24kV / 35kV (Thử nghiệm xung sét 125kV BIL)",
      "Kiểu ngăn cách": "Metal-Clad LSC2B-PM an toàn vận hành cao nhất"
    },
    documents: [
      {
        title: "Chứng chỉ thử nghiệm điển hình Type Test Tủ VCB 24kV",
        file_name: "Type_Test_Certificate_VCB_24kV.pdf",
        file_size: "4.5 MB",
        file_type: "pdf"
      }
    ],
    is_featured: true,
    warranty_months: 24,
    created_at: "2026-10-30T01:11:14.627Z",
    updated_at: "2026-10-30T01:11:14.627Z"
  },
  {
    id: "8ca7c01e-4e3b-47d3-b3bb-57de4ba94da7",
    name: "TỦ ATS TỰ ĐỘNG - TRẠI TẠM GIAM CHÍ HÒA - CA TP.HCM",
    slug: "tu-ats-trai-tam-giam-chi-hoa-ca-tphcm-255",
    code: "NP-ATS-AUTO",
    brand: "Nguyên Phát",
    product_type: "switchboard",
    category_id: "874efedc-72c8-48a6-90d3-ffe78035ac3b",
    category_name: "Tủ chuyển nguồn tự động ATS",
    description: `<h3>Hệ Thống Tủ ATS Dự Phòng Nguồn An Ninh</h3>
<p>Công trình trọng điểm an ninh yêu cầu mức độ tin cậy tuyệt đối, hệ thống chuyển nguồn tự động không trễ và cơ chế khóa liên động chống cấp ngược nguồn điện nguy hiểm.</p>`,
    thumbnail: "https://diennguyenphat.com/upload/files/baiviet/thuydiensongbung2-w350%5B1%5D.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/baiviet/img20160617151604-w350%5B1%5D.jpg",
      "https://diennguyenphat.com/upload/files/sanpham/image013.jpg",
      "https://diennguyenphat.com/upload/files/image011.jpg"
    ],
    rated_voltage: "220V/380V - 440V",
    rated_current: "630A",
    frequency: "50 Hz",
    ip_rating: "IP42 (tiêu chuẩn trong nhà)",
    standards: "IEC 61439-1/2, IEC 60529, TCVN 7994",
    short_circuit_current: "35kA/1s",
    material: "Thép cán nguội tiêu chuẩn (Tole)",
    thickness: "1.5mm - 2.0mm",
    surface_finish: "Sơn tĩnh điện sần tiêu chuẩn công nghiệp (RAL 7032 / RAL 7035)",
    dimensions: "H1800 x W800 x D600 mm",
    main_components: "Bộ chuyển nguồn ATS tự động, Rơ le giám sát điện áp, Khóa liên động điện cơ",
    specifications: {
      "Chức năng chính": "Tự động chuyển đổi nguồn điện giữa lưới điện quốc gia và máy phát điện dự phòng",
      "Thời gian chuyển nguồn": "Tùy chỉnh 1s - 30s với cơ chế trễ làm mát máy phát"
    },
    documents: [],
    is_featured: true,
    warranty_months: 12,
    created_at: "2026-10-30T01:11:14.627Z",
    updated_at: "2026-10-30T01:11:14.627Z"
  },
  {
    id: "f1a2b3c4-1234-4567-89ab-cdef01234567",
    name: "Tủ Bù Công Suất Phản Kháng 300kVAR (Tụ Bù Hạ Thế)",
    slug: "tu-bu-cong-suat-phan-khang-300kvar",
    code: "NP-CAP-300",
    brand: "Nguyên Phát",
    product_type: "switchboard",
    category_id: "874efedc-72c8-48a6-90d3-ffe78035ac3b",
    category_name: "Tủ tụ bù công suất phản kháng",
    description: `<h3>Tủ Tụ Bù Tự Động 300kVAR Nâng Cao Hệ Số Công Suất Cosφ</h3>
<p>Giải pháp tối ưu hóa chất lượng điện năng cho nhà máy, giảm thiểu tổn thất đường dây, loại bỏ hoàn toàn tiền phạt công suất phản kháng từ Điện lực EVN.</p>
<h4>Tính năng nổi bật:</h4>
<ul>
  <li>Bộ điều khiển tụ bù kỹ thuật số 6 đến 12 cấp vi xử lý thông minh.</li>
  <li>Cuộn kháng chặn sóng hài 7% (189Hz) bảo vệ tụ điện không bị nổ hoặc phồng trong môi trường có biến tần.</li>
  <li>Quạt hút thông gió giải nhiệt tự động theo nhiệt độ cài đặt.</li>
</ul>`,
    thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop"
    ],
    rated_voltage: "415V - 440V",
    rated_current: "Dung lượng 300 kVAR (6 cấp x 50kVAR)",
    frequency: "50 Hz",
    ip_rating: "IP42",
    standards: "IEC 61439-1/2, IEC 60831-1/2",
    short_circuit_current: "25kA/1s",
    material: "Thép cán nguội tiêu chuẩn (Tole) 1.5mm",
    thickness: "1.5mm - 2.0mm",
    surface_finish: "Sơn tĩnh điện công nghiệp RAL 7032",
    dimensions: "H2000 x W800 x D800 mm",
    main_components: "Tụ khô Epcos / Ducati / Mikro, Cuộn kháng lọc sóng hài, Contactor chuyên dụng cho tụ bù",
    specifications: {
      "Hệ số công suất đạt được": "Cosφ ≥ 0.95 (Tránh phạt tiền điện vô công)",
      "Số cấp đóng cắt": "6 cấp hoặc 12 cấp tự động luân phiên",
      "Bảo vệ": "Bảo vệ quá nhiệt, quá áp và quá sóng hài THD-U"
    },
    documents: [],
    is_featured: false,
    warranty_months: 18,
    created_at: "2026-10-30T01:11:14.627Z",
    updated_at: "2026-10-30T01:11:14.627Z"
  },
  {
    id: "a9b8c7d6-9876-4321-bca9-fedcba987654",
    name: "Hệ Thống Thang Máng Cáp & Khay Cáp Điện Mạ Kẽm Nhúng Nóng",
    slug: "he-thong-thang-mang-cap-ma-kem-nhung-nong",
    code: "NP-TMC-HDG",
    brand: "Nguyên Phát",
    product_type: "cable_tray",
    category_id: "964efedc-72c8-48a6-90d3-ffe78035ac4c",
    category_name: "Thang máng cáp điện",
    description: `<h3>Thang Máng Cáp Điện (Cable Tray / Trunking / Ladder)</h3>
<p>Sản phẩm gia công đột dập CNC chính xác, mạ kẽm nhúng nóng đạt độ dày lớp mạ 65 - 85 µm theo chuẩn ASTM A123, bền vững vượt trội tại các nhà máy hóa chất và ven biển.</p>`,
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
    ],
    rated_voltage: null,
    rated_current: null,
    frequency: null,
    ip_rating: null,
    standards: "NEMA VE1, BS EN 61537, ASTM A123",
    short_circuit_current: null,
    material: "Thép tấm cán nóng tiêu chuẩn SS400",
    thickness: "1.5mm - 2.5mm",
    surface_finish: "Mạ kẽm nhúng nóng (Hot-dip Galvanized) hoặc Sơn tĩnh điện",
    dimensions: "W100mm - W1000mm, H50mm - H150mm, L2500mm",
    main_components: "Thang máng cáp, cút nối, co chữ T, co ngã tư, giá đỡ treo ty ren",
    specifications: {
      "Chiều dài tiêu chuẩn": "2.5m - 3.0m mỗi thanh",
      "Tải trọng an toàn": "Chịu tải cáp lực lên đến 250kg/m"
    },
    documents: [],
    is_featured: false,
    warranty_months: 36,
    created_at: "2026-10-30T01:11:14.627Z",
    updated_at: "2026-10-30T01:11:14.627Z"
  }
];

// =========================================================================
// HÀM CHUẨN HÓA DỮ LIỆU ĐẦY ĐỦ 28 TRƯỜNG PRODUCTRESPONSE
// =========================================================================
export function normalizeProduct(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const cleanString = (val) => {
    if (typeof val !== 'string') return null;
    const trimmed = val.trim();
    if (!trimmed || trimmed === 'string') return null;
    return trimmed;
  };

  const cleanUrl = (val) => {
    if (typeof val !== 'string') return '';
    const trimmed = val.trim();
    if (!trimmed || trimmed === 'string') return '';
    return trimmed;
  };

  const cleanArrayOfStrings = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(cleanUrl).filter(Boolean);
  };

  return {
    id: raw.id || '',
    name: cleanString(raw.name) || 'Sản phẩm Cơ Điện Nguyên Phát',
    slug: cleanString(raw.slug) || raw.id || '',
    code: cleanString(raw.code),
    brand: cleanString(raw.brand) || 'Nguyên Phát',
    product_type: cleanString(raw.product_type) || 'switchboard',
    category_id: raw.category_id ?? null,
    category_name: cleanString(raw.category_name) || 'Tủ điện công nghiệp',
    description: typeof raw.description === 'string' && raw.description !== 'string' ? raw.description : '',
    thumbnail: cleanUrl(raw.thumbnail),
    images: cleanArrayOfStrings(raw.images),
    rated_voltage: cleanString(raw.rated_voltage),
    rated_current: cleanString(raw.rated_current),
    frequency: cleanString(raw.frequency) || (raw.rated_voltage ? '50 Hz' : null),
    ip_rating: cleanString(raw.ip_rating),
    standards: cleanString(raw.standards),
    short_circuit_current: cleanString(raw.short_circuit_current),
    material: cleanString(raw.material),
    thickness: cleanString(raw.thickness),
    surface_finish: cleanString(raw.surface_finish),
    dimensions: cleanString(raw.dimensions),
    main_components: cleanString(raw.main_components),
    specifications: (raw.specifications && typeof raw.specifications === 'object') ? raw.specifications : {},
    documents: Array.isArray(raw.documents) ? raw.documents : [],
    is_featured: Boolean(raw.is_featured),
    warranty_months: typeof raw.warranty_months === 'number' ? raw.warranty_months : 12,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null
  };
}

// =========================================================================
// API 1: GET /api/v1/products/ (Lấy danh sách sản phẩm)
// Có đầy đủ Mock Layer hỗ trợ phân trang, lọc danh mục, tìm kiếm
// =========================================================================
export async function getProducts(params = {}, customToken = null) {
  // Chuẩn hóa params linh hoạt: có thể truyền category_id dạng chuỗi hoặc object params
  const options = typeof params === 'string' ? { category_id: params } : (params || {});
  const { category_id, product_type, is_featured, search, skip = 0, limit = 200 } = options;

  let url = `${API_BASE_URL}/products/?skip=${skip}&limit=${limit}`;
  if (category_id && UUID_REGEX.test(category_id)) {
    url += `&category_id=${encodeURIComponent(category_id)}`;
  }
  if (product_type) {
    url += `&product_type=${encodeURIComponent(product_type)}`;
  }
  if (typeof is_featured === 'boolean') {
    url += `&is_featured=${is_featured}`;
  }
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const token = customToken || localStorage.getItem('np_admin_token') || '';
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeProduct).filter(Boolean);
        if (!category_id && !search && !product_type) {
          cachedProductsList = normalized;
        }
        return {
          products: normalized,
          isLive: true,
          message: 'Kết nối API trực tiếp thành công (Live Data)'
        };
      }
    }
  } catch (err) {
    console.warn('Lỗi kết nối API products live, chuyển sang Mock Data:', err.message);
  }

  // Tự động fallback sang Mock API layer
  const mockResult = mockGetProducts(options);
  if (!category_id && !search && !product_type) {
    cachedProductsList = mockResult.products;
  }
  return mockResult;
}

// =========================================================================
// API 2: GET /api/v1/products/{product_id} (Lấy chi tiết 1 sản phẩm)
// Hỗ trợ tra cứu theo UUID hoặc Slug, có Mock Layer chuẩn chỉ
// =========================================================================
export async function getProductById(idOrSlug, customToken = null) {
  if (!idOrSlug) return null;

  const token = customToken || localStorage.getItem('np_admin_token') || '';
  const headers = { 'Accept': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Nếu là UUID hợp lệ, gọi trực tiếp endpoint GET /api/v1/products/{product_id}
  if (UUID_REGEX.test(idOrSlug)) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(idOrSlug)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          return normalizeProduct(data);
        }
      }
    } catch (err) {
      console.warn('Lỗi gọi API GET /api/v1/products/{id}:', err.message);
    }
  }

  // Nếu idOrSlug là slug, tra cứu trong danh sách sản phẩm lấy từ API hoặc Cache
  try {
    let list = cachedProductsList;
    if (!Array.isArray(list) || list.length === 0) {
      const liveRes = await getProducts(null, customToken);
      list = liveRes.products || [];
    }
    const matched = list.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (matched) return matched;
  } catch {
    // Tiếp tục fallback sang Mock
  }

  // Fallback sang Mock API layer
  return mockGetProductById(idOrSlug);
}

// =========================================================================
// HÀM TỔNG HỢP CHO TRANG PRODUCT DETAIL (Trả về chi tiết + Danh sách sản phẩm)
// =========================================================================
export async function getProductDetailData(idOrSlug, customToken = null) {
  const [detailProduct, listResult] = await Promise.all([
    getProductById(idOrSlug, customToken),
    getProducts(null, customToken)
  ]);

  return {
    product: detailProduct,
    allProducts: listResult.products || []
  };
}

// =========================================================================
// MOCK API LAYER (Mô phỏng 100% logic của 2 API Server)
// =========================================================================

/**
 * Mock API: GET /api/v1/products/
 */
export function mockGetProducts(params = {}) {
  const { category_id, product_type, is_featured, search, skip = 0, limit = 200 } = params;
  let list = MOCK_PRODUCTS.map(normalizeProduct).filter(Boolean);

  if (category_id && category_id !== 'all') {
    list = list.filter((p) => p.category_id === category_id || p.category_name === category_id);
  }

  if (product_type && product_type !== 'all') {
    list = list.filter((p) => p.product_type === product_type);
  }

  if (typeof is_featured === 'boolean') {
    list = list.filter((p) => p.is_featured === is_featured);
  }

  if (search && typeof search === 'string') {
    const term = search.toLowerCase().trim();
    list = list.filter((p) =>
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.code && p.code.toLowerCase().includes(term)) ||
      (p.category_name && p.category_name.toLowerCase().includes(term)) ||
      (p.standards && p.standards.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  }

  // Sắp xếp mặc định: sản phẩm nổi bật trước, sau đó theo ngày tạo mới nhất
  list.sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const paginated = list.slice(skip, skip + limit);

  return {
    products: paginated,
    total: list.length,
    isLive: false,
    message: 'Đang hiển thị dữ liệu từ Mock Layer chuẩn ProductResponse của Nguyên Phát'
  };
}

/**
 * Mock API: GET /api/v1/products/{product_id}
 */
export function mockGetProductById(idOrSlug) {
  if (!idOrSlug) return null;
  const list = MOCK_PRODUCTS.map(normalizeProduct).filter(Boolean);
  return list.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || list[0] || null;
}
