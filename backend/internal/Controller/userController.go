package Controller

import (
	"net/http"

	"ava-sesisenai/backend/internal/DTO/InBound"
	"ava-sesisenai/backend/internal/Service"

	"github.com/gin-gonic/gin"
)

type UserController struct{ service *Service.UserService }

func NewUserController(service *Service.UserService) *UserController {
	return &UserController{service: service}
}

func (uc *UserController) Create(c *gin.Context) {
	var dto InBound.CreateUserDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": err.Error()})
		return
	}
	user, err := uc.service.CreateUser(c.Request.Context(), &dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

func (uc *UserController) List(c *gin.Context) {
	users, err := uc.service.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}
