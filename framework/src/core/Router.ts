import type { Component } from './Component';

const routes: Record<string, () => Promise<Component>> = {};

export function registerRoute(path: string, component: () => Promise<Component>) {
  routes[path] = component;
}

export async function navigateTo(path: string) {
  const component = await routes[path]();
  const appElement = document.querySelector('[app]');
  if (appElement) {
    appElement.innerHTML = component.render();
    if (component.mount) {
      component.mount(appElement as HTMLElement);
    }
  }
}

export function initRouter() {
  window.addEventListener('popstate', () => {
    navigateTo(window.location.pathname);
  });
}