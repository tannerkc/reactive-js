// export function createStore<T>(initialState: T): [() => T, (partial: Partial<T>) => void] {
//     // Implementation of global store
// }

import { createSignal } from "../../reactivity/src";

const [globalState, setGlobalState] = createSignal({ });

export { globalState, setGlobalState };
