import { readFile } from "../utils";

function isUnique(phrase: string) {
	let chars: string[] = [];
	for (const char of phrase.split("")) {
		if (chars.includes(char)) return false;
		chars.push(char);
	}
	return true;
}

function charsBeforeMarker(packet: string, length = 4) {
	for (let i = 0; i < packet.length - length - 1; i++) {
		const potentialMarker = packet.slice(i, i + length);
		if (isUnique(potentialMarker)) {
			return i + length;
		}
	}
	return -1;
}

const input = await readFile(import.meta, "6.txt");

console.log(charsBeforeMarker(input, 4));
console.log(charsBeforeMarker(input, 14));
