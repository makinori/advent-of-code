import { readFile } from "../utils";

const input = await readFile(import.meta, "5.txt");

// get stack indices

const stackIndicesMatches = input.match(/^(?:\s*[0-9]\s*)*$/gm);
if (stackIndicesMatches == null) throw new Error("Stack indices not found");

const stackIndices = stackIndicesMatches[0]
	.trim()
	.split(/\s+/)
	.map(n => Number(n));

// get starting crates

const startingCratesMatches = input.match(/(?:\s*?\[[A-Z]\]\s*?)+/g);
if (startingCratesMatches == null) throw new Error("Starting crates not found");

const startingCrates = startingCratesMatches[0]
	.split("\n")
	.map(line =>
		(line.match(/(?:\[[A-Z]\] ?)|(?:    ?)/g) ?? []).map(result =>
			result.trim().replace(/\[|\]/g, "")
		)
	);

// create stack dictionary with arrays and add our starting crates

const stack: { [key: number]: string[] } = {};

function resetStack() {
	for (const stackIndex of stackIndices) {
		stack[stackIndex] = [];
	}

	for (const crates of startingCrates) {
		for (let i = 0; i < crates.length; i++) {
			if (crates[i] == "") continue;
			stack[stackIndices[i]].unshift(crates[i]);
		}
	}
}

function getResult() {
	let result = "";

	for (const crates of Object.values(stack)) {
		result += crates[crates.length - 1];
	}

	return result;
}

// get instructions

const instuctions = Array.from(
	input.matchAll(/move ([0-9]+) from ([0-9]+) to ([0-9]+)/g)
).map(result => ({
	amount: Number(result[1]),
	from: Number(result[2]),
	to: Number(result[3])
}));

// part one

resetStack();

for (const { amount, from, to } of instuctions) {
	for (let i = 0; i < amount; i++) {
		const crate = stack[from].pop();
		if (crate == null) throw new Error("Failed to get crate");
		stack[to].push(crate);
	}
}

console.log(getResult());

// part two

resetStack();

for (const { amount, from, to } of instuctions) {
	const fromStackLength = stack[from].length;
	const crates = stack[from].splice(fromStackLength - amount);
	stack[to] = [...stack[to], ...crates];
}

console.log(getResult());
