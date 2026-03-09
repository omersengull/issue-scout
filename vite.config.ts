import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  // cloudflareDevProxy() kısmını sildik, çünkü derleme anında sorun çıkarıyor
  plugins: [reactRouter(),tailwindcss(), tsconfigPaths()],
});