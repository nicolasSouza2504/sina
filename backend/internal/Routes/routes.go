package Routes

import (
	"net/http"

	"ava-sesisenai/backend/internal/Controller"

	"github.com/gin-gonic/gin"
)

func Register(r *gin.Engine, users *Controller.UserController, roles *Controller.RolesController, classes *Controller.ClassController) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "Health status OK"})
	})

	r.NoRoute(func(c *gin.Context) { c.JSON(http.StatusNotFound, gin.H{"error": "route not found"}) })
	r.NoMethod(func(c *gin.Context) { c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "method not allowed"}) })

	api := r.Group("/api")
	{
		u := api.Group("/users")
		u.POST("", users.Create)
		u.GET("", users.List)

		rg := api.Group("/roles")
		rg.GET("", roles.List)
		rg.GET("/:id", roles.Show)

		cl := api.Group("/classes")
		cl.GET("", classes.List);
		cl.POST("", classes.Create);
		cl.PUT("/:id", classes.Update);
		cl.DELETE("/:id", classes.Delete);
		
	}
}
