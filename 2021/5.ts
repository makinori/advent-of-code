import { readFile } from "../utils.ts";

// const dataString = `0,9 -> 5,9
// 8,0 -> 0,8
// 9,4 -> 3,4
// 2,2 -> 2,1
// 7,0 -> 7,4
// 6,4 -> 2,0
// 0,9 -> 2,9
// 3,4 -> 1,4
// 0,0 -> 8,8
// 5,5 -> 8,2`;

const dataString = await readFile(import.meta, "5.txt");

const data = dataString
	.trim()
	.split("\n")
	.map(line =>
		line.split(" -> ").map(coordStr => {
			let coord = coordStr.split(",").map(n => Number(n));
			return { x: coord[0], y: coord[1] };
		})
	);

class OceanFloor {
	data: { [key: string]: number } = {};

	start = { x: 0, y: 0 };
	end = { x: 0, y: 0 };

	constructor() {}

	addPoint(x: number, y: number) {
		const key = x + "," + y;
		if (this.data[key] == null) {
			this.data[key] = 1;
		} else {
			this.data[key]++;
		}
		if (x < this.start.x) this.start.x = x;
		if (x > this.end.x) this.end.x = x;
		if (y < this.start.y) this.start.y = y;
		if (y > this.end.y) this.end.y = y;
	}

	addLine(line: { x: number; y: number }[], allowDiagonal = false) {
		const xAxis = line[0].y == line[1].y;
		const yAxis = line[0].x == line[1].x;
		const diagonal = !xAxis && !yAxis;

		// horizontal and vertical lines only
		if (allowDiagonal == false && diagonal) return;

		if (xAxis) {
			let dir = Math.sign(line[1].x - line[0].x);
			for (let x = line[0].x; x != line[1].x + dir; x += dir) {
				this.addPoint(x, line[0].y);
			}
		} else if (yAxis) {
			let dir = Math.sign(line[1].y - line[0].y);
			for (let y = line[0].y; y != line[1].y + dir; y += dir) {
				this.addPoint(line[0].x, y);
			}
		} else if (diagonal) {
			// TODO: error if not 45 deg diagonal
			let xDir = Math.sign(line[1].x - line[0].x);
			let yDir = Math.sign(line[1].y - line[0].y);
			let current = line[0];
			this.addPoint(current.x, current.y);
			while (current.x != line[1].x && current.y != line[1].y) {
				current.x += xDir;
				current.y += yDir;
				this.addPoint(current.x, current.y);
			}
		}
	}

	print() {
		for (let y = this.start.y; y < this.end.y + 1; y++) {
			let line = "";
			for (let x = this.start.x; x < this.end.x + 1; x++) {
				const point = this.data[x + "," + y];
				line += point == null ? "." : point;
			}
			console.log(line);
		}
	}

	countOverlap() {
		let twoOrMore = 0;
		for (let y = this.start.y; y < this.end.y + 1; y++) {
			for (let x = this.start.x; x < this.end.x + 1; x++) {
				const point = this.data[x + "," + y];
				if (point != null && point >= 2) {
					twoOrMore++;
				}
			}
		}
		return twoOrMore;
	}
}

{
	const oceanFloor = new OceanFloor();

	for (const line of data) {
		oceanFloor.addLine(line);
	}

	// oceanFloor.print();
	console.log(oceanFloor.countOverlap());
}

{
	const oceanFloor = new OceanFloor();

	for (const line of data) {
		oceanFloor.addLine(line, true);
	}

	// oceanFloor.print();
	console.log(oceanFloor.countOverlap());
}
