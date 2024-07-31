export type ComponentProps = Record<string, any>;

export type Component = (props: ComponentProps) => string;

export const createComponent = (template: (props: ComponentProps) => string): Component => {
  return (props: ComponentProps) => template(props);
};
