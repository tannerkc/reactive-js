type Primitive = string | number | boolean | null | undefined;
type Props = Record<string, any>;
type ChildNode = VNode | Primitive;

interface VNode {
  type: string | Function;
  props: Props;
  children: ChildNode[];
  dom?: Node;
  fragment?: DocumentFragment;
}

const EMPTY_OBJ = {};
const EMPTY_ARR: any[] = [];

function createFragment(): DocumentFragment {
  return document.createDocumentFragment();
}

function createElement(vnode: VNode): Node {
  if (typeof vnode.type === 'function') {
    return createComponent(vnode);
  }

  const el = document.createElement(vnode.type);
  updateProps(el, EMPTY_OBJ, vnode.props);
  vnode.children.forEach(child => {
    const childNode = createNode(child);
    el.appendChild(childNode);
  });
  vnode.dom = el;
  return el;
}

function createComponent(vnode: VNode): Node {
  const Component = vnode.type as Function;
  const props = { ...vnode.props, children: vnode.children };
  const result = Component(props);
  return createNode(result);
}

function createNode(child: ChildNode): Node {
  if (typeof child === 'string' || typeof child === 'number') {
    return document.createTextNode(child.toString());
  }
  if (child === null || child === undefined) {
    return document.createComment('');
  }
  return createElement(child as VNode);
}

function updateProps(dom: Element, oldProps: Props, newProps: Props) {
  for (const key in { ...oldProps, ...newProps }) {
    const oldValue = oldProps[key];
    const newValue = newProps[key];

    if (oldValue === newValue) continue;

    if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      if (oldValue) dom.removeEventListener(eventName, oldValue);
      if (newValue) dom.addEventListener(eventName, newValue);
    } else if (key === 'style' && typeof newValue === 'object') {
      Object.assign((dom as HTMLElement).style, newValue);
    } else if (key === 'class' || key === 'className') {
      dom.setAttribute('class', newValue);
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(key);
    } else {
      dom.setAttribute(key, newValue);
    }
  }
}

function updateElement(dom: Node, oldVNode: VNode, newVNode: VNode) {
  if (oldVNode.type !== newVNode.type) {
    dom.parentNode!.replaceChild(createElement(newVNode), dom);
    return;
  }

  if (typeof newVNode.type === 'string') {
    updateProps(dom as Element, oldVNode.props, newVNode.props);

    const oldChildren = oldVNode.children;
    const newChildren = newVNode.children;
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];

      if (i >= oldChildren.length) {
        dom.appendChild(createNode(newChild));
      } else if (i >= newChildren.length) {
        dom.removeChild(dom.childNodes[i]);
      } else {
        updateNode(dom.childNodes[i], oldChild, newChild);
      }
    }
  }
}

function updateNode(dom: Node, oldVNode: ChildNode, newVNode: ChildNode) {
  if (typeof oldVNode !== typeof newVNode) {
    dom.parentNode!.replaceChild(createNode(newVNode), dom);
  } else if (typeof newVNode === 'string' || typeof newVNode === 'number') {
    if (dom.nodeValue !== newVNode.toString()) {
      dom.nodeValue = newVNode.toString();
    }
  } else if (typeof (newVNode as VNode).type === 'string') {
    updateElement(dom, oldVNode as VNode, newVNode as VNode);
  }
}

// Keyed list reconciliation
function reconcileChildren(parentDom: Node, oldChildren: ChildNode[], newChildren: ChildNode[]) {
  const oldChildrenMap = new Map<string, VNode>();
  oldChildren.forEach((child, i) => {
    if (typeof child === 'object' && child !== null && 'key' in child.props) {
      oldChildrenMap.set(child.props.key, child as VNode);
    }
  });

  let lastIndex = 0;
  newChildren.forEach((newChild, newIndex) => {
    if (typeof newChild === 'object' && newChild !== null && 'key' in newChild.props) {
      const oldChild = oldChildrenMap.get(newChild.props.key);
      if (oldChild) {
        updateNode(parentDom.childNodes[newIndex], oldChild, newChild);
        if (newIndex < lastIndex) {
          parentDom.insertBefore(parentDom.childNodes[newIndex], parentDom.childNodes[lastIndex]);
        } else {
          lastIndex = newIndex;
        }
        oldChildrenMap.delete(newChild.props.key);
      } else {
        parentDom.insertBefore(createNode(newChild), parentDom.childNodes[newIndex] || null);
      }
    } else {
      if (newIndex < oldChildren.length) {
        updateNode(parentDom.childNodes[newIndex], oldChildren[newIndex], newChild);
      } else {
        parentDom.appendChild(createNode(newChild));
      }
    }
  });

  oldChildrenMap.forEach(child => {
    parentDom.removeChild(child.dom!);
  });
}

// Component lifecycle
const lifecycles = new WeakMap<VNode, { mount: Function, unmount: Function }>();

function registerLifecycle(vnode: VNode, mount: Function, unmount: Function) {
  lifecycles.set(vnode, { mount, unmount });
}

function mountComponent(vnode: VNode) {
  const lifecycle = lifecycles.get(vnode);
  if (lifecycle && lifecycle.mount) {
    lifecycle.mount();
  }
}

function unmountComponent(vnode: VNode) {
  const lifecycle = lifecycles.get(vnode);
  if (lifecycle && lifecycle.unmount) {
    lifecycle.unmount();
  }
}

// Event delegation
const delegatedEvents = new Map<string, (e: Event) => void>();

function delegate(eventName: string) {
  if (!delegatedEvents.has(eventName)) {
    const delegatedHandler = (e: Event) => {
      let target = e.target as Node | null;
      while (target) {
        const handler = (target as any)[`on${eventName}`];
        if (handler) {
          handler(e);
          if (e.cancelBubble) break;
        }
        target = target.parentNode;
      }
    };
    document.addEventListener(eventName, delegatedHandler);
    delegatedEvents.set(eventName, delegatedHandler);
  }
}

// Asynchronous rendering
let pendingUpdates = new Set<VNode>();
let rafId: number | null = null;

function scheduleUpdate(vnode: VNode) {
  pendingUpdates.add(vnode);
  if (!rafId) {
    rafId = requestAnimationFrame(flushUpdates);
  }
}

function flushUpdates() {
  const updates = Array.from(pendingUpdates);
  pendingUpdates.clear();
  rafId = null;

  updates.forEach(vnode => {
    if (vnode.dom) {
      updateElement(vnode.dom, vnode, vnode);
    }
  });
}

// Main render function
export function render(vnode: VNode, container: Element) {
  const oldVNode = container._vnode || { type: '', props: {}, children: [] };
  const newVNode = { ...vnode, dom: container };

  updateElement(container, oldVNode, newVNode);
  container._vnode = newVNode;

  mountComponent(newVNode);
}