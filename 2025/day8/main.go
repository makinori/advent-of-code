package main

import (
	_ "embed"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
)

// unfinished. i need to do this differently anyway
// i kinda dont want to do this right now

var (
	//go:embed input.txt
	input string

	coordsRegexp = regexp.MustCompile(`(\d+),(\d+),(\d+)`)

	boxes []JunctionBox
	pairs []Pair
)

type JunctionBox struct {
	X, Y, Z int
}

type Pair struct {
	A, B *JunctionBox
}

func hasPair(a, b *JunctionBox) bool {
	for i := range pairs {
		if (pairs[i].A == a && pairs[i].B == b) ||
			(pairs[i].A == b && pairs[i].B == a) {
			return true
		}
	}
	return false
}

func distance(a, b *JunctionBox) float64 {
	var sum float64
	x := a.X - b.X
	sum += float64(x * x)
	y := a.Y - b.Y
	sum += float64(y * y)
	z := a.Z - b.Z
	sum += float64(z * z)
	return math.Sqrt(sum)
}

func findClosest(to *JunctionBox) (*JunctionBox, float64) {
	closestDist := math.MaxFloat64
	var closest *JunctionBox
	for i := range boxes {
		if &boxes[i] == to {
			continue
		}

		if hasPair(&boxes[i], to) {
			continue
		}

		dist := distance(&boxes[i], to)
		if dist < closestDist {
			closestDist = dist
			closest = &boxes[i]
		}
	}
	return closest, closestDist
}

func findAndPairShortest() {
	shortest := math.MaxFloat64
	var shortestA *JunctionBox
	var shortestB *JunctionBox

	for i := range boxes {
		closest, dist := findClosest(&boxes[i])

		if dist < shortest {
			shortest = dist
			shortestA = &boxes[i]
			shortestB = closest
		}
	}

	fmt.Println(shortestA)
	fmt.Println(shortestB)
	fmt.Println("")

	pairs = append(pairs, Pair{A: shortestA, B: shortestB})
}

func haveCompleteCircuit() {
	var notVisited []*JunctionBox
	for i := range boxes {
		notVisited = append(notVisited, &boxes[i])
	}

	// ...
}

func main() {
	input = strings.TrimSpace(input)

	for line := range strings.SplitSeq(input, "\n") {
		matches := coordsRegexp.FindStringSubmatch(line)
		if len(matches) == 0 {
			panic("failed to parse: " + line)
		}

		x, _ := strconv.Atoi(matches[1])
		y, _ := strconv.Atoi(matches[2])
		z, _ := strconv.Atoi(matches[3])

		box := JunctionBox{X: x, Y: y, Z: z}

		boxes = append(boxes, box)
	}

	findAndPairShortest()
	findAndPairShortest()
	findAndPairShortest()
	findAndPairShortest()

}
