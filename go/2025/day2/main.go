package main

import (
	_ "embed"
	"fmt"
	"math"
	"strconv"
	"strings"
)

var (
	//go:embed input.txt
	input string

	invalidIDsWhenRepeatedTwice int
	invalidIDsWithRepetitions   int
)

func processID(idNum int) {
	idStr := strconv.Itoa(idNum)
	length := len(idStr)

	if length%2 == 0 && idStr[:length/2] == idStr[length/2:] {
		invalidIDsWhenRepeatedTwice += idNum
	}

	// we need all factors of a number, except for itself
	// to use as needle lengths. biggest numbers first
	// to speed up search process as fast as possible

	// fmt.Println(idStr)

	var factors []int

	for i := length / 2; i > 0; i-- {
		if math.Mod(float64(length), float64(i)) == 0 {
			factors = append(factors, i)
		}
	}

	for _, factor := range factors {
		needle := idStr[:factor]
		// fmt.Println("factor", factor, "needle", needle)

		invalid := false
		for i := factor; i < length; i += factor {
			if needle != idStr[i:i+factor] {
				invalid = true
				break
			}
		}

		if invalid {
			continue
		}

		// fmt.Println("invalid: "+idStr+", factor:", factor)

		invalidIDsWithRepetitions += idNum

		// dont need to try more. we already know its invalid

		return
	}
}

func main() {
	// processID(12341234)
	// processID(123123123)
	// processID(1212121212)
	// processID(1111111)

	// return

	for idRangeStr := range strings.SplitSeq(strings.TrimSpace(input), ",") {
		idRangeStr = strings.TrimSpace(idRangeStr)
		if idRangeStr == "" {
			continue
		}

		idRange := strings.Split(idRangeStr, "-")
		if len(idRange) != 2 {
			panic("id range not 2 numbers: " + idRangeStr)
		}

		start, err := strconv.Atoi(idRange[0])
		if err != nil {
			panic("failed to parse start of range: " + idRangeStr)
		}

		end, err := strconv.Atoi(idRange[1])
		if err != nil {
			panic("failed to parse end of range: " + idRangeStr)
		}

		for i := start; i <= end; i++ {
			processID(i)
		}
	}

	fmt.Println(invalidIDsWhenRepeatedTwice)
	fmt.Println(invalidIDsWithRepetitions)
}
