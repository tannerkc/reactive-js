import { createElement, createTextNode, Fragment } from './dom-utils';

export function jsx(type: string | Function, props: any, ...children: any[]) {
  if (typeof type === 'function') {
    return type({ ...props, children });
  }
  return createElement(type, props, ...children);
}

export function jsxs(type: string | Function, props: any) {
  return jsx(type, props);
}

export { Fragment };

// This will be used by Babel to transform JSX
export const jsxDEV = jsx;