/**
 * Service kết nối API Sản phẩm Nguyên Phát
 * API Base: https://nguyen-phat-admin.onrender.com/api/v1/products/
 * Tương thích 100% với schema ProductResponse:
 * {
 *   id: string (uuid),
 *   name: string,
 *   slug: string,
 *   category_id: string (uuid) | null,
 *   category_name: string | null,
 *   description: string | null,
 *   thumbnail: string | null,
 *   images: string[],
 *   created_at: string (ISO date-time),
 *   updated_at: string (ISO date-time)
 * }
 */

const API_BASE_URL = 'https://nguyen-phat-admin.onrender.com/api/v1';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cache ngắn hạn trong bộ nhớ phiên giúp chuyển trang List -> Detail mượt tức thì
let cachedProductsList = null;

// Dữ liệu mẫu đúng 100% cấu trúc 10 trường của ProductResponse (dùng làm fallback khi API 401 hoặc mất mạng)
export const MOCK_PRODUCTS = [
  {
    id: "7a8c3e21-912b-4f3d-9d41-112345678901",
    name: "Nhà Xưởng Kết Cấu Thép Tiền Chế Khẩu Độ Lớn",
    slug: "nha-xuong-ket-cau-thep-tien-che",
    category_id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
    category_name: "Kết Cấu Thép",
    description: "Giải pháp nhà xưởng khung thép tiền chế nhịp lớn vượt khẩu độ 40m - 60m không cột giữa. Thiết kế tối ưu tải trọng, thời gian lắp dựng nhanh gấp 2 lần xây dựng truyền thống, độ bền trên 50 năm.\n\n- Tối ưu không gian vận hành dây chuyền sản xuất và kho vận.\n- Gia công đồng bộ từ phôi thép cường độ cao trên dây chuyền CNC tự động.\n- Kiểm soát chất lượng mối hàn và lớp sơn bảo vệ nghiêm ngặt trước khi xuất xưởng.",
    thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-15T08:30:00.000Z",
    updated_at: "2026-10-25T14:20:00.000Z"
  },
  {
    id: "8b9d4f32-023c-5e4e-ae52-223456789012",
    name: "Khung Kèo Thép Tổ Hợp Chữ I Tiêu Chuẩn ASTM",
    slug: "khung-keo-thep-to-hop-chu-i",
    category_id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
    category_name: "Kết Cấu Thép",
    description: "Chế tạo từ phôi thép tấm chất lượng cao SS400, Q345B cắt tự động trên dây chuyền Plasma CNC. Mối hàn tự động dưới lớp thuốc hàn đạt chuẩn siêu âm kiểm định độ kín khít, chịu lực gió bão cấp 12.\n\n- Độ chính xác gia công dầm kèo tổ hợp đạt tiêu chuẩn quốc tế ASTM A36 / AWS D1.1.\n- Xử lý bề mặt phun bi chuẩn Sa 2.5 tăng khả năng bám dính lớp sơn bảo vệ kháng ăn mòn.",
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-18T09:15:00.000Z",
    updated_at: "2026-10-26T11:00:00.000Z"
  },
  {
    id: "9c0e5a43-134d-6f5f-bf63-334567890123",
    name: "Tấm Panel Sandwich PU Cách Nhiệt Chống Cháy Lan",
    slug: "tam-panel-sandwich-pu-cach-nhiet",
    category_id: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
    category_name: "Vật Liệu Cách Nhiệt",
    description: "Lõi Polyurethane tỷ trọng cao 40-42 kg/m³, bề mặt tôn mạ hợp kim nhôm kẽm kháng khuẩn, cách âm và cách nhiệt vượt trội cho phòng sạch, kho lạnh và nhà máy thực phẩm.\n\n- Giảm truyền nhiệt tới 45%, tiết kiệm tối đa năng lượng điều hòa làm mát xưởng.\n- Khóa ngàm âm dương chống dột, thi công lắp ráp tường vách và trần nhanh chóng.",
    thumbnail: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-19T10:45:00.000Z",
    updated_at: "2026-10-27T08:10:00.000Z"
  },
  {
    id: "ad1f6b54-245e-7a6a-cf74-445678901234",
    name: "Sàn Thép Liên Hợp Deck Mạ Kẽm Sóng Cường Lực",
    slug: "san-thep-lien-hop-deck-ma-kem",
    category_id: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
    category_name: "Giải Pháp Sàn",
    description: "Tấm sàn Decking thay thế hoàn toàn cốp pha truyền thống, giảm 30% khối lượng bê tông và thời gian thi công sàn nhiều tầng. Độ bám dính bê tông cực cao với các gân dập nổi chuyên dụng.\n\n- Khả năng chịu tải trọng rung động cao trong các nhà xưởng đa tầng hiện đại.\n- Thép mạ kẽm Z120 - Z275 đạt chuẩn chống rỉ sét môi trường công nghiệp.",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-20T11:20:00.000Z",
    updated_at: "2026-10-27T16:40:00.000Z"
  },
  {
    id: "be2a7c65-356f-8b7b-d085-556789012345",
    name: "Cửa Cuốn Nhanh Công Nghiệp High Speed Door",
    slug: "cua-cuon-nhanh-cong-nghiep-high-speed-door",
    category_id: "3fa85f64-5717-4562-b3fc-2c963f66afa4",
    category_name: "Cơ Điện & Phụ Trợ",
    description: "Tốc độ nâng hạ 1.5 - 2.0 m/s, tự động cảm biến radar và loop từ trường. Màn bạt PVC gia cường sợi polyester, tích hợp cơ chế tự phục hồi sau va đập vô tình của xe nâng.\n\n- Ngăn bụi mịn, giữ nhiệt độ kho lạnh và tiết kiệm điện năng cho điều hòa phân xưởng.\n- Động cơ biến tần vận hành êm ái, tuổi thọ trên 1.000.000 chu kỳ đóng mở.",
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-21T13:00:00.000Z",
    updated_at: "2026-10-28T09:30:00.000Z"
  },
  {
    id: "cf3b8d76-467a-9c8c-e196-667890123456",
    name: "Hệ Thống Thông Gió Mái & Quạt Trần HVLS Tiết Kiệm Năng Lượng",
    slug: "he-thong-thong-gio-mai-quat-hvls",
    category_id: "3fa85f64-5717-4562-b3fc-2c963f66afa4",
    category_name: "Cơ Điện & Phụ Trợ",
    description: "Hệ thống cửa trời louver kết hợp quạt trần công nghiệp sải cánh 7.3m, luân chuyển khí tươi liên tục, hạ nhiệt độ mặt sàn 4-6 độ C mà không tiêu tốn điện năng làm lạnh.\n\n- Phủ gió mát diện rộng lên đến 1.500m² mỗi cụm quạt trần HVLS.\n- Cánh quạt hợp kim nhôm định hình khí động học hàng không hoạt động bền bỉ, an toàn.",
    thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-22T14:10:00.000Z",
    updated_at: "2026-10-28T10:15:00.000Z"
  },
  {
    id: "d04c9e87-578b-0d9d-f207-778901234567",
    name: "Cầu Trục Dầm Đôi Nhà Xưởng Tải Trọng 10T - 50T",
    slug: "cau-truc-dam-doi-nha-xuong",
    category_id: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
    category_name: "Thiết Bị Nâng Hạ",
    description: "Thiết kế tích hợp đồng bộ với kết cấu cột dầm nhà thép. Hệ tời pa lăng cáp đôi điện tử biến tần xuất xứ Hàn Quốc/Đức, thắng đĩa từ tính an toàn tuyệt đối khi vận hành tải trọng nặng.\n\n- Khẩu độ dầm đạt từ 12m đến 36m, hành trình nâng hạ chính xác cao.\n- Tích hợp cảm biến chống quá tải, công tắc giới hạn hành trình và điều khiển từ xa.",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-23T15:30:00.000Z",
    updated_at: "2026-10-28T14:00:00.000Z"
  },
  {
    id: "e15dafa8-689c-1eae-0318-889012345678",
    name: "Bulong Móng Neo Cường Độ Cao 8.8 & Bản Mã Cắt Laser CNC",
    slug: "bulong-mong-neo-ban-ma-cnc",
    category_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    category_name: "Phụ Kiện Cơ Khí",
    description: "Bộ bu lông neo móng M24, M30, M36 mạ kẽm nhúng nóng chuẩn ASTM F1554, kèm bản mã thép gia công đột lỗ CNC chính xác từng milimet cho liên kết chân cột vững chãi.\n\n- Cường độ chịu kéo cao cấp bền 8.8, 10.9 đáp ứng mọi yêu cầu móng chịu tải động.\n- Bề mặt ren sắc nét, mạ kẽm chống oxy hóa trong môi trường đất ẩm hoặc ven biển.",
    thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop"
    ],
    created_at: "2026-10-24T16:00:00.000Z",
    updated_at: "2026-10-29T08:00:00.000Z"
  }
];

/**
 * Chuẩn hóa dữ liệu đúng 10 trường của ProductResponse từ API,
 * tuyệt đối không thêm dữ liệu giả ngoài schema.
 */
export function normalizeProduct(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const cleanUrl = (val) => {
    if (typeof val !== 'string') return '';
    const trimmed = val.trim();
    if (!trimmed || trimmed === 'string') return '';
    return trimmed;
  };

  return {
    id: raw.id || '',
    name: raw.name || '',
    slug: raw.slug || '',
    category_id: raw.category_id ?? null,
    category_name: raw.category_name && raw.category_name !== 'string' ? raw.category_name : null,
    description: raw.description && raw.description !== 'string' ? raw.description : '',
    thumbnail: cleanUrl(raw.thumbnail),
    images: Array.isArray(raw.images)
      ? raw.images.map(cleanUrl).filter(Boolean)
      : [],
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null
  };
}

/**
 * Lấy danh sách sản phẩm từ API GET /api/v1/products/
 * @param {string|null} categoryId
 * @param {string|null} customToken
 * @returns {Promise<{ products: Array, isLive: boolean, message: string }>}
 */
export async function getProducts(categoryId = null, customToken = null) {
  const token = customToken || localStorage.getItem('np_admin_token') || '';
  let url = `${API_BASE_URL}/products/`;
  if (categoryId && UUID_REGEX.test(categoryId)) {
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
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeProduct).filter(Boolean);
        if (!categoryId) {
          cachedProductsList = normalized;
        }
        return {
          products: normalized,
          isLive: true,
          message: 'Kết nối API trực tiếp thành công'
        };
      }
    } else if (response.status === 401) {
      const fallback = filterMock(categoryId);
      if (!categoryId) cachedProductsList = fallback;
      return {
        products: fallback,
        isLive: false,
        requiresAuth: true,
        message: 'Endpoint API yêu cầu xác thực Bearer Token (HTTP 401). Đang hiển thị dữ liệu mẫu đúng chuẩn ProductResponse.'
      };
    }
  } catch (err) {
    console.warn('Lỗi kết nối API sản phẩm:', err);
  }

  const fallback = filterMock(categoryId);
  if (!categoryId) cachedProductsList = fallback;
  return {
    products: fallback,
    isLive: false,
    message: 'Đang hiển thị dữ liệu mẫu chuẩn theo cấu trúc API Nguyên Phát.'
  };
}

/**
 * Lấy chi tiết sản phẩm theo ID (UUID) hoặc Slug, đồng thời trả kèm danh sách để lọc sản phẩm cùng category_id
 * @param {string} idOrSlug
 * @param {string|null} customToken
 * @returns {Promise<{ product: Object|null, allProducts: Array }>}
 */
export async function getProductDetailData(idOrSlug, customToken = null) {
  const token = customToken || localStorage.getItem('np_admin_token') || '';
  const headers = { 'Accept': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 1. Lấy danh sách từ GET /api/v1/products/ (hoặc dùng cache nếu vừa tải ở trang danh sách)
  let allProducts = cachedProductsList;
  if (!Array.isArray(allProducts) || allProducts.length === 0) {
    const listResult = await getProducts(null, customToken);
    allProducts = listResult.products || [];
  }

  // 2. Nếu tham số là UUID hợp lệ, có thể gọi GET /api/v1/products/{product_id} để lấy bản ghi mới nhất
  if (idOrSlug && UUID_REGEX.test(idOrSlug)) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(idOrSlug)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          return {
            product: normalizeProduct(data),
            allProducts
          };
        }
      }
    } catch (err) {
      console.warn('Lỗi gọi API chi tiết sản phẩm theo UUID:', err.message);
    }
  }

  // 3. Tra cứu trực tiếp từ mảng kết quả GET /api/v1/products/ theo id hoặc slug
  const matched = allProducts.find(
    (item) => item.id === idOrSlug || item.slug === idOrSlug
  ) || null;

  return {
    product: matched,
    allProducts
  };
}

function filterMock(categoryId) {
  const normalizedMock = MOCK_PRODUCTS.map(normalizeProduct).filter(Boolean);
  const list = (!categoryId || categoryId === 'all')
    ? normalizedMock
    : normalizedMock.filter(p => p.category_id === categoryId || p.category_name === categoryId);
  return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}
