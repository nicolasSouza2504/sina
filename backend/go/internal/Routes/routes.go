package Routes

import (
	"ava-sesisenai/backend/internal/Middleware"
	"net/http"

	"ava-sesisenai/backend/internal/Controller"

	"github.com/gin-gonic/gin"
)

func Register(r *gin.Engine, users *Controller.UserController, roles *Controller.RolesController, classes *Controller.ClassController, auth *Controller.AuthController) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "Health status OK"})
	})

	r.NoRoute(func(c *gin.Context) { c.JSON(http.StatusNotFound, gin.H{"error": "route not found"}) })
	r.NoMethod(func(c *gin.Context) { c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "method not allowed"}) })

	api := r.Group("/api")
	api.POST("auth/login", auth.Login)

	usersGroup := api.Group("/users")
	usersGroup.Use(Middleware.RequireAuth())
	{

		usersGroup.POST("/users", users.Create)
		usersGroup.GET("", users.List)
		usersGroup.GET("/:id", users.Show)
		usersGroup.PATCH("/:id", users.Update)
		usersGroup.PATCH("/:id/reactivate", users.Reactivate)
		usersGroup.DELETE("/:id", users.Delete)
	}

	rolesGroup := api.Group("/roles")
	rolesGroup.Use(Middleware.RequireAuth())
	{
		rolesGroup.GET("", roles.List)
		rolesGroup.GET("/:id", roles.Show)
	}

	classesGroup := api.Group("/classes")
	classesGroup.Use(Middleware.RequireAuth())
	{
		classesGroup.GET("", classes.List)
		classesGroup.POST("", classes.Create)
		classesGroup.PATCH("/:id", classes.Update)
		classesGroup.DELETE("/:id", classes.Delete)
	}
}
