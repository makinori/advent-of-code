import { readFile } from "../utils";

const treeHeightsString = await readFile(import.meta, "8.txt");

const treeHeights = treeHeightsString
	.trim()
	.split("\n")
	.map(line => line.split("").map(h => Number(h)));

const height = treeHeights.length;
const width = treeHeights[0].length;

const lookDirs = [
	{ x: -1, y: 0 },
	{ x: 1, y: 0 },
	{ x: 0, y: -1 },
	{ x: 0, y: 1 }
];

function isVisible(x: number, y: number) {
	// visible on the edges or out of bounds
	if (x <= 0 || y <= 0 || x >= width - 1 || y >= height - 1) return true;

	const treeHeight = treeHeights[y][x];

	for (const lookDir of lookDirs) {
		let queryX = x;
		let queryY = y;

		let steps = 1;

		let isVisible = true;

		while (
			queryX > 0 &&
			queryY > 0 &&
			queryX < width - 1 &&
			queryY < height - 1
		) {
			queryX = x + lookDir.x * steps;
			queryY = y + lookDir.y * steps;

			let queryHeight = treeHeights[queryY][queryX];

			// console.log("steps", steps);
			// console.log("      x y", x, y);
			// console.log("query x y", queryX, queryY);
			// console.log(" treeHeight", treeHeight);
			// console.log("queryHeight", queryHeight);
			// console.log("");

			if (queryHeight >= treeHeight) {
				isVisible = false;
				break;
			}

			steps++;
		}

		if (isVisible) {
			return true;
		}
	}

	return false;
}

let visibleSum = 0;

for (let y = 0; y < height; y++) {
	for (let x = 0; x < width; x++) {
		if (isVisible(x, y)) {
			visibleSum++;
		}
	}
}

console.log(visibleSum);

// part two

function getScenicScore(x: number, y: number) {
	// out of bounds
	if (x < 0 && y < 0 && x >= width && y >= height) return 0;

	let treeHeight = treeHeights[y][x];

	let viewDistances: number[] = [];

	for (const lookDir of lookDirs) {
		let queryX = x;
		let queryY = y;

		let steps = 1;
		let viewDistance = 0;

		while (
			queryX > 0 &&
			queryY > 0 &&
			queryX < width - 1 &&
			queryY < height - 1
		) {
			queryX = x + lookDir.x * steps;
			queryY = y + lookDir.y * steps;

			let queryHeight = treeHeights[queryY][queryX];

			// console.log("treeHeight", treeHeight);
			// console.log("query", queryX, queryY);
			// console.log("queryHeight", queryHeight);
			// console.log("");

			viewDistance++;

			// tree in the way
			if (queryHeight >= treeHeight) {
				break;
			}

			steps++;
		}

		// console.log("trees", viewDistance);
		// console.log("");

		viewDistances.push(viewDistance);
	}

	let scenicScore = viewDistances[0];
	for (let i = 1; i < viewDistances.length; i++) {
		scenicScore *= viewDistances[i];
	}

	return scenicScore;
}

let highestScenicScore = 0;

for (let y = 0; y < height; y++) {
	for (let x = 0; x < width; x++) {
		const scenicScore = getScenicScore(x, y);
		if (scenicScore > highestScenicScore) {
			highestScenicScore = scenicScore;
		}
	}
}

console.log(highestScenicScore);
