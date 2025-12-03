package util

import (
	"math"
)

func GLSLModf(x, y float64) float64 {
	return x - y*math.Floor(x/y)
}

func GLSLModi[T AnyInt | AnyUint](x, y T) T {
	if y == 0 {
		panic("division by zero")
	}

	r := x % y

	if r >= 0 {
		return r
	}

	if y > 0 {
		r += y
	} else {
		r -= y
	}

	return r
}
