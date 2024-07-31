import { createComponent } from './src/core/component';
import { createPersistentState } from './src/core/persistentState';
import { createRouter } from './src/router/router';

const persistentState = createPersistentState('appState', { message: 'Hello, world!' });

const AppComponent = createComponent((props) => {
  return `<div>${props.message}</div>`;
});

const renderApp = () => {
  const state = persistentState.getState();
  const html = AppComponent({ message: state.message });
  document.getElementById('app')!.innerHTML = html;
};

const router = createRouter(
  [{ path: '/', component: renderApp }],
  (html: string) => {
    document.querySelector('div[app]')!.innerHTML = html;
  }
);

// Initial render
renderApp();
