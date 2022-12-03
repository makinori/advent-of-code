import { readFile } from "../utils";

const rucksackInput = await readFile(import.meta, "3.txt");

const rucksacks: [string, string][] = rucksackInput
	.trim()
	.split("\n")
	// doesnt check if its not even
	.map((rucksack: string) => [
		rucksack.slice(0, rucksack.length / 2),
		rucksack.slice(rucksack.length / 2, rucksack.length)
	]);

function priorityValue(item: string) {
	// a-z 1-26, A-Z 27-52
	if (/[a-z]/.test(item)) {
		return item.charCodeAt(0) - 96;
	} else if (/[A-Z]/.test(item)) {
		return item.charCodeAt(0) - 64 + 26;
	}
	return 0;
}

let partOneSum = 0;

for (const [a, b] of rucksacks) {
	let common: string[] = [];
	for (const item of a) {
		if (b.includes(item) && !common.includes(item)) {
			common.push(item);
		}
	}

	if (common.length > 1) {
		throw new Error("More than one in common");
	}

	// console.log(common[0], priorityValue(common[0]));
	partOneSum += priorityValue(common[0]);
}

console.log(partOneSum);

// part two

let partTwoSum = 0;

for (let i = 0; i < rucksacks.length; i += 3) {
	const [a, b, c] = rucksacks.slice(i, i + 3).map(both => both[0] + both[1]);

	let common: string[] = [];

	for (const item of a) {
		if (b.includes(item) && c.includes(item) && !common.includes(item)) {
			common.push(item);
		}
	}

	if (common.length > 1) {
		throw new Error("More than one in common");
	}

	// console.log(common[0], priorityValue(common[0]));
	partTwoSum += priorityValue(common[0]);
}

console.log(partTwoSum);
