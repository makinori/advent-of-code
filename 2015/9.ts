import { relativeResolve } from "../utils.ts";

const allRoutes = Deno.readTextFileSync(relativeResolve(import.meta, "9.txt"))
	.split("\n")
	.map(route => {
		const matches = route.match(/^([^]+) to ([^]+) = ([0-9]+)$/);
		if (matches == null) throw new Error("Invalid regex");
		return {
			from: matches[1],
			to: matches[2],
			distance: Number(matches[3])
		};
	});

const getDistance = (a: string, b: string) => {
	for (const route of allRoutes) {
		if (
			(route.from == a && route.to == b) ||
			(route.from == b && route.to == a)
		) {
			return route.distance;
		}
	}
	return null;
};

const getAllNames = () => {
	const names: { [key: string]: boolean } = {};
	for (const route of allRoutes) {
		names[route.from] = true;
		names[route.to] = true;
	}
	return Object.keys(names);
};

const allNames = getAllNames();

const filteredArray = (array: string[], filter: string[]) => {
	const filtered = [];
	for (const item of array) {
		if (!filter.includes(item)) filtered.push(item);
	}
	return filtered;
};

const findAllCombinations = (allItems: string[]) => {
	const combinations: string[][] = [];
	const iterate = (items: string[], combination: string[] = []) => {
		for (const item of items) {
			const newCombination = [...combination, item];
			if (newCombination.length == allItems.length) {
				combinations.push(newCombination);
			} else {
				iterate(filteredArray(items, newCombination), newCombination);
			}
		}
	};
	iterate(allItems);
	return combinations;
};

const allPaths = findAllCombinations(allNames)
	.map(path => {
		let distance = 0;
		let currentlyAt = path[0];
		for (let i = 1; i < path.length; i++) {
			distance += getDistance(currentlyAt, path[i]) ?? 0;
			currentlyAt = path[i];
		}
		return { path, distance };
	})
	.sort((a, b) => a.distance - b.distance);

console.log(allPaths[0]);
console.log(allPaths[allPaths.length - 1]);
