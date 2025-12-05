package main

import (
	_ "embed"
	"fmt"
	"regexp"
	"slices"
	"strconv"
	"strings"
)

var (
	//go:embed input.txt
	input string

	rangeRegexp = regexp.MustCompile(`(\d+)-(\d+)`)
)

// inclusive
type FreshRange struct {
	From uint64
	To   uint64
}

func (r *FreshRange) IsFresh(id uint64) bool {
	return id >= r.From && id <= r.To
}

type FreshRanges []FreshRange

func (input FreshRanges) IsFresh(id uint64) bool {
	for _, freshRange := range input {
		if freshRange.IsFresh(id) {
			return true
		}
	}
	return false
}

func (input FreshRanges) TotalFreshForIDs(ingredientIDs []uint64) uint64 {
	var totalFresh uint64 = 0
	for _, id := range ingredientIDs {
		if input.IsFresh(id) {
			totalFresh++
		}
	}
	return totalFresh
}

// 3-5
// 10-14
// 16-20
// 12-18

// 3------5      10---------14      16----------20
//                     12-----------------18

func (input FreshRanges) AllFreshCount() uint64 {
	// sort by from

	sorted := make(FreshRanges, len(input))
	copy(sorted, input)

	slices.SortFunc(sorted, func(a, b FreshRange) int {
		return int(a.From - b.From)
	})

	// collapse

	var merged FreshRanges
	prev := sorted[0]

	for i := 1; i < len(sorted); i++ {
		if sorted[i].From <= prev.To {
			// merge
			prev.To = max(sorted[i].To, prev.To)
		} else {
			merged = append(merged, prev)
			prev = sorted[i]
		}
	}

	merged = append(merged, prev)

	// count

	var count uint64
	for i := range merged {
		count += merged[i].To - merged[i].From + 1
	}

	return count
}

func main() {
	input = strings.TrimSpace(input)

	var freshRanges FreshRanges
	readFreshRanges := false

	var ingredientIDs []uint64

	for line := range strings.SplitSeq(input, "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			readFreshRanges = true
			continue
		}

		if !readFreshRanges {
			matches := rangeRegexp.FindStringSubmatch(line)
			if len(matches) == 0 {
				panic("failed to parse range: " + line)
			}

			var err error
			var freshRange FreshRange

			freshRange.From, err = strconv.ParseUint(matches[1], 10, 64)
			if err != nil {
				panic(err)
			}

			freshRange.To, err = strconv.ParseUint(matches[2], 10, 64)
			if err != nil {
				panic(err)
			}

			if freshRange.From > freshRange.To {
				panic("from cant be more than to: " + line)
			}

			freshRanges = append(freshRanges, freshRange)
		} else {
			ingredient, err := strconv.ParseUint(line, 10, 64)
			if err != nil {
				panic(err)
			}

			ingredientIDs = append(ingredientIDs, ingredient)
		}
	}

	fmt.Println(freshRanges.TotalFreshForIDs(ingredientIDs))
	fmt.Println(freshRanges.AllFreshCount())
}
