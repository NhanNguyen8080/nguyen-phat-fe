import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Tắt tự động phục hồi cuộn của trình duyệt khi reload (F5) để trang chủ luôn nhảy về đầu trang
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Dọn sạch hash section nếu có khi mở trang để tránh trình duyệt tự nhảy tới anchor
if (typeof window !== 'undefined') {
  const currentHash = window.location.hash || '';
  const homeSectionHashes = [
    '#product', '#project', '#news', '#about', '#contact', '#home',
    '#services', '#portfolio', '#tin-tuc', '#cong-trinh'
  ];
  if (homeSectionHashes.includes(currentHash)) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  window.addEventListener('beforeunload', () => {
    const hash = window.location.hash || '';
    if (!hash.startsWith('#/')) {
      window.scrollTo(0, 0);
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
