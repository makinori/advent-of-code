import { readFile } from "../utils.ts";

const instructions = (await readFile(import.meta, "12.txt"))
	.split("\n")
	.map(instruction => ({
		code: instruction.slice(0, 1),
		amount: Number(instruction.slice(1))
	}));

{
	let x = 0;
	let y = 0;
	let dir = 90;

	const move = (addX: number, addY: number) => {
		x += addX;
		y += addY;
	};

	const rotate = (degrees: number) => {
		if (Math.abs(degrees % 90))
			throw new Error("Invalid rotation " + degrees);
		dir = (dir + degrees) % 360;
		while (dir < 0) {
			dir = 360 + dir;
		}
	};

	const moveForward = (amount: number) => {
		dir = dir % 360;
		if (![0, 90, 180, 270].includes(dir))
			throw new Error("Unknown direction " + dir);
		if (dir == 0) move(0, -amount);
		if (dir == 90) move(amount, 0);
		if (dir == 180) move(0, amount);
		if (dir == 270) move(-amount, 0);
	};

	for (let { code, amount } of instructions) {
		if (!["N", "E", "S", "W", "L", "R", "F"].includes(code))
			throw new Error("Unknown code " + code);

		if (code == "N") move(0, -amount);
		if (code == "E") move(amount, 0);
		if (code == "S") move(0, amount);
		if (code == "W") move(-amount, 0);
		if (code == "L") rotate(-amount);
		if (code == "R") rotate(amount);
		if (code == "F") moveForward(amount);
	}

	console.log(Math.abs(x) + Math.abs(y));
}

{
	let shipX = 0;
	let shipY = 0;
	let waypointX = 10;
	let waypointY = -1;

	const move = (addX: number, addY: number) => {
		waypointX += addX;
		waypointY += addY;
	};

	const rotate = (degrees: number) => {
		if (Math.abs(degrees % 90))
			throw new Error("Invalid rotation " + degrees);
		degrees = degrees % 360;
		while (degrees < 0) {
			degrees = 360 + degrees;
		}

		let x = waypointX;
		let y = waypointY;

		if (degrees == 90) {
			waypointX = 0 - y;
			waypointY = x;
		} else if (degrees == 180) {
			waypointX = 0 - x;
			waypointY = 0 - y;
		} else if ((degrees = 270)) {
			waypointX = y;
			waypointY = 0 - x;
		}
	};

	const moveForward = (amount: number) => {
		shipX += waypointX * amount;
		shipY += waypointY * amount;
	};

	for (let { code, amount } of instructions) {
		if (!["N", "E", "S", "W", "L", "R", "F"].includes(code))
			throw new Error("Unknown code " + code);

		if (code == "N") move(0, -amount);
		if (code == "E") move(amount, 0);
		if (code == "S") move(0, amount);
		if (code == "W") move(-amount, 0);
		if (code == "L") rotate(-amount);
		if (code == "R") rotate(amount);
		if (code == "F") moveForward(amount);
	}

	console.log(Math.abs(shipX) + Math.abs(shipY));
}
