import { relativeResolve } from "../utils.ts";

const expenses = Deno.readTextFileSync(relativeResolve(import.meta, "1.txt"))
	.split("\n")
	.map(n => Number(n));

const findTwo = () => {
	for (const a of expenses) {
		for (const b of expenses) {
			if (a + b == 2020) {
				return a * b;
			}
		}
	}
};

const findThree = () => {
	for (const a of expenses) {
		for (const b of expenses) {
			for (const c of expenses) {
				if (a + b + c == 2020) {
					return a * b * c;
				}
			}
		}
	}
};

console.log(findTwo());
console.log(findThree());
