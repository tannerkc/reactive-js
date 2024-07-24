import { plugin } from 'bun';
import transformJSX from './jsxTransformer';

export default {
  name: 'jsx',
  setup(build) {
    build.onLoad({ filter: /\.(jsx|tsx)$/ }, async (args) => {
      const text = await Bun.file(args.path).text();
      const contents = transformJSX(text);
      return { contents, loader: 'js' };
    });
  },
} as plugin;