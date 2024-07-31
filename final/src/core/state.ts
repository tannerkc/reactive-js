type Subscriber = () => void;

export function createSignal<T>(initialValue: T): [() => T, (newValue: T) => void] {
  let value = initialValue;
  const subscribers = new Set<Subscriber>();

  const getter = () => value;
  const setter = (newValue: T) => {
    value = newValue;
    subscribers.forEach((subscriber) => subscriber());
  };

  return [getter, setter];
}

export function effect(callback: () => void): () => void {
  const run = () => {
    cleanup();
    callback();
  };

  let cleanup = () => {};
  run();

  return () => cleanup();
}