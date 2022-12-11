import { readFile } from "../utils";

const input = await readFile(import.meta, "11.txt");

type Operation = [string, string];

interface Monkey {
	index: number;
	items: number[];
	operation: Operation;
	testDivBy: number;
	testTrueThrowTo: number;
	testFalseThrowTo: number;
}

// thank you phos, you saved my day
let commonDivisor = 1;

let monkeys = Array.from(
	input.trim().matchAll(/Monkey [0-9]+:[^]+?(?:\n\n|$)/g)
)
	.map(paragraphMatches =>
		paragraphMatches[0]
			.trim()
			.split("\n")
			.map(line => line.trim())
	)
	.map(factStrings => {
		let monkey: Monkey = {
			index: -1,
			items: [],
			operation: ["", ""],
			testDivBy: -1,
			testTrueThrowTo: -1,
			testFalseThrowTo: -1
		};

		for (const factString of factStrings) {
			const firstWord = factString
				.split(/[0-9]|:/g)[0]
				.toLowerCase()
				.trim();

			switch (firstWord) {
				case "monkey":
					monkey.index = Number(
						factString.replace("Monkey ", "").replace(":", "")
					);
					break;
				case "starting items":
					monkey.items = factString
						.replace("Starting items: ", "")
						.split(/, ?/g)
						.map(n => Number(n));
					break;
				case "operation":
					const [op, n] = factString
						.replace("Operation: new = old ", "")
						.split(" ");
					monkey.operation = [op, n];
					break;
				case "test":
					monkey.testDivBy = Number(
						factString.replace("Test: divisible by ", "")
					);
					commonDivisor *= monkey.testDivBy;
					break;
				case "if true":
					monkey.testTrueThrowTo = Number(
						factString.replace("If true: throw to monkey ", "")
					);
					break;
				case "if false":
					monkey.testFalseThrowTo = Number(
						factString.replace("If false: throw to monkey ", "")
					);
					break;
			}
		}
		return monkey;
	})
	.sort((a, b) => a.index - b.index);

const monkeysJsonBackup = JSON.stringify(monkeys);

const getMonkey = (index: number) =>
	monkeys.find(monkey => monkey.index == index);

const doOperation = (a: number, [op, inputB]: Operation) => {
	const b = inputB == "old" ? a : Number(inputB);

	switch (op) {
		case "+":
			return a + b;
		case "*":
			return a * b;
		default:
			throw new Error("Unknown operation:" + op);
	}
};

const isDivisible = (a: number, b: number) => a % b == 0;

let timesInspected: { [monkeyIndex: number]: number } = {};

function doRound(worryMyself: boolean) {
	for (const monkey of monkeys) {
		let itemLength = monkey.items.length;

		for (let item of monkey.items) {
			let monkeyThrowToIndex = -1;

			// inspects item
			item = doOperation(item, monkey.operation);

			// gets bored so i worry myself
			if (worryMyself) {
				item = Math.floor(item / 3);
			}

			// run test to find monkey to throw to
			monkeyThrowToIndex = isDivisible(item, monkey.testDivBy)
				? monkey.testTrueThrowTo
				: monkey.testFalseThrowTo;

			const monkeyThrowTo = getMonkey(monkeyThrowToIndex);
			if (monkeyThrowTo == null)
				throw new Error("No monkey " + monkeyThrowToIndex);

			// optimize item
			item = item % commonDivisor;

			monkeyThrowTo.items.push(item);

			// increment inspected

			if (timesInspected[monkey.index] == null) {
				timesInspected[monkey.index] = 0;
			}
			timesInspected[monkey.index]++;
		}

		// remove items since we've thrown them
		monkey.items.splice(0, itemLength);
	}
}

{
	for (let i = 0; i < 20; i++) {
		doRound(true);
	}

	const monkeyBusinessValues = Object.values(timesInspected)
		.sort((a, b) => b - a)
		.slice(0, 2);

	console.log(monkeyBusinessValues[0] * monkeyBusinessValues[1]);
}

// part two

{
	// reset first
	monkeys = JSON.parse(monkeysJsonBackup);
	timesInspected = {};

	for (let i = 0; i < 10000; i++) {
		doRound(false);
	}

	const monkeyBusinessValues = Object.values(timesInspected)
		.sort((a, b) => b - a)
		.slice(0, 2);

	console.log(monkeyBusinessValues[0] * monkeyBusinessValues[1]);
}
