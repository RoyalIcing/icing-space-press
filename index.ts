import { serveRequest } from "@collected/press-server";

export default {
  async fetch(request: Request, env: {}, ctx: ExecutionContext): Promise<Response> {
    return await serveRequest('RoyalIcing', 'RoyalIcing', new URL(request.url));
  }
}
