export function render(component: () => Node, container: Element): void {
    container.innerHTML = '';
    const result = component();
    container.appendChild(result);
}