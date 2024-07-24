// ./src/index.ts
import Reactive, { initiateApp } from "reactivejs" // the Reactive import acts like imported React, enabling the use of jsx
import "./index.css" // a default file we provide when the user runs npx create-reactive-app project-name

initiateApp()  // hydrates document.querySelector('div[app]') with the jsx file that matches the users url route
// http://localhost:3000/ will fetch ./src/routes/index.tsx
// http://localhost:3000/dashboard will fetch ./src/routes/dashboard/index.tsx
// http://localhost:3000/users/123 will fetch ./src/routes/users/[userId]/index.tsx

// this function also uses bun.js server to servers side render the page, or vite for client rendered pages. A jsx file needs to specify "use client" to be CSR.