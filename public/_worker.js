import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - build klasörü derleme sonrası oluşacağı için hata verebilir, görmezden gel
import * as build from "../build/server/index.js";

export default {
  async fetch(request, env, ctx) {
    const handler = createPagesFunctionHandler({ build });
    return handler(request, env, ctx);
  },
};