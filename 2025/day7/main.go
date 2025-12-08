package main

import (
	"bytes"
	_ "embed"
	"flag"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/makinori/advent-of-code/termdraw"
)

// this was really fun

const (
	ANIMATE_SLOW_SPEED   = 100  // ms
	ANIMATE_FAST_SPEED   = 10   // ms
	ANIMATE_FAST_WHEN    = 20   // lines
	ANIMATE_WAIT_BETWEEN = 1000 // ms between parts
)

var (
	//go:embed input.txt
	input string

	animate   bool
	cacheless bool

	lines  [][]byte
	height int
	width  int

	totalSplits int

	allCachedTimelines = map[SplitKey]int{}

	animateSpeed     time.Duration
	animateDrawCache [][]byte
)

type SplitKey struct {
	X, Y int
}

func copyLines(input [][]byte) [][]byte {
	output := make([][]byte, len(input))
	for y := range input {
		output[y] = make([]byte, len(input[y]))
		copy(output[y], input[y])
	}
	return output
}

func widerLines(lines [][]byte) [][]byte {
	widerLines := make([][]byte, len(lines))
	for y := range lines {
		widerLines[y] = make([]byte, len(lines[y])*2)
		for x := range lines[y] {
			widerLines[y][x*2] = ' '
			widerLines[y][x*2+1] = lines[y][x]
		}
	}
	return widerLines
}

func drawLines(lines [][]byte, extraText string) {
	lines = widerLines(lines)

	termdraw.Move(0, 0)

	for y := range height {
		line := lines[y]

		hasCacheForLine := len(animateDrawCache)-1 >= y
		if hasCacheForLine && slices.Compare(animateDrawCache[y], line) == 0 {
			continue
		}

		if !hasCacheForLine {
			termdraw.Move(0, uint(y))
			termdraw.Write(string(line))
			continue
		}

		lineCacheLength := len(line)

		for x := range line {
			if x > lineCacheLength-1 {
				termdraw.Move(uint(x), uint(y))
				termdraw.Write(string(line[x:]))
				break
			}

			if animateDrawCache[y][x] != line[x] {
				termdraw.Move(uint(x), uint(y))
				termdraw.Write(string(line[x]))
			}
		}
	}

	termdraw.Move(0, uint(len(lines)))
	if extraText == "" {
		termdraw.ClearLine()
	} else {
		termdraw.Write(extraText)
	}

	animateDrawCache = copyLines(lines)
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
		case ' ':
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

func simulateBeam(
	startX, startY int,
	currentLinesForAnimating [][]byte,
) int {
	if startX < 0 || startX >= width || startY < 0 || startY >= height {
		panic(fmt.Sprintf("beam %dx%d out of bounds", startX, startY))
	}

	y := startY
	for {
		if y >= height {
			if animate {
				time.Sleep(time.Millisecond * animateSpeed)
				drawLines(currentLinesForAnimating, "")
			}
			return 1 // valid timeline
		}

		sample := lines[y][startX]
		if sample == '^' {
			break
		} else if animate && sample == ' ' {
			currentLinesForAnimating[y][startX] = '|'
		}

		y++
	}

	// we split

	key := SplitKey{X: startX, Y: y}

	if !animate || (animate && !cacheless) {
		cachedTimelines, ok := allCachedTimelines[key]
		if ok {
			return cachedTimelines
		}
	}

	if animate {
		time.Sleep(time.Millisecond * animateSpeed)
		drawLines(currentLinesForAnimating, "")
	}

	timelines :=
		simulateBeam(startX-1, y, copyLines(currentLinesForAnimating)) +
			simulateBeam(startX+1, y, copyLines(currentLinesForAnimating))

	allCachedTimelines[key] = timelines

	return timelines
}

func main() {
	flag.BoolVar(&animate, "animate", false, "draw progressively")
	flag.BoolVar(&cacheless, "cacheless", false, "don't cache when animating")
	flag.Parse()

	if !animate {
		fmt.Println("try with -animate")
	}

	input = strings.TrimSpace(input)
	input = strings.ReplaceAll(input, ".", " ") // prettier to draw

	lines = bytes.Split([]byte(input), []byte{'\n'})
	height = len(lines)
	width = len(lines[0])

	if animate {
		if height > ANIMATE_FAST_WHEN {
			animateSpeed = ANIMATE_FAST_SPEED
		} else {
			animateSpeed = ANIMATE_SLOW_SPEED
		}
		termdraw.Clear()
		drawLines(lines, "0 splits")
	}

	y := 1
	for processLine(y) {
		time.Sleep(time.Millisecond * animateSpeed)
		if animate {
			drawLines(lines, strconv.Itoa(totalSplits)+" splits")
		}
		y++
	}

	if !animate {
		fmt.Println(totalSplits)
	}

	if animate {
		time.Sleep(time.Millisecond * ANIMATE_WAIT_BETWEEN)
		if cacheless && height > ANIMATE_FAST_WHEN {
			animateSpeed = 0
		}
	}

	// reset lines and simulate each beam instead

	lines = bytes.Split([]byte(input), []byte{'\n'})

	startX := 0
	for x := range width {
		if lines[0][x] == 'S' {
			startX = x
		}
	}

	if animate {
		fmt.Println(simulateBeam(startX, 0, copyLines(lines)), "timelines")
	} else {
		fmt.Println(simulateBeam(startX, 0, nil))
	}
}
