import { serveRequest } from "@collected/press-server";

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return await handleRequest(request).catch(
      (err) => {
        if (err instanceof Response) {
          return err;
        }
        console.error(err);
        return new Response(err.stack, { status: 500 });
      }
    );
  }
}

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/assets/")) {
    // TODO: handle these inside serveRequest()
    return fetch(new URL(pathname, "https://collected.press/").href);
  }

  return serveRequest('RoyalIcing', 'RoyalIcing', pathname);
}