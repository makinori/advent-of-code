import { relativeResolve } from "../utils.ts";

const bagsData = Deno.readTextFileSync(relativeResolve(import.meta, "7.txt"))
	.split("\n")
	.map(bagStr => {
		const [color, list] = bagStr.split(" bags contain ");
		return {
			color: color.trim(),
			bags: list
				.replace(/\.$/, "")
				.split(", ")
				.filter(bagStr => bagStr != "no other bags")
				.map(bagStr => {
					bagStr = bagStr.replace(/bags?/i, "").trim();
					const amount = Number((bagStr.match(/([0-9]) /) ?? [0])[1]);
					const color = bagStr.replace(/[0-9] /, "").trim();
					return { color, amount };
				})
		};
	});

const getBagOfColor = (color: string) => {
	for (const bag of bagsData) {
		if (color == bag.color) return bag;
	}
	return null;
};

interface Bag {
	color: string;
	amount: number;
	bags?: Bag[];
}

{
	const combinations: Bag[][] = [];

	const processColor = (color: string, combination: Bag[] = []) => {
		const bag = getBagOfColor(color);
		if (bag == null) return;

		if (combination.length == 0)
			combination.push({ color: bag.color, amount: 1 });

		for (const subBag of bag.bags) {
			const newCombination = [...combination, subBag];
			processColor(subBag.color, newCombination);
			combinations.push(newCombination);
		}
	};

	for (const bag of bagsData) {
		processColor(bag.color);
	}

	const bagsThatCanHoldShinyGold: string[] = [];

	for (const combination of combinations) {
		if (combination[combination.length - 1].color != "shiny gold") continue;
		for (const bag of combination) {
			if (bag.color == "shiny gold") continue;
			if (bagsThatCanHoldShinyGold.includes(bag.color)) continue;
			bagsThatCanHoldShinyGold.push(bag.color);
		}
	}

	// console.log(bagsThatCanHoldShinyGold);
	console.log(bagsThatCanHoldShinyGold.length);
}

{
	let totalBags = 0;

	const processBag = (bag: Bag) => {
		const bagData = getBagOfColor(bag.color);
		if (bagData == null) throw new Error(bag.color + " not found");
		bag.bags = [];
		for (let i = 0; i < bag.amount; i++) {
			bag.bags = [...bag.bags, ...bagData.bags];
			totalBags++;
		}
		bag.bags = bag.bags.map(bag => processBag(bag));
		return bag;
	};

	processBag({ color: "shiny gold", amount: 1 });

	console.log(totalBags - 1);
}
