package Routes

import (
	"github.com/gin-gonic/gin"
)

func Routes(r *gin.Engine) {
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "Health status OK",
		})
	})
}
