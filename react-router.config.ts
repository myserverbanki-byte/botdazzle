import type { Config } from "@react-router/dev/config";

export default {
  // SSR mode for Vercel deployment
  ssr: true,
  future: {
    unstable_optimizeDeps: true,
  },
} satisfies Config;
