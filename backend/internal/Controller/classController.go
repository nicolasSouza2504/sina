package Controller

import (
	"ava-sesisenai/backend/internal/DTO/InBound"
	"ava-sesisenai/backend/internal/Service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ClassController struct{ service *Service.ClassService }

func NewClassController(service *Service.ClassService) *ClassController {
	return &ClassController{service: service}
}

func (cc *ClassController) List(c *gin.Context) {

	classes, err := cc.service.List(c.Request.Context())

	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})

		return

	}

	c.JSON(http.StatusOK, classes)

}

func (cc *ClassController) Create(c *gin.Context) {

	var classDTO *InBound.ClassDTO

	if err := c.ShouldBindJSON(&classDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": err.Error()})
		return
	}

	class, err := cc.service.CreateClass(c.Request.Context(), classDTO)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, class)
}

func (cc *ClassController) Update(c *gin.Context) {

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	var classDTO *InBound.ClassDTO

	if err := c.ShouldBindJSON(&classDTO); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"errors": err.Error()})
		return
	}

	classDTO.ID = id
	class, err := cc.service.UpdateClass(c.Request.Context(), classDTO)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, class)
}

func (cc *ClassController) Delete(c *gin.Context) {

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid ID"})
		return
	}

	class, err := cc.service.DeleteClass(c.Request.Context(), int64(id))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, class)
}
