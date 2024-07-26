export function createSignal<T>(initialValue: T): [() => T, (newValue: T) => void] {
    // Implementation of createSignal
  }
  
  export function createEffect(fn: () => void): void {
    // Implementation of createEffect
  }
  
  export function createMemo<T>(fn: () => T): () => T {
    // Implementation of createMemo
  }