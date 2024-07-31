import { promises as fs } from "fs";
import path from "path";
import { compileJSXToHTML } from "../../jsx";

const baseDir = path.resolve("src/routes");

async function renderPage(filePath: string) {
  const { default: PageComponent } = await import(filePath);
  return compileJSXToHTML(PageComponent());

}

export async function router(req: Request): Promise<Response> {
  const url = new URL(req.url);
//   console.log(url.pathname)
  const routePath = url.pathname;
  const filePath = path.join(baseDir, `${routePath}/index.tsx`);

  console.log(routePath)

  try {
    await fs.access(filePath);
    const html = await renderPage(filePath);
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    console.error(error)
    return new Response("404 Not Found", { status: 404 });
  }
}
