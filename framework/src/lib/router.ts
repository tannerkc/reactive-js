// import { render, mount } from './renderer';

// interface Route {
//   path: string;
//   component: () => Promise<{ default: () => JSX.Element }>;
// }

// const routes: Route[] = [];

// function normalizePath(path: string): string {
//   return path.endsWith('/') ? path.slice(0, -1) : path;
// }

// export async function initRouter(): Promise<void> {
//   // Dynamically import all route components
//   const routeModules = import.meta.glob('/src/routes/**/index.{tsx,jsx}');

//   for (const [path, importFn] of Object.entries(routeModules)) {
//     const routePath = normalizePath(path
//       .replace('/src/routes', '')
//       .replace(/\/index\.(tsx|jsx)$/, '')
//       || '/');

//     routes.push({
//       path: routePath,
//       component: importFn as () => Promise<{ default: () => JSX.Element }>,
//     });
//   }

//   window.addEventListener('popstate', handleNavigation);
//   document.addEventListener('click', handleClick);

//   await handleNavigation();
// }

// async function handleNavigation(): Promise<void> {
//   const path = normalizePath(window.location.pathname);
//   const route = routes.find(r => r.path === path);

//   if (route) {
//     const { default: Component } = await route.component();
//     const content = <Component />;
//     mount(render(content, {}));
//   } else {
//     console.error(`No route found for path: ${path}`);
//     // You might want to add a 404 page here
//   }
// }

// function handleClick(e: MouseEvent): void {
//   const target = e.target as HTMLElement;
//   if (target.matches('a[href^="/"]')) {
//     e.preventDefault();
//     const href = target.getAttribute('href');
//     if (href) {
//       history.pushState(null, '', href);
//       handleNavigation();
//     }
//   }
// }

// export function navigate(path: string): void {
//   history.pushState(null, '', path);
//   handleNavigation();
// }


/////////

// import { render, mount } from './renderer';

// interface Component {
//   template: string | JSX.Element;
//   data?: Record<string, any>;
// }

// const routes = new Map<string, Component>();

// export function addRoute(path: string, component: Component): void {
//   routes.set(path, component);
// }

// export function navigate(path: string): void {
//   const component = routes.get(path);
//   if (component) {
//     const content = render(component.template, component.data || {});
//     mount(content);
//     history.pushState(null, '', path);
//   } else {
//     console.error(`No route found for path: ${path}`);
//   }
// }

// export function initRouter(): void {
//   window.addEventListener('popstate', () => {
//     navigate(window.location.pathname);
//   });

//   document.addEventListener('click', (e: MouseEvent) => {
//     const target = e.target as HTMLElement;
//     if (target.matches('a[href^="/"]')) {
//       e.preventDefault();
//       navigate(target.getAttribute('href') || '/');
//     }
//   });

//   navigate(window.location.pathname);
// }



/////////////


import { render, mount } from './renderer';

interface RouteModule {
  default: () => JSX.Element;
}

const routeCache = new Map<string, RouteModule>();

async function loadRoute(path: string): Promise<RouteModule | null> {
  const normalizedPath = path.endsWith('/') ? path + 'index' : path;
  const routePath = `/src/routes${normalizedPath}`;

  if (routeCache.has(routePath)) {
    return routeCache.get(routePath)!;
  }

  try {
    const module = await import(`${routePath}.tsx`);
    routeCache.set(routePath, module);
    return module;
  } catch (error) {
    console.error(`Failed to load route for path: ${path}`, error);
    return null;
  }
}

async function renderRoute(path: string): Promise<void> {
  const routeModule = await loadRoute(path);

  if (routeModule && routeModule.default) {
    const content = routeModule.default();
    mount(content);
  } else {
    console.error(`No route found for path: ${path}`);
    // Optionally, render a 404 page here
  }
}

export function navigate(path: string): void {
  renderRoute(path);
  history.pushState(null, '', path);
}

export function initRouter(): void {
  window.addEventListener('popstate', () => {
    renderRoute(window.location.pathname);
  });

  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches('a[href^="/"]')) {
      e.preventDefault();
      navigate(target.getAttribute('href') || '/');
    }
  });

  renderRoute(window.location.pathname);
}

///////////////


// import { render, mount } from './renderer';

// interface RouteModule {
//   default: () => JSX.Element;
//   layout?: () => JSX.Element;
// }

// const routeCache = new Map<string, RouteModule>();

// async function loadRoute(path: string): Promise<RouteModule | null> {
//   const normalizedPath = path.endsWith('/') ? path + 'index' : path;
//   const routePath = `/src/routes${normalizedPath}`;

//   if (routeCache.has(routePath)) {
//     return routeCache.get(routePath)!;
//   }

//   try {
//     const module = await import(`${routePath}.tsx`);
//     routeCache.set(routePath, module);
//     return module;
//   } catch (error) {
//     console.error(`Failed to load route for path: ${path}`, error);
//     return null;
//   }
// }

// async function getNestedRoutes(path: string): Promise<RouteModule[]> {
//   const pathParts = path.split('/').filter(Boolean);
//   const routes: RouteModule[] = [];

//   let currentPath = '';
//   for (const part of pathParts) {
//     currentPath += `/${part}`;
//     const route = await loadRoute(currentPath);
//     if (route) {
//       routes.push(route);
//     }
//   }

//   // Add the index route if it exists
//   if (!path.endsWith('/index')) {
//     const indexRoute = await loadRoute(path.endsWith('/') ? path + 'index' : path + '/index');
//     if (indexRoute) {
//       routes.push(indexRoute);
//     }
//   }

//   return routes;
// }

// function renderNestedRoutes(routes: RouteModule[]): JSX.Element {
//   let content: JSX.Element | null = null;

//   for (let i = routes.length - 1; i >= 0; i--) {
//     const route = routes[i];
//     const PageComponent = route.default;
//     const Layout = route.layout;

//     if (Layout) {
//       content = <Layout>{content ?? <PageComponent />}</Layout>;
//     } else if (!content) {
//       content = <PageComponent />;
//     }
//   }

//   return content!;
// }

// async function renderRoute(path: string): Promise<void> {
//   const routes = await getNestedRoutes(path);

//   if (routes.length > 0) {
//     const content = renderNestedRoutes(routes);
//     mount(content);
//   } else {
//     console.error(`No route found for path: ${path}`);
//     // Optionally, render a 404 page here
//   }
// }

// export function navigate(path: string): void {
//   renderRoute(path);
//   history.pushState(null, '', path);
// }

// export function initRouter(): void {
//   window.addEventListener('popstate', () => {
//     renderRoute(window.location.pathname);
//   });

//   document.addEventListener('click', (e: MouseEvent) => {
//     const target = e.target as HTMLElement;
//     if (target.matches('a[href^="/"]')) {
//       e.preventDefault();
//       navigate(target.getAttribute('href') || '/');
//     }
//   });

//   renderRoute(window.location.pathname);
// }


//////////////


// import { render, mount } from './renderer';

// interface RouteModule {
//   default: () => JSX.Element;
// }

// interface RouterConfig {
//   showLoadingIndicator?: boolean;
//   developmentMode?: boolean;
// }

// const routeCache = new Map<string, RouteModule>();
// let config: RouterConfig = {};

// function createLoadingIndicator(): HTMLElement {
//   const indicator = document.createElement('div');
//   indicator.id = 'route-loading-indicator';
//   indicator.style.cssText = `
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 3px;
//     background-color: #007bff;
//     transition: width 0.3s ease-out;
//   `;
//   return indicator;
// }

// function showLoadingIndicator(): void {
//   if (config.showLoadingIndicator) {
//     const existingIndicator = document.getElementById('route-loading-indicator');
//     if (!existingIndicator) {
//       document.body.appendChild(createLoadingIndicator());
//     }
//     setTimeout(() => {
//       const indicator = document.getElementById('route-loading-indicator');
//       if (indicator) indicator.style.width = '70%';
//     }, 50);
//   }
// }

// function hideLoadingIndicator(): void {
//   if (config.showLoadingIndicator) {
//     const indicator = document.getElementById('route-loading-indicator');
//     if (indicator) {
//       indicator.style.width = '100%';
//       setTimeout(() => {
//         indicator.style.opacity = '0';
//         setTimeout(() => indicator.remove(), 300);
//       }, 150);
//     }
//   }
// }

// async function loadRoute(path: string): Promise<RouteModule | null> {
//   const normalizedPath = path.endsWith('/') ? path + 'index' : path;
//   const routePath = `/src/routes${normalizedPath}`;

//   if (routeCache.has(routePath)) {
//     return routeCache.get(routePath)!;
//   }

//   try {
//     const module = await import(`${routePath}.tsx`);
//     routeCache.set(routePath, module);
//     return module;
//   } catch (error) {
//     console.error(`Failed to load route for path: ${path}`, error);
//     return null;
//   }
// }

// async function renderRoute(path: string): Promise<void> {
//   showLoadingIndicator();

//   try {
//     const routeParts = path.split('/').filter(Boolean);
//     let currentPath = '';
//     let content: JSX.Element | null = null;

//     for (const part of routeParts) {
//       currentPath += `/${part}`;
//       const routeModule = await loadRoute(currentPath);

//       if (routeModule && routeModule.default) {
//         const Component = routeModule.default;
//         content = content ? <Component>{content}</Component> : <Component />;
//       }
//     }

//     if (!content) {
//       const indexModule = await loadRoute(path);
//       if (indexModule && indexModule.default) {
//         content = indexModule.default();
//       }
//     }

//     if (content) {
//       mount(content);
//     } else {
//       throw new Error(`No route found for path: ${path}`);
//     }
//   } catch (error) {
//     console.error(`Error rendering route: ${path}`, error);
//     if (config.developmentMode) {
//       const errorContent = (
//         <div style="color: red; padding: 20px;">
//           <h1>Error</h1>
//           <p>{error instanceof Error ? error.message : String(error)}</p>
//         </div>
//       );
//       mount(errorContent);
//     }
//   } finally {
//     hideLoadingIndicator();
//   }
// }

// export function navigate(path: string): void {
//   renderRoute(path);
//   history.pushState(null, '', path);
// }

// export function initRouter(routerConfig: RouterConfig = {}): void {
//   config = routerConfig;

//   window.addEventListener('popstate', () => {
//     renderRoute(window.location.pathname);
//   });

//   document.addEventListener('click', (e: MouseEvent) => {
//     const target = e.target as HTMLElement;
//     if (target.matches('a[href^="/"]')) {
//       e.preventDefault();
//       navigate(target.getAttribute('href') || '/');
//     }
//   });

//   renderRoute(window.location.pathname);
// }