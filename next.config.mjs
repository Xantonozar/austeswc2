/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com", 
      "res.cloudinary.com", 
      "aust.edu" // Added aust.edu for loading images
    ],
  },
};

export default nextConfig;
