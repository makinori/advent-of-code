import { readFile } from "../utils.ts";

type Space = "L" | "#" | ".";

const originalSeatLayout: Space[][] = (await readFile(import.meta, "11.txt"))
	.split("\n")
	.map(line =>
		line.split("").map(space => {
			if (space != "L" && space != "#" && space != ".")
				throw new Error("Invalid space " + space);
			return space;
		})
	);

const printSeatLayout = (seatLayout: Space[][]) => {
	for (const row of seatLayout) {
		console.log(row.join(""));
	}
	console.log("");
};

const getSpace = (
	seatLayout: Space[][],
	x: number,
	y: number
): { space: Space; off: boolean } => {
	if (x < 0 || y < 0 || y > seatLayout.length - 1)
		return { space: ".", off: true };
	const row = seatLayout[y];
	if (x > row.length - 1) return { space: ".", off: true };
	return { space: row[x], off: false };
};

const lookAround = (seatLayout: Space[][], fromX: number, fromY: number) => {
	let occupied = 0;
	for (let y = -1; y <= 1; y++) {
		for (let x = -1; x <= 1; x++) {
			if (x == 0 && y == 0) continue;
			const { space } = getSpace(seatLayout, fromX + x, fromY + y);
			if (space == "#") occupied++;
		}
	}
	return occupied;
};

const lookAroundFar = (seatLayout: Space[][], fromX: number, fromY: number) => {
	let totalOccupied = 0;
	for (let y = -1; y <= 1; y++) {
		for (let x = -1; x <= 1; x++) {
			if (x == 0 && y == 0) continue;

			let currentX = fromX + x;
			let currentY = fromY + y;
			let space: Space;
			let off: boolean;
			let occupied = false;

			while (
				({ space, off } = getSpace(seatLayout, currentX, currentY))
			) {
				if (off) break;
				if (space == "#") {
					occupied = true;
					break;
				} else if (space == "L") {
					break; // cant look past chairs
				}
				currentX += x;
				currentY += y;
			}

			if (occupied) totalOccupied++;
		}
	}
	return totalOccupied;
};

const countUnoccupied = (seatLayout: Space[][]) =>
	(
		seatLayout
			.map(row => row.join(""))
			.join("")
			.match(/#/g) ?? []
	).length;

const deepCopy = <T>(o: T) => JSON.parse(JSON.stringify(o));

{
	let currentSeatLayout: Space[][] = originalSeatLayout;

	const step = () => {
		const workingSeatLayout: Space[][] = deepCopy(currentSeatLayout);
		let dirty = false;

		for (let y = 0; y < currentSeatLayout.length; y++) {
			for (let x = 0; x < currentSeatLayout[y].length; x++) {
				const { space } = getSpace(currentSeatLayout, x, y);
				if (space == ".") continue;

				const occupied = lookAround(currentSeatLayout, x, y);

				if (space == "L" && occupied == 0) {
					workingSeatLayout[y][x] = "#";
					dirty = true;
				} else if (space == "#" && occupied >= 4) {
					workingSeatLayout[y][x] = "L";
					dirty = true;
				}
			}
		}

		currentSeatLayout = workingSeatLayout;
		// printSeatLayout(currentSeatLayout);

		if (dirty) step();
	};

	// printSeatLayout(currentSeatLayout);
	step();

	console.log(countUnoccupied(currentSeatLayout));
}

{
	let currentSeatLayout: Space[][] = originalSeatLayout;

	const step = () => {
		const workingSeatLayout: Space[][] = deepCopy(currentSeatLayout);
		let dirty = false;

		for (let y = 0; y < currentSeatLayout.length; y++) {
			for (let x = 0; x < currentSeatLayout[y].length; x++) {
				const { space } = getSpace(currentSeatLayout, x, y);
				if (space == ".") continue;

				const occupied = lookAroundFar(currentSeatLayout, x, y);

				if (space == "L" && occupied == 0) {
					workingSeatLayout[y][x] = "#";
					dirty = true;
				} else if (space == "#" && occupied >= 5) {
					workingSeatLayout[y][x] = "L";
					dirty = true;
				}
			}
		}

		currentSeatLayout = workingSeatLayout;
		// printSeatLayout(currentSeatLayout);

		if (dirty) step();
	};

	// printSeatLayout(currentSeatLayout);
	step();

	console.log(countUnoccupied(currentSeatLayout));
}
