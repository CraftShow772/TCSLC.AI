import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'strict-dynamic' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.vercel-insights.com https://vitals.vercel-insights.com",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
    ].join(", "),
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "require-corp",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withContentlayer(nextConfig);
