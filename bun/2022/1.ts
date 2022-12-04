import { readFile } from "../utils";

const textInput = await readFile(import.meta, "1.txt");

const allElfCalories: number[][] = textInput
	.trim()
	.split("\n\n")
	.map(elfTextInput =>
		elfTextInput
			.trim()
			.split("\n")
			.map(n => Number(n))
	);

let highest = 0;

for (const elfCalories of allElfCalories) {
	const sum = elfCalories.reduce((a, b) => a + b);
	if (sum > highest) {
		highest = sum;
	}
}

console.log(highest);

// part 2

console.log(
	allElfCalories
		.map(elfCalories => elfCalories.reduce((a, b) => a + b))
		.sort((a, b) => b - a)
		.slice(0, 3)
		.reduce((a, b) => a + b)
);
