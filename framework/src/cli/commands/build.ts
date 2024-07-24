import { build as viteBuild } from 'vite';
import path from 'path';

export async function build(): Promise<void> {
  console.log('Building project...');

  try {
    await viteBuild({
      root: process.cwd(),
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            main: path.resolve(process.cwd(), 'index.html'),
          },
        },
      },
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}