package util

import (
	"slices"
)

var factorsCache = map[uint][]uint{}

func Factors(n uint) []uint {
	if n == 0 {
		return []uint{}
	}

	if n == 1 {
		return []uint{1}
	}

	// could probably optimize further by using the cache in our for loop lol
	// perhaps time to write some tests

	cache, ok := factorsCache[n]
	if ok {
		factors := make([]uint, len(cache))
		copy(factors, cache)
		return factors
	}

	// factors start at 1, end at n/2 and include self
	// the result of our division is also a factor
	// if result <= i, we can end early

	var factors []uint
	var otherFactors []uint

	for i := uint(1); i <= n/2; i++ {
		frac := n % i
		if frac != 0 {
			continue
		}

		// fmt.Println("i", i)

		if slices.Index(otherFactors, i) > -1 {
			break
		}

		factors = append(factors, i)

		otherFactor := n / i

		// fmt.Println("o", otherFactor)

		if otherFactor <= i {
			break
		}

		// if slices.Index(factors, otherFactor) > -1 {
		// 	panic("otherFactor already in factors")
		// }

		otherFactors = append(otherFactors, otherFactor)
	}

	// UintSlice(factors).Sort()

	slices.Reverse(otherFactors)

	factors = append(factors, otherFactors...)

	factorsCache[n] = make([]uint, len(factors))
	copy(factorsCache[n], factors)

	return factors
}
