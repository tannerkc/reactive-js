// import { build } from 'bun';
// import jsxPlugin from './jsxPlugin';

// await build({
//   entrypoints: ['./src/index.jsx'],
//   outdir: './dist',
//   plugins: [jsxPlugin],
// });


// v2
import { build as viteBuild } from 'vite';
import { build as bunBuild } from 'bun';
import jsxPlugin from './jsxPlugin';

async function build() {
  // Build client assets with Vite
  await viteBuild();

  // Build server with Bun
  await bunBuild({
    entrypoints: ['./server.ts'],
    outdir: './dist',
    target: 'bun',
    plugins: [jsxPlugin],
  });
}

build().catch(console.error);