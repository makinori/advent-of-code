package main

import (
	_ "embed"
	"fmt"
	"strconv"
	"strings"
)

var (
	//go:embed input.txt
	input string

	sumOf2  int
	sumOf12 int
)

func getHighestIndex(arr []int) int {
	highestIndex := 0
	for i := range arr {
		if arr[i] > arr[highestIndex] {
			highestIndex = i
		}
	}
	return highestIndex
}

func maxJoltage(bank []int, need int) int {
	bankLength := len(bank)
	if need > bankLength {
		panic("need more than available")
	}

	resultString := make([]byte, need)

	// greedy search

	start := 0
	for i := range need {
		// make sure there's enough left over
		end := bankLength - (need - i - 1)
		highestIndex := start + getHighestIndex(bank[start:end])
		resultString[i] = strconv.Itoa(bank[highestIndex])[0]
		start = highestIndex + 1
	}

	result, err := strconv.Atoi(string(resultString))
	if err != nil {
		panic(err)
	}

	return result
}

func processBank(bank []int) {
	sumOf2 += maxJoltage(bank, 2)
	sumOf12 += maxJoltage(bank, 12)
}

func main() {
	input = strings.TrimSpace(input)

	for line := range strings.SplitSeq(input, "\n") {
		bankStr := strings.Split(line, "")
		bank := make([]int, len(bankStr))

		for i := range bank {
			joltage, err := strconv.Atoi(bankStr[i])
			if err != nil {
				panic("failed to parse: " + bankStr[i])
			}
			bank[i] = joltage
		}

		processBank(bank)
	}

	fmt.Println(sumOf2)
	fmt.Println(sumOf12)
}
