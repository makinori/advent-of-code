import { readFile } from "../utils.ts";

const allNumbers = (await readFile(import.meta, "9.txt"))
	.split("\n")
	.map(n => Number(n));

const getSums = (numbers: number[]) => {
	const sums: number[] = [];
	for (let first = 0; first < numbers.length; first++) {
		for (let second = 0; second < numbers.length; second++) {
			if (first == second) continue;
			sums.push(numbers[first] + numbers[second]);
		}
	}
	return sums;
};

const processNumbers = (preamble: number) => {
	let index = preamble;
	let invalidNumber: number = -1;

	const step = () => {
		const preambleNumbers = allNumbers.slice(index - preamble, index);
		const preambleSums = getSums(preambleNumbers);
		if (!preambleSums.includes(allNumbers[index])) {
			if (invalidNumber > -1)
				throw new Error("Invalid number already found");
			invalidNumber = allNumbers[index];
		}
		index++;
		return index < allNumbers.length;
	};

	while (step());

	if (invalidNumber < 0) throw new Error("Invalid number not found");

	return invalidNumber;
};

const invalidNumber = processNumbers(25);
console.log(invalidNumber);

const getContiguousSet = () => {
	for (let start = 0; start < allNumbers.length; start++) {
		for (let end = start + 1; end < allNumbers.length; end++) {
			const contiguousSet = allNumbers.slice(start, end);
			const sum = contiguousSet.reduce((a, b) => a + b);
			if (sum == invalidNumber) {
				return contiguousSet;
			}
		}
	}
	throw new Error("Contiguous set not found for " + invalidNumber);
};

const contiguousSetSorted = getContiguousSet().sort((a, b) => a - b);
console.log(
	contiguousSetSorted[0] + contiguousSetSorted[contiguousSetSorted.length - 1]
);
