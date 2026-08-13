import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Os arquivos já chegam otimizados como WebP pelo Supabase. Evita o
    // endpoint pago `/_next/image` da Vercel, que estava retornando 402.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
