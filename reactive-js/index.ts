export { createComponent } from './packages/renderer/lib/component'
export { createContext, useContext, createMemo, effect, state } from './packages/reactivity'

import { effect, state } from './packages/reactivity';
import { createElement, Fragment } from './packages/renderer/lib/jsx-runtime';

const Reactive = {
    state,
    effect,
    createElement,
    Fragment
};

export default Reactive
export const jsx = Reactive.createElement;
export const jsxs = Reactive.createElement;