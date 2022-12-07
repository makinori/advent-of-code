import { readFile } from "../utils";
import * as path from "node:path";

const linesString = await readFile(import.meta, "7.txt");
const lines = linesString
	.trim()
	.split("\n")
	.map(line => line.trim().split(" "));

// parse lines

enum Type {
	File = "file",
	Dir = "dir"
}

interface File {
	type: Type;
	name: string;
	size?: number; // files only
	dir?: File[]; // dirs only
}

let i = 0;
let cwd = "/";
let fs: File[] = [];

const getFsArray = (pathStr: string) => {
	if (!pathStr.startsWith("/")) {
		throw new Error("Needs absolute path");
	}

	let fsArray = fs;

	// ignore / since its absolute only
	const pathEls = pathStr.split("/").slice(1);

	for (let pathEl of pathEls) {
		if (pathEl == "") continue;

		const foundArray = fsArray.find(
			file => file.type == Type.Dir && file.name == pathEl
		);

		if (foundArray) {
			if (foundArray.dir == null) throw new Error("Shouldn't happen");
			fsArray = foundArray.dir;
		} else {
			// make new array and add to current fs array
			const newArray = [];
			fsArray.push({ type: Type.Dir, name: pathEl, dir: newArray });
			fsArray = newArray;
		}
	}

	return fsArray;
};

const getRangeOfCommandOutput = (startIndex: number) => {
	let endIndex = lines.length;
	for (let i = startIndex; i < lines.length; i++) {
		if (lines[i][0] == "$") {
			endIndex = i;
			break;
		}
	}
	return endIndex;
};

const parseLs = (lines: string[][]) => {
	const fsArray = getFsArray(cwd);

	for (const line of lines) {
		if (line[0] == "dir") {
			// do we need to do anything? i guess we can just ensure the dir
			getFsArray(path.join(cwd, line[1]));
		} else {
			const name = line[1];
			const size = Number(line[0]);

			fsArray.push({ type: Type.File, name, size });
		}
	}
};

while (i < lines.length) {
	const line = lines[i++];

	if (line[0] == "$") {
		switch (line[1]) {
			case "cd":
				cwd = path.join(cwd, line[2]);
				break;

			case "ls":
				const endIndex = getRangeOfCommandOutput(i);
				const output = lines.slice(i, endIndex);
				parseLs(output);
				// move current line pointer
				i = endIndex;
				break;
		}
	}
}

// now that we have an fs tree, get puzzle output

const collectedTotalSizes: { dirPath: string; size: number }[] = [];

function getTotalSize(fsArray: File[], dirPath: string) {
	let size = 0;
	for (let file of fsArray) {
		if (file.type == Type.File) {
			size += file.size ?? 0;
		} else if (file.type == Type.Dir) {
			size += getTotalSize(file.dir ?? [], path.join(dirPath, file.name));
		}
	}
	collectedTotalSizes.push({ dirPath: dirPath, size });
	return size;
}

let totalUsedSize = getTotalSize(fs, "/");
// console.log(collectedTotalSizes);

// part one

let partOneSum = 0;

for (const { dirPath, size } of collectedTotalSizes) {
	if (size <= 100000) {
		partOneSum += size;
	}
}

console.log(partOneSum);

// part two

const totalUnunsedSize = 70000000 - totalUsedSize;
const sizeWeNeed = 30000000 - totalUnunsedSize;

const dirsWeCanDelete: { dirPath: string; size: number }[] = [];

for (const dir of collectedTotalSizes) {
	if (dir.size > sizeWeNeed) {
		dirsWeCanDelete.push(dir);
	}
}

const dirWeCanDelete = dirsWeCanDelete.sort((a, b) => a.size - b.size)[0];

console.log(dirWeCanDelete.size);
