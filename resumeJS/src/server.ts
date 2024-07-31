import { Elysia } from 'elysia';
import { createComponent } from './core/component';
import { createPersistentState } from './core/persistentState';

const persistentState = createPersistentState('appState', { message: 'Hello, world!' });

const AppComponent = createComponent((props) => {
  return `<div>${props.message}</div>`;
});

const app = new Elysia();

app.get('/', function* ({ set }) {
  // Set headers for the response
  set.headers['Content-Type'] = 'text/html';

  // Get current state from persistent state management
  const state = persistentState.getState();
  
  // Stream content using generator function
  yield '<!DOCTYPE html>';
  yield '<html lang="en">';
  yield '<head><meta charset="UTF-8"><title>My Framework</title></head>';
  yield '<body>';
  yield AppComponent({ message: state.message });
  yield '</body>';
  yield '</html>';
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
