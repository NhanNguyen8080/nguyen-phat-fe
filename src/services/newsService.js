/**
 * Service kết nối API Tin tức / Bài viết Nguyên Phát
 * API Base: https://nguyen-phat-admin.onrender.com/api/v1/posts/
 * Schema tương thích 100% với PostResponse trong OpenAPI spec của hệ thống.
 */

const API_BASE_URL = 'https://nguyen-phat-admin.onrender.com/api/v1';

// Dữ liệu mẫu chuẩn cấu trúc PostResponse dùng khi API yêu cầu Bearer token hoặc mạng gián đoạn
export const MOCK_POSTS = [
  {
    id: "n1-7a8c3e21-912b-4f3d-9d41-112345678901",
    title: "Xu Hướng Ứng Dụng Kết Cấu Thép Xanh Trong Nhà Xưởng Công Nghiệp 2026",
    slug: "xu-huong-ung-dung-ket-cau-thep-xanh-2026",
    category_name: "Thị Trường Thép",
    thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    summary: "Việc sử dụng thép tái chế và quy trình chế tạo tiền chế giảm phát thải carbon đang trở thành tiêu chuẩn bắt buộc cho các nhà xưởng FDI đạt chứng chỉ LEED tại Việt Nam.",
    content: `Trong bối cảnh toàn cầu hướng tới mục tiêu Net Zero 2050, ngành xây dựng công nghiệp tại Việt Nam đang chứng kiến sự chuyển mình mạnh mẽ sang các giải pháp 'thép xanh'. 

Kết cấu thép tiền chế tối ưu tải trọng không chỉ giảm 30-40% lượng bê tông móng mà còn cho phép tái chế gần như 100% vòng đời công trình. Tại Nguyên Phát, chúng tôi tiên phong ứng dụng công nghệ cắt phôi CNC Plasma chính xác cao, hạn chế hao hụt thép dưới 1.5% và tối ưu hóa nhịp vượt khẩu độ lớn lên đến 60 mét không cột giữa.

Các nhà đầu tư FDI từ Nhật Bản, Hàn Quốc và Châu Âu hiện nay ưu tiên đặc biệt cho các nhà thầu có khả năng cung ứng giải pháp kết cấu thép đạt chứng nhận xanh, sử dụng sơn gốc nước không VOC và tích hợp sẵn mái tôn chuẩn bị cho điện mặt trời áp mái.`,
    author: "Ban Kỹ Thuật Nguyên Phát",
    readTime: "5 phút đọc",
    created_at: "2026-10-25T08:30:00Z",
    updated_at: "2026-10-28T14:20:00Z"
  },
  {
    id: "n2-8b9d4f32-023c-5e4e-ae52-223456789012",
    title: "Kỹ Thuật Xử Lý Chống Cháy Cho Kết Cấu Thép Theo Tiêu Chuẩn QCVN 06:2022",
    slug: "ky-thuat-xu-ly-chong-chay-ket-cau-thep-qcvn-06",
    category_name: "Kỹ Thuật Xây Dựng",
    thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
    summary: "Tổng hợp các giải pháp bọc bảo vệ chống cháy hiệu quả từ sơn phồng chống cháy, vữa chống cháy vô cơ đến tấm thạch cao chịu lửa cho dầm cột kết cấu thép.",
    content: `Quy chuẩn QCVN 06:2022/BXD đặt ra những yêu cầu khắt khe về giới hạn chịu lửa (R, E, I) đối với các cấu kiện thép chịu lực trong nhà xưởng công nghiệp quy mô lớn.

Thép thông thường bắt đầu mất cường độ chịu lực nghiêm trọng khi nhiệt độ vượt quá 500°C. Do đó, việc ứng dụng các giải pháp bảo vệ thụ động là bắt buộc:
1. **Sơn phồng chống cháy thế hệ mới:** Khi gặp nhiệt độ cao, màng sơn giãn nở gấp 50-80 lần tạo lớp xốp gốm cách nhiệt bảo vệ lõi thép trong 60 đến 120 phút.
2. **Vữa chống cháy khoáng vô cơ:** Giải pháp kinh tế cho các cấu kiện cột chính khu vực kho vận nguy cơ cháy cao.
3. **Giải pháp bao che panel lõi PIR:** Kháng cháy lan tuyệt đối và không sinh khói độc.

Nguyên Phát cam kết 100% hồ sơ nghiệm thu PCCC được hỗ trợ trọn gói, đạt kiểm định của Cục Cảnh sát PCCC & CNCH.`,
    author: "Ks. Trần Đức Minh",
    readTime: "7 phút đọc",
    created_at: "2026-10-22T09:15:00Z",
    updated_at: "2026-10-27T11:00:00Z"
  },
  {
    id: "n3-9c0e5a43-134d-6f5f-bf63-334567890123",
    title: "Nguyên Phát Bàn Giao Tổ Hợp Nhà Xưởng Hansol 35.000m² Vượt Tiến Độ 15 Ngày",
    slug: "nguyen-phat-ban-giao-nha-xuong-hansol-vuot-tien-do",
    category_name: "Tin Công Ty",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    summary: "Dự án nhà máy sản xuất linh kiện điện tử Hansol tại KCN Yên Phong chính thức được bàn giao đưa vào vận hành thử nghiệm, nhận được thư khen ngợi từ tổng thầu.",
    content: `Ngày 20/10/2026, Công ty Cổ phần Kết Cấu Thép & Cơ Khí Xây Dựng Nguyên Phát đã tổ chức lễ bàn giao hoàn thiện gói thầu chế tạo và lắp dựng kết cấu thép dự án Nhà máy Hansol Electronics.

Với khối lượng hơn 1.800 tấn kết cấu thép tổ hợp, đội ngũ kỹ sư và công nhân Nguyên Phát đã thi công liên tục 3 ca, áp dụng mô hình quản lý BIM 4D để kiểm soát xung đột lắp dựng ngay trên bản vẽ 3D. Nhờ đó, dự án đã về đích sớm hơn 15 ngày so với hợp đồng ban đầu, đạt 0 tai nạn lao động và đáp ứng toàn diện tiêu chuẩn kiểm định quốc tế.

Sự kiện một lần nữa khẳng định năng lực thi công vượt trội và chữ Tín hàng đầu của thương hiệu Nguyên Phát trong mắt các chủ đầu tư FDI.`,
    author: "Ban Truyền Thông C&A",
    readTime: "4 phút đọc",
    created_at: "2026-10-20T10:45:00Z",
    updated_at: "2026-10-26T08:10:00Z"
  },
  {
    id: "n4-ad1f6b54-245e-7a6a-cf74-445678901234",
    title: "Ứng Dụng Công Nghệ Mô Hình Hóa BIM 3D/4D Vào Quản Lý Xây Dựng Tiền Chế",
    slug: "ung-dung-mo-hinh-hoa-bim-xay-dung-tien-che",
    category_name: "Công Nghệ & Xu Hướng",
    thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    summary: "Chuyển đổi số trong thi công kết cấu thép giúp giảm thiểu 95% sai sót liên kết tại công trường và tối ưu hóa chuỗi cung ứng vật tư thép tấm.",
    content: `Công nghệ BIM (Building Information Modeling) không còn là lựa chọn mà đã trở thành tiêu chuẩn cốt lõi tại Nguyên Phát.

Từ khâu thiết kế chi tiết trên Tekla Structures, dữ liệu số được truyền thẳng sang hệ thống máy cắt Plasma CNC và máy khoan dầm tự động. Các liên kết bu lông, sườn tăng cứng và bản mã được kiểm tra xung đột không gian tuyệt đối trước khi sản xuất hàng loạt.

Khi bước sang giai đoạn lắp dựng, mô hình 4D liên kết trực tiếp tiến độ thực tế với mô hình 3D, giúp ban chỉ huy công trường điều phối cần cẩu, xe nâng và xe vận chuyển một cách nhịp nhàng, giảm thời gian chờ đợi lãng phí.`,
    author: "Ks. Lê Hoàng Nam",
    readTime: "6 phút đọc",
    created_at: "2026-10-18T11:20:00Z",
    updated_at: "2026-10-25T16:40:00Z"
  },
  {
    id: "n5-be2a7c65-356f-8b7b-d085-556789012345",
    title: "Dự Báo Thị Trường Thép Xây Dựng Quý IV/2026: Nhu Cầu Tăng Trưởng Mạnh",
    slug: "du-bao-thi-truong-thep-xay-dung-quy-iv-2026",
    category_name: "Thị Trường Thép",
    thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    summary: "Làn sóng giải ngân vốn đầu tư công vào hạ tầng giao thông và bất động sản khu công nghiệp thúc đẩy nhu cầu tiêu thụ thép tấm và thép hình cỡ lớn.",
    content: `Thị trường thép Việt Nam trong quý cuối năm 2026 ghi nhận nhiều tín hiệu phục hồi tích cực. Sự mở rộng của các khu công nghiệp vệ tinh tại Bình Dương, Long An, Hải Phòng, Bắc Ninh đang kéo theo nhu cầu khổng lồ về kết cấu thép tiền chế.

Bên cạnh đó, giá phôi thép nhập khẩu và quặng sắt thế giới đang ổn định ở mức hợp lý, tạo điều kiện thuận lợi cho các tổng thầu chốt giá sớm cho các hợp đồng xây dựng năm 2027. Nguyên Phát hiện đã chủ động dự trữ phôi thép đạt chuẩn ASTM A36 / SS400 để đảm bảo bình ổn giá và cam kết tiến độ tối ưu nhất cho quý đối tác.`,
    author: "Phòng Phân Tích Kinh Doanh",
    readTime: "5 phút đọc",
    created_at: "2026-10-15T13:00:00Z",
    updated_at: "2026-10-24T09:30:00Z"
  },
  {
    id: "n6-cf3b8d76-467a-9c8c-e196-667890123456",
    title: "Nguyên Phát Đầu Tư Dây Chuyền Hàn Tự Động Robot Hiện Đại Nhất Khu Vực",
    slug: "nguyen-phat-dau-tu-day-chuyen-han-tu-dong-robot",
    category_name: "Tin Công Ty",
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
    summary: "Nhà máy Nguyên Phát nâng công suất chế tạo lên 2.500 tấn thép/tháng với tổ hợp robot hàn đa trục tự động dưới lớp thuốc hàn đạt chuẩn siêu âm quốc tế.",
    content: `Nhằm đáp ứng yêu cầu ngày càng khắt khe của các dự án công trình nhịp lớn và kho bãi tự động hóa, Nguyên Phát đã hoàn tất lắp đặt và vận hành hệ thống trạm hàn robot tự động hiện đại.

Hệ thống cho phép hàn ngấu sâu liên tục các dầm chữ I, dầm hộp có chiều cao bản bụng đến 2.5m, đường hàn đều đẹp, không rỗ khí và đạt độ đồng nhất 100% khi kiểm định bằng phương pháp siêu âm UT và chụp phim RT. Bước đi này giúp công ty tăng 40% năng suất chế tạo và rút ngắn thời gian chuẩn bị linh kiện cho các dự án trọng điểm.`,
    author: "Ban Giám Đốc Nhà Máy",
    readTime: "4 phút đọc",
    created_at: "2026-10-12T14:10:00Z",
    updated_at: "2026-10-23T10:15:00Z"
  },
  {
    id: "n7-de4c9e87-578b-0d9d-f207-778901234567",
    title: "Tiêu Chí Lựa Chọn Sàn Thép Liên Hợp Deck Cho Tòa Nhà Văn Phòng Hiện Đại",
    slug: "tieu-chi-lua-chon-san-thep-lien-hop-deck",
    category_name: "Kỹ Thuật Xây Dựng",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    summary: "So sánh sàn deck mạ kẽm với sàn bê tông truyền thống về tải trọng, tốc độ đổ bê tông liên tục và khả năng chống rung cho các công trình cao tầng.",
    content: `Sàn deck mạ kẽm sóng cường lực đang là giải pháp thay thế hoàn hảo cho phương pháp cốp pha truyền thống trong các tòa nhà văn phòng và trung tâm thương mại đa tầng.

Ưu điểm nổi bật của hệ sàn deck thi công bởi Nguyên Phát:
- **Tốc độ:** Có thể lắp đặt sàn đồng thời cho 3-4 tầng cùng lúc mà không cần hệ giáo chống tầng dưới.
- **Tiết kiệm:** Giảm tới 30% thể tích bê tông và tải trọng tĩnh tác động lên cột móng.
- **Thẩm mỹ:** Bề mặt mạ kẽm Z275 sáng bóng, có thể để trần theo phong cách kiến trúc Industrial hiện đại mà không cần đóng trần thạch cao.`,
    author: "Ks. Vũ Tuấn Kiệt",
    readTime: "5 phút đọc",
    created_at: "2026-10-08T15:00:00Z",
    updated_at: "2026-10-21T12:00:00Z"
  },
  {
    id: "n8-ef5d0f98-689c-1e0e-0318-889012345678",
    title: "Tối Ưu Hóa Chi Phí Xây Dựng Nhà Xưởng Bằng Giải Pháp Thiết Kế Value Engineering",
    slug: "toi-uu-chi-phi-xay-dung-nha-xuong-value-engineering",
    category_name: "Kỹ Thuật Xây Dựng",
    thumbnail: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop",
    summary: "Phương pháp kỹ thuật giá trị (VE) giúp chủ đầu tư cắt giảm 10-15% tổng chi phí đầu tư ban đầu mà vẫn đảm bảo độ bền kết cấu vượt trội trên 50 năm.",
    content: `Value Engineering (VE) không phải là cắt giảm vật liệu rẻ tiền mà là phương pháp phân tích chức năng thông minh để tìm ra giải pháp tối ưu nhất về chi phí và hiệu năng.

Tại Nguyên Phát, đội ngũ kỹ sư kết cấu thường xuyên thực hiện tính toán tái thiết kế phương án khung thép cho khách hàng:
- Thay đổi sơ đồ nhịp dầm để tận dụng tối đa mô-men uốn và giảm tiết diện thép ở những vị trí nội lực nhỏ.
- Ứng dụng thép cường độ cao Q345B/SM490 cho các cấu kiện cột chính, giảm tự trọng bản thân công trình.
- Sử dụng xà gồ chữ Z mạ kẽm nối chồng liên tục thay vì xà gồ đơn giản để tăng khả năng chịu tải võng của mái tôn.`,
    author: "Giám Đốc Kỹ Thuật George Brian",
    readTime: "6 phút đọc",
    created_at: "2026-10-05T09:00:00Z",
    updated_at: "2026-10-19T11:30:00Z"
  }
];

/**
 * Lấy danh sách bài viết/tin tức
 * @param {string|null} category - Tên danh mục cần lọc (nếu null thì lấy tất cả)
 * @returns {Promise<{posts: Array, isLiveApi: boolean}>}
 */
export async function getPosts(category = null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(`${API_BASE_URL}/posts/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Chuẩn hóa dữ liệu theo PostResponse
        const formatted = data.map(item => ({
          id: item.id || Math.random().toString(),
          title: item.title || 'Tin tức Nguyên Phát',
          slug: item.slug || '',
          category_name: item.category_name || item.category || 'Tin tức chung',
          thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
          content: item.content || item.summary || '',
          summary: item.summary || (item.content ? item.content.slice(0, 160) + '...' : ''),
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
        }));

        const filtered = (category && category !== 'all'
          ? formatted.filter(p => p.category_name === category)
          : formatted
        ).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        return { posts: filtered, isLiveApi: true };
      }
    }
  } catch (error) {
    // API có thể yêu cầu Bearer Auth hoặc mạng chậm -> Fallback về MOCK_POSTS chuẩn schema
    console.warn('[newsService] Live API không khả dụng hoặc yêu cầu Token, sử dụng dữ liệu chuẩn schema:', error.message);
  }

  // Fallback an toàn với MOCK_POSTS (luôn sắp xếp bài tạo mới nhất đứng đầu)
  const filtered = (category && category !== 'all'
    ? MOCK_POSTS.filter(p => p.category_name === category)
    : [...MOCK_POSTS]
  ).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  return { posts: filtered, isLiveApi: false };
}

/**
 * Lấy chi tiết bài viết theo ID hoặc Slug
 * @param {string} idOrSlug - ID hoặc Slug của bài viết
 * @returns {Promise<Object|null>}
 */
export async function getPostById(idOrSlug) {
  if (idOrSlug) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(`${API_BASE_URL}/posts/${idOrSlug}`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && (data.id || data.title)) {
          return enrichPost(data);
        }
      }
    } catch (error) {
      console.warn(`[newsService] Fetch detail failed for id/slug ${idOrSlug}:`, error.message);
    }
  }

  const found = MOCK_POSTS.find(p => p.id === idOrSlug || p.slug === idOrSlug) || MOCK_POSTS[0];
  return enrichPost(found);
}

function enrichPost(post) {
  if (!post) return null;
  return {
    ...post,
    author: post.author || 'Ban Kỹ Thuật Nguyên Phát',
    readTime: post.readTime || '5 phút đọc',
    tags: post.tags || ['Kết cấu thép', 'Nhà xưởng công nghiệp', 'Nguyên Phát Steel', 'Tiêu chuẩn xây dựng']
  };
}
