import * as ts from 'typescript';

export function compile(code: string): string {
  const sourceFile = ts.createSourceFile('temp.tsx', code, ts.ScriptTarget.Latest, true);

  function visit(node: ts.Node): string {
    if (ts.isJsxElement(node)) {
      return transformJsxElement(node);
    } else if (ts.isJsxSelfClosingElement(node)) {
      return transformJsxSelfClosingElement(node);
    } else if (ts.isJsxText(node)) {
      return JSON.stringify(node.text.trim());
    } else if (ts.isJsxExpression(node)) {
      return node.expression ? visit(node.expression) : '';
    } else if (ts.isIdentifier(node)) {
      return node.text;
    } else if (ts.isStringLiteral(node)) {
      return JSON.stringify(node.text);
    } else if (ts.isNumericLiteral(node)) {
      return node.text;
    } else if (ts.isBinaryExpression(node)) {
      return `${visit(node.left)} ${node.operatorToken.getText()} ${visit(node.right)}`;
    } else if (ts.isPropertyAccessExpression(node)) {
      return `${visit(node.expression)}.${node.name.text}`;
    } else if (ts.isCallExpression(node)) {
      const args = node.arguments.map(visit).join(', ');
      return `${visit(node.expression)}(${args})`;
    } else if (ts.isArrowFunction(node)) {
      const params = node.parameters.map(p => p.name.getText()).join(', ');
      const body = visit(node.body);
      return `(${params}) => ${body}`;
    }

    return node.getFullText();
  }

  function transformJsxElement(node: ts.JsxElement): string {
    const tagName = node.openingElement.tagName.getText();
    const props = transformAttributes(node.openingElement.attributes);
    const children = node.children.map(visit).filter(Boolean).join(', ');

    return `jsx("${tagName}", ${props}, ${children})`;
  }

  function transformJsxSelfClosingElement(node: ts.JsxSelfClosingElement): string {
    const tagName = node.tagName.getText();
    const props = transformAttributes(node.attributes);

    return `jsx("${tagName}", ${props})`;
  }

  function transformAttributes(attrs: ts.JsxAttributes): string {
    const properties: string[] = [];

    attrs.properties.forEach(prop => {
      if (ts.isJsxAttribute(prop)) {
        const name = prop.name.getText();
        const initializer = prop.initializer 
          ? ts.isStringLiteral(prop.initializer) 
            ? JSON.stringify(prop.initializer.text)
            : `(${visit(prop.initializer)})`
          : 'true';
        properties.push(`"${name}": ${initializer}`);
      } else if (ts.isJsxSpreadAttribute(prop)) {
        properties.push(`...${visit(prop.expression)}`);
      }
    });

    return `{${properties.join(', ')}}`;
  }

  const result = visit(sourceFile);
  return result;
}