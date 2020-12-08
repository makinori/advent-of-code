import fs from "fs";

type Program = { op: string; n: number }[];

const program: Program = fs
	.readFileSync(__dirname + "/8.txt", "utf-8")
	.split("\n")
	.map(line => {
		const split = line.split(" ");
		return { op: split[0], n: Number(split[1]) };
	});

const run = (program: Program) => {
	let pointer = 0;
	let accumulator = 0;
	let finishSignal: "repeating" | "finished";

	const pointersDone: number[] = [];

	const step = () => {
		if (pointersDone.includes(pointer)) {
			finishSignal = "repeating";
			return false;
		}
		if (pointer >= program.length) {
			finishSignal = "finished";
			return false;
		}

		const line = program[pointer];
		if (line == null) throw new Error(`Invalid pointer ${pointer}`);

		let jumpAmount = 1;

		switch (line.op) {
			case "nop":
				break;
			case "jmp":
				jumpAmount = line.n;
				break;
			case "acc":
				accumulator += line.n;
				break;
			default:
				throw new Error(`Invalid operation ${line.op}`);
		}

		pointersDone.push(pointer);
		pointer += jumpAmount;

		// console.log(pointer, accumulator);

		return true;
	};

	while (step()) {}

	return { accumulator, finishSignal };
};

console.log(run(program));

// const createAllCombinations = () => {
// 	const combinations: Program[] = [];

// 	const processPointer = (pointer: number, combination: Program = []) => {
// 		const line = program[pointer];

// 		if (pointer >= program.length) {
// 			combinations.push(combination);
// 			return;
// 		}

// 		let mayBeAffected = line.op == "nop" || line.op == "jmp";

// 		// avoid infinite program
// 		if (line.op == "nop" && line.n == 0) mayBeAffected = false;

// 		if (mayBeAffected) {
// 			const nopCombination = [...combination, { op: "nop", n: line.n }];
// 			processPointer(pointer + 1, nopCombination);

// 			const jmpCombination = [...combination, { op: "jmp", n: line.n }];
// 			processPointer(pointer + 1, jmpCombination);
// 		} else {
// 			const newCombination = [...combination, line];
// 			processPointer(pointer + 1, newCombination);
// 		}
// 	};

// 	processPointer(0);

// 	return combinations;
// };

// for (const testProgram of createAllCombinations()) {
// 	const result = run(testProgram);
// 	if (result.finishSignal == "repeating") continue;

// 	console.log(testProgram);
// 	console.log(result);

// 	// if (result.finishSignal == "finished") {
// 	// 	console.log(result);
// 	// 	process.exit();
// 	// }
// }

for (let pointer = 0; pointer < program.length; pointer++) {
	const line = program[pointer];

	if ((line.op == "nop" && line.n != 0) || line.op == "jmp") {
		const newProgram: Program = JSON.parse(JSON.stringify(program));
		newProgram[pointer].op = line.op == "nop" ? "jmp" : "nop";

		const result = run(newProgram);
		if (result.finishSignal == "finished") {
			console.log(result);
			break;
		}
	}
}
