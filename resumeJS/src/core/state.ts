export type State<T> = {
    state: T;
    setState: (newState: T) => void;
    getState: () => T;
    subscribe: (listener: (state: T) => void) => void;
    serialize: () => string;
};
  
export const createState = <T>(initialState: T): State<T> => {
    let state = initialState;
    const listeners: Array<(state: T) => void> = [];

    const setState = (newState: T) => {
        state = newState;
        listeners.forEach(listener => listener(state));
    };

    const getState = () => state;

    const subscribe = (listener: (state: T) => void) => {
        listeners.push(listener);
    };

    const serialize = () => JSON.stringify(state);

    return { state, setState, getState, subscribe, serialize };
};
  