import { file, serve } from "bun";
import { render, Component } from '../../renderer';
import { createComponent } from "../../renderer/lib/component";

const ROOT_FOLDER = './src/routes/';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for route handlers
const routeCache = new Map<string, { handler: Function, timestamp: number }>();

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
    const checkPath = cleanPath(`${currentPath}/index.ts`);
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

// Enhanced route execution with caching
async function executeRoute(routeInfo: { path: string, params: Record<string, string> }, req: Request): Promise<Response | Component | null> {
  const { path, params } = routeInfo;
  const cacheKey = `${path}:${req.method}`;
  const cachedRoute = routeCache.get(cacheKey);
  
  if (cachedRoute && Date.now() - cachedRoute.timestamp < CACHE_DURATION) {
    return cachedRoute.handler(req, params);
  }

  try {
    const module = await import(path);
    const httpVerb = req.method.toLowerCase();
    const handler = module[httpVerb as keyof typeof module] || module.handler || module.default;

    if (handler) {
      routeCache.set(cacheKey, { handler, timestamp: Date.now() });
      return handler(req, params);
    }
    throw new Error(`No handler found for ${httpVerb} ${path}`);
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
      if (typeof result === 'function') {
        // It's a JSX component
        return new Response(renderToString(result as Component, routeInfo.params), {
          headers: { "Content-Type": "text/html" }
        });
      } else if (result instanceof Response) {
        return result;
      } else if (typeof result === 'string') {
        return new Response(result);
      } else {
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  }

  return new Response("Not found", { status: 404 });
}

// Simple JSX to string renderer for SSR
function renderToString(precomponent: Component, props: Record<string, any>): string {
  const tempDiv = document.createElement('div');
  let component = createComponent(precomponent)
  render(() => component(props), tempDiv);
  return tempDiv.innerHTML;
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