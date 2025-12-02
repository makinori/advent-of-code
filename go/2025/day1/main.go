package main

import (
	_ "embed"
	"fmt"
	"math"
	"strconv"
	"strings"

	"github.com/makinori/advent-of-code/go/util"
)

var (
	//go:embed input.txt
	input string

	currentRotation int = 50

	endsOnZero  uint
	totalClicks uint
)

func processLine(line string) {
	amount, err := strconv.Atoi(line[1:])
	if err != nil {
		panic(err)
	}

	switch line[0] {
	case 'L':
		amount *= -1
	case 'R':
		// all good
	default:
		panic("failed to parse: " + line)
	}

	newRotation := currentRotation + amount

	clicks := uint(math.Abs(float64(newRotation / 100)))

	// if end on click or passed negative, need to add one
	if newRotation == 0 || currentRotation != 0 && newRotation < 0 {
		clicks++
	}

	totalClicks += clicks

	currentRotation = int(util.GLSLMod(float64(newRotation), 100))
	if currentRotation == 0 {
		endsOnZero++
	}
}

func main() {
	input = strings.TrimSpace(input)
	for line := range strings.SplitSeq(input, "\n") {
		processLine(line)
	}
	fmt.Println(endsOnZero)
	fmt.Println(totalClicks)
}
