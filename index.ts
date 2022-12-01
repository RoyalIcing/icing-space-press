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

  return serveRequest('RoyalIcing', 'RoyalIcing', pathname, GitHubSiteURLBuilder.proxied('RoyalIcing', 'RoyalIcing'));
}

class GitHubSiteURLBuilder {
  static asRoot = Symbol();
  static asSubpath = Symbol();

  constructor(private _basePath: string) {}

  static direct(ownerName: string, repoName: string) {
    return new GitHubSiteURLBuilder(`/github-site/${ownerName}/${repoName}/`)
  }

  static proxied(ownerName: string, repoName: string) {
    return new GitHubSiteURLBuilder("/")
  }

  buildPath(suffix: string) {
    return new URL(suffix, new URL(this._basePath, "https://example.org")).pathname;
  }

  home() {
    return this.buildPath("");
  }

  article(slug: string) {
    return this.buildPath(`./${slug}`);
  }

  async adjustHTML(html: string) {
    const res = new HTMLRewriter().on('a[href]', {
      element: (element) => {
        const rel = element.getAttribute('rel') || ''
        element.setAttribute('rel', `${rel} noopener`.trim())

        const href = element.getAttribute('href')!

        let url = null;
        try {
          url = new URL(href)
          if (url.protocol) {
            return
          }
        }
        catch { }


        let newHref = this.buildPath(href);
        if (href === '/') {
          newHref = this.home();
        }

        element.setAttribute('href', newHref)

      }
    }).transform(new Response(html, { headers: {'content-type': 'text/html;charset=utf-8'} }));
    return await res.text();
  }
}