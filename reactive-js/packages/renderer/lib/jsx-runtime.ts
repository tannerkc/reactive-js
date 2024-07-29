import { state, batch, effect } from '../../reactivity';
import type { Accessor } from '../../reactivity'

export type Props = Record<string, any>;
export type Child = string | number | boolean | null | undefined | Node | Accessor<Node>;

const EMPTY_OBJ: Props = {};
const EMPTY_ARR: any[] = [];
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

export function createElement(type: string | Function, props?: Props, ...children: Child[]): Node | Accessor<Node> {
  props = props || EMPTY_OBJ;

  if (typeof type === "function") {
    return type({ ...props, children: children.length > 1 ? children : children[0] });
  }

  const element = document.createElement(type);

  for (const p in props) {
    if (p === "style" && typeof props.style === 'object') {
      Object.assign(element.style, props.style);
    } else if (p === "className") {
      element.className = props.className;
    } else if (p === "htmlFor") {
      element.setAttribute("for", props.htmlFor);
    } else if (p.startsWith("on") && typeof props[p] === 'function') {
      element.addEventListener(p.toLowerCase().slice(2), props[p]);
    } else {
      element.setAttribute(p, props[p]);
    }
  }

  children.forEach(child => {
    if (child != null) {
      if (typeof child === 'function') {
        effect(() => {
          const result = child();
          element.appendChild(
            typeof result === "object"
              ? result
              : document.createTextNode(String(result))
          );
        });
      } else {
        element.appendChild(
          typeof child === "object"
            ? child
            : document.createTextNode(String(child))
        );
      }
    }
  });

  return element;
}

export function Fragment(props: { children: Child | Child[] }): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const children = Array.isArray(props.children) ? props.children : [props.children];
  children.forEach(child => {
    if (child != null) {
      if (typeof child === 'function') {
        effect(() => {
          const result = child();
          fragment.appendChild(
            typeof result === "object"
              ? result
              : document.createTextNode(String(result))
          );
        });
      } else {
        fragment.appendChild(
          typeof child === "object"
            ? child
            : document.createTextNode(String(child))
        );
      }
    }
  });
  return fragment;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
