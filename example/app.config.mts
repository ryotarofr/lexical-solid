import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "vercel",
  },
  vite: {
    resolve: {
      dedupe: ["solid-js", "lexical-solid"],
    },
  },
});
