import type { Metadata } from 'next'
import AdminShell from './AdminShell'

// Manifest admin phải có SẴN trong HTML lúc server render.
// Trước đây AdminShell đổi link[rel=manifest] bằng useEffect — không dùng được:
// iOS Safari fetch + parse manifest ngay lúc load trang, nên bảng "Zum Home-Bildschirm"
// vẫn đọc manifest gốc (start_url: /) → cài admin lại ra trang chủ.
// Metadata ở segment con ghi đè segment cha, nên chỉ cần khai lại `manifest` ở đây.
export const metadata: Metadata = {
  title: 'O·MO·I Reservierung Admin',
  manifest: '/manifest-admin.json',
  // Icon riêng cho admin — iOS lấy apple-touch-icon (không đọc icons trong manifest).
  icons: { icon: '/images/icon-admin-192.png', apple: '/images/icon-admin-180.png' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Reservierung admin' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
