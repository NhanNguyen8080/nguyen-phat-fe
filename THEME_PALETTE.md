# Hệ Thống Bảng Màu & Quy Chuẩn Thiết Kế (Theme & Color Tokens)
### Dự án: Cơ Điện Nguyên Phát — Giao diện Đỏ Nâu Trầm & Vàng Ánh Kim

Tài liệu này lưu trữ quy chuẩn toàn bộ bảng màu (Color Palette), biến CSS (`:root`), cấu hình Tailwind CSS và hướng dẫn triển khai giao diện đồng bộ cho **Website Client** và **Trang Quản Trị (Admin Dashboard)**.

---

## 1. Triết Lý Thiết Kế & Phối Màu
- **Tông màu chủ đạo:** Đỏ nâu trầm / Mahogany Wine (`#341111`) kết hợp Vàng ánh kim hoàng gia (`#ffb800`).
- **Phong cách:** Sang trọng, trầm ấm, kỹ thuật chuẩn xác, uy tín và vững chãi.
- **Công thái học (Ergonomics):** 
  - Chữ chính dùng màu **trắng kem ngà** (`#fcf6f3`) thay vì trắng tinh `#ffffff` để loại bỏ hiện tượng mỏi mắt khi đọc lâu trên nền tối.
  - Chữ phụ dùng màu **hồng tro ấm** (`#d4bcb8`) thay thế hoàn toàn cho xám xanh lạnh (`#9ca3af`) để tạo sự hài hòa với undertone đỏ nâu.
  - Điểm nhấn dùng **vàng kim ấm** (`#ffb800`) với độ tương phản đạt chuẩn WCAG AAA (> 13:1).

---

## 2. Bảng Mã Màu Chi Tiết (Color Tokens)

### 2.1. Hệ màu nền (Background Colors)

| Tên biến CSS | Mã HEX | RGBA / Giá trị | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| `--primary-bg` | `#341111` | `rgb(52, 17, 17)` | **Nền chính:** Toàn bộ trang web, vùng nội dung làm việc chính Admin |
| `--secondary-bg` | `#421616` | `rgb(66, 22, 22)` | **Khối phụ:** Sidebar menu, Header navbar, tiêu đề bảng `<th>` |
| `--card-bg` | `#4c1a1a` | `rgb(76, 26, 26)` | **Thẻ dữ liệu:** Khối thống kê (Stats Card), Panel, Modal popup |
| `--card-hover-bg`| `#551e1e` | `rgb(85, 30, 30)` | **Hover:** Hiệu ứng khi rê chuột vào hàng bảng `<tr>`, thẻ card |
| `--dark-bg` | `#220808` | `rgb(34, 8, 8)` | **Nền thẫm sâu:** Vùng code, dropdown menu, thanh đáy |
| `--deep-dark-bg` | `#1a0606` | `rgb(26, 6, 6)` | **Nền cực sâu:** Chân trang cuối (footer), backdrop overlay modal |

### 2.2. Hệ màu điểm nhấn & Nhận diện (Accent & Brand Colors)

| Tên biến CSS | Mã HEX | RGBA / Giá trị | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| `--accent-yellow` | `#ffb800` | `rgb(255, 184, 0)` | **Điểm nhấn chính:** Nút bấm Primary, Icon nổi bật, Tab active |
| `--accent-shimmer` | `#ffe066` | `rgb(255, 224, 102)` | Dải ánh sáng lấp lánh (shimmer) của nút chính |
| `--accent-bg` | — | `rgba(255, 184, 0, 0.14)` | Nền badge/tag danh mục, nền menu item đang active |
| `--border-gold` | — | `rgba(255, 184, 0, 0.35)` | Viền khi `focus` ô nhập liệu, viền badge vàng kim |

### 2.3. Hệ màu chữ & Nội dung (Typography Colors)

| Tên biến CSS | Mã HEX | RGBA / Giá trị | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| `--text-dark` | `#fcf6f3` | `rgb(252, 246, 243)` | **Chữ chính:** Tiêu đề H1-H6, nhãn quan trọng, dữ liệu bảng |
| `--text-gray` | `#d4bcb8` | `rgb(212, 188, 184)` | **Chữ phụ:** Mô tả phụ, ngày tháng, breadcrumb, nhãn input |
| `--text-muted` | — | `rgba(212, 188, 184, 0.65)` | Placeholder ô tìm kiếm, ghi chú mờ |
| `--text-btn-dark`| `#1a0808` | `rgb(26, 8, 8)` | Màu chữ đậm tương phản cực cao trên nền nút vàng kim |
| `--text-light` | `#ffffff` | `rgb(255, 255, 255)` | Trắng sáng tinh khiết khi cần độ tương phản tuyệt đối |

### 2.4. Hệ màu trạng thái quản trị (Admin Status Badges)

| Trạng thái | Mã Chữ / Icon | Nền Badge (RGBA) | Viền Badge (Border) | Ứng dụng thực tế |
| :--- | :--- | :--- | :--- | :--- |
| **Thành công (Success)** | `#81c784` | `rgba(76, 175, 80, 0.15)` | `1px solid rgba(76, 175, 80, 0.35)` | Đã hoàn thành, Còn hàng, Đã kích hoạt, Đã thanh toán |
| **Cảnh báo / Chờ (Warning)** | `#ffb800` | `rgba(255, 184, 0, 0.15)` | `1px solid rgba(255, 184, 0, 0.35)` | Chờ duyệt, Tạm hoãn, Đang xử lý, Bản nháp |
| **Lỗi / Hủy (Danger)** | `#ff6b6b` | `rgba(239, 68, 68, 0.15)` | `1px solid rgba(239, 68, 68, 0.35)` | Hết hàng, Đã hủy, Bị khóa, Đã xóa |
| **Thông tin (Info)** | `#60a5fa` | `rgba(59, 130, 246, 0.15)` | `1px solid rgba(59, 130, 246, 0.35)` | Tin tức mới, Thông báo hệ thống, Cập nhật |

---

## 3. Khối Mã CSS Sẵn Sàng Triển Khai (`admin.css`)

```css
/* ==========================================================
   CƠ ĐIỆN NGUYÊN PHÁT — ADMIN THEME SYSTEM
   ========================================================== */

:root {
  /* Nền giao diện đỏ nâu */
  --primary-bg: #341111;
  --secondary-bg: #421616;
  --card-bg: #4c1a1a;
  --card-hover-bg: #551e1e;
  --dark-bg: #220808;

  /* Điểm nhấn vàng kim */
  --accent-yellow: #ffb800;
  --accent-yellow-light: #ffe066;

  /* Hệ màu chữ */
  --text-dark: #fcf6f3;
  --text-gray: #d4bcb8;
  --text-light: #ffffff;

  /* Đường viền */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.15);
  --border-gold: rgba(255, 184, 0, 0.35);

  /* Bán kính bo góc */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}

/* Áp dụng dark mode hệ thống */
html {
  color-scheme: dark;
  background-color: var(--primary-bg);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--primary-bg);
  color: var(--text-dark);
  line-height: 1.6;
}

/* Thanh cuộn (Scrollbar) chuẩn sang trọng */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--dark-bg);
}
::-webkit-scrollbar-thumb {
  background: #551e1e;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-yellow);
}

/* Bôi đen văn bản */
::selection {
  background-color: var(--accent-yellow);
  color: #1a0808;
}

/* ==========================================================
   BUTTONS (NÚT BẤM ADMIN)
   ========================================================== */

/* Nút chính: Thêm mới, Lưu dữ liệu, Cập nhật */
.btn-primary {
  background-color: var(--accent-yellow);
  background-image: linear-gradient(
    105deg,
    var(--accent-yellow) 40%,
    var(--accent-yellow-light) 50%,
    var(--accent-yellow) 60%
  );
  background-size: 200% auto;
  color: #1a0808;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 184, 0, 0.4);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 184, 0, 0.38);
  filter: brightness(1.05);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Nút phụ: Hủy, Quay lại, Xuất báo cáo, Làm mới */
.btn-secondary {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--text-dark);
  font-weight: 600;
  font-size: 0.92rem;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-medium);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(6px);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-secondary:hover {
  background-color: rgba(255, 184, 0, 0.12);
  border-color: rgba(255, 184, 0, 0.45);
  color: var(--accent-yellow);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

/* Nút xóa / Cảnh báo nguy hiểm */
.btn-danger {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background-color: #ef4444;
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.35);
  transform: translateY(-1px);
}

/* ==========================================================
   INPUTS & FORM CONTROLS (Ô NHẬP LIỆU)
   ========================================================== */

.admin-input,
.admin-select,
.admin-textarea {
  width: 100%;
  padding: 10px 14px;
  background-color: var(--secondary-bg);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  color: var(--text-dark);
  font-size: 0.92rem;
  outline: none;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
}

.admin-input::placeholder,
.admin-textarea::placeholder {
  color: rgba(212, 188, 184, 0.65);
}

.admin-input:focus,
.admin-select:focus,
.admin-textarea:focus {
  background-color: var(--card-bg);
  border-color: var(--accent-yellow);
  box-shadow: 0 0 0 3px rgba(255, 184, 0, 0.2);
}

.admin-select option {
  background-color: #3b1414;
  color: #fcf6f3;
}

/* ==========================================================
   TABLES (BẢNG DỮ LIỆU QUẢN TRỊ)
   ========================================================== */

.admin-table-wrapper {
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background-color: var(--secondary-bg);
  color: var(--text-gray);
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-medium);
}

.admin-table td {
  padding: 14px 18px;
  font-size: 0.92rem;
  color: var(--text-dark);
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color 0.15s ease;
}

.admin-table tbody tr:hover td {
  background-color: var(--card-hover-bg);
}

/* ==========================================================
   CARDS & PANELS (THẺ THỐNG KÊ & KHỐI NỘI DUNG)
   ========================================================== */

.admin-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.25s ease;
}

.admin-card:hover {
  border-color: var(--border-gold);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  transform: translateY(-2px);
}

.admin-card-title {
  color: var(--text-gray);
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.admin-card-value {
  color: var(--text-dark);
  font-size: 1.85rem;
  font-weight: 800;
}
```

---

## 4. Cấu Hình Nhanh Cho Tailwind CSS (`tailwind.config.js`)

Nếu dự án Admin của bạn xây dựng bằng React / Next.js / Vue với Tailwind CSS, bạn chỉ cần bổ sung cấu hình màu sau:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        np: {
          // Backgrounds
          bg: '#341111',
          secondary: '#421616',
          card: '#4c1a1a',
          'card-hover': '#551e1e',
          dark: '#220808',
          'ultra-dark': '#1a0606',
          
          // Brand Accent
          gold: '#ffb800',
          'gold-light': '#ffe066',
          
          // Typography
          text: '#fcf6f3',
          muted: '#d4bcb8',
          
          // Borders
          border: 'rgba(255, 255, 255, 0.12)',
          'border-gold': 'rgba(255, 184, 0, 0.35)',
        }
      }
    }
  }
}
```

Cách dùng trong class Tailwind:
```html
<!-- Ví dụ thẻ card thống kê -->
<div class="bg-np-card border border-np-border hover:border-np-border-gold rounded-xl p-6 transition">
  <p class="text-np-muted text-sm font-medium">Tổng Sản Phẩm</p>
  <h3 class="text-np-text text-2xl font-bold mt-1">128</h3>
</div>

<!-- Ví dụ nút chính -->
<button class="bg-np-gold text-[#1a0808] font-bold px-5 py-2.5 rounded-lg shadow-lg hover:brightness-105 transition">
  Thêm sản phẩm
</button>
```

---

## 5. Quy Chuẩn Đóng Gói
- File này được lưu trực tiếp tại thư mục gốc của repository: [`THEME_PALETTE.md`](./THEME_PALETTE.md).
- Có thể copy file này sang kho mã nguồn dự án Admin để lập trình viên giao diện áp dụng tức thì mà không cần đo đạc lại màu sắc.
