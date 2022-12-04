import * as path from "path";

export async function readFile(
	importMeta: ImportMeta,
	filename: string
): Promise<string> {
	return Bun.file(path.resolve(importMeta.dir, filename)).text();
}
