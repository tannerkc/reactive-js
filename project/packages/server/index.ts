import { router } from "../router";

Bun.serve({
  fetch(req) {
    return router(req);
  },
  port: 3000,
});

console.log("Server running on http://localhost:3000");