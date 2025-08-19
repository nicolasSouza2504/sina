package main

import "ava-sesisenai/backend/internal/Bootstrap"

func main() {
	c := Bootstrap.BuildContainer()
	Bootstrap.Run(c)
}
