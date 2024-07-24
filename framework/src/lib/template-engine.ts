export function compile(template: string): string {
    return template
      .replace(/<(\w+)([^>]*)>/g, '${h("$1", "$2")}')
      .replace(/<\/(\w+)>/g, '${h("/$1")}');
}
  
export function h(tag: string, attrs: string = '', ...children: string[]): string {
    if (tag.startsWith('/')) return `</${tag.slice(1)}>`;
    
    const attributes = attrs
      .split(' ')
      .filter(Boolean)
      .map(attr => {
        const [key, value] = attr.split('=');
        return `${key}="${value.replace(/['"]/g, '')}"`;
      })
      .join(' ');
  
    return `<${tag}${attributes ? ' ' + attributes : ''}>${children.join('')}`;
}