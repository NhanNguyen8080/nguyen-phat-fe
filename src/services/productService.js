/**
 * Service kết nối và Mock API Sản phẩm & Danh Mục Cơ Điện Nguyên Phát
 * 
 * 2 API chuẩn theo OpenAPI Specification:
 * 1. GET https://nguyen-phat-admin.onrender.com/api/v1/products/
 *    (Hỗ trợ query: category_id, product_type, is_featured, search, skip, limit)
 * 2. GET https://nguyen-phat-admin.onrender.com/api/v1/products/{product_id}
 *    (Chi tiết đầy đủ thông số kỹ thuật của 1 sản phẩm)
 * 3. GET https://nguyen-phat-admin.onrender.com/api/v1/categories/
 *    (Danh mục: Chỉ giữ 1 phân cấp cha, lọc bỏ tất cả phân cấp con, phân cấp cha bỏ mục hình ảnh thiết bị)
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
let cachedCategoriesList = null;

// =========================================================================
// MOCK DANH MỤC CHA CHUẨN:
// - Chỉ giữ 1 phân cấp cha (parent_id: null)
// - Lọc bỏ 100% tất cả phân cấp con
// - Phân cấp cha BỎ mục "Hình ảnh thiết bị" / "Hình ảnh & Dự án"
// =========================================================================
export const MOCK_PARENT_CATEGORIES = [
  {
    id: "e03442e0-789d-46f9-a334-5a5f1cc02642",
    name: "Tủ điện",
    slug: "tu-dien",
    description: "Sản xuất và lắp đặt các loại tủ bảng điện công nghiệp, tủ MSB, ATS, tụ bù, điều khiển, VCB.",
    sort_order: 1
  },
  {
    id: "09048929-2ca1-48fb-a727-6fc6c259a0a7",
    name: "Thang máng cáp",
    slug: "thang-mang-cap",
    description: "Sản xuất thang cáp, máng cáp, khay cáp (tray cáp) sơn tĩnh điện, mạ kẽm nhúng nóng, Inox 304.",
    sort_order: 2
  },
  {
    id: "8345389a-c70e-473c-ba34-c6ee68ac237d",
    name: "Thiết bị đóng cắt",
    slug: "thiet-bi-dong-cat",
    description: "Phân phối chính hãng thiết bị đóng cắt ACB, MCCB, MCB, Contactor, Rơ le của Schneider, Mitsubishi, ABB, LS.",
    sort_order: 3
  },
  {
    id: "192eb51f-01fd-464c-8cb8-4983af568eb1",
    name: "Điện công nghiệp",
    slug: "ien-cong-nghiep",
    description: "Giải pháp và vật tư điện công nghiệp đồng bộ cho nhà máy xí nghiệp.",
    sort_order: 4
  }
];

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
    category_id: "e03442e0-789d-46f9-a334-5a5f1cc02642",
    category_name: "Tủ điện",
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
        url: "#",
        file_type: "pdf",
        size: "2.8 MB"
      },
      {
        title: "Bản vẽ mặt cắt kích thước hình học Tủ MSB 3200A (DWG/PDF)",
        url: "#",
        file_type: "pdf",
        size: "1.4 MB"
      }
    ],
    is_featured: true,
    warranty_months: 24,
    created_at: "2026-10-30T01:11:13.568Z",
    updated_at: "2026-10-30T01:11:13.568Z"
  },
  {
    id: "f8435d64-e535-43a9-a9a7-96a9390230f8",
    name: "Tủ Bơm Biến Tần - NHÀ MÁY SX CỌC VÁCH NHỰA UPVC",
    slug: "tu-bom-bien-tan-nha-may-sx-coc-vach-nhua-upvc-249",
    code: "NP-VFD-055",
    brand: "Nguyên Phát",
    product_type: "control_panel",
    category_id: "e03442e0-789d-46f9-a334-5a5f1cc02642",
    category_name: "Tủ điện",
    description: `<h3>Tủ Điều Khiển Bơm Tích Hợp Biến Tần VFD</h3>
<p><strong>Tủ bơm biến tần</strong> chuyên dụng cho hệ thống cấp nước sinh hoạt, tuần hoàn giải nhiệt và phòng cháy chữa cháy công nghiệp. Giúp ổn định áp suất đường ống và tiết kiệm điện năng lên đến 40%.</p>`,
    thumbnail: "https://diennguyenphat.com/upload/files/baiviet/img20160617151604-w350%5B1%5D.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/baiviet/img20160617151604-w350%5B1%5D.jpg",
      "https://diennguyenphat.com/upload/files/baiviet/thuydiensongbung2-w350%5B1%5D.jpg"
    ],
    rated_voltage: "380V - 415V AC",
    rated_current: "150A",
    frequency: "50 Hz",
    ip_rating: "IP54 (chống bụi & nước bắn tóe)",
    standards: "IEC 61439-1, IEC 60947",
    short_circuit_current: "25kA/1s",
    material: "Thép cán nguội phủ sơn tĩnh điện",
    thickness: "1.5mm",
    surface_finish: "Sơn tĩnh điện RAL 7032",
    dimensions: "H1800 x W800 x D600 mm",
    main_components: "Biến tần Danfoss/Schneider, MCCB LS, PLC Mitsubishi, rơ le bảo vệ",
    specifications: {
      "Chế độ vận hành": "Tự động điều áp theo cảm biến (PID) / Bằng tay",
      "Số lượng bơm điều khiển": "Luân phiên 3 bơm động lực",
      "Giao diện điều khiển": "Màn hình cảm ứng HMI 7 inch giao diện tiếng Việt"
    },
    documents: [],
    is_featured: true,
    warranty_months: 24,
    created_at: "2026-10-30T01:11:13.670Z",
    updated_at: "2026-10-30T01:11:13.670Z"
  },
  {
    id: "4444558e-0b04-4c28-971c-f232491fa308",
    name: "Tủ Chuyển Nguồn Tự Động ATS 4P - 400A",
    slug: "tu-msb-ats-4p-400a-khu-tai-dinh-cu-tan-hoa-dong-248",
    code: "NP-ATS-400",
    brand: "Nguyên Phát",
    product_type: "ats_panel",
    category_id: "e03442e0-789d-46f9-a334-5a5f1cc02642",
    category_name: "Tủ điện",
    description: `<h3>Tủ Chuyển Đổi Nguồn Tự Động ATS 4P 400A</h3>
<p>Đảm bảo nguồn điện dự phòng liên tục cho công trình. Tự động chuyển đổi giữa nguồn điện lưới và máy phát điện dự phòng trong thời gian chưa đầy 3 giây.</p>`,
    thumbnail: "https://diennguyenphat.com/upload/files/baiviet/182854-news-bworldbank%5B1%5D.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/baiviet/182854-news-bworldbank%5B1%5D.jpg"
    ],
    rated_voltage: "380V - 440V / 3P + N",
    rated_current: "400A",
    frequency: "50 Hz",
    ip_rating: "IP43",
    standards: "IEC 60947-6-1, TCVN 7994",
    short_circuit_current: "36kA/1s",
    material: "Thép cán nguội Tole dày 2.0mm",
    thickness: "2.0mm",
    surface_finish: "Sơn tĩnh điện công nghiệp RAL 7035",
    dimensions: "H1600 x W800 x D500 mm",
    main_components: "Bộ chuyển đổi nguồn ATS Socomec/Osung/Schneider, bộ điều khiển ATS Controller kỹ thuật số",
    specifications: {
      "Thời gian chuyển mạch": "Dưới 1.5 giây",
      "Cơ chế khóa liên động": "Khóa cơ khí & khóa liên động điện kép an toàn tuyệt đối",
      "Chế độ vận hành": "Auto / Manual / Test nguồn máy phát định kỳ"
    },
    documents: [],
    is_featured: true,
    warranty_months: 24,
    created_at: "2026-10-30T01:11:13.774Z",
    updated_at: "2026-10-30T01:11:13.774Z"
  },
  {
    id: "a3a2e374-60be-45a7-96a3-f08eafe799a4",
    name: "Hệ Thống Tủ Trung Thế VCB 24kV",
    slug: "tu-vcb-nha-may-duong-son-duong-tuyen-quang-246",
    code: "NP-VCB-24KV",
    brand: "Nguyên Phát",
    product_type: "medium_voltage",
    category_id: "e03442e0-789d-46f9-a334-5a5f1cc02642",
    category_name: "Tủ điện",
    description: `<h3>Tủ Máy Cắt Chân Không Trung Thế VCB 24kV</h3>
<p>Sản phẩm tủ trung thế bảo vệ trạm biến áp phân phối nhà máy sản xuất công nghiệp, điện áp vận hành đến 24kV, máy cắt chân không tiêu chuẩn quốc tế.</p>`,
    thumbnail: "https://diennguyenphat.com/upload/files/image004.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/image004.jpg"
    ],
    rated_voltage: "24 kV",
    rated_current: "630A - 1250A",
    frequency: "50 Hz",
    ip_rating: "IP4X",
    standards: "IEC 62271-200, IEC 62271-100",
    short_circuit_current: "25kA/3s",
    material: "Tôn mạ kẽm Aluzinc chống ăn mòn cao cấp",
    thickness: "2.0mm - 2.5mm",
    surface_finish: "Sơn tĩnh điện epoxy",
    dimensions: "H2200 x W800 x D1500 mm",
    main_components: "Máy cắt chân không VCB ABB/Schneider, dao tiếp địa, rơ le kỹ thuật số bảo vệ SEL/MiCOM",
    specifications: {
      "Cấp điện áp cách điện": "50kV / 1 phút, xung sét 125kV",
      "Tiêu chuẩn khoang tủ": "Metal-clad phân chia độc lập an toàn thao tác"
    },
    documents: [],
    is_featured: false,
    warranty_months: 36,
    created_at: "2026-10-30T01:11:13.978Z",
    updated_at: "2026-10-30T01:11:13.978Z"
  },
  {
    id: "97463f23-f3c9-4675-9e6e-d28c2c7760da",
    name: "Tủ Tụ Bù Công Suất Phản Kháng 500kVAR - 440V",
    slug: "tu-tu-bu-500kva-440v",
    code: "NP-CAP-500",
    brand: "Nguyên Phát",
    product_type: "capacitor_bank",
    category_id: "e03442e0-789d-46f9-a334-5a5f1cc02642",
    category_name: "Tủ điện",
    description: `<h3>Tủ Tụ Bù Tự Động 500kVAR Tích Hợp Cuộn Kháng Lọc Sóng Hài</h3>
<p>Bù công suất vô công cosφ > 0.95, triệt tiêu tiền phạt cos phi của điện lực và giảm tổn thất trên đường dây truyền tải.</p>`,
    thumbnail: "https://diennguyenphat.com/upload/files/image008.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/image008.jpg"
    ],
    rated_voltage: "440V / 3P",
    rated_current: "650A",
    frequency: "50 Hz",
    ip_rating: "IP41",
    standards: "IEC 61439-1, IEC 60831",
    short_circuit_current: "30kA/1s",
    material: "Thép cán nguội sơn tĩnh điện",
    thickness: "1.5mm - 2.0mm",
    surface_finish: "Sơn tĩnh điện RAL 7032",
    dimensions: "H2000 x W1000 x D800 mm",
    main_components: "Tụ khô Epcos/Schneider 50kVAR, cuộn kháng lọc sóng hài 7%, bộ điều khiển Mikro 12 cấp",
    specifications: {
      "Cấp bù": "12 cấp đóng cắt thông minh tuần tự",
      "Bảo vệ nhiệt": "Tích hợp rơ le nhiệt và quạt thông gió cưỡng bức điều khiển tự động"
    },
    documents: [],
    is_featured: true,
    warranty_months: 24,
    created_at: "2026-10-30T01:11:14.288Z",
    updated_at: "2026-10-30T01:11:14.288Z"
  },
  {
    id: "bc283f57-a24f-4662-b07f-1fc0ffd85e09",
    name: "Thang Cáp & Máng Cáp Điện Sơn Tĩnh Điện (Cable Tray & Trunking)",
    slug: "mang-cap-son-tinh-dien-nguyen-phat",
    code: "NP-CABLE-TRAY",
    brand: "Nguyên Phát",
    product_type: "cable_containment",
    category_id: "09048929-2ca1-48fb-a727-6fc6c259a0a7",
    category_name: "Thang máng cáp",
    description: `<h3>Hệ Thống Thang Máng Cáp Cơ Điện MEP</h3>
<p>Gia công trên dây chuyền chấn đột CNC chính xác từng milimet. Đa dạng kích thước và chủng loại: Mạ kẽm nhúng nóng, Sơn tĩnh điện, Inox 304.</p>`,
    thumbnail: "https://diennguyenphat.com/upload/files/image009.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/image009.jpg",
      "https://diennguyenphat.com/upload/files/image011.jpg"
    ],
    rated_voltage: null,
    rated_current: null,
    frequency: null,
    ip_rating: "NEMA VE-1",
    standards: "TCVN 10688, NEMA VE1, IEC 61537",
    short_circuit_current: null,
    material: "Thép đen / Tôn tráng kẽm / Inox 304",
    thickness: "1.2mm - 1.5mm - 2.0mm",
    surface_finish: "Sơn tĩnh điện RAL 7032 hoặc Mạ kẽm nhúng nóng",
    dimensions: "W100xH50 mm đến W1000xH200 mm, L=2500 - 3000 mm",
    main_components: "Thân máng, nắp máng, co L, ngã 3 tee, ngã 4 cross, bát nối và bu lông M8",
    specifications: {
      "Tải trọng an toàn": "Chịu tải cáp điện nặng theo chuẩn NEMA",
      "Màu sắc tùy chọn": "Ghi xám RAL 7032, Cam báo cháy, Trắng sữa, Inox mờ"
    },
    documents: [],
    is_featured: false,
    warranty_months: 24,
    created_at: "2026-10-30T01:11:14.627Z",
    updated_at: "2026-10-30T01:11:14.627Z"
  },
  {
    id: "31dbd409-8cf1-4b09-9244-533d7e807120",
    name: "Rơ Le Bảo Vệ Quá Áp, Thấp Áp Selec 600VPR",
    slug: "relay-bao-ve-qua-ap-thap-ap-selec-600vpr",
    code: "NP-SELEC-600VPR",
    brand: "Selec / Phân phối Nguyên Phát",
    product_type: "protection_relay",
    category_id: "8345389a-c70e-473c-ba34-c6ee68ac237d",
    category_name: "Thiết bị đóng cắt",
    description: `<h3>Rơ Le Kỹ Thuật Số Giám Sát Điện Áp 3 Pha</h3>
<p>Thiết bị giám sát quá áp, thấp áp, mất pha, thứ tự pha và lệch pha tự động ngắt cuộn hút khởi động từ bảo vệ an toàn cho động cơ và tải điện.</p>`,
    thumbnail: "https://diennguyenphat.com/upload/files/image011.jpg",
    images: [
      "https://diennguyenphat.com/upload/files/image011.jpg"
    ],
    rated_voltage: "280V - 520V AC (L-L)",
    rated_current: "Tiếp điểm 5A / 250V AC",
    frequency: "50 Hz / 60 Hz",
    ip_rating: "IP20 (Terminal), IP40 (Enclosure)",
    standards: "IEC 60947-5-1",
    short_circuit_current: null,
    material: "Nhựa chống cháy Polycarbonate chuẩn UL94-V0",
    thickness: null,
    surface_finish: "Lắp đặt thanh ray DIN rail 35mm",
    dimensions: "17.5 x 90 x 60 mm",
    main_components: "Bộ vi xử lý đo lường RMS thực tế (True RMS), màn hình LED hiển thị trạng thái lỗi",
    specifications: {
      "Thời gian tác động": "Trễ cắt điều chỉnh được từ 0.2 đến 10 giây",
      "Chức năng bảo vệ": "Quá áp, thấp áp, mất pha, đảo thứ tự pha, mất cân bằng pha"
    },
    documents: [],
    is_featured: false,
    warranty_months: 18,
    created_at: "2026-10-30T01:11:14.700Z",
    updated_at: "2026-10-30T01:11:14.700Z"
  }
];

// =========================================================================
// HÀM HỖ TRỢ XÁC ĐỊNH DANH MỤC CHA CHUẨN (HIERARCHY MAPPER)
// - Quy về 1 phân cấp cha duy nhất
// - Loại bỏ phân cấp con
// - Bỏ hoàn toàn mục "Hình ảnh thiết bị"
// =========================================================================
export function resolveParentCategory(catId, catName, productName) {
  const cName = (catName || '').trim();
  const pName = (productName || '').trim();
  const cNameLower = cName.toLowerCase();
  const pNameLower = pName.toLowerCase();

  // 1. Nếu là mục "Hình ảnh thiết bị" (hoặc máy móc nhà xưởng máy hàn, máy chấn...) -> Đánh dấu bỏ
  if (
    cNameLower.includes('hình ảnh thiết bị') ||
    catId === '604977d8-7990-4131-b160-77673a786a8a' ||
    cNameLower === 'hình ảnh & dự án' ||
    catId === 'bee10ab4-de98-40f4-857a-b544a585a182'
  ) {
    // Nếu sản phẩm bắt đầu bằng Tủ điện (được gán nhầm vào Công trình tiêu biểu / Hình ảnh), vẫn đưa về Tủ điện
    if (pNameLower.startsWith('tủ ') || pNameLower.startsWith('hệ thống tủ') || pNameLower.startsWith('tủ')) {
      return {
        id: "e03442e0-789d-46f9-a334-5a5f1cc02642",
        name: "Tủ điện",
        slug: "tu-dien",
        isFacility: false
      };
    }
    return {
      id: null,
      name: null,
      slug: null,
      isFacility: true // Flag loại bỏ
    };
  }

  // 2. Thang máng cáp (Thang cáp, Máng cáp, Tray cáp)
  if (
    cNameLower.includes('thang') ||
    cNameLower.includes('máng cáp') ||
    cNameLower.includes('tray') ||
    catId === '09048929-2ca1-48fb-a727-6fc6c259a0a7' ||
    catId === 'cd8a3f57-a24f-4662-b07f-1fc0ffd85e01'
  ) {
    return {
      id: "09048929-2ca1-48fb-a727-6fc6c259a0a7",
      name: "Thang máng cáp",
      slug: "thang-mang-cap",
      isFacility: false
    };
  }

  // 3. Thiết bị đóng cắt (Rơ le, Relay, Contactor, ACB, MCCB)
  if (
    cNameLower.includes('đóng cắt') ||
    cNameLower.includes('rơ le') ||
    cNameLower.includes('relay') ||
    pNameLower.includes('rơ le') ||
    pNameLower.includes('relay') ||
    catId === '8345389a-c70e-473c-ba34-c6ee68ac237d' ||
    catId === '06b2d787-d788-453c-a137-896a4a0a4251' ||
    catId === '31dbd409-8cf1-4b09-9244-533d7e807120'
  ) {
    return {
      id: "8345389a-c70e-473c-ba34-c6ee68ac237d",
      name: "Thiết bị đóng cắt",
      slug: "thiet-bi-dong-cat",
      isFacility: false
    };
  }

  // 4. Điện công nghiệp
  if (
    cNameLower.includes('điện công nghiệp') ||
    catId === '192eb51f-01fd-464c-8cb8-4983af568eb1'
  ) {
    return {
      id: "192eb51f-01fd-464c-8cb8-4983af568eb1",
      name: "Điện công nghiệp",
      slug: "ien-cong-nghiep",
      isFacility: false
    };
  }

  // 5. Mặc định: Tủ điện (Bao gồm các phân cấp con: Tủ MSB, ATS, Tụ Bù, Điều Khiển, VCB, MDB, Hòa Đồng Bộ...)
  return {
    id: "e03442e0-789d-46f9-a334-5a5f1cc02642",
    name: "Tủ điện",
    slug: "tu-dien",
    isFacility: false
  };
}

// =========================================================================
// HÀM LẤY DANH MỤC: CHỈ GIỮ 1 PHÂN CẤP CHA, LỌC BỎ TẤT CẢ CON, BỎ HÌNH ẢNH THIẾT BỊ
// =========================================================================
export async function getCategories(customToken = null) {
  if (Array.isArray(cachedCategoriesList) && cachedCategoriesList.length > 0) {
    return cachedCategoriesList;
  }

  const token = customToken || localStorage.getItem('np_admin_token') || '';
  const headers = { 'Accept': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/categories/`, { headers });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // 1. Chỉ giữ phân cấp cha: parent_id === null
        // 2. Lọc bỏ phân cấp con: bỏ tất cả parent_id !== null
        // 3. Phân cấp cha bỏ mục hình ảnh thiết bị & hình ảnh dự án
        const parents = data.filter((c) => {
          if (c.parent_id !== null && c.parent_id !== undefined && c.parent_id !== '') {
            return false;
          }
          const name = (c.name || '').toLowerCase();
          const slug = (c.slug || '').toLowerCase();
          if (name.includes('hình ảnh') || slug.includes('hinh-anh') || name.includes('dự án')) {
            return false;
          }
          return true;
        });

        if (parents.length > 0) {
          // Sắp xếp thứ tự trực quan: Tủ điện -> Thang máng cáp -> Thiết bị đóng cắt -> Điện công nghiệp
          const orderMap = {
            'tu-dien': 1,
            'thang-mang-cap': 2,
            'thiet-bi-dong-cat': 3,
            'ien-cong-nghiep': 4
          };
          parents.sort((a, b) => (orderMap[a.slug] || 99) - (orderMap[b.slug] || 99));

          cachedCategoriesList = parents;
          return parents;
        }
      }
    }
  } catch (err) {
    console.warn('Lỗi gọi API categories live, dùng Mock Parent Categories:', err.message);
  }

  cachedCategoriesList = MOCK_PARENT_CATEGORIES;
  return MOCK_PARENT_CATEGORIES;
}

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

  const rawCatId = raw.category_id ?? null;
  const rawCatName = cleanString(raw.category_name);
  const rawName = cleanString(raw.name) || 'Sản phẩm Cơ Điện Nguyên Phát';

  // Xác định phân cấp cha chuẩn 1 cấp duy nhất (bỏ con, bỏ hình ảnh thiết bị)
  const parentCat = resolveParentCategory(rawCatId, rawCatName, rawName);

  return {
    id: raw.id || '',
    name: rawName,
    slug: cleanString(raw.slug) || raw.id || '',
    code: cleanString(raw.code),
    brand: cleanString(raw.brand) || 'Nguyên Phát',
    product_type: cleanString(raw.product_type) || 'switchboard',
    category_id: parentCat.id || rawCatId,
    category_name: parentCat.name || 'Tủ điện',
    raw_category_name: rawCatName,
    is_facility_equipment: parentCat.isFacility,
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
    warranty_months: typeof raw.warranty_months === 'number' ? raw.warranty_months : 24,
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null
  };
}

// =========================================================================
// API 1: GET /api/v1/products/ (Lấy danh sách sản phẩm)
// Có đầy đủ Mock Layer hỗ trợ phân trang, lọc danh mục, tìm kiếm
// =========================================================================
export async function getProducts(params = {}, customToken = null) {
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
        // Chuẩn hóa và lọc bỏ các mục "Hình ảnh thiết bị"
        const normalized = data
          .map(normalizeProduct)
          .filter(Boolean)
          .filter((p) => !p.is_facility_equipment);

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
  let list = MOCK_PRODUCTS.map(normalizeProduct).filter(Boolean).filter((p) => !p.is_facility_equipment);

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
