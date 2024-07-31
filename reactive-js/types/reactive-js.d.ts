declare module 'reactive-js' {
  namespace Reactive {
    function createElement(type: string | Function, props?: any, ...children: any[]): any;
    function Fragment(props: { children?: any }): any;
    function state<T>(initial: T): [() => T, (value: T) => void];
    function effect(fn: () => void): void;
  }

  export = Reactive;

  namespace JSX {
    interface Element {
      type: string | Function;
      props: any;
      key: string | null;
    }
    interface ElementClass {
      render(): Element;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}