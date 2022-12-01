import { readFile } from "../utils.ts";

let data = (await readFile(import.meta, "13.txt")).split("\n");

const earliestTime = Number(data[0]);
const busIds = data[1].split(",").map(time => Number(time));

{
	const busTimes: { [time: number]: number[] } = {};

	for (const busId of busIds) {
		if (Number.isNaN(busId)) continue;

		let time = busId;
		while (time < earliestTime) {
			time += busId;
			if (busTimes[time] == null) {
				busTimes[time] = [busId];
			} else {
				busTimes[time].push(busId);
			}
		}
	}

	let queryBusTime = earliestTime;

	while (busTimes[queryBusTime] == null) {
		queryBusTime++;
	}

	const earliestBusId = busTimes[queryBusTime][0];

	console.log((queryBusTime - earliestTime) * earliestBusId);
}

// {
// 	const getBusIndicies = (queryTime: number) => {
// 		let foundBusIds: number[] = [];

// 		// for (const busId of busIds) {
// 		for (let i = 0; i < busIds.length; i++) {
// 			const busId = busIds[i];
// 			if (Number.isNaN(busId)) continue;
// 			if (queryTime % busId == 0) {
// 				foundBusIds.push(i);
// 			}
// 		}

// 		return foundBusIds;
// 	};

// 	// console.log(1068781, getBusIndicies(1068781));
// 	// console.log(1068781 + 1, getBusIndicies(1068781 + 1));
// 	// console.log(1068781 + 2, getBusIndicies(1068781 + 2));
// 	// console.log(1068781 + 3, getBusIndicies(1068781 + 3));
// 	// console.log(1068781 + 4, getBusIndicies(1068781 + 4));

// 	let time = 0;
// 	let found = false;

// 	while (!found) {
// 		let patternFound = true;

// 		// if (time % 10000000 == 0) console.log(time);
// 		// console.log(time);

// 		for (let i = 0; i < busIds.length; i++) {
// 			const busIndicies = getBusIndicies(time + i);
// 			const busId = busIds[i];
// 			// console.log(i, busId, busIndicies);

// 			if (Number.isNaN(busId)) {
// 				if (busIndicies.length != 0) {
// 					patternFound = false;
// 					break;
// 				}
// 			} else {
// 				if (!busIndicies.includes(i)) {
// 					patternFound = false;
// 					break;
// 				}
// 			}
// 		}

// 		if (patternFound) {
// 			found = true;
// 		} else {
// 			time += busIds.length - 1;
// 			// time++;
// 		}
// 	}

// 	console.log(time);
// }

// https://github.com/andreamazzatxt/AdventOfCode2020/blob/main/13/13.js

// let time = 0;
// let multiplicator = 1;

// for (let i = 0; i < busIds.length; i++) {
// 	const busId = busIds[i];
// 	if (Number.isNaN(busId)) continue;

// 	let found = false;

// 	while (!found) {
// 		if ((time + i) % busId === 0) {
// 			found = true;
// 			multiplicator *= busId;
// 		} else {
// 			time += multiplicator;
// 		}
// 	}
// }

// console.log(time);
