package main

import (
	"ava-sesisenai/backend/internal/Config"
	"ava-sesisenai/backend/internal/Container"
	routes "ava-sesisenai/backend/internal/Routes"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func main() {
	Config.InitDB()
	defer func(DB *bun.DB) {
		err := DB.Close()
		if err != nil {

		}
	}(Config.DB)

	c := Container.New(Config.DB)

	r := gin.Default()
	routes.Register(r, c)

	if err := r.Run(":8080"); err != nil {
		panic("Failed to start server: " + err.Error())
	}
}
