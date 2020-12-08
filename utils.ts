export const relativeResolve = (importMeta: ImportMeta, path: string) =>
	importMeta.url
		.replace(/^file:\/\//, "")
		.split("/")
		.slice(0, -1)
		.join("/") +
	"/" +
	path;
