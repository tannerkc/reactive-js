import { FileSystemRouter } from "bun";
import path from "path";

export class ReactiveRouter {
  private router: InstanceType<typeof FileSystemRouter>;
  private routesDir: string;

  constructor() {
    this.routesDir = path.join(process.cwd(), "src", "routes");
    this.router = new FileSystemRouter({
      dir: this.routesDir,
      style: "nextjs",
      fileExtensions: [".tsx"],
    });
  }

  match(url: string) {
    const result = this.router.match(url);
    if (!result) return null;

    const relativePath = path.relative(this.routesDir, result.filePath);
    const parts = relativePath.split(path.sep);
    const isIndex = parts[parts.length - 1] === "index.tsx";

    if (isIndex) {
      parts.pop();
    }

    const routeParts = parts.map(part => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return part;
      }
      return part.replace(".tsx", "");
    });

    const name = "/" + routeParts.join("/");

    return {
      ...result,
      name,
      kind: name.includes("[") ? "dynamic" : "exact",
    };
  }

  reload() {
    this.router.reload();
  }
}

export const router = new ReactiveRouter();