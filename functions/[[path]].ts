import { createPagesFunctionHandler } from "@react-router/cloudflare";
import * as build from "virtual:react-router/server-build";

export const onRequest = createPagesFunctionHandler({ build });