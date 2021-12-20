import { readFile } from "../utils.ts";

// const dataString = `199
// 200
// 208
// 210
// 200
// 207
// 240
// 269
// 260
// 263`;

const dataString = await readFile(import.meta, "1.txt");

const data = dataString
	.trim()
	.split("\n")
	.map(n => Number(n));

{
	let current = data[0];
	let increases = 0;

	// start at second
	for (const depth of data.slice(1)) {
		if (depth > current) {
			increases++;
		}
		current = depth;
	}

	console.log(increases);
}

{
	let current = data[0] + data[1] + data[2];
	let increases = 0;

	// i at second, and length - 2 because can't sample non existant data
	for (let i = 1; i < data.length - 2; i++) {
		// console.log(i, data[i], data[i + 1], data[i + 2]);
		const sum = data[i] + data[i + 1] + data[i + 2];
		if (sum > current) {
			increases++;
		}
		current = sum;
	}

	console.log(increases);
}
