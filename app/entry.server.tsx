import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { ServerRouter, type EntryContext } from "react-router";

export const streamTimeout = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext
) {
  let shellRendered = false;

  const stream = await renderToReadableStream(
    <ServerRouter context={entryContext} url={request.url} />,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      },
    }
  );

  shellRendered = true;

  if (isbot(request.headers.get("user-agent") || "")) {
    await stream.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(stream, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}