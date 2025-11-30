import { readFile } from "../utils.ts";

interface Vec2 {
	x: number;
	y: number;
}

enum Dir {
	Up = "U",
	Right = "R",
	Down = "D",
	Left = "L"
}

const dirMap: { [key: string]: Vec2 } = {
	[Dir.Up]: { x: 0, y: -1 },
	[Dir.Right]: { x: 1, y: 0 },
	[Dir.Down]: { x: 0, y: 1 },
	[Dir.Left]: { x: -1, y: 0 }
};

function printMultiple(
	head: Vec2,
	tails: Vec2[],
	positionsBeenIn: Vec2[] = []
) {
	let minX = head.x;
	let minY = head.y;
	for (const tail of tails) {
		minX = Math.min(minX, tail.x);
		minY = Math.min(minY, tail.y);
	}
	for (const positionBeenIn of positionsBeenIn) {
		minX = Math.min(minX, positionBeenIn.x);
		minY = Math.min(minY, positionBeenIn.y);
	}
	minX--;
	minY--;

	let width = head.x;
	let height = head.y;
	for (const tail of tails) {
		width = Math.max(width, tail.x);
		height = Math.max(height, tail.y);
	}
	for (const positionBeenIn of positionsBeenIn) {
		width = Math.max(width, positionBeenIn.x);
		height = Math.max(height, positionBeenIn.y);
	}
	width += 2;
	height += 2;

	for (let y = minY; y < height; y++) {
		let line = "";
		for (let x = minX; x < width; x++) {
			if (head.x == x && head.y == y) {
				line += "H ";
			} else {
				let alreadyDrawn = false;

				for (let i = 0; i < tails.length; i++) {
					if (tails[i].x == x && tails[i].y == y) {
						line += (tails.length == 1 ? "T" : i + 1) + " ";
						alreadyDrawn = true;
						break;
					}
				}

				if (alreadyDrawn) continue;

				for (const positionBeenIn of positionsBeenIn) {
					if (positionBeenIn.x == x && positionBeenIn.y == y) {
						line += "# ";
						alreadyDrawn = true;
						break;
					}
				}

				if (alreadyDrawn) continue;

				line += ". ";
			}
		}
		console.log(line);
	}
}

// key: head to tail offset
// value: tail transformation
// also 0,0 starts at the top left (screw you directx)
const lookupTable = {
	// -- horizontal
	// T.H => .TH
	"-2,0": "1,0",
	// H.T => HT.,
	"2,0": "-1,0",
	//
	// -- vertical
	// T    .
	// . => T
	// H    H
	"0,-2": "0,1",
	// H    H
	// . => T
	// T    .
	"0,2": "0,-1",
	//
	// -- diagonal up
	// . H    . H
	// . . => . T
	// T .    . .
	"-1,2": "1,-1",
	// H .    H .
	// . . => T .
	// . T    . .
	"1,2": "-1,-1",
	//
	// -- diagonal down
	// . T    . .
	// . . => T .
	// H .    H .
	"1,-2": "-1,1",
	// T .    . .
	// . . => . T
	// . H    . H
	"-1,-2": "1,1",
	//
	// -- diagonal left
	// . . T    . . .
	// H . . => H T .
	"2,-1": "-1,1",
	// H . .    H T .
	// . . T => . . .
	"2,1": "-1,-1",
	//
	// -- diagonal right
	// T . .    . . .
	// . . H => . T H
	"-2,-1": "1,1",
	// . . H    . T H
	// T . . => . . .
	"-2,1": "1,-1",
	//
	// -- literal diagonals
	// . . H    . . H
	// . . . => . T .
	// T . .    . . .
	"-2,2": "1,-1",
	// H . .    H . .
	// . . . => . T .
	// . . T    . . .
	"2,2": "-1,-1",
	// . . T    . . .
	// . . . => . T .
	// H . .    H . .
	"2,-2": "-1,1",
	// T . .    . . .
	// . . . => . T .
	// . . H    . . H
	"-2,-2": "1,1"
};

function getNewTail(head: Vec2, tail: Vec2) {
	const input: Vec2 = { x: tail.x - head.x, y: tail.y - head.y };

	const lookupOutput = lookupTable[input.x + "," + input.y];
	if (lookupOutput == null) throw new Error("Confused what to do");

	const lookup = lookupOutput.split(",").map(n => Number(n));
	return { x: tail.x + lookup[0], y: tail.y + lookup[1] };
}

const tests = [
	// horizontal
	// { head: { x: 3, y: 1 }, tail: { x: 1, y: 1 } },
	// { head: { x: 1, y: 1 }, tail: { x: 3, y: 1 } },
	// vertical
	// { head: { x: 1, y: 3 }, tail: { x: 1, y: 1 } },
	// { head: { x: 1, y: 1 }, tail: { x: 1, y: 3 } },
	// diagonal up
	// { head: { x: 2, y: 1 }, tail: { x: 1, y: 3 } },
	// { head: { x: 1, y: 1 }, tail: { x: 2, y: 3 } },
	// diagonal down
	// { head: { x: 1, y: 3 }, tail: { x: 2, y: 1 } },
	// { head: { x: 2, y: 3 }, tail: { x: 1, y: 1 } },
	// diagonal left
	// { head: { x: 1, y: 2 }, tail: { x: 3, y: 1 } },
	// { head: { x: 1, y: 1 }, tail: { x: 3, y: 2 } },
	// diagonal right
	// { head: { x: 3, y: 2 }, tail: { x: 1, y: 1 } },
	// { head: { x: 3, y: 1 }, tail: { x: 1, y: 2 } }
	// negative space
	// { head: { x: 3 - 123, y: 1 - 123 }, tail: { x: 1 - 123, y: 2 - 123 } }
	// literal diagonals
	// { head: { x: 2, y: 0 }, tail: { x: 0, y: 2 } },
	// { head: { x: 0, y: 0 }, tail: { x: 2, y: 2 } },
	// { head: { x: 0, y: 2 }, tail: { x: 2, y: 0 } },
	// { head: { x: 2, y: 2 }, tail: { x: 0, y: 0 } }
];

for (const { head, tail } of tests) {
	console.log("input:");
	printMultiple(head, [tail], []);
	console.log("output:");
	printMultiple(head, [getNewTail(head, tail)], []);
	console.log("");
}

const instructionsStr = await readFile(import.meta, "9.txt");

const instructions = instructionsStr
	.trim()
	.split("\n")
	.map(inst => {
		const [dirStr, amount] = inst.split(" ");
		return { dir: dirStr, amount: Number(amount) };
	});

let positionsTailsHaveBeenIn: { [key: string]: Vec2 };

function addTailPos(pos: Vec2) {
	const posStr = pos.x + "," + pos.y;
	if (positionsTailsHaveBeenIn[posStr] == null) {
		positionsTailsHaveBeenIn[posStr] = pos;
	}
}

{
	let head: Vec2 = { x: 0, y: 0 };
	let tail: Vec2 = { x: 0, y: 0 };

	positionsTailsHaveBeenIn = {
		"0,0": { x: 0, y: 0 }
	};

	// printMultiple(head, [tail], Object.values(positionsTailHasBeenIn));
	// console.log("");

	for (const instruction of instructions) {
		// console.log(instruction);

		for (let step = 0; step < instruction.amount; step++) {
			const dir = dirMap[instruction.dir];
			head = { x: head.x + dir.x, y: head.y + dir.y };

			// console.log("head moved");
			// printMultiple(head, [tail], Object.values(positionsTailHasBeenIn));
			// console.log("");

			try {
				tail = getNewTail(head, tail);
				addTailPos(tail);

				// console.log("tail moved");
				// printMultiple(
				// 	head,
				// 	[tail],
				// 	Object.values(positionsTailHasBeenIn)
				// );
				// console.log("");
			} catch (error) {
				// console.log("failed to move tail, but its ok\n");
			}
		}
	}

	addTailPos(head);

	// printMultiple(head, [tail], Object.values(positionsTailHasBeenIn));

	// console.log(Object.values(positionsTailHasBeenIn).length);
	// should be correct but its -1 lmao
	console.log(Object.values(positionsTailsHaveBeenIn).length - 1);
}

// part two huh

{
	let head: Vec2 = { x: 0, y: 0 };
	let tails: Vec2[] = new Array(9).fill(null).map(() => ({ x: 0, y: 0 }));

	positionsTailsHaveBeenIn = {
		"0,0": { x: 0, y: 0 }
	};

	for (const instruction of instructions) {
		// console.log(instruction);

		for (let step = 0; step < instruction.amount; step++) {
			const dir = dirMap[instruction.dir];
			head = { x: head.x + dir.x, y: head.y + dir.y };

			// console.log("head moved");
			// printMultiple(head, tails, []);
			// console.log("");

			try {
				tails[0] = getNewTail(head, tails[0]);

				// console.log("tail0 moved");
				// printMultiple(head, tails, []);
				// console.log("");
			} catch (error) {}

			for (let i = 1; i < tails.length; i++) {
				try {
					tails[i] = getNewTail(tails[i - 1], tails[i]);

					// console.log("tail" + i + " moved");
					// printMultiple(head, tails, []);
					// console.log("");
				} catch (error) {}
			}

			addTailPos(tails[tails.length - 1]);
		}
	}

	addTailPos(head);

	// printMultiple(head, tails, Object.values(positionsTailsHaveBeenIn));

	// console.log(Object.values(positionsTailHasBeenIn).length);
	// should be correct but its -1 lmao
	console.log(Object.values(positionsTailsHaveBeenIn).length - 1);
}
