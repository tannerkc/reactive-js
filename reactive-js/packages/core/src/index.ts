import { transform } from '@babel/core';
import jsxPlugin from 'babel-plugin-jsx-dom-expressions';

// Compiles JSX code to JavaScript using Babel and the JSX DOM expressions plugin
export function compileJSX(code: string): string {
  const result = transform(code, {
    plugins: [jsxPlugin],
  });
  return result?.code || '';
}

// Creates an HTML element or DocumentFragment from a tag, props, and children
export function createElement(tag: string | Function, props: any = {}, ...children: any[]): HTMLElement | DocumentFragment {
  // If the tag is a function, it's a functional component, so call it
  if (typeof tag === 'function') {
    return tag({ ...props, children });
  }

  // Create the actual DOM element
  const element = document.createElement(tag);

  // Assign properties and attributes
  for (const [name, value] of Object.entries(props)) {
    if (name.startsWith('on') && typeof value === 'function') {
      // Add event listeners (e.g., onClick)
      element.addEventListener(name.slice(2).toLowerCase(), value);
    } else if (name === 'style' && typeof value === 'object') {
      // Add styles (e.g., style={{ color: 'red' }})
      Object.assign(element.style, value);
    } else {
      // Set attributes (e.g., id, className)
      element.setAttribute(name, value);
    }
  }

  // Append children
  for (const child of children) {
    appendChild(element, child);
  }

  return element;
}

// Helper function to append a child or children to a parent element
function appendChild(parent: HTMLElement | DocumentFragment, child: any): void {
  if (Array.isArray(child)) {
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
  } else if (child instanceof Node) {
    parent.appendChild(child);
  } else if (typeof child === 'string' || typeof child === 'number') {
    parent.appendChild(document.createTextNode(child.toString()));
  } else if (child !== null && child !== undefined) {
    console.warn('Unknown child type', child);
  }
}

// Creates a DocumentFragment to support the Fragment component
export function Fragment(props: any): DocumentFragment {
  const fragment = document.createDocumentFragment();
  props.children.forEach((child: any) => appendChild(fragment, child));
  return fragment;
}

// Renders an element into a container in the DOM
export function render(element: any, container: HTMLElement): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(element);
}

// Placeholder function to initiate the application (to be implemented)
export function initiateApp(): void {
  console.log('App initiated');
}
