echo -n "$(pwd)"
CGO_ENABLED=0 go build -o server main.go 