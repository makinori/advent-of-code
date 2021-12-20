import { readFile } from "../utils.ts";

// const dataString = `00100
// 11110
// 10110
// 10111
// 10101
// 01111
// 00111
// 11100
// 10000
// 11001
// 00010
// 01010`;

const dataString = await readFile(import.meta, "3.txt");

const data = dataString.trim().split("\n");

{
	let length = data[0].length;

	let gammaRateStr = "";

	for (let x = 0; x < length; x++) {
		let zeros = 0;
		let ones = 0;
		for (const number of data) {
			if (number[x] == "0") {
				zeros++;
			} else if (number[x] == "1") {
				ones++;
			} else {
				console.log(x, "at", number, "wtf");
				Deno.exit(1);
			}
		}

		let common = "";
		if (zeros > ones) {
			common = "0";
		} else if (ones > zeros) {
			common = "1";
		} else {
			console.log("zeros and ones are equal, what to do");
			Deno.exit(1);
		}
		gammaRateStr += common;
	}

	const epsilonRateStr = gammaRateStr
		.split("")
		.map(n => (n == "0" ? "1" : "0"))
		.join("");

	const gammaRate = Number.parseInt(gammaRateStr, 2);
	const epsilonRate = Number.parseInt(epsilonRateStr, 2);

	console.log(gammaRate * epsilonRate);
}

{
	let length = data[0].length;

	function processData(workingData: string[], flipComparison: boolean) {
		for (let x = 0; x < length; x++) {
			if (workingData.length == 1) break;

			let zeros = 0;
			let ones = 0;
			for (const number of workingData) {
				if (number[x] == "0") {
					zeros++;
				} else if (number[x] == "1") {
					ones++;
				} else {
					console.log(x, "at", number, "wtf");
					Deno.exit(1);
				}
			}

			let common = "";
			if (zeros > ones) {
				common = flipComparison ? "1" : "0";
			} else if (ones > zeros) {
				common = flipComparison ? "0" : "1";
			} else {
				// console.log("zeros and ones are equal, what to do");
				// Deno.exit(1);
				// goes to one (or flipped) in this case
				common = flipComparison ? "0" : "1";
			}

			// console.log(common);
			// console.log(workingData.length);
			workingData = workingData.filter(number => number[x] == common);
			// console.log(workingData.length);
			// console.log();
		}

		return workingData;
	}

	let oxygenGeneratorData = processData(data, false);
	if (oxygenGeneratorData.length != 1) {
		console.log(oxygenGeneratorData, "oxygenGeneratorData wrong");
		Deno.exit(1);
	}
	let co2ScrubberData = processData(data, true);
	if (co2ScrubberData.length != 1) {
		console.log(co2ScrubberData, "co2ScrubberData wrong");
		Deno.exit(1);
	}

	console.log(
		parseInt(oxygenGeneratorData[0], 2) * parseInt(co2ScrubberData[0], 2)
	);
}
