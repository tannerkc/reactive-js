#!/usr/bin/env node

// import { build } from './commands/build';
// import { dev } from './commands/dev';

// const command = process.argv[2];

// switch (command) {
//   case 'build':
//     build();
//     break;
//   case 'dev':
//     dev();
//     break;
//   default:
//     console.log('Unknown command. Available commands: build, dev');
// }

import { dev } from './commands/dev.js';

const args = process.argv.slice(2);

async function run() {
  const command = args[0];

  switch (command) {
    case 'dev':
      await dev();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
