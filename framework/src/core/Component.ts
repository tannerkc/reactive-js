export interface Component {
    render(): string;
    mount?(element: HTMLElement): void;
    unmount?(): void;
}

export function createComponent(config: Partial<Component>): Component {
    return {
        render: config.render || (() => ''),
        mount: config.mount,
        unmount: config.unmount,
    };
}