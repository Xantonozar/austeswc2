/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "aust.edu" },
      { hostname: "www.aibl.com.bd" },
      { hostname: "www.dailymessenger.net" },
      { hostname: "cdn.shortpixel.ai" }
    ],
  },
};

export default nextConfig;
