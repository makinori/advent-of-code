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

	# fail if remote or git-filter-repo not found
	git remote get-url public > /dev/null
	git-filter-repo --version > /dev/null

	git checkout -B public
	git-filter-repo --refs HEAD --invert-paths --path-glob "*.txt" --force
	git push --force --set-upstream public public:main
	git checkout main
	git branch -D public