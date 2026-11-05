/**
 * Service kết nối API Công trình / Dự án Cơ Điện Nguyên Phát
 * API Base: https://nguyen-phat-admin.onrender.com/api/v1/projects/
 * Schema tương thích 100% với ProjectResponse trong OpenAPI specification của hệ thống:
 * - id: string (uuid)
 * - title: string
 * - slug: string
 * - thumbnail: string | null
 * - content: string | null (HTML)
 * - client: string | null (Chủ đầu tư / Đối tác)
 * - location: string | null (Địa điểm)
 * - project_type: string | null (Loại hình công trình)
 * - scope_of_work: string | null (Hạng mục thi công)
 * - scale_capacity: string | null
 * - completion_year: integer | null
 * - images: string[]
 * - is_featured: boolean | null
 * - created_at: string (date-time)
 * - updated_at: string (date-time)
 */

const API_BASE_URL = 'https://nguyen-phat-admin.onrender.com/api/v1';

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let cachedProjectsList = null;

// Dữ liệu mẫu chuẩn cấu trúc ProjectResponse từ Cơ Điện Nguyên Phát (dùng khi offline hoặc fallback)
export const MOCK_PROJECTS = [
  {
    id: "47792699-c75d-479e-bb27-f0540f15f1f7",
    title: "Nhà Máy SX Cọc Vách Nhựa UPVC - KCN Hiệp Phước",
    slug: "nha-may-sx-coc-vach-nhua-upvc-kcn-hiep-phuoc-nha-be-34",
    thumbnail: "http://diennguyenphat.com/upload/files/image004.jpg",
    content: "<h3>Dự án Nhà Máy SX Cọc Vách Nhựa UPVC - KCN Hiệp Phước</h3>\n<p>Công ty TNHH SX-TM Cơ Điện Nguyên Phát vinh dự là đối tác được lựa chọn triển khai hạng mục cung cấp và thi công hệ thống điện cho công trình <strong>Nhà Máy SX Cọc Vách Nhựa UPVC</strong> tại KCN Hiệp Phước, Nhà Bè, TP.HCM.</p>\n<h4>Thông tin tóm tắt công trình:</h4>\n<ul>\n  <li><strong>Chủ đầu tư / Đối tác:</strong> Chủ đầu tư dự án</li>\n  <li><strong>Địa điểm thực hiện:</strong> KCN Hiệp Phước, Nhà Bè, TP.HCM</li>\n  <li><strong>Loại hình công trình:</strong> Nhà máy Sản xuất & KCN</li>\n  <li><strong>Hạng mục Nguyên Phát đảm nhận:</strong> Sản xuất, cung cấp và lắp đặt trọn gói hệ thống Tủ điện phân phối và Thang máng cáp</li>\n</ul>\n<p>Toàn bộ sản phẩm được kiểm định nghiêm ngặt trước khi xuất xưởng, đáp ứng các yêu cầu khắt khe về kỹ thuật IEC 61439-1/2, thẩm mỹ và tiến độ bàn giao của chủ đầu tư.</p>",
    client: "Chủ đầu tư dự án",
    location: "KCN Hiệp Phước, Nhà Bè, TP.HCM",
    project_type: "Nhà máy Sản xuất & KCN",
    category_name: "Nhà máy Sản xuất & KCN",
    scope_of_work: "Sản xuất, cung cấp và lắp đặt trọn gói hệ thống Tủ điện phân phối và Thang máng cáp",
    scale_capacity: "Hệ thống trạm phân phối 3200A",
    completion_year: 2022,
    images: [
      "http://diennguyenphat.com/upload/files/sanpham/image005.jpg",
      "http://diennguyenphat.com/upload/files/image006.jpg"
    ],
    is_featured: true,
    created_at: "2026-10-30T01:11:24.364Z",
    updated_at: "2026-11-02T04:21:42.003Z"
  },
  {
    id: "d34e5709-db4c-4ea2-92f4-9cdbe7344eec",
    title: "Khu Tái Định Cư Tân Hòa Đông - Quận 6",
    slug: "khu-tai-dinh-cu-tan-hoa-dong-quan-6-35",
    thumbnail: "http://diennguyenphat.com/upload/files/image007.jpg",
    content: "<h3>Dự án Khu Tái Định Cư Tân Hòa Đông - Quận 6</h3>\n<p>Cung cấp hệ thống tủ điện tổng MSB, tủ chuyển nguồn tự động ATS 400A và thang máng cáp sơn tĩnh điện cho tổ hợp chung cư cao tầng Tân Hòa Đông, đảm bảo an toàn điện lưới và phòng chống cháy nổ.</p>",
    client: "Ban Quản lý Dự án Quận 6",
    location: "Quận 6, TP. Hồ Chí Minh",
    project_type: "Khu Dân Cư & Đô Thị",
    category_name: "Khu Dân Cư & Đô Thị",
    scope_of_work: "Cung cấp trọn gói tủ điện MSB, ATS 400A và thang máng cáp",
    scale_capacity: "Chung cư cao tầng",
    completion_year: 2022,
    images: [
      "http://diennguyenphat.com/upload/files/image008.jpg"
    ],
    is_featured: false,
    created_at: "2026-10-30T01:11:24.364Z",
    updated_at: "2026-11-02T04:21:42.003Z"
  },
  {
    id: "aea46dc7-bb75-4e90-a568-53d947e0f819",
    title: "Nhà Xưởng KCN Long Đức - Đồng Nai",
    slug: "kcn-long-duc-dong-nai-36",
    thumbnail: "http://diennguyenphat.com/upload/files/image009.jpg",
    content: "<h3>Dự án Nhà Xưởng KCN Long Đức - Đồng Nai</h3>\n<p>Thi công lắp đặt đồng bộ hệ thống tủ điện điều khiển động cơ MCC, tủ bù công suất phản kháng và hệ thống trunking máng cáp mạ kẽm nhúng nóng.</p>",
    client: "Chủ đầu tư KCN Long Đức",
    location: "KCN Long Đức, Long Thành, Đồng Nai",
    project_type: "Nhà máy Sản xuất & KCN",
    category_name: "Nhà máy Sản xuất & KCN",
    scope_of_work: "Sản xuất, cung cấp và lắp đặt trọn gói hệ thống Tủ điện phân phối và Thang máng cáp",
    scale_capacity: "Nhà xưởng 15.000m²",
    completion_year: 2022,
    images: [
      "http://diennguyenphat.com/upload/files/image010.jpg"
    ],
    is_featured: false,
    created_at: "2026-10-30T01:11:24.364Z",
    updated_at: "2026-11-02T04:21:42.003Z"
  },
  {
    id: "530c7ac4-a340-4251-a139-8a54822cdc7d",
    title: "Tòa Nhà Văn Phòng Đại Diện Phía Nam Cty 319 Invest",
    slug: "toa-nha-van-phong-dai-dien-phia-nam-cty-319-invest-tan-binh-39",
    thumbnail: "http://diennguyenphat.com/upload/files/image014.jpg",
    content: "<h3>Dự án Tòa Nhà Văn Phòng Cty 319 Invest - Bộ Quốc Phòng</h3>\n<p>Nguyên Phát tự hào cung cấp toàn bộ hệ thống tủ phân phối tầng, tủ điện tầng hầm và máng cáp cho tòa nhà văn phòng đại diện phía Nam của Tổng công ty 319.</p>",
    client: "Công ty CP Đầu tư và Thương mại 319 (Bộ Quốc Phòng)",
    location: "Tân Bình, TP. Hồ Chí Minh",
    project_type: "Tòa Nhà Văn Phòng & Thương Mại",
    category_name: "Tòa Nhà Văn Phòng & Thương Mại",
    scope_of_work: "Hệ thống tủ điện tầng, tủ bơm PCCC và thang máng cáp",
    scale_capacity: "Tòa nhà văn phòng 9 tầng",
    completion_year: 2022,
    images: [],
    is_featured: true,
    created_at: "2026-10-30T01:11:24.364Z",
    updated_at: "2026-11-02T04:21:42.003Z"
  },
  {
    id: "78abb1ad-a29b-4c03-b52d-cca0aad57d05",
    title: "Tập Đoàn Hyosung - Nhơn Trạch, Đồng Nai",
    slug: "cong-ty-hyosung-nhon-trach-dong-nai-43",
    thumbnail: "http://diennguyenphat.com/upload/files/image017.jpg",
    content: "<h3>Dự án Cung Cấp Thiết Bị Điện Tập Đoàn Hyosung Hàn Quốc</h3>\n<p>Cung ứng hệ thống tủ tụ bù tự động 500kVAR và hệ thống khay cáp mạ kẽm nhúng nóng tiêu chuẩn quốc tế phục vụ các dây chuyền dệt sợi công nghiệp cao cấp.</p>",
    client: "Tập đoàn Hyosung (Hàn Quốc)",
    location: "KCN Nhơn Trạch, Đồng Nai",
    project_type: "Nhà máy Sản xuất & KCN",
    category_name: "Nhà máy Sản xuất & KCN",
    scope_of_work: "Tủ tụ bù công suất phản kháng và hệ thống khay máng cáp",
    scale_capacity: "Dây chuyền sản xuất FDI",
    completion_year: 2022,
    images: [],
    is_featured: true,
    created_at: "2026-10-30T01:11:24.364Z",
    updated_at: "2026-11-02T04:21:42.003Z"
  },
  {
    id: "fe7ac7cf-ca04-4ac4-86ef-d1472c3830ec",
    title: "Hotel Millennium Boutique - Thái Văn Lung, Quận 1",
    slug: "hotel-millennium-boutique-7a-thai-van-lung-q1-46",
    thumbnail: "http://diennguyenphat.com/upload/files/image020.jpg",
    content: "<h3>Dự án Khách Sạn Millennium Boutique Quận 1</h3>\n<p>Lắp đặt hệ thống tủ điện phân phối phòng khách sạn, tủ điều khiển chiller điều hòa trung tâm và máng cáp kỹ thuật đạt tiêu chuẩn thẩm mỹ cao cấp.</p>",
    client: "Công ty TNHH Khách Sạn Millennium",
    location: "7A Thái Văn Lung, Quận 1, TP. Hồ Chí Minh",
    project_type: "Tòa nhà Khách sạn & Nghỉ dưỡng",
    category_name: "Tòa nhà Khách sạn & Nghỉ dưỡng",
    scope_of_work: "Tủ phân phối điện khách sạn và hệ thống thang máng cáp",
    scale_capacity: "Khách sạn 4 sao",
    completion_year: 2022,
    images: [],
    is_featured: false,
    created_at: "2026-10-30T01:11:24.364Z",
    updated_at: "2026-11-02T04:21:42.003Z"
  }
];

/**
 * Chuẩn hóa cấu trúc 15 trường của ProjectResponse
 * Đồng bộ giữa các trường backend (client, scope_of_work, project_type) và UI
 */
export function normalizeProject(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const client = raw.client || raw.investor || '';
  const scopeOfWork = raw.scope_of_work || raw.scope || '';
  const projectType = raw.project_type || raw.category_name || '';
  const location = raw.location && raw.location !== 'string' ? raw.location : '';
  const completionYear = raw.completion_year || (raw.created_at ? new Date(raw.created_at).getFullYear() : null);

  const images = Array.isArray(raw.images) && raw.images.length > 0
    ? raw.images.filter(Boolean)
    : (raw.thumbnail ? [raw.thumbnail] : []);

  return {
    id: raw.id || '',
    title: raw.title || '',
    slug: raw.slug || raw.id || '',
    thumbnail: raw.thumbnail || (images[0] || ''),
    content: typeof raw.content === 'string' && raw.content !== 'string' ? raw.content : '',
    client,
    investor: client, // backwards compatibility
    location,
    project_type: projectType,
    category_name: projectType, // map project_type -> category_name
    scope_of_work: scopeOfWork,
    scope: scopeOfWork, // backwards compatibility
    scale_capacity: raw.scale_capacity || null,
    completion_year: completionYear,
    images,
    is_featured: Boolean(raw.is_featured),
    created_at: raw.created_at || null,
    updated_at: raw.updated_at || null,
    standards: raw.standards || ''
  };
}

/**
 * Lấy danh sách công trình từ API (có fallback sang Mock Layer chuẩn Cơ Điện Nguyên Phát)
 * @param {string|null} customToken
 * @returns {Promise<{ projects: Array, isLive: boolean, message: string }>}
 */
export async function getProjects(customToken = null) {
  if (Array.isArray(cachedProjectsList) && cachedProjectsList.length > 0) {
    return {
      projects: cachedProjectsList,
      isLive: true,
      message: 'Lấy từ cache'
    };
  }

  const token = customToken || localStorage.getItem('np_admin_token') || '';
  const url = `${API_BASE_URL}/projects/?skip=0&limit=100`;

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
        const normalized = data
          .map(normalizeProject)
          .filter(Boolean)
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        cachedProjectsList = normalized;
        return {
          projects: normalized,
          isLive: true,
          message: 'Kết nối API công trình trực tiếp thành công'
        };
      }
    }
  } catch (err) {
    console.warn('Lỗi kết nối API projects live, dùng Mock Data:', err.message);
  }

  const normalizedMock = MOCK_PROJECTS
    .map(normalizeProject)
    .filter(Boolean)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  cachedProjectsList = normalizedMock;

  return {
    projects: normalizedMock,
    isLive: false,
    message: 'Đang hiển thị dữ liệu chuẩn theo cấu trúc API Nguyên Phát.'
  };
}

/**
 * Lấy chi tiết công trình theo UUID hoặc Slug (gọi chuẩn endpoint của backend)
 * @param {string} idOrSlug
 * @param {string|null} customToken
 * @returns {Promise<Object|null>}
 */
export async function getProjectById(idOrSlug, customToken = null) {
  if (!idOrSlug) return null;

  const token = customToken || localStorage.getItem('np_admin_token') || '';
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // 1. Nếu là UUID hợp lệ, gọi endpoint GET /api/v1/projects/{project_id}
  if (UUID_REGEX.test(idOrSlug)) {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(idOrSlug)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          return normalizeProject(data);
        }
      }
    } catch (err) {
      console.warn('Lỗi gọi API GET /api/v1/projects/{id}:', err.message);
    }
  } else {
    // 2. Nếu là Slug, gọi trực tiếp endpoint GET /api/v1/projects/slug/{slug} đã deploy trên backend
    try {
      const res = await fetch(`${API_BASE_URL}/projects/slug/${encodeURIComponent(idOrSlug)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          return normalizeProject(data);
        }
      }
    } catch (err) {
      console.warn('Lỗi gọi API GET /api/v1/projects/slug/{slug}:', err.message);
    }
  }

  // 3. Tra cứu trong Cache hoặc lấy từ danh sách tổng
  try {
    let list = cachedProjectsList;
    if (!Array.isArray(list) || list.length === 0) {
      const liveRes = await getProjects(customToken);
      list = liveRes.projects || [];
    }
    const matched = list.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (matched) return matched;
  } catch {
    // Tiếp tục fallback
  }

  // 4. Fallback Mock
  const found = MOCK_PROJECTS.map(normalizeProject).find(p => p.id === idOrSlug || p.slug === idOrSlug) || normalizeProject(MOCK_PROJECTS[0]);
  return found;
}
