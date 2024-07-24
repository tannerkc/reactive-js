import { createElement } from './jsx-runtime';

export function render(template: string | JSX.Element, data: Record<string, any>): string | HTMLElement {
  if (typeof template === 'string') {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
  } else {
    return template;
  }
}

export function mount(content: string | HTMLElement): void {
  const appElement = document.querySelector('div[app]');
  
  if (appElement) {
    if (typeof content === 'string') {
      appElement.innerHTML = content;
    } else {
      appElement.innerHTML = '';
      appElement.appendChild(content);
    }
  } else {
    console.error('No <div app> element found');
  }
}

// export function render(content: JSX.Element, _data: Record<string, any>): JSX.Element {
//   return content;
// }

// export function mount(content: JSX.Element): void {
//   const appElement = document.querySelector('div[app]');
  
//   if (appElement) {
//     appElement.innerHTML = '';
//     appElement.appendChild(content);
//   } else {
//     console.error('No <div app> element found');
//   }
// }