/**
 * Service kết nối API Tin tức / Bài viết Cơ Điện Nguyên Phát
 * API Base: https://nguyen-phat-admin.onrender.com/api/v1/posts/
 * Schema tương thích 100% với PostResponse và PostDetailResponse trong OpenAPI specification của hệ thống:
 * - id: string (uuid)
 * - title: string
 * - slug: string
 * - category_name: string
 * - thumbnail: string | null
 * - summary: string | null
 * - content: string | null (HTML)
 * - author: string | null
 * - read_time: string | null
 * - tags: string[]
 * - is_featured: boolean
 * - views: integer
 * - created_at: string (date-time)
 * - updated_at: string (date-time)
 * - toc: Array<{ id: string, title: string }> (Mục lục bài viết)
 * - related_posts: Array<{ id, title, slug, category_name, thumbnail, created_at }> (Bài viết liên quan)
 */

const API_BASE_URL = 'https://nguyen-phat-admin.onrender.com/api/v1';

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let cachedPostsList = null;

// Dữ liệu mẫu chuẩn cấu trúc PostResponse / PostDetailResponse Cơ Điện Nguyên Phát
export const MOCK_POSTS = [
  {
    id: "b118bab1-2b04-40ef-8dd0-fd25e83d9dee",
    title: "Hướng Dẫn Thiết Kế Tủ Điện Phân Phối Tổng MSB Đạt Chuẩn IEC 61439-1/2",
    slug: "thiet-ke-tu-dien-phan-phoi-tong-msb-chuan-iec-61439",
    category_name: "Tủ Bảng Điện & Trạm Biến Áp",
    thumbnail: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80",
    summary: "Phân tích chi tiết quy trình tính toán, lựa chọn thiết bị đóng cắt ACB/MCCB và thiết kế thanh cái đồng cho tủ điện phân phối tổng MSB công nghiệp.",
    content: `<p>Tủ điện phân phối tổng (Main Switchboard - MSB) là trái tim của hệ thống phân phối điện hạ thế trong nhà máy, tòa nhà cao tầng và các trung tâm dữ liệu. Một tủ MSB đạt chuẩn phải đảm bảo khả năng cấp nguồn liên tục, an toàn vận hành và dễ dàng bảo trì.</p>

<h2 id="tieu-chuan-iec">Tiêu chuẩn quốc tế IEC 61439-1 và 61439-2</h2>
<p>Bộ tiêu chuẩn IEC 61439 thay thế hoàn toàn tiêu chuẩn cũ IEC 60439, phân định rõ ràng giữa thiết kế tủ điện kiểm tra điển hình (Type-Tested) và trách nhiệm của đơn vị lắp ráp (Assembly Manufacturer). Mọi khía cạnh từ độ tăng nhiệt, khả năng chịu dòng ngắn mạch đến độ cách điện đều được kiểm chứng nghiêm ngặt.</p>

<h2 id="tinh-toan-thanh-cai">1. Tính toán thanh cái đồng và dòng định mức</h2>
<p>Thanh cái đồng (Busbar) cần được tính toán dựa trên dòng điện danh định và dòng chịu ngắn mạch cực đại Icw (thường từ 50kA/1s đến 100kA/1s). Độ dẫn điện của đồng thanh cái phải đạt từ 99.9% Cu-ETP trở lên, các điểm nối được mạ thiếc hoặc mạ bạc để giảm điện trở tiếp xúc.</p>

<h2 id="phan-chia-form-tu">2. Phân chia Form tủ (Form of Separation)</h2>
<p>Tùy theo yêu cầu an toàn, tủ MSB thường được chế tạo từ Form 2b đến Form 4b. Việc ngăn cách khoang thanh cái chính, khoang thiết bị đóng cắt và khoang đấu nối cáp giúp ngăn ngừa hồ quang lan truyền khi xảy ra sự cố.</p>

<h2 id="giai-phap-chong-ho-quang">3. Tích hợp rơ le bảo vệ hồ quang điện nội bộ</h2>
<p>Việc trang bị các cảm biến quang học phát hiện hồ quang (Arc Flash Protection) kết hợp cắt nhanh ACB trong vòng dưới 50ms giúp bảo vệ an toàn tính mạng người vận hành và giảm thiểu hư hỏng thiết bị.</p>`,
    author: "Ban Kỹ Thuật Cơ Điện Nguyên Phát",
    readTime: "4 phút đọc",
    read_time: "4 phút đọc",
    tags: ["Tủ MSB", "Hạ thế", "IEC 61439", "Thanh cái đồng", "ACB"],
    is_featured: true,
    views: 2425,
    created_at: "2026-10-19T01:01:22.973Z",
    updated_at: "2026-11-04T08:42:36.558Z",
    toc: [
      { id: "tieu-chuan-iec", title: "Tiêu chuẩn quốc tế IEC 61439-1 và 61439-2" },
      { id: "tinh-toan-thanh-cai", title: "1. Tính toán thanh cái đồng và dòng định mức" },
      { id: "phan-chia-form-tu", title: "2. Phân chia Form tủ (Form of Separation)" },
      { id: "giai-phap-chong-ho-quang", title: "3. Tích hợp rơ le bảo vệ hồ quang điện nội bộ" }
    ],
    related_posts: []
  },
  {
    id: "a31646e3-cd37-49fd-a114-85625b77d626",
    title: "Kỹ Thuật Thi Công Thang Máng Cáp Điện Chuyên Nghiệp Trong Nhà Máy FDI",
    slug: "ky-thuat-thi-cong-thang-mang-cap-nha-may-fdi",
    category_name: "Thang Máng Cáp",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb1861563?auto=format&fit=crop&w=1200&q=80",
    summary: "Quy chuẩn khoảng cách ty treo, phương pháp xử lý co lơi, ngã 3 tee và tiếp địa liên tục cho hệ thống thang máng cáp công nghiệp nặng.",
    content: `<p>Hệ thống thang cáp (Cable Ladder) và máng cáp (Cable Tray) đóng vai trò nâng đỡ toàn bộ mạng lưới truyền dẫn điện lực và điều khiển trong các tổ hợp nhà máy sản xuất.</p>

<h2 id="quy-chuan-tai-trong">1. Tính toán khoảng cách giá đỡ theo tiêu chuẩn NEMA VE-1</h2>
<p>Khoảng cách giữa hai điểm treo đỡ máng cáp thông thường từ 1.5m đến 2.0m tùy theo tổng tải trọng dây cáp (kg/m) và chiều cao thành máng.</p>

<h2 id="xu-ly-tiep-dia">2. Hệ thống nối đất đẳng thế liên tục</h2>
<p>Mỗi mối nối giữa hai cây máng bắt buộc phải sử dụng dây bện đồng tiếp địa (Earthing Braid) hoặc bát nối có răng khía tiếp xúc kim loại, đảm bảo điện trở nối đất toàn tuyến dưới 0.1 Ohm.</p>`,
    author: "Ks. Lê Anh Tuấn",
    readTime: "3 phút đọc",
    read_time: "3 phút đọc",
    tags: ["Thang máng cáp", "Mạ kẽm nhúng nóng", "Tiếp địa", "Thi công cơ điện"],
    is_featured: false,
    views: 1341,
    created_at: "2026-10-15T23:54:22.973Z",
    updated_at: "2026-10-15T23:54:22.973Z",
    toc: [
      { id: "quy-chuan-tai-trong", title: "1. Tính toán khoảng cách giá đỡ theo tiêu chuẩn NEMA VE-1" },
      { id: "xu-ly-tiep-dia", title: "2. Hệ thống nối đất đẳng thế liên tục" }
    ],
    related_posts: []
  },
  {
    id: "c99d5803-426b-4717-9adc-3ff2e20da065",
    title: "Giải Pháp Bù Công Suất Phản Kháng & Lọc Sóng Hài Tích Cực (AHF)",
    slug: "giai-phap-bu-cong-suat-phan-khang-loc-song-hai-ahf",
    category_name: "Kỹ Thuật Cơ Điện",
    thumbnail: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80",
    summary: "Nâng cao hệ số công suất Cosφ ≥ 0.98, triệt tiêu phạt tiền điện lực và bảo vệ tụ bù khỏi hiện tượng cộng hưởng sóng hài bậc cao.",
    content: `<p>Trong môi trường nhà máy sử dụng nhiều biến tần, lò nung cảm ứng và máy hàn, sóng hài phi tuyến (THD) gây nóng dây dẫn, nổ tụ bù và nhảy CB bất thường. Giải pháp tích hợp cuộn kháng 7% hoặc bộ lọc sóng hài tích cực AHF là bắt buộc.</p>`,
    author: "Ks. Nguyễn Hoàng Nam",
    readTime: "4 phút đọc",
    read_time: "4 phút đọc",
    tags: ["Tụ bù", "Sóng hài AHF", "Cos phi", "Tiết kiệm điện"],
    is_featured: true,
    views: 2100,
    created_at: "2026-10-12T22:47:22.973Z",
    updated_at: "2026-10-12T22:47:22.973Z",
    toc: [],
    related_posts: []
  },
  {
    id: "f2723dde-17fb-49c0-9fda-4045af124c76",
    title: "Hệ Thống SCADA & Giám Sát Năng Lượng Thông Minh Cho Nhà Xưởng Hiện Đại",
    slug: "he-thong-scada-giam-sat-nang-luong-thong-minh",
    category_name: "Năng Lượng & Tự Động Hóa",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    summary: "Ứng dụng nền tảng IoT và chuẩn truyền thông Modbus/TCP, IEC 61850 trong giám sát điện năng tiêu thụ thời gian thực, tự động cảnh báo sự cố.",
    content: `<p>Chuyển đổi số trong quản lý hạ tầng năng lượng (Energy Management System - EMS) đang trở thành tiêu chuẩn cốt lõi giúp các doanh nghiệp sản xuất tối ưu chi phí vận hành và đáp ứng các chứng chỉ phát thải xanh ESG.</p>`,
    author: "Ks. Vũ Đình Trọng",
    readTime: "5 phút đọc",
    read_time: "5 phút đọc",
    tags: ["SCADA", "EMS", "IoT công nghiệp", "Tiết kiệm điện năng"],
    is_featured: false,
    views: 1670,
    created_at: "2026-10-08T21:40:22.973Z",
    updated_at: "2026-10-08T21:40:22.973Z",
    toc: [],
    related_posts: []
  },
  {
    id: "d6842fa2-69d8-4cc9-b772-7fbeed8d8df6",
    title: "Tìm Hiểu Về Trạm Biến Áp Hợp Bộ Kiosk 24kV/35kV Chuẩn Điện Lực",
    slug: "tram-bien-ap-hop-bo-kiosk-24kv-chuan-dien-luc",
    category_name: "Tủ Bảng Điện & Trạm Biến Áp",
    thumbnail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    summary: "Cấu tạo khoang trung thế RMU, khoang máy biến áp và khoang hạ thế tổng tích hợp trong một vỏ trạm kiosk ngoài trời thẩm mỹ cao.",
    content: `<p>Trạm biến áp Kiosk là giải pháp tối ưu cho các khu đô thị và nhà máy có diện tích mặt bằng hạn chế, đáp ứng các tiêu chuẩn nghiêm ngặt của Tập đoàn Điện lực Việt Nam (EVN).</p>`,
    author: "Ban Kỹ Thuật Cơ Điện Nguyên Phát",
    readTime: "4 phút đọc",
    read_time: "4 phút đọc",
    tags: ["Trạm Kiosk", "Trung thế 24kV", "Máy biến áp", "Tủ RMU"],
    is_featured: true,
    views: 2750,
    created_at: "2026-09-28T19:26:22.973Z",
    updated_at: "2026-09-28T19:26:22.973Z",
    toc: [],
    related_posts: []
  },
  {
    id: "1afb47f9-0f72-4673-97c1-32326f080c43",
    title: "Tủ Tự Động Chuyển Nguồn ATS: Giải Pháp Đảm Bảo Cấp Điện 24/7",
    slug: "tu-tu-dong-chuyen-nguon-ats-cap-dien-lien-tuc",
    category_name: "Tủ Bảng Điện & Trạm Biến Áp",
    thumbnail: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80",
    summary: "Nguyên lý hoạt động và cơ chế khóa liên động kép cơ - điện an toàn tuyệt đối khi chuyển đổi giữa nguồn điện lưới và máy phát điện dự phòng.",
    content: `<p>Đối với các cơ sở y tế, trung tâm dữ liệu và dây chuyền sản xuất liên tục, việc mất điện lưới đột ngột gây tổn thất nghiêm trọng. Tủ ATS Nguyên Phát sử dụng bộ chuyển nguồn Socomec/Osung/Schneider chuyển mạch tự động trong vòng 1-3 giây.</p>`,
    author: "Ks. Lê Anh Tuấn",
    readTime: "3 phút đọc",
    read_time: "3 phút đọc",
    tags: ["Tủ ATS", "Nguồn dự phòng", "Khóa liên động", "Máy phát điện"],
    is_featured: true,
    views: 2580,
    created_at: "2026-08-29T12:44:22.973Z",
    updated_at: "2026-08-29T12:44:22.973Z",
    toc: [],
    related_posts: []
  }
];

export const DEFAULT_THUMBNAILS = [
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541888946425-d0fbb1861563?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
];

export function sanitizeThumbnail(thumb, fallbackIndex = 0) {
  if (!thumb || typeof thumb !== 'string' || thumb.includes('domain.com') || thumb.includes('example.com')) {
    return DEFAULT_THUMBNAILS[Math.abs(fallbackIndex) % DEFAULT_THUMBNAILS.length];
  }
  return thumb;
}

import { stripHtml } from '../utils/textUtils';
export { stripHtml };

/**
 * Chuẩn hóa 1 bài viết theo schema PostResponse / PostDetailResponse
 */
export function normalizePost(item, idx = 0) {
  if (!item || typeof item !== 'object') return null;

  const cleanSummary = item.summary 
    ? stripHtml(item.summary) 
    : (item.content ? stripHtml(item.content).slice(0, 160) + '...' : '');

  const readTime = item.read_time || item.readTime || '';

  return {
    id: item.id || '',
    title: item.title || '',
    slug: item.slug || item.id || '',
    category_name: item.category_name || item.category || '',
    thumbnail: sanitizeThumbnail(item.thumbnail, idx),
    content: item.content || item.summary || '',
    summary: cleanSummary,
    author: item.author || '',
    readTime,
    read_time: readTime,
    tags: Array.isArray(item.tags) ? item.tags : [],
    is_featured: Boolean(item.is_featured),
    views: typeof item.views === 'number' ? item.views : 0,
    created_at: item.published_at || item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    toc: Array.isArray(item.toc) ? item.toc : [],
    related_posts: Array.isArray(item.related_posts) ? item.related_posts.map((rp, rIdx) => ({
      ...rp,
      thumbnail: sanitizeThumbnail(rp.thumbnail, rIdx + 1),
      summary: rp.summary ? stripHtml(rp.summary) : ''
    })) : []
  };
}

/**
 * Lấy danh sách bài viết/tin tức
 * @param {string|null} category - Tên danh mục cần lọc (nếu null thì lấy tất cả)
 * @returns {Promise<{posts: Array, isLiveApi: boolean}>}
 */
export async function getPosts(category = null) {
  if (!category && Array.isArray(cachedPostsList) && cachedPostsList.length > 0) {
    return { posts: cachedPostsList, isLiveApi: true };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const url = `${API_BASE_URL}/posts/?skip=0&limit=100`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const formatted = data
          .map((item, idx) => normalizePost(item, idx))
          .filter(Boolean)
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        if (!category || category === 'all') {
          cachedPostsList = formatted;
        }

        const filtered = (category && category !== 'all')
          ? formatted.filter(p => p.category_name === category)
          : formatted;

        return { posts: filtered, isLiveApi: true };
      }
    }
  } catch (error) {
    console.warn('[newsService] Live API không khả dụng:', error.message);
  }

  // Không dùng fallback mock, trả về rỗng nếu backend lỗi hoặc không có dữ liệu
  const cached = Array.isArray(cachedPostsList) ? cachedPostsList : [];
  const filtered = (category && category !== 'all')
    ? cached.filter(p => p.category_name === category)
    : cached;

  return { posts: filtered, isLiveApi: false };
}

/**
 * Lấy chi tiết bài viết theo UUID hoặc Slug (gọi chuẩn endpoint backend)
 * @param {string} idOrSlug - ID hoặc Slug của bài viết
 * @returns {Promise<Object|null>}
 */
export async function getPostById(idOrSlug) {
  if (!idOrSlug) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // 1. Phân định UUID vs Slug để gọi đúng endpoint backend
    const url = UUID_REGEX.test(idOrSlug)
      ? `${API_BASE_URL}/posts/${encodeURIComponent(idOrSlug)}`
      : `${API_BASE_URL}/posts/slug/${encodeURIComponent(idOrSlug)}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && (data.id || data.title)) {
        return normalizePost(data);
      }
    }
  } catch (error) {
    console.warn(`[newsService] Fetch detail failed for id/slug ${idOrSlug}:`, error.message);
  }

  // 2. Tìm kiếm trong Cache nếu đã tải danh sách trước đó
  let list = cachedPostsList;
  if (!Array.isArray(list) || list.length === 0) {
    const res = await getPosts();
    list = res.posts || [];
  }

  const found = list.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  return found || null;
}
