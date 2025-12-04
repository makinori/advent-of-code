default:
	@just --list

[working-directory: "go"]
go *args:
	@just {{args}}

[working-directory: "deno"]
deno *args:
	@just {{args}}

list:
	@echo "go:"
	@cd go && just list
	@echo "deno:"
	@cd deno && just list

[group("internal")]
update-public:
	#!/usr/bin/env bash
	set -euo pipefail

	git remote get-url public # fails if remote not found

	commits=$(git rev-list --count HEAD)
	from=$(git log --format=%ai --max-parents=0 -n1 | cut -d- -f1)
	to=$(git log -1 --format=%ai | cut -d- -f1)
	message="Squash $commits commits from $from to $to"

	git branch -D public || true
	git checkout --orphan public
	git rm -f "*.txt"
	git add .
	git commit -am "$message"
	git push --force --set-upstream public public:main
	git checkout main
	git branch -D public