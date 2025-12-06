package main

import (
	_ "embed"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// ⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣦⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡶⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⠀⠀⠀⣤⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢿⠾⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
// ⠀⣀⣀⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀
// ⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⠀⠀
// ⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆
// ⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟
// ⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀
// ⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡾⠋⠘⣇⠀⠀⠂⠀⠀⠀⠀⠀⢀⡽⠁⠈⠻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀
// ⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠏⠀⠀⠀⠛⣄⠀⠀⠀⠀⠀⠀⠀⣾⠁⠀⠀⠀⢻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⡿⠃⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣄⣀⡀⠀⠀⢻⣤⡀⠀⠀⠀⠀⠠⡇⡀⡀⠀⠀⣀⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⢐⣿⠅⠀⠈⠍⠩⠛⠚⠉⠷⣦⡀⠀⠀⢰⡛⢟⠒⠚⠋⠉⠙⣧⠀⠀⠀⠀⠀⠀⠀⠀⠠⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⢾⣿⣶⣦⣤⣰⣭⣤⣥⢆⠀⠐⠩⠳⢤⡸⣧⣤⣤⢤⣆⣀⣠⣽⠄⠀⠀⠀⠀⠀⠀⠀⠄⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠋⢸⠀⠀⠀⠀⠀⠀⠀⢸⡿⣿⣼⣿⣿⣿⣿⣿⠍⠀⠀⠀⠄⠀⠀⣻⣏⣹⣿⣿⣿⣿⣿⣏⠀⠀⡀⠀⠀⠀⢀⠨⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⢳⡀⠀⠀⠀⠀⣿⡛⣿⣿⣻⣾⣽⣯⣿⠈⠀⠀⠀⠀⠀⠀⣽⣿⣿⣿⣿⡿⣿⣿⡇⠀⠀⠀⠀⠀⡐⠀⠠⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡄⠀⠁⠀⠀⠀⠈⣿⣯⢻⣿⣯⣷⣿⣿⡟⠂⠀⠀⠀⠀⠀⠀⢈⣿⣿⣿⣯⣿⣿⢿⡃⠀⠠⠐⠀⡐⠀⡁⢸⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⠀⡀⣤⡀⠀⡿⡱⠈⡙⠻⠿⠟⠋⠈⠀⠀⠀⠀⠀⠀⠀⠈⠘⠻⠿⠿⠟⠃⣾⠀⢠⢤⣾⠀⠐⠠⠀⣸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⢀⣿⡹⣄⣧⠐⠐⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⢀⠀⡀⠂⠀⠀⠀⠀⣿⣠⢋⣼⣿⡆⠁⠂⢐⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⡧⠀⣼⣿⢿⣦⡻⣧⣄⠂⠁⠀⠐⠀⠀⠺⢿⣄⣀⣀⣸⣿⠇⠀⠀⠠⠐⠀⡁⣠⣧⣿⣿⣛⢷⡀⠀⡾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⣼⡿⣭⣟⣾⣷⣜⢻⣿⣦⣃⡴⣈⣀⢂⠀⡀⢀⠐⡀⢀⠠⢀⡁⢂⣁⣦⣵⣿⣿⣿⠧⢍⣊⣧⢀⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⢻⣷⡿⣟⢾⡿⣾⠛⠹⣟⣯⣘⣭⣟⣶⣵⣬⣲⣤⣧⣮⣷⣿⣿⣿⢿⡿⣯⣷⣿⣌⣶⣿⢻⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠀⠙⢷⣿⣦⡟⠃⠀⠈⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿⣿⣿⣟⣿⣿⡿⢀⡽⢿⢁⡟⣿⡿⢃⠞⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡤⠤⠞⠋⢳⡀⡘⠹⢾⣿⣿⣿⡿⣽⣿⣿⣿⣿⣿⡿⣿⣯⣿⣟⡇⢀⡼⠻⠿⣏⡜⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡠⠼⠛⠉⠈⠀⠀⠀⠠⢀⣿⠠⠖⣾⣿⣿⢿⣻⣿⣿⣿⣿⣿⣟⣿⣻⢿⣿⡷⠺⣡⢃⡀⠀⠀⠈⠙⠒⠦⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜⠁⠀⠀⠀⠀⠀⠀⡀⢆⣱⣷⠿⢧⣰⣿⣿⣿⣻⢿⣿⣿⣿⣿⣿⣽⡿⣽⣿⣿⣿⣱⣿⣦⡐⡄⡁⠀⡀⠀⠀⠀⠉⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⠀⠀⠀⢀⡰⣬⣼⢿⣫⣵⣾⣿⣿⣿⣿⣷⣻⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣵⣂⡄⠠⠀⠀⢀⡾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠦⣀⣠⡴⠖⠋⣱⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣠⡉⢟⠓⠚⠒⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⢿⣿⡿⣯⣿⢿⡿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⢿⣿⣮⡘⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⢡⣾⣿⣟⡿⢯⣟⡿⣽⣟⣯⣿⣻⣯⣿⢯⣿⣽⣿⣻⡿⣟⡿⣯⣷⢿⣳⡿⣟⡿⣾⡽⣿⣾⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢶⡿⠁⣠⠟⣸⣟⣾⣽⠿⠞⠿⠿⠾⠿⣾⣟⡷⣿⢯⣟⡾⣷⣻⡽⣯⡿⠛⠛⠛⠛⠛⠛⠿⢶⡿⡽⡿⠿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⢀⡼⠋⠀⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣽⣻⢾⡽⣳⣯⠟⠉⠀⠀⠀⠀⢀⡀⠀⠀⠀⠑⠍⢥⣀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣄⠚⠀⣀⣠⢤⣶⠊⠉⠁⠈⠉⠒⢒⡤⣄⣀⡀⠀⠈⠙⠛⠁⢀⣀⣤⠴⠒⠋⠁⠀⠀⠉⠑⢶⣄⣀⠈⠏⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠿⣿⢻⣿⡿⢋⠞⠀⠀⠀⠀⠀⠀⠀⢱⣷⣟⣿⣿⡿⣶⣶⣿⣿⣿⣮⠄⠀⠀⠀⠀⠀⠀⠈⣆⠑⠯⣿⣾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠛⠁⢸⠆⠀⠀⠀⠀⠀⠀⠀⣸⠑⠯⣝⣻⣹⣏⣿⡿⠚⠉⠘⡀⠀⠀⠀⠀⠀⠀⠀⢹⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢣⡀⠀⠀⠀⠀⠀⢀⡎⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢧⠀⠀⠀⠀⠀⠀⢀⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠒⠶⠤⠶⠷⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠲⠦⠴⠤⠖⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
//
//                  https://youtu.be/GNeyqFfXf7k
//

var (
	//go:embed input.txt
	input string

	lineRegexp = regexp.MustCompile(`\s+`)
)

type MathProblem struct {
	Numbers  []int
	Operator byte
}

func (problem *MathProblem) Eval() int {
	value := problem.Numbers[0]
	for i := 1; i < len(problem.Numbers); i++ {
		switch problem.Operator {
		case '*':
			value *= problem.Numbers[i]
		case '+':
			value += problem.Numbers[i]
		default:
			panic("unknown operator: " + string(problem.Operator))
		}
	}
	return value
}

func doMath(problems []MathProblem) int {
	sum := 0
	for _, problem := range problems {
		sum += problem.Eval()
	}
	return sum
}

func parseWrong() []MathProblem {
	var problems []MathProblem

	for line := range strings.SplitSeq(strings.TrimSpace(input), "\n") {
		matches := lineRegexp.Split(strings.TrimSpace(line), -1)

		for i, value := range matches {
			if len(problems) <= i {
				problems = append(problems, MathProblem{})
			}

			switch value[0] {
			case '*', '+':
				problems[i].Operator = byte(value[0])
			default:
				n, err := strconv.Atoi(value)
				if err != nil {
					panic(err)
				}
				problems[i].Numbers = append(problems[i].Numbers, n)
			}
		}
	}

	return problems
}

func parseCorrect() []MathProblem {
	lines := strings.Split(input, "\n")

	lineLength := len(lines[0])
	for i := 1; i < len(lines); i++ {
		testLength := len(lines[i])
		if testLength == 0 {
			lines = lines[:len(lines)-1]
			break
		}
		if lineLength != len(lines[i]) {
			panic("not all lines equal length")
		}
	}

	// work backwards

	problemIndex := 0
	var problems []MathProblem

	for x := lineLength - 1; x >= 0; x-- {
		numberStr := ""

		for y := 0; y < len(lines)-1; y++ {
			numberStr += strings.TrimSpace(string(lines[y][x]))
		}

		if numberStr == "" {
			continue
		}

		number, err := strconv.Atoi(numberStr)
		if err != nil {
			panic(err)
		}

		if len(problems) <= problemIndex {
			problems = append(problems, MathProblem{})
		}

		problems[problemIndex].Numbers = append(
			problems[problemIndex].Numbers, number,
		)

		operator := strings.TrimSpace(string(lines[len(lines)-1][x]))
		if operator == "" {
			continue
		}

		problems[problemIndex].Operator = operator[0]
		problemIndex++
	}

	return problems
}

func main() {
	fmt.Println(doMath(parseWrong()))
	fmt.Println(doMath(parseCorrect()))
}
