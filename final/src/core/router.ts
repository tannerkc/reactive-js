import { FileSystemRouter } from "bun";
import { Elysia } from "elysia";

export class Router {
  private fsRouter: FileSystemRouter;
  private apiHandler: Elysia;

  constructor() {
    this.fsRouter = new FileSystemRouter({
      dir: "./src/routes",
      style: "nextjs",
    });
    this.apiHandler = new Elysia().get("/api", () => "API Route");
  }

  async handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    
    if (url.pathname.startsWith("/api")) {
      return this.apiHandler.handle(req);
    }

    const match = this.fsRouter.match(url.pathname);
    if (match) {
      const { default: Component } = await import(match.filePath);
      const content = renderToString(<Component />);
      return new Response(content, { headers: { "Content-Type": "text/html" } });
    }

    return new Response("Not Found", { status: 404 });
  }
}