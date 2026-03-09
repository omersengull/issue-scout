declare module "@react-router/adapter-cloudflare" {
  import type { ViteDevServer } from "vite";
  export function cloudflareDevProxy(): any;
}