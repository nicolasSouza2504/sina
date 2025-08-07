package main

import (
	routes "ava-sesisenai/backend/internal/Routes"

	"github.com/gin-gonic/gin"
)

func main() {
	runner := gin.Default()

	routes.Routes(runner)

	if err := runner.Run(":8080"); err != nil {
		panic("Failed to start server: " + err.Error())
	}
}
