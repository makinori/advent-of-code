import fs from "fs";

const map = fs.readFileSync(__dirname + "/3.txt", "utf-8").split("\n");
const height = map.length;

const isTree = (x: number, y: number) => {
	if (y > height - 1) return false;
	const width = map[y].length;
	const result = map[y][x % width];
	return result == "#";
};

const countTrees = (xStep: number, yStep: number) => {
	let trees = 0;
	let x = 0;
	let y = 0;
	while (y < height) {
		x += xStep;
		y += yStep;
		if (isTree(x, y)) trees++;
	}
	console.log(xStep, yStep, trees);
	return trees;
};

countTrees(3, 1);
console.log("");

let totalTrees = [
	countTrees(1, 1),
	countTrees(3, 1),
	countTrees(5, 1),
	countTrees(7, 1),
	countTrees(1, 2)
];
console.log(totalTrees.reduce((a, b) => a * b));
