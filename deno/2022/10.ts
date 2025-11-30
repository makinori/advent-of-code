import { readFile } from "../utils.ts";

const input = await readFile(import.meta, "10.txt");

const program = input
	.trim()
	.split("\n")
	.map(line => line.trim().split(" "));

let pointer = 0;
let cycle = 1;
let running = true;

let regX = 1;
let regXQueue: number | null = null;

let sum = 0;

let display = "#";

const nextCycleAndDraw = () => {
	cycle++;

	// get signal strength
	if ((cycle - 20) % 40 == 0) {
		sum += cycle * regX;
	}

	// draw pixel

	const pixelX = (cycle - 1) % 40;
	if (pixelX == 0 && cycle - 1 < 240) {
		display += "\n";
	}

	let pixel = "";
	if (regX == pixelX - 1 || regX == pixelX || regX == pixelX + 1) {
		pixel = "#";
	} else {
		pixel = ".";
	}
	display += pixel;

	// console.log("cycle", cycle, "regX", regX, "pixelX", pixelX, "pixel", pixel);
};

const runCycle = () => {
	if (regXQueue != null) {
		regX += regXQueue;
		regXQueue = null;
		nextCycleAndDraw();
		return;
	}

	let line = program[pointer++];
	if (line == null) {
		running = false;
		return;
	}

	if (line[0] == "addx") {
		regXQueue = Number(line[1]);
	} else if (line[0] == "noop") {
		// do nothing
	} else {
		throw new Error("Unknown instruction: " + line[0]);
	}

	nextCycleAndDraw();
};

while (running) {
	runCycle();
}

console.log(sum);
console.log(display);
