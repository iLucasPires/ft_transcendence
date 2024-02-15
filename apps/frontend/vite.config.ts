import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import RadixVueResolver from "radix-vue/resolver";

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      dts: true,
      imports: [
        "vue",
        "pinia",
        "vue-router",
        { "@/stores/appStore": ["useAppStore"] },
        { "@/stores/meStore": ["useMeStore"] },
        { "@/stores/chatStore": ["useChatStore"] },
      ],
    }),
    Components({
      dts: true,
      resolvers: [RadixVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
