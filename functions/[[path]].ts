import { createPagesFunctionHandler } from "@react-router/cloudflare";

// @ts-ignore - Build klasörü derleme sonrası oluşacağı için uyan uyarısını susturuyoruz
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({ build });