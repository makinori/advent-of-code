export CGO_ENABLED := "0"
export GOEXPERIMENT := "greenteagc"

default:
	@just --list

_list dir regex:
	#!/usr/bin/env python3
	from pathlib import Path
	import re

	years = []
	for dir in Path("{{dir}}").iterdir():
		if not re.search(r"^\d+$", dir.name):
			continue
		years.append(int(dir.name))
	years.sort()
	years.reverse()

	for year in years:
		days = []
		for file in (Path("{{dir}}") / str(year)).iterdir():
			match = re.match(r"^{{regex}}$", file.name)
			if not match:
				continue
			days.append(int(match.group(1)))
		days.sort()
		print(str(year) + ": " + ",".join(str(n) for n in days))


alias l := list
[group("go")]
list: (_list '.' 'day(\d+)')

alias ld := list-deno
[group("deno")]
list-deno: (_list 'deno' '(\d+)\.ts')

alias la := list-all
list-all:
	@echo "go:"
	@just list
	@echo "deno:"
	@just list-deno

alias r := run
[group("go")]
run year day *args:
	go run ./{{year}}/day{{day}} {{args}}

alias rd := run-deno
[group("deno")]
run-deno year day:
	deno run --allow-read ./deno/{{year}}/{{day}}.ts

alias b := build
[group("go")]
build year day:
	go build -ldflags "-s -w" ./{{year}}/day{{day}}
	strip day{{day}}

alias c := clean
[group("go")]
clean:
	rm -f day*

alias n := new
[group("go")]
new year day:
	d="./{{year}}/day{{day}}" && mkdir -p "$d" && \
	f="$d/main.go" && [ -f "$f" ] && echo "already exists" || \
	(cp _template.go "$f" && touch "$d/input.txt" && xdg-open "$f")

alias up := update-public
[group("internal")]
update-public:
	#!/usr/bin/env bash
	set -euo pipefail

	# fail if remote or git-filter-repo not found
	git remote get-url public > /dev/null
	git-filter-repo --version > /dev/null

	git checkout -B public
	rm -f .git/filter-repo/already_ran
	git-filter-repo --refs HEAD --invert-paths --path-glob "*.txt" --force
	git push --force --set-upstream public public:main
	git checkout main
	git branch -D public
