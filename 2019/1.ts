import fs from "fs";

const getFuel = (mass: number) => Math.floor(mass / 3) - 2;

const getActualFuel = (mass: number) => {
	const fuel = Math.floor(mass / 3) - 2;
	if (fuel < 0) return 0;
	return fuel + getActualFuel(fuel);
};

const masses = fs
	.readFileSync(__dirname + "/1.txt", "utf8")
	.split("\n")
	.map(n => Number(n));

console.log(masses.map(mass => getFuel(mass)).reduce((a, b) => a + b));

console.log(masses.map(mass => getActualFuel(mass)).reduce((a, b) => a + b));
