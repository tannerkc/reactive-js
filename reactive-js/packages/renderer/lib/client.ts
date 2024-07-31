import { loadComponent } from "../../core/src/componentLoader";
import { router } from "../../core/src/reactiveRouter";

async function render() {
  const { component, props } = await loadComponent(window.location.pathname);
  const app = document.querySelector('div[app]');
  if (app) {
    app.innerHTML = '';
    app.appendChild(component(props));
  }
}

window.addEventListener('popstate', render);
render();