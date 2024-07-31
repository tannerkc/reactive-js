export namespace JSX {
    export interface Element {
        type: string | Function;
        props: { [key: string]: any };
    }

    export interface IntrinsicElements {
        [elemName: string]: any;
    }
}

export function jsx(type: string | Function, props: any, key?: string): JSX.Element {
    return { type, props: { ...props, key } };
}

export const jsxs = jsx;
export const Fragment = (props: { children: any }) => props.children;