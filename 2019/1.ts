import { relativeResolve } from "../utils.ts";

const getFuel = (mass: number) => Math.floor(mass / 3) - 2;

const getActualFuel = (mass: number): number => {
	const fuel = Math.floor(mass / 3) - 2;
	if (fuel < 0) return 0;
	return fuel + getActualFuel(fuel);
};

const masses = Deno.readTextFileSync(relativeResolve(import.meta, "1.txt"))
	.split("\n")
	.map(n => Number(n));

console.log(masses.map(mass => getFuel(mass)).reduce((a, b) => a + b));

console.log(masses.map(mass => getActualFuel(mass)).reduce((a, b) => a + b));
