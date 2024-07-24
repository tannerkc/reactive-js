import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

function transformJSX(code: string): string {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  traverse(ast, {
    JSXElement(path) {
      const openingElement = path.node.openingElement;
      const tagName = (openingElement.name as t.JSXIdentifier).name;
      const attributes = openingElement.attributes.map((attr) => {
        if (t.isJSXAttribute(attr)) {
          return t.objectProperty(
            t.identifier(attr.name.name as string),
            attr.value || t.booleanLiteral(true)
          );
        }
        return null;
      }).filter(Boolean);

      const children = path.node.children.map((child) => {
        if (t.isJSXText(child)) {
          return t.stringLiteral(child.value.trim());
        }
        return child;
      });

      const newCallExpression = t.callExpression(
        t.identifier('h'),
        [
          t.stringLiteral(tagName),
          t.objectExpression(attributes as t.ObjectProperty[]),
          ...children,
        ]
      );

      path.replaceWith(newCallExpression);
    },
  });

  const output = generate(ast);
  return output.code;
}

export default transformJSX;