package main

import (
	_ "embed"
	"fmt"
	"strings"
	"time"

	"github.com/makinori/advent-of-code/go/util/draw"
)

const (
	ANIMATE         = false
	ANIMATION_SPEED = time.Millisecond * 50
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
	img := draw.BrailleImage{}

	for y, row := range *grid {
		for x, item := range row {
			switch item {
			case ItemRoll:
				img.Set(uint(x), uint(y), true)
			default:
				img.Set(uint(x), uint(y), false)
			}
		}
	}

	// draw.Clear()
	draw.Move(0, 0)
	img.Print()
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
		draw.Clear()
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
			grid.Print()
		}

		totalRolls += count
	}

	if !ANIMATE {
		fmt.Println(totalRolls)
	}
}
