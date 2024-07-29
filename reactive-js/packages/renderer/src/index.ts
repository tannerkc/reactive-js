export function render(component: () => Node, container: Element): void {
    container.innerHTML = '';
    const result = component();
    container.appendChild(result);
}

export async function renderToString(jsx: any): Promise<string> {
  if (typeof jsx === 'string' || typeof jsx === 'number' || typeof jsx === 'boolean') {
    return String(jsx);
  }

  if (jsx === null || jsx === undefined) {
    return '';
  }

  if (Array.isArray(jsx)) {
    return (await Promise.all(jsx.map(renderToString))).join('');
  }

  if (typeof jsx === 'object') {
    if (jsx.$$typeof === Symbol.for('react.element')) {
      const { type, props } = jsx;
      if (typeof type === 'string') {
        const attributes = Object.entries(props)
          .filter(([key]) => key !== 'children')
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ');
        
        const children = props.children ? await renderToString(props.children) : '';
        
        return `<${type} ${attributes}>${children}</${type}>`;
      } else if (typeof type === 'function') {
        return await renderToString(type(props));
      }
    }
  }

  console.warn('Unhandled JSX type:', jsx);
  return '';
}