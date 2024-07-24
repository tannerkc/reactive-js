import { readdirSync, statSync } from 'fs';
import { join, parse } from 'path';

interface Route {
  path: string;
  component: string;
}

function generateRoutes(dir: string, basePath: string = ''): Route[] {
  const entries = readdirSync(dir);
  const routes: Route[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    const parsedPath = parse(fullPath);

    if (stat.isDirectory()) {
      routes.push(...generateRoutes(fullPath, `${basePath}/${entry}`));
    } else if (stat.isFile() && (parsedPath.ext === '.tsx' || parsedPath.ext === '.jsx')) {
      let path = `${basePath}/${parsedPath.name}`.replace(/\/index$/, '');
      path = path === '' ? '/' : path;
      routes.push({
        path,
        component: fullPath,
      });
    }
  }

  return routes;
}

export const routes = generateRoutes('./src/routes');