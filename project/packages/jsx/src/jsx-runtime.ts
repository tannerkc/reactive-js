export function createElement(tag, props, ...children) {
    if (typeof tag === "function") {
      return tag(props, ...children);
    }
  
    const element = { tag, props: props || {}, children };
    return element;
}
  
export function Fragment(props, ...children) {
    return children;
}
  