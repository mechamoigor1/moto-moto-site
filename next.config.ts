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
    // Fotos de motos e artes de marca raramente mudam depois de publicadas;
    // um TTL longo evita reprocessar/rebaixar o cache do otimizador de imagens.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        // SVGs e ícones estáticos em /public não mudam de nome quando trocados,
        // então usamos um cache mais curto (1 dia) em vez de "immutable".
        source: "/:path*.(svg|ico|webp|png)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
