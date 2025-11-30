import { readFile } from "../utils.ts";

enum Hand {
	// scores
	Rock = 1,
	Paper = 2,
	Scissors = 3
}

enum Outcome {
	Lose,
	Draw,
	Win
}

const charToHand = {
	A: Hand.Rock,
	B: Hand.Paper,
	C: Hand.Scissors,
	X: Hand.Rock,
	Y: Hand.Paper,
	Z: Hand.Scissors
};

const charToOutcome = {
	X: Outcome.Lose,
	Y: Outcome.Draw,
	Z: Outcome.Win
};

const handWinMap = {
	[Hand.Rock]: Hand.Scissors,
	[Hand.Scissors]: Hand.Paper,
	[Hand.Paper]: Hand.Rock
};

const handLoseMap = {
	[Hand.Scissors]: Hand.Rock,
	[Hand.Paper]: Hand.Scissors,
	[Hand.Rock]: Hand.Paper
};

const strategyGuideInput = await readFile(import.meta, "2.txt");

const strategyGuide = strategyGuideInput
	.trim()
	.split("\n")
	.map((round: string) => {
		const data = round.trim().split(" ");
		return [charToHand[data[0]], data[1]];
	});

let partOneSum = 0;

for (const roundStrategy of strategyGuide) {
	const opponentHand = roundStrategy[0];
	const myHand = charToHand[roundStrategy[1]];

	let score = 0;
	if (handWinMap[myHand] == opponentHand) {
		// win
		score = myHand + 6;
	} else if (myHand == opponentHand) {
		// draw
		score = myHand + 3;
	} else {
		// lose
		score = myHand;
	}

	partOneSum += score;
}

console.log(partOneSum);

// part 2

let partTwoSum = 0;

for (const roundStrategy of strategyGuide) {
	const opponentHand = roundStrategy[0];
	const myOutcome = charToOutcome[roundStrategy[1]];

	let score = 0;
	if (myOutcome == Outcome.Lose) {
		// i need to lose
		const myHand = handWinMap[opponentHand];
		score = myHand;
	} else if (myOutcome == Outcome.Draw) {
		// i need to draw
		const myHand = opponentHand;
		score = myHand + 3;
	} else if (myOutcome == Outcome.Win) {
		// i need to win
		const myHand = handLoseMap[opponentHand];
		score = myHand + 6;
	}

	partTwoSum += score;
}

console.log(partTwoSum);
