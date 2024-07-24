export type { JSX } from './jsx';

export function createElement(tag: string | Function, props: any, ...children: any[]): HTMLElement | Text {
    if (typeof tag === 'function') {
      return tag({ ...props, children });
    }
  
    const element = document.createElement(tag);
  
    for (const [key, value] of Object.entries(props || {})) {
      if (key.startsWith('on') && key.toLowerCase() in window) {
        element.addEventListener(key.toLowerCase().slice(2), value as EventListener);
      } else {
        element.setAttribute(key, value as string);
      }
    }
  
    children.forEach(child => {
      if (Array.isArray(child)) {
        child.forEach(nestedChild => appendChild(element, nestedChild));
      } else {
        appendChild(element, child);
      }
    });
  
    return element;
  }
  
  function appendChild(parent: HTMLElement, child: any) {
    if (child == null) {
      return;
    }
  
    if (child instanceof Node) {
      parent.appendChild(child);
    } else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  }
  
  export const jsx = createElement;
  export const jsxs = createElement;