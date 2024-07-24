import { createServer } from 'vite';

export async function dev(): Promise<void> {
  console.log('Starting development server...');

  try {
    const server = await createServer({
      root: process.cwd(),
      server: {
        port: 3000,
      },
    });

    await server.listen();

    server.printUrls();
  } catch (error) {
    console.error('Failed to start dev server:', error);
    process.exit(1);
  }
}