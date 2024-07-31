// component.ts
import { effect, onCleanup } from '../../reactivity';

export type Props = Record<string, any>;
export type Child = string | number | boolean | null | undefined | Node;
export type Component<P = {}> = (props: P) => Node | (() => Node);

export function createComponent<P = {}>(render: (props: P) => Node | (() => Node)): Component<P> {
  return (props: P) => {
    let node: Node;
    effect(() => {
      const result = render(props);
      if (typeof result === 'function') {
        effect(() => {
          const newNode = result();
          if (node && node.parentNode) {
            node.parentNode.replaceChild(newNode, node);
          }
          node = newNode;
        });
      } else {
        node = result;
      }
    });
    return () => node;
  };
}

export function render(component: () => Node, container: Element): void {
  let root: Node | null = null;
  effect(() => {
    const newRoot = component();
    if (root) {
      container.replaceChild(newRoot, root);
    } else {
      container.appendChild(newRoot);
    }
    root = newRoot;
  });
  onCleanup(() => {
    if (root && root.parentNode) {
      root.parentNode.removeChild(root);
    }
  });
}