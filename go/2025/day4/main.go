package main

import (
	"bytes"
	_ "embed"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"
)

const (
	ANIMATE         = false
	ANIMATION_SPEED = time.Millisecond * 100
)

var (
	//go:embed input.txt
	input string
)

type Item uint8

const (
	ItemAir Item = iota
	ItemRoll
)

type Grid [][]Item

func (grid *Grid) Print() {
	buf := bytes.NewBuffer(nil)
	for _, row := range *grid {
		for _, item := range row {
			switch item {
			case ItemAir:
				buf.WriteString("..")
			case ItemRoll:
				buf.WriteString("@@")
			default:
				buf.WriteString("??")
			}
		}
		buf.WriteByte('\n')
	}
	// remove trailing \n
	fmt.Println(buf.String()[:buf.Len()-1])
}

func sampleGrid(grid Grid, x, y int) Item {
	if x < 0 || y < 0 || x >= len(grid[0]) || y >= len(grid) {
		return ItemAir
	}
	return grid[y][x]
}

func isAccessible(grid Grid, x, y int) bool {
	count := 0
	for offsetY := -1; offsetY <= 1; offsetY++ {
		for offsetX := -1; offsetX <= 1; offsetX++ {
			if offsetX == 0 && offsetY == 0 {
				continue
			}
			if sampleGrid(grid, x+offsetX, y+offsetY) == ItemRoll {
				count++
			}
			if count >= 4 {
				return false
			}
		}
	}
	return true
}

func countRolls(grid Grid) (int, Grid) {
	totalRolls := 0
	var newGrid Grid

	for y, row := range grid {
		var newRow []Item

		for x, item := range row {
			if item == ItemRoll && isAccessible(grid, x, y) {
				// fmt.Println(x, y, "accessible")
				totalRolls++
				item = ItemAir
			}

			newRow = append(newRow, item)
		}

		newGrid = append(newGrid, newRow)
	}

	return totalRolls, newGrid
}

func clear() {
	cmd := exec.Command("clear")
	cmd.Stdout = os.Stdout
	cmd.Run()
}

func main() {
	input = strings.TrimSpace(input)

	var grid Grid

	for line := range strings.SplitSeq(input, "\n") {
		row := make([]Item, len(line))
		for x, char := range line {
			switch char {
			case '.':
				row[x] = ItemAir
			case '@':
				row[x] = ItemRoll
			default:
				panic("unknown: " + string(char))
			}
		}
		grid = append(grid, row)
	}

	if ANIMATE {
		clear()
		grid.Print()
	}

	totalRolls := 0

	for {
		if ANIMATE {
			time.Sleep(ANIMATION_SPEED)
		}

		var count int
		count, grid = countRolls(grid)

		// puzzle 1
		if !ANIMATE && totalRolls == 0 {
			fmt.Println(count)
		}

		if count == 0 {
			break
		}

		if ANIMATE {
			clear()
			grid.Print()
		}

		totalRolls += count
	}

	if !ANIMATE {
		fmt.Println(totalRolls)
	}
}
