export const createSignal = (initialValue: any) => {
    let value = initialValue;
    const subscribers = new Set<Function>();
  
    const signal = () => value;
    signal.subscribe = (callback: Function) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    };
    signal.set = (newValue: any) => {
      if (value !== newValue) {
        value = newValue;
        subscribers.forEach(callback => callback());
      }
    };
    return [signal, signal.set] as const;
};
  
  
export function createEffect(fn: () => void): void {
// Implementation of createEffect
}

export function createMemo<T>(fn: () => T): () => T {
// Implementation of createMemo
}