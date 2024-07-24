import type { Component } from './Component';

export function render(component: Component, container: HTMLElement) {
  const html = component.render();
  container.innerHTML = html;
  if (component.mount) {
    component.mount(container);
  }
}

// export function renderToString(component) {
//     if (typeof component === 'string') {
//       return component;
//     }
  
//     if (typeof component === 'function') {
//       return renderToString(component());
//     }
  
//     if (Array.isArray(component)) {
//       return component.map(renderToString).join('');
//     }
  
//     if (typeof component === 'object') {
//       const { tag, props, children } = component;
//       const attributes = Object.entries(props || {})
//         .map(([key, value]) => `${key}="${value}"`)
//         .join(' ');
  
//       const renderedChildren = Array.isArray(children)
//         ? children.map(renderToString).join('')
//         : renderToString(children);
  
//       return `<${tag} ${attributes}>${renderedChildren}</${tag}>`;
//     }
  
//     return '';
//   }
  
//   export function h(tag, props, ...children) {
//     return { tag, props, children };
//   }