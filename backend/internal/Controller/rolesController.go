package Controller

import (
	"database/sql"
	"net/http"
	"strconv"

	"ava-sesisenai/backend/internal/Repository"

	"github.com/gin-gonic/gin"
)

type RolesController struct {
	repo *Repository.RolesRepository
}

func NewRolesController(repo *Repository.RolesRepository) *RolesController {
	return &RolesController{repo: repo}
}

func (ctl *RolesController) List(c *gin.Context) {
	roles, err := ctl.repo.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(roles) <= 0 {
		c.Status(http.StatusNoContent)
		return
	}
	c.JSON(http.StatusOK, roles)
}

func (ctl *RolesController) Show(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	role, err := ctl.repo.GetByID(c.Request.Context(), id)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "role not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, role)
}
