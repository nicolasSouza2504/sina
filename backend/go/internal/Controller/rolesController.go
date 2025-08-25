package Controller

import (
	"net/http"
	"strconv"

	"ava-sesisenai/backend/internal/Repository"

	"github.com/gin-gonic/gin"
)

type RolesController struct {
	repo Repository.IRolesRepository
}

func NewRolesController(repo Repository.IRolesRepository) *RolesController {
	return &RolesController{repo: repo}
}

func (rc *RolesController) List(c *gin.Context) {
	roles, err := rc.repo.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, roles)
}

func (rc *RolesController) Show(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	role, err := rc.repo.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, role)
}
