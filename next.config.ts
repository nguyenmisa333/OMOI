import type { NextConfig } from "next";

// Origin của service "Thẻ Tích điểm" (loyalty) trên Render, vd https://omoi-web.onrender.com
const LOYALTY_ORIGIN = process.env.LOYALTY_ORIGIN;

const nextConfig: NextConfig = {
  async redirects() {
    // /bestellen → trang đặt Take Away trên Lightspeed.
    // permanent:false (307) → không cache, dễ đổi link sau này.
    return [
      {
        source: "/bestellen",
        destination: "https://mylightspeed.app/SXTFYWPE/C-ordering",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    if (!LOYALTY_ORIGIN) return [];
    // Proxy /Stempel/* sang app loyalty (Next 14, basePath=/Stempel) trên Render.
    // Cùng origin omoi.help với người dùng → không dính CORS.
    return [
      { source: "/Stempel", destination: `${LOYALTY_ORIGIN}/Stempel` },
      { source: "/Stempel/:path*", destination: `${LOYALTY_ORIGIN}/Stempel/:path*` },
    ];
  },
  async headers() {
    // Không cache trang /Stempel ở Vercel/CDN: nội dung do app loyalty (Render)
    // quản lý. Nếu cache, mỗi lần loyalty đổi build sẽ phục vụ HTML cũ (logo vỡ...).
    return [
      {
        source: "/Stempel/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
      {
        source: "/Stempel",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
