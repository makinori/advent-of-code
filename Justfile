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

update-public:
	git remote get-url public # fails if remote not found
	git branch -D public || true
	git checkout --orphan public
	git rm -f "*.txt"
	git add .
	git commit -am "$(date +'%Y-%m-%d %H:%M:%S')"
	git push --force --set-upstream public public:main
	git checkout main
	git branch -D public