package Routes

import (
	"net/http"

	"ava-sesisenai/backend/internal/Container"

	"github.com/gin-gonic/gin"
)

func Register(r *gin.Engine, c *Container.Container) {
	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"status": "Health status OK"})
	})

	api := r.Group("/api")
	{
		api.GET("/roles", c.RolesCtl.List)
		api.GET("/roles/:id", c.RolesCtl.Show)
	}
}
