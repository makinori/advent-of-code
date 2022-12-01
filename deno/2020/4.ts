import { readFile } from "../utils.ts";

const passports = (await readFile(import.meta, "4.txt"))
	.split(/\n\s*\n/g)
	.map(passport =>
		passport
			.replace(/\s/g, "\n")
			.split("\n")
			.map(field => field.trim())
	)
	.map(fields => {
		const data: { [key: string]: string } = {};
		for (const field of fields) {
			const [key, value] = field.split(":");
			if (key && value) {
				data[key] = value;
			}
		}
		return data;
	});

{
	const required = [
		"byr", // Birth Year
		"iyr", // Issue Year
		"eyr", // Expiration Year
		"hgt", // Height)
		"hcl", // Hair Color
		"ecl", // Eye Color
		"pid" // Passport ID
		// "cid", // Country ID
	];

	let validPassports = 0;

	for (const passport of passports) {
		let valid = true;
		for (const field of required) {
			if (passport[field] == null) {
				valid = false;
				break;
			}
		}
		if (valid) validPassports++;
	}

	console.log(validPassports);
}

const checkYear = (yearStr: string, min: number, max: number) => {
	if (yearStr == null) return false;
	if (yearStr.length != 4) return false;
	const year = Number(yearStr);
	if (year < min) return false;
	if (year > max) return false;
	return true;
};

const checkHeight = (heightStr: string) => {
	if (heightStr == null) return false;
	const ext = heightStr.slice(-2).trim();
	if (ext != "cm" && ext != "in") return false;
	const height = Number(heightStr.slice(0, -2));
	if (ext == "cm") {
		if (height < 150) return false;
		if (height > 193) return false;
	} else if (ext == "in") {
		if (height < 59) return false;
		if (height > 76) return false;
	}
	return true;
};

const checkHexColor = (hexStr: string) =>
	/^#[0-9a-f]{6}$/.test((hexStr || "").toLowerCase());

const checkEyeColor = (eyeColor: string) =>
	["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(eyeColor);

const checkPassportId = (passportId: string) =>
	/^[0-9]{9}$/.test(passportId || "");

// const checkPass

let validPassports = 0;

for (const passport of passports) {
	if (!checkYear(passport["byr"], 1920, 2002)) continue;
	if (!checkYear(passport["iyr"], 2010, 2020)) continue;
	if (!checkYear(passport["eyr"], 2020, 2030)) continue;
	if (!checkHeight(passport["hgt"])) continue;
	if (!checkHexColor(passport["hcl"])) continue;
	if (!checkEyeColor(passport["ecl"])) continue;
	if (!checkPassportId(passport["pid"])) continue;
	validPassports++;
}

console.log(validPassports);
