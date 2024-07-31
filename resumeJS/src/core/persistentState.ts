export type PersistentState<T> = {
    getState: () => T;
    setState: (newState: T) => void;
    serialize: () => string;
    deserialize: (serializedState: string) => void;
  };
  
  export const createPersistentState = <T>(key: string, initialState: T): PersistentState<T> => {
    const loadStateFromStorage = (): T => {
      const serializedState = localStorage.getItem(key);
      return serializedState ? JSON.parse(serializedState) : initialState;
    };
  
    const saveStateToStorage = (state: T): void => {
      localStorage.setItem(key, JSON.stringify(state));
    };
  
    let state = loadStateFromStorage();
  
    const getState = () => state;
  
    const setState = (newState: T) => {
      state = newState;
      saveStateToStorage(state);
    };
  
    const serialize = () => JSON.stringify(state);
  
    const deserialize = (serializedState: string) => {
      state = JSON.parse(serializedState);
      saveStateToStorage(state);
    };
  
    return { getState, setState, serialize, deserialize };
  };
  