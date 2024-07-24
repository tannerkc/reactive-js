// declare namespace JSX {
//     type Element = HTMLElement;
  
//     interface IntrinsicElements {
//       // HTML elements
//       a: HTMLAttributes<HTMLAnchorElement>;
//       button: HTMLAttributes<HTMLButtonElement>;
//       div: HTMLAttributes<HTMLDivElement>;
//       h1: HTMLAttributes<HTMLHeadingElement>;
//       h2: HTMLAttributes<HTMLHeadingElement>;
//       h3: HTMLAttributes<HTMLHeadingElement>;
//       h4: HTMLAttributes<HTMLHeadingElement>;
//       h5: HTMLAttributes<HTMLHeadingElement>;
//       h6: HTMLAttributes<HTMLHeadingElement>;
//       img: HTMLAttributes<HTMLImageElement>;
//       input: HTMLAttributes<HTMLInputElement>;
//       p: HTMLAttributes<HTMLParagraphElement>;
//       span: HTMLAttributes<HTMLSpanElement>;
//       // Add more HTML elements as needed
  
//       // SVG elements
//       svg: SVGAttributes<SVGSVGElement>;
//       path: SVGAttributes<SVGPathElement>;
//       // Add more SVG elements as needed
//     }
  
//     interface HTMLAttributes<T> extends DOMAttributes<T> {
//       // Add any global HTML attributes here
//       class?: string;
//       id?: string;
//       style?: string | { [key: string]: string | number };
//       // Add more attributes as needed
//     }
  
//     interface SVGAttributes<T> extends DOMAttributes<T> {
//       // Add any global SVG attributes here
//       width?: number | string;
//       height?: number | string;
//       viewBox?: string;
//       // Add more attributes as needed
//     }
  
//     interface DOMAttributes<T> {
//       // Event handlers
//       onClick?: (event: MouseEvent) => void;
//       onChange?: (event: Event) => void;
//       onInput?: (event: Event) => void;
//       onSubmit?: (event: Event) => void;
//       // Add more event handlers as needed
//     }
// }

export declare namespace JSX {
    interface Element extends HTMLElement {}
  
    interface IntrinsicElements {
      [elemName: string]: any;
    }
}