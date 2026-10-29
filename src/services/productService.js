/**
 * Service kết nối API Sản phẩm Nguyên Phát
 * API Base: https://nguyen-phat-admin.onrender.com/api/v1/products/
 * Schema tương thích 100% với ProductResponse trong OpenAPI spec của hệ thống.
 */

const API_BASE_URL = 'https://nguyen-phat-admin.onrender.com/api/v1';

// Dữ liệu mẫu chuẩn cấu trúc ProductResponse dùng khi API chưa cấu hình Public GET (hoặc chưa có Token)
export const MOCK_PRODUCTS = [
  {
    id: "7a8c3e21-912b-4f3d-9d41-112345678901",
    name: "Nhà Xưởng Kết Cấu Thép Tiền Chế Khẩu Độ Lớn",
    slug: "nha-xuong-ket-cau-thep-tien-che",
    category_id: "cat-thep-01",
    category_name: "Kết Cấu Thép",
    description: "Giải pháp nhà xưởng khung thép tiền chế nhịp lớn vượt khẩu độ 40m - 60m không cột giữa. Thiết kế tối ưu tải trọng, thời gian lắp dựng nhanh gấp 2 lần xây dựng truyền thống, độ bền trên 50 năm.",
    thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-15T08:30:00Z",
    updated_at: "2026-10-25T14:20:00Z"
  },
  {
    id: "8b9d4f32-023c-5e4e-ae52-223456789012",
    name: "Khung Kèo Thép Tổ Hợp Chữ I Tiêu Chuẩn ASTM",
    slug: "khung-keo-thep-to-hop-chu-i",
    category_id: "cat-thep-01",
    category_name: "Kết Cấu Thép",
    description: "Chế tạo từ phôi thép tấm chất lượng cao SS400, Q345B cắt tự động trên dây chuyền Plasma CNC. Mối hàn tự động dưới lớp thuốc hàn đạt chuẩn siêu âm kiểm định độ kín khít, chịu lực gió bão cấp 12.",
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-18T09:15:00Z",
    updated_at: "2026-10-26T11:00:00Z"
  },
  {
    id: "9c0e5a43-134d-6f5f-bf63-334567890123",
    name: "Tấm Panel Sandwich PU Cách Nhiệt Chống Cháy Lan",
    slug: "tam-panel-sandwich-pu-cach-nhiet",
    category_id: "cat-vatlieu-02",
    category_name: "Vật Liệu Cách Nhiệt",
    description: "Lõi Polyurethane tỷ trọng cao 40-42 kg/m³, bề mặt tôn mạ hợp kim nhôm kẽm kháng khuẩn, cách âm và cách nhiệt vượt trội cho phòng sạch, kho lạnh và nhà máy thực phẩm.",
    thumbnail: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-19T10:45:00Z",
    updated_at: "2026-10-27T08:10:00Z"
  },
  {
    id: "ad1f6b54-245e-7a6a-cf74-445678901234",
    name: "Sàn Thép Liên Hợp Deck Mạ Kẽm Sóng Cường Lực",
    slug: "san-thep-lien-hop-deck-ma-kem",
    category_id: "cat-san-03",
    category_name: "Giải Pháp Sàn",
    description: "Tấm sàn Decking thay thế hoàn toàn cốp pha truyền thống, giảm 30% khối lượng bê tông và thời gian thi công sàn nhiều tầng. Độ bám dính bê tông cực cao với các gân dập nổi chuyên dụng.",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-20T11:20:00Z",
    updated_at: "2026-10-27T16:40:00Z"
  },
  {
    id: "be2a7c65-356f-8b7b-d085-556789012345",
    name: "Cửa Cuốn Nhanh Công Nghiệp High Speed Door",
    slug: "cua-cuon-nhanh-cong-nghiep-high-speed-door",
    category_id: "cat-phukien-04",
    category_name: "Cơ Điện & Phụ Trợ",
    description: "Tốc độ nâng hạ 1.5 - 2.0 m/s, tự động cảm biến radar và loop từ trường. Màn bạt PVC gia cường sợi polyester, tích hợp cơ chế tự phục hồi sau va đập vô tình của xe nâng.",
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-21T13:00:00Z",
    updated_at: "2026-10-28T09:30:00Z"
  },
  {
    id: "cf3b8d76-467a-9c8c-e196-667890123456",
    name: "Hệ Thống Thông Gió Mái & Quạt Trần HVLS Tiết Kiệm Năng Lượng",
    slug: "he-thong-thong-gio-mai-quat-hvls",
    category_id: "cat-phukien-04",
    category_name: "Cơ Điện & Phụ Trợ",
    description: "Hệ thống cửa trời louver kết hợp quạt trần công nghiệp sải cánh 7.3m, luân chuyển khí tươi liên tục, hạ nhiệt độ mặt sàn 4-6 độ C mà không tiêu tốn điện năng làm lạnh.",
    thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-22T14:10:00Z",
    updated_at: "2026-10-28T10:15:00Z"
  },
  {
    id: "d04c9e87-578b-0d9d-f207-778901234567",
    name: "Cầu Trục Dầm Đôi Nhà Xưởng Tải Trọng 10T - 50T",
    slug: "cau-truc-dam-doi-nha-xuong",
    category_id: "cat-thietbi-05",
    category_name: "Thiết Bị Nâng Hạ",
    description: "Thiết kế tích hợp đồng bộ với kết cấu cột dầm nhà thép. Hệ tời pa lăng cáp đôi điện tử biến tần xuất xứ Hàn Quốc/Đức, thắng đĩa từ tính an toàn tuyệt đối khi vận hành tải trọng nặng.",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-23T15:30:00Z",
    updated_at: "2026-10-28T14:00:00Z"
  },
  {
    id: "e15dafa8-689c-1eae-0318-889012345678",
    name: "Bulong Móng Neo Cường Độ Cao 8.8 & Bản Mã Cắt Laser CNC",
    slug: "bulong-mong-neo-ban-ma-cnc",
    category_id: "cat-phukien-04",
    category_name: "Phụ Kiện Cơ Khí",
    description: "Bộ bu lông neo móng M24, M30, M36 mạ kẽm nhúng nóng chuẩn ASTM F1554, kèm bản mã thép gia công đột lỗ CNC chính xác từng milimet cho liên kết chân cột vững chãi.",
    thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-24T16:00:00Z",
    updated_at: "2026-10-29T08:00:00Z"
  }
];

/**
 * Lấy danh sách sản phẩm từ API (có fallback dữ liệu mẫu chuẩn schema khi API 401 hoặc lỗi mạng)
 * @param {string|null} categoryId
 * @param {string|null} customToken
 * @returns {Promise<{ products: Array, isLive: boolean, message: string }>}
 */
export async function getProducts(categoryId = null, customToken = null) {
  const token = customToken || localStorage.getItem('np_admin_token') || '';
  let url = `${API_BASE_URL}/products/`;
  if (categoryId) {
    url += `?category_id=${encodeURIComponent(categoryId)}`;
  }

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
          products: data,
          isLive: true,
          message: 'Kết nối API trực tiếp thành công'
        };
      }
    } else if (response.status === 401) {
      return {
        products: filterMock(categoryId),
        isLive: false,
        requiresAuth: true,
        message: 'Endpoint API yêu cầu xác thực Bearer Token (HTTP 401). Đang hiển thị dữ liệu chuẩn theo Schema ProductResponse.'
      };
    }
  } catch (err) {
    console.warn('Lỗi kết nối API sản phẩm:', err);
  }

  return {
    products: filterMock(categoryId),
    isLive: false,
    message: 'Đang hiển thị dữ liệu mẫu chuẩn theo cấu trúc API Nguyên Phát.'
  };
}

function filterMock(categoryId) {
  if (!categoryId || categoryId === 'all') return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter(p => p.category_id === categoryId || p.category_name === categoryId);
}
