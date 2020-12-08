import { relativeResolve } from "../utils.ts";

const groups = Deno.readTextFileSync(relativeResolve(import.meta, "6.txt"))
	.split(/\n\n/g)
	.map(group => group.split(/\n/g));

const makeLetterMap = (a: string) => {
	const map: { [key: string]: boolean } = {};
	for (const char of a.split("")) {
		if (/[a-z]/.test(char)) map[char] = true;
	}
	return map;
};

console.log(
	groups
		.map(group => {
			let letterMap = {};
			for (const person of group) {
				letterMap = { ...letterMap, ...makeLetterMap(person) };
			}
			return Object.keys(letterMap).length;
		})
		.reduce((a, b) => a + b)
);

const andArray = (a: string[], b: string[]) => {
	const common: string[] = [];
	for (const char of [...a, ...b]) {
		if (a.includes(char) && b.includes(char) && !common.includes(char)) {
			common.push(char);
		}
	}
	return common;
};

console.log(
	groups
		.map(group => {
			let initial = false;
			let letters: string[] = [];
			for (const person of group) {
				const personLetters = Object.keys(makeLetterMap(person));
				if (initial == false) {
					initial = true;
					letters = personLetters;
				} else {
					// and
					letters = andArray(letters, personLetters);
				}
			}
			return letters.length;
		})
		.reduce((a, b) => a + b)
);
