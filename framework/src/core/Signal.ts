type Listener<T> = (value: T) => void;

export function createSignal<T>(initialValue: T) {
  let value = initialValue;
  const listeners = new Set<Listener<T>>();

  function get() {
    return value;
  }

  function set(newValue: T) {
    if (newValue !== value) {
      value = newValue;
      listeners.forEach(listener => listener(value));
    }
  }

  function subscribe(listener: Listener<T>) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { get, set, subscribe };
}

export function effect(fn: () => void) {
  fn();
  // In a real implementation, we'd track dependencies and re-run when they change
}