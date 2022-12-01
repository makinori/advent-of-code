import { readFile } from "../utils.ts";

const instructions = (await readFile(import.meta, "14.txt"))
	.split("\n")
	.map(line => {
		if (line.startsWith("mask")) {
			return ["mask", (line.split("=").pop() || "").trim()];
		} else {
			const matches = line.match(/^mem\[([0-9]+)] = ([0-9]+)$/) || [];
			return ["mem", Number(matches[1]), Number(matches[2])];
		}
	});

const memory: { [address: number]: string } = {};
const emptyValue = "000000000000000000000000000000000000";

let currentMask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

const setMemory = (address: number, decimalValue: number) => {
	const value = decimalValue.toString(2).padStart(36, "0");
	const newMemoryValue = [];

	for (let i = 0; i < 36; i++) {
		const mask = currentMask[i];
		const result = mask != "X" ? mask : value[i];
		newMemoryValue.push(result);
	}

	memory[address] = newMemoryValue.join("");
};

for (const [op, a, b] of instructions) {
	if (op == "mask") {
		currentMask = a as string;
	} else if (op == "mem") {
		setMemory(a as number, b as number);
	}
}

console.log(
	Object.values(memory)
		.map(value => parseInt(value, 2))
		.reduce((a, b) => a + b)
);
