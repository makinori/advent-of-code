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

	# fails if remote not found
	git remote get-url public > /dev/null

	commits=$(git rev-list --count HEAD)
	from=$(git log --date=format:%b\ %Y --format=%ad --max-parents=0 -n1)
	# to=$(git log --date=format:%b\ %Y --format=%ad -1)
	message="Squash $commits commits since $from"

	git branch -D public || true
	git checkout --orphan public
	git rm -f "*.txt"
	git add .
	git commit -am "$message"
	git push --force --set-upstream public public:main
	git checkout main
	git branch -D public