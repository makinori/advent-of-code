import { readFile } from "../utils.ts";

// const dataString = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

// 22 13 17 11  0
//  8  2 23  4 24
// 21  9 14 16  7
//  6 10  3 18  5
//  1 12 20 15 19

//  3 15  0  2 22
//  9 18 13 17  5
// 19  8  7 25 23
// 20 11 10 24  4
// 14 21 16 12  6

// 14 21 17 24  4
// 10 16 15  9 19
// 18  8 23 26 20
// 22 11 13  6  5
//  2  0 12  3  7`;

const dataString = await readFile(import.meta, "4.txt");

const data = dataString.trim().split("\n");

const numbers = data[0].split(",").map(n => parseInt(n));

class Board {
	board: number[][] = [];
	marked: boolean[][] = [];

	finished = false;

	constructor(input: string) {
		const rows = input.split("\n");
		for (let y = 0; y < rows.length; y++) {
			this.board[y] = rows[y]
				.split(" ")
				.filter(n => n != "")
				.map(n => parseInt(n));
			this.marked[y] = this.board[y].map(n => false);
		}
		// this.print();
	}

	print() {
		console.table(this.board);
		console.table(this.marked);
	}

	mark(n: number) {
		for (let y = 0; y < this.board.length; y++) {
			for (let x = 0; x < this.board[y].length; x++) {
				if (this.board[y][x] == n) {
					this.marked[y][x] = true;
					break;
				}
			}
		}
	}

	isMarked(x: number, y: number) {
		return this.marked[y][x];
	}

	getNumber(x: number, y: number) {
		return this.board[y][x];
	}

	hasWon() {
		const size = this.marked[0].length;

		// horizontal rows
		for (let y = 0; y < size; y++) {
			let rowMarked = true;
			// let rowSum = 0;
			for (let x = 0; x < size; x++) {
				if (this.isMarked(x, y) == false) {
					rowMarked = false;
					break;
				} else {
					// rowSum += this.getNumber(x, y);
				}
			}
			if (rowMarked == true) return true;
		}

		// vertical columns
		for (let x = 0; x < size; x++) {
			let columnMarked = true;
			// let columnSum = 0;
			for (let y = 0; y < size; y++) {
				if (this.isMarked(x, y) == false) {
					columnMarked = false;
					break;
				} else {
					// columnSum += this.getNumber(x, y);
				}
			}
			if (columnMarked == true) return true;
		}

		// // diagonal
		// let diagonalMarked = true;
		// // let diagonalSum = 0;
		// for (let i = 0; i < size; i++) {
		// 	if (this.isMarked(i, i) == false) {
		// 		diagonalMarked = false;
		// 		break;
		// 	} else {
		// 		// diagonalSum += this.getNumber(i, i);
		// 	}
		// }
		// if (diagonalMarked == true) return true;

		// // anti? diagonal
		// let antiDiagonalMarked = true;
		// // let antiDiagonalSum = 0;
		// for (let i = 0; i < size; i++) {
		// 	if (this.isMarked(i, size - 1 - i) == false) {
		// 		antiDiagonalMarked = false;
		// 		break;
		// 	} else {
		// 		// antiDiagonalSum += this.getNumber(i, size - 1 - i);
		// 	}
		// }
		// if (antiDiagonalMarked == true) return true;

		return false;
	}

	sumOfUnmarked() {
		let sum = 0;
		for (let y = 0; y < this.board.length; y++) {
			for (let x = 0; x < this.board[y].length; x++) {
				if (this.isMarked(x, y) == false) {
					sum += this.getNumber(x, y);
				}
			}
		}
		return sum;
	}
}

{
	const boards = (
		data
			.slice(2)
			.join("\n")
			.match(/[^]+?(?:\n\n|$)/g) ?? []
	).map(board => new Board(board.trim()));

	for (const number of numbers) {
		let won = false;
		for (const board of boards) {
			board.mark(number);
			if (board.hasWon()) {
				console.log(board.sumOfUnmarked() * number);
				won = true;
				break;
			}
		}
		if (won) break;
	}
}

{
	const boards = (
		data
			.slice(2)
			.join("\n")
			.match(/[^]+?(?:\n\n|$)/g) ?? []
	).map(board => new Board(board.trim()));

	let lastScore = 0;

	for (const number of numbers) {
		for (const board of boards) {
			if (board.finished) continue;
			board.mark(number);
			if (board.hasWon()) {
				board.finished = true;
				lastScore = board.sumOfUnmarked() * number;
			}
		}
	}

	console.log(lastScore);
}
