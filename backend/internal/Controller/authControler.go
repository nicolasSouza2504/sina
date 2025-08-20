package Controller

import (
	"ava-sesisenai/backend/internal/DTO/InBound"
	"ava-sesisenai/backend/internal/Service"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	service *Service.AuthService
}

func NewAuthController(service *Service.AuthService) *AuthController {
	return &AuthController{service: service}
}
func (ac *AuthController) Login(c *gin.Context) {
	var dto InBound.UserLoginDTO
	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(422, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}
	authenticatedResponse, err := ac.service.Login(c.Request.Context(), &dto)
	if err != nil {
		c.JSON(422, gin.H{"error": "Invalid credentials", "details": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"message": "Login successful",
		"token":   authenticatedResponse.Token,
	})
}
