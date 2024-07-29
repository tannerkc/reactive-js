import { file, serve } from "bun";
import { renderToString } from '../../renderer';

const ROOT_FOLDER = './src/routes/';
// Utility function to clean up file paths
const cleanPath = (path: string): string => path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';

// Function to check if a path is dynamic
const isDynamicPath = (path: string): boolean => path.startsWith('[') && path.endsWith(']');

// Function to get all possible paths for a given URL
async function getPossiblePaths(url: string): Promise<Array<{ path: string, params: Record<string, string> }>> {
  const pathParts = url.split('/').filter(Boolean);
  let currentPath = ROOT_FOLDER;
  const possiblePaths: Array<{ path: string, params: Record<string, string> }> = [];

  for (let i = 0; i <= pathParts.length; i++) {
    const checkPath = cleanPath(`${currentPath}/index.tsx`);
    if (await file(checkPath).exists()) {
      possiblePaths.push({ path: checkPath, params: {} });
    }

    if (i < pathParts.length) {
      const dirContent = import.meta.dir.split('/');
      const matchingDir = dirContent.find(dir => 
        dir === pathParts[i] || isDynamicPath(dir)
      );

      if (matchingDir) {
        if (isDynamicPath(matchingDir)) {
          const paramName = matchingDir.slice(1, -1);
          possiblePaths[possiblePaths.length - 1].params[paramName] = pathParts[i];
        }
        currentPath = cleanPath(`${currentPath}/${matchingDir}`);
      } else {
        break;
      }
    }
  }

  return possiblePaths;
}

// Function to execute a route
async function executeRoute(routeInfo: { path: string, params: Record<string, string> }, req: Request): Promise<string | null> {
  const { path, params } = routeInfo;

  try {
    const module = await import(path);
    const Component = module.default;

    if (typeof Component === 'function') {
      const props = { params, req };
      const jsx = Component(props);
      return await renderToString(jsx);
    }

    throw new Error(`No valid component found in ${path}`);
  } catch (e) {
    console.error(`Error executing route ${path}:`, e);
    return null;
  }
}

// Main router function
async function router(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = cleanPath(url.pathname);
  
  const possiblePaths = await getPossiblePaths(path);
  
  for (const routeInfo of possiblePaths.reverse()) {
    const result = await executeRoute(routeInfo, req);
    if (result !== null) {
      return new Response(result, {
        headers: { "Content-Type": "text/html" }
      });
    }
  }

  return new Response("Not found", { status: 404 });
}

// Middleware support
type Middleware = (context: { req: Request, res?: Response }) => Promise<void>;
const middlewares: Middleware[] = [];

export function use(middleware: Middleware): void {
  middlewares.push(middleware);
}

// Enhanced serve function with middleware support
function enhancedServe(options: { port: number }): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: async (req: Request) => {
      let context:any = { req };
      for (const middleware of middlewares) {
        await middleware(context);
        if (context.res) return context.res;
      }
      return router(context.req);
    }
  });
}

// For SSR
if (import.meta.main) {
  enhancedServe({ port: 3000 });
}

// For CSR and SSR
export { router, enhancedServe };