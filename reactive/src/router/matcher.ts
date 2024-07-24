import { routes } from './fileSystemRouter';

export function matchRoute(url: string) {
//   const path = new URL(url, 'http://dummy.com').pathname;
  const path = new URL(url).pathname;
  
  for (const route of routes) {
    if (route.path === path) {
      return route;
    }
  }

  // Handle dynamic routes
  for (const route of routes) {
    const routeParts = route.path.split('/');
    const urlParts = path.split('/');

    if (routeParts.length === urlParts.length) {
      const params: Record<string, string> = {};
      const match = routeParts.every((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          params[part.slice(1, -1)] = urlParts[i];
          return true;
        }
        return part === urlParts[i];
      });

      if (match) {
        return { ...route, params };
      }
    }
  }

  return null;
}