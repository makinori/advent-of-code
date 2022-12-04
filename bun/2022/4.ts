import { readFile } from "../utils";

const pairsInput = await readFile(import.meta, "4.txt");

const pairs = pairsInput
	.trim()
	.split("\n")
	.map(pair =>
		pair
			.trim()
			.split(",")
			.map(range => {
				const [start, end] = range.split("-").map(n => Number(n));
				// return new Array(end - start + 1)
				// 	.fill(0)
				// 	.map((_, i) => i + start);
				return [start, end];
			})
	);

const rangeFullyInsideOf = (
	[aStart, aEnd]: number[],
	[bStart, bEnd]: number[]
) => aStart >= bStart && aEnd <= bEnd;

let fullyContainsTheOtherSum = 0;

for (const [a, b] of pairs) {
	if (rangeFullyInsideOf(a, b) || rangeFullyInsideOf(b, a)) {
		fullyContainsTheOtherSum++;
	}
}

console.log(fullyContainsTheOtherSum);

// part two

const rangePartiallyInsideOf = (
	[aStart, aEnd]: number[],
	[bStart, bEnd]: number[]
) => {
	// a --1234----
	// b ----3456--
	if (aStart < bStart && bStart <= aEnd && aEnd < bEnd) return true;
	// a ----3456--
	// b --1234----
	if (bStart < aStart && aStart <= bEnd && bEnd < aEnd) return true;
	// nope
	return false;
};

let containsTheOtherSum = 0;

for (const [a, b] of pairs) {
	if (
		rangeFullyInsideOf(a, b) ||
		rangeFullyInsideOf(b, a) ||
		rangePartiallyInsideOf(a, b) ||
		rangePartiallyInsideOf(b, a)
	) {
		containsTheOtherSum++;
	}
}

console.log(containsTheOtherSum);
