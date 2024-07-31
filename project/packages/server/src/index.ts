// import { Elysia } from 'elysia'

// const app = new Elysia();
// app.get('/', () => "Hello World!");
// app.listen(8000);
// console.log(
//   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
// );


import { router } from "../../router";

Bun.serve({
  fetch(req) {
    console.log(req)
    return router(req);
  },
  port: 3000,
});

console.log("Server running on http://localhost:3000");