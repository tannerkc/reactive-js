import { transformSync } from '@babel/core';
import babelConfig from '../../../babel.config.ts';

function renderToString(element) {
  if (typeof element === 'string') {
    return element;
  }

  const { tag, props, children } = element;
  const propString = Object.entries(props || {})
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const childrenString = (children || []).map(renderToString).join('');

  return `<${tag}${propString ? ' ' + propString : ''}>${childrenString}</${tag}>`;
}

export function compileJSXToHTML(jsxCode) {
  if (!jsxCode) return
  
  const transformedCode = transformSync(jsxCode, {
    ...babelConfig
  }).code;

  const createElementCode = `
    import { createElement, Fragment } from './dom-utils.js';
    ${transformedCode};
  `;

  let element;
  eval(createElementCode);
  return renderToString(element);
}
