import fs from "fs";

const program = fs
	.readFileSync(__dirname + "/2.txt", "utf8")
	.split(",")
	.map(n => Number(n));

program[1] = 12;
program[2] = 2;

let pos = 0;
let op: number;

while ((op = program[pos]) != 99) {
	if (op == 1 || op == 2) {
		const aPos = program[pos + 1];
		const bPos = program[pos + 2];
		const cPos = program[pos + 3];
		program[cPos] =
			op == 1
				? program[aPos] + program[bPos]
				: program[aPos] * program[bPos];
		pos += 4;
	} else {
		console.log("Invalid op", op);
	}
}

console.log(program);
