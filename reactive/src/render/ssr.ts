import { render as renderToStringBase } from "./renderEngine";

export async function render(Component, props) {
  // Implement any async data fetching or context setup here
  const vnode = Component(props);
  return renderToStringBase(vnode);
}

// renderEngine.ts (add this function to your existing renderEngine)
export function renderToString(vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return escapeHtml(vnode.toString());
  }

  if (vnode == null) {
    return '';
  }

  if (typeof vnode.type === 'function') {
    return renderToString(vnode.type(vnode.props));
  }

  const props = vnode.props || {};
  let html = `<${vnode.type}`;
  
  for (const [key, value] of Object.entries(props)) {
    if (key !== 'children') {
      html += ` ${key}="${escapeHtml(value)}"`;
    }
  }
  
  html += '>';

  if (vnode.children) {
    for (const child of vnode.children) {
      html += renderToString(child);
    }
  }

  html += `</${vnode.type}>`;
  return html;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}