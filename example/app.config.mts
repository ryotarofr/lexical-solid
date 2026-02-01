import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    // Use vercel preset only in production (Vercel sets VERCEL env var)
    preset: process.env.VERCEL ? "vercel" : "node-server",
  },
  vite: {
    resolve: {
      dedupe: ["solid-js", "lexical-solid"],
    },
  },
});
