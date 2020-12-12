const pathDelimiter = Deno.build.os == "windows" ? "\\" : "/";

export const relativeResolve = (importMeta: ImportMeta, path: string) =>
	new URL(
		importMeta.url.split(pathDelimiter).slice(0, -1).join(pathDelimiter) +
			pathDelimiter +
			path
	);
