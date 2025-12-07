package main

import (
	"bytes"
	_ "embed"
	"fmt"
	"strings"
)

// this was really fun

var (
	//go:embed input.txt
	input string

	lines  [][]byte
	height int
	width  int

	totalSplits int

	allCachedTimelines = map[SplitKey]int{}
)

type SplitKey struct {
	X, Y int
}

func processLine(y int) bool {
	if y >= height {
		return false
	}

	prev := lines[y-1]
	line := lines[y]

	// get beams from prev lines

	var beams []int
	for x := range width {
		switch prev[x] {
		case 'S', '|':
			beams = append(beams, x)
		}
	}

	// update line with new beams, or split

	for _, x := range beams {
		switch line[x] {
		case '.':
			// air
			line[x] = '|'
		case '|':
			// merge
		case '^':
			line[x-1] = '|'
			line[x+1] = '|'
			totalSplits++
		default:
			panic("unknown beam hit: " + string(line[x]))
		}
	}

	return true
}

func simulateBeam(startX, startY int) int {
	if startX < 0 || startX >= width || startY < 0 || startY >= height {
		panic(fmt.Sprintf("beam %dx%d out of bounds", startX, startY))
	}

	y := startY
	for {
		if y >= height {
			return 1 // valid timeline
		}

		sample := lines[y][startX]
		if sample == '^' {
			break
		}

		y++
	}

	// we split

	key := SplitKey{X: startX, Y: y}
	cachedTimelines, ok := allCachedTimelines[key]
	if ok {
		return cachedTimelines
	}

	timelines := simulateBeam(startX-1, y) + simulateBeam(startX+1, y)

	allCachedTimelines[key] = timelines

	return timelines
}

func main() {
	lines = bytes.Split([]byte(strings.TrimSpace(input)), []byte{'\n'})
	height = len(lines)
	width = len(lines[0])

	y := 1
	for processLine(y) {
		y++
	}

	fmt.Println(totalSplits)

	// reset lines and simulate each beam instead

	lines = bytes.Split([]byte(strings.TrimSpace(input)), []byte{'\n'})

	startX := 0
	for x := range width {
		if lines[0][x] == 'S' {
			startX = x
		}
	}

	fmt.Println(simulateBeam(startX, 0))
}
