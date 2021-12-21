class Lanternfish {
	constructor(public pool: Pool, public internalTimer: number) {}

	nextDay() {
		this.internalTimer--;
		if (this.internalTimer < 0) {
			this.pool.lanternfish.push(new Lanternfish(this.pool, 8));
			this.internalTimer = 6;
		}
	}
}

class Pool {
	lanternfish: Lanternfish[] = [];

	print() {
		// console.log(this.lanternfish.map(f => f.internalTimer));
	}

	constructor(input: number[]) {
		for (const internalTimer of input) {
			this.lanternfish.push(new Lanternfish(this, internalTimer));
		}
		this.print();
	}

	nextDay() {
		// new ones could get added and you don't want to loop through them
		const currentLanternfish = this.lanternfish.slice();
		for (const lanternfish of currentLanternfish) {
			lanternfish.nextDay();
		}
		this.print();
	}

	processDays(amount: number) {
		for (let day = 0; day < amount; day++) {
			this.nextDay();
		}
		return this.lanternfish.length;
	}
}

{
	// const pool = new Pool([3, 4, 3, 1, 2]);
	const pool = new Pool([
		3, 1, 4, 2, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 1, 2, 1, 1, 2, 1, 3, 4, 5, 1,
		1, 4, 1, 3, 3, 1, 1, 1, 1, 3, 3, 1, 3, 3, 1, 5, 5, 1, 1, 3, 1, 1, 2, 1,
		1, 1, 3, 1, 4, 3, 2, 1, 4, 3, 3, 1, 1, 1, 1, 5, 1, 4, 1, 1, 1, 4, 1, 4,
		4, 1, 5, 1, 1, 4, 5, 1, 1, 2, 1, 1, 1, 4, 1, 2, 1, 1, 1, 1, 1, 1, 5, 1,
		3, 1, 1, 4, 4, 1, 1, 5, 1, 2, 1, 1, 1, 1, 5, 1, 3, 1, 1, 1, 2, 2, 1, 4,
		1, 3, 1, 4, 1, 2, 1, 1, 1, 1, 1, 3, 2, 5, 4, 4, 1, 3, 2, 1, 4, 1, 3, 1,
		1, 1, 2, 1, 1, 5, 1, 2, 1, 1, 1, 2, 1, 4, 3, 1, 1, 1, 4, 1, 1, 1, 1, 1,
		2, 2, 1, 1, 5, 1, 1, 3, 1, 2, 5, 5, 1, 4, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
		4, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 4, 1, 1, 4, 1, 3, 4, 1, 5, 4, 2,
		5, 1, 2, 1, 1, 1, 1, 1, 1, 4, 3, 2, 1, 1, 3, 2, 5, 2, 5, 5, 1, 3, 1, 2,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 4, 1, 4, 2, 1, 3, 4, 1, 1,
		1, 2, 3, 1, 1, 1, 4, 1, 2, 5, 1, 2, 1, 5, 1, 1, 2, 1, 2, 1, 1, 1, 1, 4,
		3, 4, 1, 5, 5, 4, 1, 1, 5, 2, 1, 3
	]);
	console.log(pool.processDays(80));
}

{
	// const pool = new Pool([3, 4, 3, 1, 2]);
	const pool = new Pool([
		3, 1, 4, 2, 1, 1, 1, 1, 1, 1, 1, 4, 1, 4, 1, 2, 1, 1, 2, 1, 3, 4, 5, 1,
		1, 4, 1, 3, 3, 1, 1, 1, 1, 3, 3, 1, 3, 3, 1, 5, 5, 1, 1, 3, 1, 1, 2, 1,
		1, 1, 3, 1, 4, 3, 2, 1, 4, 3, 3, 1, 1, 1, 1, 5, 1, 4, 1, 1, 1, 4, 1, 4,
		4, 1, 5, 1, 1, 4, 5, 1, 1, 2, 1, 1, 1, 4, 1, 2, 1, 1, 1, 1, 1, 1, 5, 1,
		3, 1, 1, 4, 4, 1, 1, 5, 1, 2, 1, 1, 1, 1, 5, 1, 3, 1, 1, 1, 2, 2, 1, 4,
		1, 3, 1, 4, 1, 2, 1, 1, 1, 1, 1, 3, 2, 5, 4, 4, 1, 3, 2, 1, 4, 1, 3, 1,
		1, 1, 2, 1, 1, 5, 1, 2, 1, 1, 1, 2, 1, 4, 3, 1, 1, 1, 4, 1, 1, 1, 1, 1,
		2, 2, 1, 1, 5, 1, 1, 3, 1, 2, 5, 5, 1, 4, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1,
		4, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 4, 1, 1, 4, 1, 3, 4, 1, 5, 4, 2,
		5, 1, 2, 1, 1, 1, 1, 1, 1, 4, 3, 2, 1, 1, 3, 2, 5, 2, 5, 5, 1, 3, 1, 2,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 4, 1, 4, 2, 1, 3, 4, 1, 1,
		1, 2, 3, 1, 1, 1, 4, 1, 2, 5, 1, 2, 1, 5, 1, 1, 2, 1, 2, 1, 1, 1, 1, 4,
		3, 4, 1, 5, 5, 4, 1, 1, 5, 2, 1, 3
	]);
	console.log(pool.processDays(256));
}
