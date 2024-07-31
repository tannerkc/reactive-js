import { serve } from "bun";
import { router } from "./src/ReactiveRouter";
import path from "path";
import fs from "fs";

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const INDEX_HTML = path.join(PROJECT_ROOT, "index.html");

function serveStatic(filePath: string) {
  return new Response(Bun.file(filePath));
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  // Serve static files from the public directory
  const publicFilePath = path.join(PUBLIC_DIR, url.pathname);
  if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
    return serveStatic(publicFilePath);
  }

  // Check if the route exists
  const matchedRoute = router.match(url.pathname);
  
  if (matchedRoute) {
    // If it's a route, serve the index.html
    return serveStatic(INDEX_HTML);
  }

  // If no match, return 404
  return new Response("Not Found", { status: 404 });
}

const server = serve({
  port: 3000,
  fetch: handleRequest,
});

console.log(`Server running at http://localhost:${server.port}`);