import type { JSX } from "../jsx";

export function renderToString(element: JSX.Element): string {
  if (typeof element === "string") {
    return element;
  }

  if (typeof element === "function") {
    return renderToString(element());
  }

  const { type, props } = element;
  const attributes = Object.entries(props)
    .filter(([key]) => key !== "children")
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const children = props.children
    ? Array.isArray(props.children)
      ? props.children.map(renderToString).join("")
      : renderToString(props.children)
    : "";

  return `<${type} ${attributes}>${children}</${type}>`;
}