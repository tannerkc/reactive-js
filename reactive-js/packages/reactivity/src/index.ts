// reactivity.ts
export type Accessor<T> = () => T;
export type Setter<T> = (v: T | ((prev: T) => T)) => T;
export type Signal<T> = [get: Accessor<T>, set: Setter<T>];

interface SignalOptions<T> {
  equals?: (a: T, b: T) => boolean;
  name?: string;
}

interface Owner {
  owned: Set<Computation>;
  cleanups: Set<() => void>;
  context: Map<symbol, any>;
  owner: Owner | null;
}

interface Computation extends Owner {
  fn: () => any;
  value: any;
  observers: Set<Computation>;
  sources: Set<SignalState<any>>;
  state: 'stale' | 'pending' | 'ready';
}

interface SignalState<T> {
  value: T;
  observers: Set<Computation>;
}

const UNOWNED: Owner = {
  owned: new Set(),
  cleanups: new Set(),
  context: new Map(),
  owner: null
};

let currentOwner: Owner | null = null;
let currentListener: Computation | null = null;
let batched = false;
let queuedComputations = new Set<Computation>();

export function state<T>(value: T, options: SignalOptions<T> = {}): Signal<T> {
  const sig: SignalState<T> = {
    value,
    observers: new Set()
  };

  const get = () => {
    if (currentListener) {
      sig.observers.add(currentListener);
      currentListener.sources.add(sig);
    }
    return sig.value;
  };

  const set = (newValue: T | ((prev: T) => T)) => {
    const resolvedValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(sig.value) : newValue;
    if (!options.equals || !options.equals(sig.value, resolvedValue)) {
      sig.value = resolvedValue;
      queueUpdate(() => {
        for (const obs of sig.observers) {
          obs.state = 'stale';
          queuedComputations.add(obs);
        }
      });
    }
    return sig.value;
  };

  return [get, set];
}

export function effect(fn: () => void): void {
  createComputation(fn, false);
}

export function createMemo<T>(fn: () => T): Accessor<T> {
  const comp = createComputation(fn, true);
  return () => comp.value;
}

function createComputation(fn: () => any, memoize: boolean): Computation {
  const comp: Computation = {
    fn,
    value: undefined,
    owned: new Set(),
    cleanups: new Set(),
    context: new Map(),
    owner: currentOwner,
    observers: new Set(),
    sources: new Set(),
    state: 'stale'
  };

  const execute = () => {
    if (comp.state !== 'stale') return;
    cleanupComputation(comp);
    const prevOwner = currentOwner;
    const prevListener = currentListener;
    currentOwner = currentListener = comp;
    try {
      const newValue = comp.fn();
      if (memoize) comp.value = newValue;
    } finally {
      currentOwner = prevOwner;
      currentListener = prevListener;
    }
    comp.state = 'ready';
  };

  queuedComputations.add(comp);
  queueUpdate(execute);

  return comp;
}

function cleanupComputation(comp: Computation): void {
  for (const source of comp.sources) {
    source.observers.delete(comp);
  }
  comp.sources.clear();
  for (const cleanup of comp.cleanups) cleanup();
  comp.cleanups.clear();
}

function queueUpdate(fn: () => void): void {
  if (batched) {
    queueMicrotask(fn);
  } else {
    fn();
  }
}

export function batch<T>(fn: () => T): T {
  const prevBatch = batched;
  batched = true;
  try {
    return fn();
  } finally {
    batched = prevBatch;
    if (!batched) {
      while (queuedComputations.size) {
        const comp = queuedComputations.values().next().value;
        queuedComputations.delete(comp);
        comp.state = 'stale';
        comp.fn();
      }
    }
  }
}

export function untrack<T>(fn: () => T): T {
  const prevListener = currentListener;
  currentListener = null;
  try {
    return fn();
  } finally {
    currentListener = prevListener;
  }
}

interface Context<T> {
  id: symbol;
  defaultValue: T;
}

export function createContext<T>(defaultValue: T): Context<T> {
  return {
    id: Symbol('context'),
    defaultValue
  };
}

export function useContext<T>(context: Context<T>): T {
  return currentOwner?.context.get(context.id) ?? context.defaultValue;
}

export function provide<T>(context: Context<T>, value: T): void {
  if (currentOwner) {
    currentOwner.context.set(context.id, value);
  }
}

export function onCleanup(fn: () => void): void {
  if (currentOwner) {
    currentOwner.cleanups.add(fn);
  }
}

export function catchError(fn: () => void, errorHandler: (error: Error) => void): void {
  try {
    fn();
  } catch (error) {
    errorHandler(error instanceof Error ? error : new Error(String(error)));
  }
}