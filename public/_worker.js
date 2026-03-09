import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore
import * as build from "../build/server/index.js";

export default {
  async fetch(request, env, ctx) {
    const handler = createPagesFunctionHandler({ build });
    return handler(request, env, ctx);
  },
};