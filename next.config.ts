import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    // @ts-expect-error - Thuộc tính này bị thiếu trong type của Next.js 15 nhưng vẫn có thể hoạt động
    buildActivity: false,
  },
  images: {
    remotePatterns: [
      { hostname: "streetviewpixels-pa.googleapis.com" },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        // Backend API images (covers both local dev and deployed environments)
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        // Backend API images (covers deployed environment)
        protocol: "https",
        hostname: "api.zsocial.id.vn",
        port: "",
        pathname: "/**",
      },
      { hostname: "maps.googleapis.com" },
      { hostname: "maps.gstatic.com" },
      { hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
