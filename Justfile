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