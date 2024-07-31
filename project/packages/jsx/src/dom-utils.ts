export function createElement(type: string, props: any, ...children: any[]) {
    const element = document.createElement(type);
    for (const [key, value] of Object.entries(props || {})) {
      if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.toLowerCase().slice(2), value);
      } else {
        element.setAttribute(key, value);
      }
    }
    element.append(...children.flat().map(child => 
      typeof child === 'string' ? createTextNode(child) : child
    ));
    return element;
  }
  
  export function createTextNode(text: string) {
    return document.createTextNode(text);
  }
  
  export const Fragment = Symbol('Fragment');