package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(rw, "Hello World")
	})

	fmt.Printf("Starting Server at :3000")
	http.ListenAndServe(":3000", nil)
}
