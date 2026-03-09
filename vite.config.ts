
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/config/cloudflare";
export default defineConfig({
  plugins: [cloudflareDevProxy(),tailwindcss(), reactRouter(), tsconfigPaths()],
});
