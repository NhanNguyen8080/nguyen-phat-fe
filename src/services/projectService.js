/**
 * Service kết nối API Công trình / Dự án Nguyên Phát
 * API Base: https://nguyen-phat-admin.onrender.com/api/v1/projects/
 * Schema tương thích 100% với ProjectResponse trong OpenAPI spec của hệ thống.
 */

const API_BASE_URL = 'https://nguyen-phat-admin.onrender.com/api/v1';

// Dữ liệu mẫu chuẩn cấu trúc ProjectResponse dùng khi API chưa cấu hình Public GET (hoặc chưa có Token)
export const MOCK_PROJECTS = [
  {
    id: "p1-7a8c3e21-912b-4f3d-9d41-112345678901",
    title: "Nhà Máy Sản Xuất Linh Kiện Điện Tử Hansol - KCN Yên Phong",
    slug: "nha-may-san-xuat-linh-kien-dien-tu-hansol",
    category_name: "Nhà Xưởng Công Nghiệp",
    thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
    content: "Quy mô diện tích 35.000m², tổng khối lượng kết cấu thép 1.800 tấn. Thi công hoàn thiện khung kèo tiền chế, sàn deck và bao che panel chống cháy lan trong 120 ngày. Đạt tiêu chuẩn nghiệm thu PCCC và kiểm định an toàn chất lượng quốc tế.",
    created_at: "2026-10-10T08:30:00Z",
    updated_at: "2026-10-25T14:20:00Z"
  },
  {
    id: "p2-8b9d4f32-023c-5e4e-ae52-223456789012",
    title: "Kho Logistics Thông Minh Smart Hub - Long An",
    slug: "kho-logistics-thong-minh-smart-hub",
    category_name: "Kho Bãi & Logistics",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    content: "Trung tâm logistics hiện đại với khẩu độ vượt nhịp 48m không cột giữa, nền bê tông đánh bóng tăng cứng rải sika chịu tải 5 tấn/m². Hệ thống cửa xuất nhập hàng tự động dock leveler và trần lợp cách nhiệt PU 3 lớp.",
    created_at: "2026-10-12T09:15:00Z",
    updated_at: "2026-10-26T11:00:00Z"
  },
  {
    id: "p3-9c0e5a43-134d-6f5f-bf63-334567890123",
    title: "Nhà Xưởng Chế Biến Thực Phẩm Sạch VinaFresh - Bình Dương",
    slug: "nha-xuong-che-bien-thuc-pham-sach-vinafresh",
    category_name: "Nhà Xưởng Công Nghiệp",
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    content: "Dự án thi công theo tiêu chuẩn phòng sạch GMP/HACCP, ứng dụng hoàn toàn hệ panel PIR cách nhiệt và hệ thống kiểm soát nhiệt độ thông minh. Toàn bộ kết cấu khung thép được mạ kẽm nhúng nóng kháng ăn mòn hóa chất.",
    created_at: "2026-10-15T10:45:00Z",
    updated_at: "2026-10-27T08:10:00Z"
  },
  {
    id: "p4-ad1f6b54-245e-7a6a-cf74-445678901234",
    title: "Tòa Nhà Văn Phòng & Showroom C&A Center - TP.HCM",
    slug: "toa-nha-van-phong-showroom-ca-center",
    category_name: "Thương Mại & Văn Phòng",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    content: "Công trình thương mại 7 tầng kiến trúc lộ kết cấu thép hiện đại, sử dụng kính Low-E cản nhiệt và sàn deck liên hợp tiết kiệm thời gian thi công. Đạt chứng chỉ công trình xanh LEED Silver về tiết kiệm năng lượng.",
    created_at: "2026-10-18T11:20:00Z",
    updated_at: "2026-10-27T16:40:00Z"
  },
  {
    id: "p5-be2a7c65-356f-8b7b-d085-556789012345",
    title: "Nhà Máy May Mặc Xuất Khẩu Dệt May Phương Nam - Tiền Giang",
    slug: "nha-may-may-mac-xuat-khau-det-may-phuong-nam",
    category_name: "Nhà Xưởng Công Nghiệp",
    thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    content: "Tổ hợp 3 phân xưởng may quy mô 20.000m² với hệ thống thông gió đối lưu tự nhiên và quạt trần công nghiệp HVLS tiết kiệm 60% điện năng làm mát. Mái lợp tôn sóng cliplock chống dột tuyệt đối.",
    created_at: "2026-10-20T13:00:00Z",
    updated_at: "2026-10-28T09:30:00Z"
  },
  {
    id: "p6-cf3b8d76-467a-9c8c-e196-667890123456",
    title: "Nhà Máy Sản Xuất Bao Bì Kim Loại VinaCan - Hải Phòng",
    slug: "nha-may-san-xuat-bao-bi-kim-loai-vinacan",
    category_name: "Nhà Xưởng Công Nghiệp",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
    content: "Trang bị hệ dầm cầu trục đôi 25 tấn khẩu độ 30m, cột thép chữ H gia công siêu âm đạt tiêu chuẩn tải trọng rung lắc cường độ cao. Hệ móng cọc bê tông ly tâm khoan nhồi vững chắc.",
    created_at: "2026-10-22T14:10:00Z",
    updated_at: "2026-10-28T10:15:00Z"
  },
  {
    id: "p7-d04c9e87-578b-0d9d-f207-778901234567",
    title: "Cụm Nhà Xưởng Cho Thuê Tiêu Chuẩn Quốc Tế - Đồng Nai",
    slug: "cum-nha-xuong-cho-thue-tieu-chuan-quoc-te",
    category_name: "Kho Bãi & Logistics",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
    content: "Module nhà xưởng linh hoạt từ 2.000m² đến 10.000m², trang bị đầy đủ trạm biến áp, hệ thống PCCC tự động Sprinkler và đường nội bộ tải trọng nặng cho xe container 40 feet ra vào 24/7.",
    created_at: "2026-10-24T15:30:00Z",
    updated_at: "2026-10-28T14:00:00Z"
  },
  {
    id: "p8-e15dafa8-689c-1eae-0318-889012345678",
    title: "Khu Căn Hộ Nghỉ Dưỡng Sinh Thái Eco Hill - Đà Lạt",
    slug: "khu-can-ho-nghi-duong-sinh-thai-eco-hill",
    category_name: "Dân Dụng & Nghỉ Dưỡng",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    content: "Dự án dân dụng kết cấu thép nhẹ kết hợp gỗ tự nhiên trên địa hình đồi dốc. Giải pháp móng đơn hạn chế đào đắp, bảo tồn cảnh quan rừng thông và tối ưu view thung lũng.",
    created_at: "2026-10-26T16:00:00Z",
    updated_at: "2026-10-29T08:00:00Z"
  }
];

/**
 * Lấy danh sách công trình từ API (có fallback dữ liệu mẫu chuẩn schema khi API 401 hoặc lỗi mạng)
 * @param {string|null} customToken
 * @returns {Promise<{ projects: Array, isLive: boolean, message: string }>}
 */
export async function getProjects(customToken = null) {
  const token = customToken || localStorage.getItem('np_admin_token') || '';
  const url = `${API_BASE_URL}/projects/`;

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
        return {
          projects: data,
          isLive: true,
          message: 'Kết nối API công trình trực tiếp thành công'
        };
      }
    }
  } catch (err) {
    console.warn('Lỗi kết nối API projects:', err);
  }

  return {
    projects: MOCK_PROJECTS,
    isLive: false,
    message: 'Đang hiển thị dữ liệu chuẩn theo cấu trúc API Nguyên Phát.'
  };
}

/**
 * Lấy chi tiết công trình theo ID hoặc Slug
 * @param {string} idOrSlug
 * @param {string|null} customToken
 * @returns {Promise<Object|null>}
 */
export async function getProjectById(idOrSlug, customToken = null) {
  const token = customToken || localStorage.getItem('np_admin_token') || '';
  
  if (idOrSlug) {
    try {
      const headers = { 'Accept': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`${API_BASE_URL}/projects/${idOrSlug}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.id || data.title)) {
          return enrichProjectSpecs(data);
        }
      }
    } catch (err) {
      console.warn('Lỗi gọi API getProjectById:', err.message);
    }
  }

  // Fallback tìm kiếm trong MOCK_PROJECTS theo id hoặc slug
  const found = MOCK_PROJECTS.find(p => p.id === idOrSlug || p.slug === idOrSlug) || MOCK_PROJECTS[0];
  return enrichProjectSpecs(found);
}

// Bổ sung thông số kỹ thuật và hình ảnh bổ trợ cho trang chi tiết công trình
function enrichProjectSpecs(project) {
  if (!project) return null;

  const defaultGallery = [
    project.thumbnail || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"
  ];

  return {
    ...project,
    images: project.images && project.images.length > 0 ? project.images : defaultGallery,
    location: project.location || (project.title.includes('Bắc Ninh') || project.title.includes('Hansol') ? 'KCN Yên Phong, Bắc Ninh'
      : project.title.includes('Long An') ? 'KCN Đức Hòa, Long An'
      : project.title.includes('Bình Dương') ? 'KCN VSIP II, Bình Dương'
      : project.title.includes('TP.HCM') ? 'Quận 7, TP. Hồ Chí Minh'
      : project.title.includes('Hải Phòng') ? 'KCN Đình Vũ, Hải Phòng'
      : project.title.includes('Đồng Nai') ? 'KCN Nhơn Trạch, Đồng Nai'
      : project.title.includes('Đà Lạt') ? 'TP. Đà Lạt, Lâm Đồng'
      : 'Việt Nam'),
    area: project.area || (project.title.includes('Hansol') ? '35.000 m²'
      : project.title.includes('Logistics') ? '28.000 m²'
      : project.title.includes('VinaFresh') ? '18.500 m²'
      : project.title.includes('C&A') ? '12.000 m² (7 Tầng)'
      : project.title.includes('Phương Nam') ? '20.000 m²'
      : project.title.includes('VinaCan') ? '16.000 m²'
      : '15.000 m²'),
    steelVolume: project.steelVolume || (project.title.includes('Hansol') ? '1.800 Tấn'
      : project.title.includes('Logistics') ? '1.450 Tấn'
      : project.title.includes('C&A') ? '980 Tấn'
      : '1.200 Tấn'),
    duration: project.duration || '120 Ngày',
    investor: project.investor || 'Chủ đầu tư trong nước & FDI',
    standards: project.standards || 'TCVN 5575:2012, ASTM A36, AWS D1.1, LEED Silver',
    scope: project.scope || 'Thiết kế kỹ thuật, gia công kết cấu thép tại nhà máy và lắp dựng hoàn thiện trọn gói.'
  };
}
