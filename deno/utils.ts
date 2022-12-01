export const readFile = async (importMeta: ImportMeta, path: string) => {
	const isFileUrl = importMeta.url.startsWith("file");
	const delimiter = !isFileUrl || Deno.build.os != "windows" ? "/" : "\\";

	const urlToFile = new URL(
		importMeta.url.split(delimiter).slice(0, -1).join(delimiter) +
			delimiter +
			path
	);

	return isFileUrl
		? Deno.readTextFile(urlToFile)
		: (await fetch(urlToFile)).text();
};
