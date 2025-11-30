package main

import (
	"fmt"
	"os"
	"slices"
	"strconv"

	"github.com/makinori/advent-of-code/go/aoc2025"
)

type puzzle struct {
	puzzle int
	fn     func()
}

type year struct {
	year    int
	puzzles []puzzle
}

var all = []year{
	{year: 2025, puzzles: []puzzle{
		{puzzle: 1, fn: aoc2025.Puzzle1},
	}},
}

func main() {
	if len(os.Args) < 3 {
		fmt.Println("usage: <year> <puzzle>")
		fmt.Println("available:")

		for _, year := range all {
			var output string
			for i, puzzle := range year.puzzles {
				output += strconv.Itoa(puzzle.puzzle)
				if i < len(year.puzzles)-1 {
					output += ","
				}
			}
			fmt.Printf("  %d: %s\n", year.year, output)
		}

		os.Exit(1)
	}

	yearNumber, err := strconv.Atoi(os.Args[1])
	if err != nil {
		panic("invalid year: " + err.Error())
	}

	puzzleNumber, err := strconv.Atoi(os.Args[2])
	if err != nil {
		panic("invalid puzzle: " + err.Error())
	}

	yearIndex := slices.IndexFunc(all, func(needle year) bool {
		return needle.year == yearNumber
	})

	if yearIndex < 0 {
		fmt.Printf("year %d not found\n", yearNumber)
		os.Exit(1)
	}

	year := all[yearIndex]

	puzzleIndex := slices.IndexFunc(year.puzzles, func(needle puzzle) bool {
		return needle.puzzle == puzzleNumber
	})

	if puzzleIndex < 0 {
		fmt.Printf("puzzle %d for %d not found\n", puzzleNumber, yearNumber)
		os.Exit(1)
	}

	year.puzzles[puzzleIndex].fn()
}
