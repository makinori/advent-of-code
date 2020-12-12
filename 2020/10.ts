import { readFile } from "../utils.ts";

const adapters = (await readFile(import.meta, "10.txt"))
	.split("\n")
	.map(n => Number(n));

const getLowestAndHighest = (numbers: number[]) => {
	let lowest = Number.MAX_SAFE_INTEGER;
	let highest = -Number.MAX_SAFE_INTEGER;
	for (const n of numbers) {
		if (n < lowest) {
			lowest = n;
		} else if (n > highest) {
			highest = n;
		}
	}
	return { lowest, highest };
};

{
	const { lowest, highest } = getLowestAndHighest(adapters);

	let currentAdapter = 0;
	let differences = { [1]: 0, [2]: 0, [3]: 0 };

	const step = () => {
		if (currentAdapter == highest) {
			differences[3]++;
			return false;
		}
		const findAdapter = (difference: 1 | 2 | 3) => {
			if (adapters.includes(currentAdapter + difference)) {
				differences[difference]++;
				currentAdapter += difference;
				return true;
			}
			return false;
		};
		if (findAdapter(1) || findAdapter(2) || findAdapter(3)) return true;
		throw new Error("No adapter found for " + currentAdapter);
	};

	while (step());

	console.log(differences[1] * differences[3]);
}

{
	const { lowest, highest } = getLowestAndHighest(adapters);

	let totalCombinations = 0;

	const combinationCache: { [key: number]: number } = {};

	const findAdapterCombination = (
		currentAdapter: number,
		currentAdapterList: number[] = []
	) => {
		if (currentAdapter == highest) {
			totalCombinations++;
			return 1;
		} else if (currentAdapter > highest) {
			return 0;
		}

		const findAdapter = (difference: 1 | 2 | 3) => {
			let newCurrentAdapter = currentAdapter + difference;
			let newCurrentAdapterList = [
				newCurrentAdapter,
				...currentAdapterList
			];

			if (adapters.includes(newCurrentAdapter)) {
				return findAdapterCombination(
					newCurrentAdapter,
					newCurrentAdapterList
				);
			}

			return 0;
		};

		if (combinationCache[currentAdapter]) {
			// console.log("cache");
			totalCombinations += combinationCache[currentAdapter];
			return combinationCache[currentAdapter];
		} else {
			let combinations = 0;
			combinations += findAdapter(1) + findAdapter(2) + findAdapter(3);
			combinationCache[currentAdapter] = combinations;
			return combinations;
		}
	};

	findAdapterCombination(0);

	console.log(totalCombinations);
}
