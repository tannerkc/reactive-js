import { createElement, jsx } from "custom-framework";

export function Home(): JSX.Element {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is a JSX component rendered without React!</p>
    </div>
  );
}