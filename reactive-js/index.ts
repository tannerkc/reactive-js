export { createComponent } from './packages/renderer/lib/component'
export { createContext, useContext, createMemo, effect, state } from './packages/reactivity'

import { effect, state } from './packages/reactivity';
import { createElement, Fragment } from './packages/renderer/lib/jsx-runtime';
import { router } from './packages/core/src/reactiveRouter';

const Reactive = {
    state,
    effect,
    createElement,
    Fragment,
    router
};

async function renderRoute(route: any) {
    const module = await import(route.filePath);
    const component = module.default;
    if (!component) {
      throw new Error(`No default export found in ${route.filePath}`);
    }
    return component(route.params);
}
  
export async function initiateApp() {
    const appElement = document.querySelector('div[app]');
    if (!appElement) {
        throw new Error('No <div app> element found in the document');
    }

    async function updateRoute() {
        const url = new URL(window.location.href);
        const matchedRoute = router.match(url.pathname);
        if (matchedRoute) {
        const content = await renderRoute(matchedRoute);
        appElement!.innerHTML = '';
        appElement!.appendChild(content);
        } else {
        appElement!.innerHTML = '<h1>404 - Not Found</h1>';
        }
    }

    window.addEventListener('popstate', updateRoute);
    await updateRoute();
}

export default Reactive
export const jsx = Reactive.createElement;
export const jsxs = Reactive.createElement;