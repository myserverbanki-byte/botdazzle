import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // SPA mode for Vercel static deployment
  ssr: false,
  future: {
    unstable_optimizeDeps: true,
  },
} satisfies Config;
