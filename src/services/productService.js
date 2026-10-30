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
  const list = (!categoryId || categoryId === 'all')
    ? [...MOCK_PRODUCTS]
    : MOCK_PRODUCTS.filter(p => p.category_id === categoryId || p.category_name === categoryId);
  return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

/**
 * Lấy thông tin chi tiết sản phẩm theo ID hoặc Slug
 * @param {string} idOrSlug
 * @param {string|null} customToken
 * @returns {Promise<Object|null>}
 */
export async function getProductById(idOrSlug, customToken = null) {
  const token = customToken || localStorage.getItem('np_admin_token') || '';

  if (idOrSlug) {
    try {
      const headers = { 'Accept': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Thử gọi trực tiếp endpoint chi tiết sản phẩm
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(idOrSlug)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && (data.id || data.name)) {
          return enrichProductDetails(data);
        }
      }

      // Nếu truyền slug nhưng API chi tiết chỉ nhận UUID, thử tìm trong danh sách API
      const listRes = await fetch(`${API_BASE_URL}/products/`, { headers });
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData)) {
          const matched = listData.find(
            (item) => item.id === idOrSlug || item.slug === idOrSlug
          );
          if (matched) {
            return enrichProductDetails(matched);
          }
        }
      }
    } catch (err) {
      console.warn('Lỗi gọi API getProductById:', err.message);
    }
  }

  // Fallback tìm kiếm trong MOCK_PRODUCTS theo id hoặc slug
  const found = MOCK_PRODUCTS.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
  return found ? enrichProductDetails(found) : null;
}

/**
 * Bổ sung thông số kỹ thuật chuyên sâu, ưu điểm và bộ ảnh chi tiết theo từng nhóm ngành
 * nhưng luôn giữ nguyên các trường dữ liệu gốc từ API trả về.
 */
function enrichProductDetails(product) {
  if (!product) return null;

  const category = product.category_name || 'Kết Cấu Thép';
  const shortCode = (product.id || product.slug || 'NP01')
    .toString()
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 6)
    .toUpperCase();

  // Bộ ảnh gallery tối thiểu 4 góc nhìn công nghiệp sắc nét
  const fallbackPool = [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop'
  ];

  const mergedImages = [];
  if (product.thumbnail) mergedImages.push(product.thumbnail);
  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (img && !mergedImages.includes(img)) mergedImages.push(img);
    });
  }
  fallbackPool.forEach((img) => {
    if (mergedImages.length < 4 && !mergedImages.includes(img)) {
      mergedImages.push(img);
    }
  });

  // Cấu hình thông số theo danh mục kỹ thuật
  const categoryPresets = {
    'Kết Cấu Thép': {
      material: 'Thép tấm Q345B / SS400 / ASTM A572',
      standard: 'TCVN 5575:2012, AISC 360, AWS D1.1',
      technology: 'Cắt CNC Plasma/Laser & Hàn tự động SAW',
      warranty: 'Bảo hành kết cấu 10 - 15 năm',
      specs: [
        { label: 'Mác thép chủ đạo', value: 'Q345B, SS400, ASTM A36 / A572 Gr.50' },
        { label: 'Khẩu độ vượt nhịp', value: '30m – 80m (Tối ưu không cột giữa)' },
        { label: 'Công nghệ làm sạch bề mặt', value: 'Phun bi thép đạt chuẩn quốc tế Sa 2.5' },
        { label: 'Hệ sơn bảo vệ', value: 'Sơn chống gỉ Alkyd / Epoxy 2 thành phần (120 - 240 µm)' },
        { label: 'Kiểm định mối hàn', value: 'Siêu âm UT 100% mối hàn đối đầu & Từ tính MT' },
        { label: 'Khả năng chịu tải gió bão', value: 'Thiết kế chịu áp lực gió bão đến cấp 12 - 14' }
      ],
      applications: [
        'Nhà máy sản xuất công nghiệp nặng & FDI',
        'Kho bãi Logistics & Trung tâm phân phối',
        'Nhà xưởng nhiều tầng kết hợp văn phòng',
        'Nhà ga, showroom ô tô & tổ hợp thương mại'
      ]
    },
    'Vật Liệu Cách Nhiệt': {
      material: 'Lõi PU / PIR tỷ trọng cao & Tôn mạ AZ100',
      standard: 'QCVN 06:2022/BXD, ISO 9001:2015',
      technology: 'Đổ foam áp lực cao liên tục tự động',
      warranty: 'Bảo hành lớp mạ & độ bền màu 10 năm',
      specs: [
        { label: 'Tỷ trọng lõi cách nhiệt', value: '40 – 45 kg/m³ (Polyurethane / PIR chống cháy lan)' },
        { label: 'Hệ số dẫn nhiệt', value: '0.018 – 0.022 W/m·K (Tiết kiệm 40% điện năng làm mát)' },
        { label: 'Độ dày tấm tiêu chuẩn', value: '50mm / 75mm / 100mm / 150mm (Tùy chỉnh theo nhiệt độ)' },
        { label: 'Bề mặt tôn hai lớp', value: 'Tôn mạ hợp kim nhôm kẽm sơn tĩnh điện kháng khuẩn 0.45 - 0.55mm' },
        { label: 'Cấp độ chống cháy', value: 'Đạt chuẩn chống cháy lan B1 / EI theo yêu cầu PCCC' },
        { label: 'Liên kết ngàm âm dương', value: 'Khóa camlock / Ngàm giấu vít kín khít tuyệt đối' }
      ],
      applications: [
        'Phòng sạch GMP dược phẩm & linh kiện điện tử',
        'Kho lạnh bảo quản nông sản, thủy hải sản âm sâu',
        'Nhà máy chế biến thực phẩm & đồ uống HACCP',
        'Vách bao che & trần cách âm nhà xưởng hiện đại'
      ]
    },
    'Giải Pháp Sàn': {
      material: 'Thép cuộn mạ kẽm cường độ cao G350 - G450',
      standard: 'ANSI/SDI C-2017, Eurocode 4',
      technology: 'Cán sóng nguội CNC & Dập gân tăng cứng',
      warranty: 'Bảo hành vật liệu chống ăn mòn 10 năm',
      specs: [
        { label: 'Mác thép nền & Lớp mạ', value: 'Thép mạ kẽm Z120 – Z275 (ASTM A653)' },
        { label: 'Độ dày tấm sàn Deck', value: '0.75mm / 0.95mm / 1.15mm / 1.20mm' },
        { label: 'Chiều cao bước sóng', value: 'H50W1000 / H75W900 (Tối ưu nhịp dầm phụ)' },
        { label: 'Đinh hàn liên kết (Stud Bolt)', value: 'M16 / M19 hàn hồ quang xuyên sàn cường độ cao' },
        { label: 'Hiệu quả thi công', value: 'Thay thế 100% cốp pha đáy, giảm 25-30% tải trọng sàn' },
        { label: 'Khả năng chịu tải sàn', value: '500 – 2.500 kg/m² tùy khẩu độ dầm và chiều dày bê tông' }
      ],
      applications: [
        'Sàn nhà xưởng sản xuất công nghiệp nhiều tầng',
        'Tòa nhà văn phòng, trung tâm thương mại kết cấu thép',
        'Sàn lửng (Mezzanine) mở rộng diện tích kho hàng',
        'Bãi đỗ xe cao tầng lắp ghép thông minh'
      ]
    }
  };

  const preset = categoryPresets[category] || {
    material: 'Hợp kim thép công nghiệp & Linh kiện đồng bộ',
    standard: 'ISO 9001:2015, TCVN & ASTM Quốc Tế',
    technology: 'Gia công CNC chính xác & Tích hợp tự động hóa',
    warranty: 'Bảo hành kỹ thuật chính hãng 24 - 60 tháng',
    specs: [
      { label: 'Tiêu chuẩn chế tạo', value: 'ISO 9001:2015, TCVN & Tiêu chuẩn công nghiệp Châu Âu' },
      { label: 'Vật liệu cấu thành', value: 'Thép chịu lực xử lý bề mặt mạ kẽm / Sơn tĩnh điện cao cấp' },
      { label: 'Độ chính xác gia công', value: 'Sai số < ±0.5mm trên hệ thống máy CNC tự động' },
      { label: 'Cấp độ bảo vệ & An toàn', value: 'IP54 / IP65 - Tích hợp cơ cấu bảo vệ an toàn vận hành' },
      { label: 'Hồ sơ nghiệm thu đi kèm', value: 'Chứng chỉ xuất xưởng CO/CQ, Biên bản kiểm định KCS' },
      { label: 'Dịch vụ hậu mãi', value: 'Hỗ trợ kỹ thuật 24/7 & Bảo trì định kỳ tận công trình' }
    ],
    applications: [
      'Tối ưu vận hành nhà máy & khu công nghiệp hiện đại',
      'Hệ thống kho vận Logistics lưu lượng xuất nhập cao',
      'Công trình kết cấu thép tiền chế tiêu chuẩn quốc tế',
      'Nâng cấp, cải tạo dây chuyền phụ trợ nhà xưởng'
    ]
  };

  return {
    ...product,
    sku: product.sku || `NP-${shortCode}`,
    images: mergedImages,
    highlights: product.highlights || [
      { label: 'Vật liệu chủ đạo', value: preset.material },
      { label: 'Tiêu chuẩn áp dụng', value: preset.standard },
      { label: 'Công nghệ chế tạo', value: preset.technology },
      { label: 'Chính sách bảo hành', value: preset.warranty }
    ],
    specs: product.specs || preset.specs,
    applications: product.applications || preset.applications,
    features: product.features || [
      {
        title: 'Thiết Kế Tối Ưu Tải Trọng & Chi Phí Đầu Tư',
        desc: 'Được tính toán mô phỏng bởi đội ngũ kỹ sư kết cấu giàu kinh nghiệm, giúp tối ưu định mức vật tư từ 15% - 20% mà vẫn đảm bảo hệ số an toàn vượt trội.'
      },
      {
        title: 'Gia Công Đồng Bộ Trên Dây Chuyền CNC Hiện Đại',
        desc: 'Toàn bộ cấu kiện và vật tư được sản xuất khép kín tại nhà máy, kiểm soát KCS nghiêm ngặt từng công đoạn trước khi xuất xưởng đến chân công trình.'
      },
      {
        title: 'Rút Ngắn Tiến Độ Lắp Dựng & Bàn Giao Nghiệm Thu',
        desc: 'Thiết kế module hóa thông minh giúp lắp ghép nhanh chóng, giảm thiểu rủi ro thời tiết và sớm đưa nhà máy vào vận hành khai thác thương mại.'
      }
    ],
    faqs: product.faqs || [
      {
        question: 'Nguyên Phát có hỗ trợ khảo sát và lên bản vẽ thiết kế kỹ thuật trước khi báo giá không?',
        answer: 'Có. Đội ngũ kỹ sư Nguyên Phát hỗ trợ khảo sát thực tế, tư vấn giải pháp vật liệu tối ưu và lập bản vẽ đề xuất kỹ thuật kèm bảng dự toán chi tiết hoàn toàn miễn phí cho chủ đầu tư.'
      },
      {
        question: 'Sản phẩm có đầy đủ chứng chỉ CO/CQ và biên bản kiểm định chất lượng phục vụ nghiệm thu không?',
        answer: '100% vật tư, phôi thép và thiết bị do Nguyên Phát cung ứng đều đi kèm bộ hồ sơ pháp lý chất lượng đầy đủ gồm: CO/CQ nguồn gốc vật liệu, kết quả thí nghiệm cơ lý tính, biên bản siêu âm mối hàn và hồ sơ KCS xuất xưởng.'
      },
      {
        question: 'Thời gian gia công sản xuất và vận chuyển lắp dựng đến công trình mất bao lâu?',
        answer: 'Tùy theo quy mô khối lượng đơn hàng, thời gian gia công tại nhà máy dao động từ 7 – 25 ngày làm việc. Nguyên Phát có năng lực vận chuyển siêu trường siêu trọng và tổ chức thi công lắp dựng trên toàn quốc.'
      }
    ]
  };
}
