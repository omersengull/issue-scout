import { createPagesFunctionHandler } from "@react-router/cloudflare";
import * as build from "virtual:react-router/server-build";

const handleRequest = createPagesFunctionHandler({ build });

export const onRequest: PagesFunction = handleRequest;