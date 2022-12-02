import { serveRequest } from "@collected/press-server";

export default {
  async fetch(request: Request, env: {}, ctx: ExecutionContext): Promise<Response> {
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

  return serveRequest('RoyalIcing', 'RoyalIcing', pathname);
}