// export default `<h1>About Page</h1><p>This is the about page content.</p>`;

import { createElement, JSX } from "custom-framework";
// import type { JSX } from "custom-framework";

export function About(): JSX.Element {
  return (
    <div>
      <h1>Welcome to the About Page</h1>
      <p>This is a JSX component rendered without React!</p>
    </div>
  );
}