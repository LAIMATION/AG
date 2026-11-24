/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* nie zdradzaj technologii w nagłówku odpowiedzi */
  poweredByHeader: false,
  /* Podstawowe nagłówki bezpieczeństwa. HSTS dokłada Vercel.
     ponytail: bez Content-Security-Policy — strona ma skrypty inline (motyw przed
     malowaniem, JSON-LD), więc CSP wymaga nonce'ów z middleware; dodać, gdy pojawi
     się treść od użytkowników albo zewnętrzne skrypty. */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
