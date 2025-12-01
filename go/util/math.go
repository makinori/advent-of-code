package util

import "math"

// TODO: write GLSLModi

func GLSLMod(x float64, y float64) float64 {
	return x - y*math.Floor(x/y)
}
