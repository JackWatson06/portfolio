/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/assets/images/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/api/media/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "*.backblazeb2.com",
        port: "",
        pathname: "/file/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
