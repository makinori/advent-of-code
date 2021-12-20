import { readFile } from "../utils.ts";

// const dataString = `forward 5
// down 5
// forward 8
// up 3
// down 8
// forward 2`;

const dataString = await readFile(import.meta, "2.txt");

const data = dataString.trim().split("\n");

{
	let x = 0;
	let y = 0;

	for (const lineString of data) {
		const line = lineString.split(" ");
		const dir = line[0];
		const amount = Number(line[1]);

		if (dir == "forward") {
			x += amount;
		} else if (dir == "down") {
			y += amount;
		} else if (dir == "up") {
			y -= amount;
		} else {
			console.log("wtf is", dir);
			Deno.exit(1);
		}
	}

	console.log(x * y);
}

{
	let x = 0;
	let y = 0;
	let aim = 0;

	for (const lineString of data) {
		const line = lineString.split(" ");
		const op = line[0];
		const amount = Number(line[1]);

		if (op == "down") {
			aim += amount;
		} else if (op == "up") {
			aim -= amount;
		} else if (op == "forward") {
			x += amount;
			y += aim * amount;
		} else {
			console.log("wtf is", op);
			Deno.exit(1);
		}
	}

	console.log(x * y);
}
