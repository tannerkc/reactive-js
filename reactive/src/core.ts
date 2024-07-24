
// Signal implementation
type Subscriber = () => void;

class Signal<T> {
  private value: T;
  private subscribers: Set<Subscriber> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    // Track dependencies here
    return this.value;
  }

  set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.notify();
    }
  }

  subscribe(subscriber: Subscriber): void {
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers.delete(subscriber);
  }

  private notify(): void {
    for (const subscriber of this.subscribers) {
      subscriber();
    }
  }
}

// Create a signal
export function createSignal<T>(initialValue: T): [() => T, (newValue: T) => void] {
  const signal = new Signal(initialValue);
  return [() => signal.get(), (newValue: T) => signal.set(newValue)];
}

// Create an effect
export function createEffect(fn: () => void): void {
  // Implement dependency tracking and automatic re-running
  fn();
}

// JSX Factory Function (simplified)
export function h(tag: string | Function, props: Record<string, any>, ...children: any[]): HTMLElement | Text {
  if (typeof tag === 'function') {
    return tag(props, children);
  }

  const element = document.createElement(tag);
  
  for (const [key, value] of Object.entries(props || {})) {
    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  }

  return element;
}

// Component function
export function component(fn: (props: any) => any): (props: any) => HTMLElement {
  return (props: any) => {
    // Implement component lifecycle and rendering logic here
    return fn(props);
  };
}