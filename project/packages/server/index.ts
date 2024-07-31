import { router } from "../router";

Bun.serve({
  fetch(req) {
    return router(req);
  },
  port: 3000,
});

console.log("Server running on http://localhost:3000");

// import { createServer } from "vite";
// import { resolve } from "path";

// async function startServer() {
//   const server = await createServer({
//     configFile: resolve(__dirname, "../../vite.config.ts")
//   });

//   await server.listen();
//   router(window.location.pathname)
//   console.log("Vite server running on http://localhost:3000");
// }

// startServer();
