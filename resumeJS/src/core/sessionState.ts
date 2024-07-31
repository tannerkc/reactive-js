export type SessionState<T> = {
    getState: () => T;
    setState: (newState: T) => void;
    serialize: () => string;
    deserialize: (serializedState: string) => void;
  };
  
  export const createSessionState = <T>(key: string, initialState: T): SessionState<T> => {
    const loadStateFromStorage = (): T => {
      const serializedState = sessionStorage.getItem(key);
      return serializedState ? JSON.parse(serializedState) : initialState;
    };
  
    const saveStateToStorage = (state: T): void => {
      sessionStorage.setItem(key, JSON.stringify(state));
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
  