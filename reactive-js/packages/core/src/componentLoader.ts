import { router } from './reactiveRouter';
import path from 'path';

export async function loadComponent(url: string) {
  const match = router.match(url);
  if (!match) {
    throw new Error(`No matching route found for ${url}`);
  }

  const module = await import(path.resolve(match.filePath));
  return {
    component: module.default,
    props: {
      params: match.params || {},
      query: match.query || {},
    },
  };
}