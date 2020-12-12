import { readFile } from "../utils.ts";

const processPass = (passStr: string) => {
	const pass = passStr.split("");

	let rowMin = 0;
	let rowMax = 128;
	let colMin = 0;
	let colMax = 8;

	for (const char of pass) {
		if (char == "F") rowMax = Math.floor((rowMax - rowMin) / 2) + rowMin;
		if (char == "B") rowMin = Math.floor((rowMax - rowMin) / 2) + rowMin;
		if (char == "L") colMax = Math.floor((colMax - colMin) / 2) + colMin;
		if (char == "R") colMin = Math.floor((colMax - colMin) / 2) + colMin;
	}

	const row = rowMin;
	const col = colMin;
	const seatId = row * 8 + col;

	return { row, col, seatId };
};

const passes = (await readFile(import.meta, "5.txt")).split("\n");

let lowestSeatId = 999999;
let highestSeatId = 0;
let allSeatIds: number[] = [];

for (const pass of passes) {
	const { seatId } = processPass(pass);
	allSeatIds.push(seatId);
	if (seatId < lowestSeatId) lowestSeatId = seatId;
	if (seatId > highestSeatId) highestSeatId = seatId;
}

console.log(highestSeatId);

for (let i = lowestSeatId; i < highestSeatId; i++) {
	if (!allSeatIds.includes(i)) console.log(i);
}
