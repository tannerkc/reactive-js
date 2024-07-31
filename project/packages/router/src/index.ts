import { promises as fs } from "fs";
import path from "path";
import { compileJSXToHTML } from "../../jsx";

const baseDir = path.resolve("src/routes");

async function renderPage(filePath: string) {
  const { default: PageComponent } = await import(filePath);
  console.log(PageComponent)
  return compileJSXToHTML(PageComponent());
}

export async function router(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const routePath = url.pathname;
  const filePath = path.join(baseDir, `${routePath}/index.tsx`);

  try {
    // await fs.access(filePath);
    const html = await renderPage(filePath);
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    console.error(error)
    const notFoundPage = path.join(baseDir, `${routePath}/404/index.html`);
    // const html = await renderPage(notFoundPage);
    return new Response(Bun.file(notFoundPage), { status: 404, headers: { "Content-Type": "text/html" } });
  }
}
