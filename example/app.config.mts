import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    resolve: {
      dedupe: ["solid-js", "lexical-solid"],
    },
  },
});
