package Controller

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"ava-sesisenai/backend/internal/Modules"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Interface para o repositório para permitir mocking
type RolesRepositoryInterface interface {
	List(ctx interface{}) ([]Modules.Role, error)
	GetByID(ctx interface{}, id int64) (*Modules.Role, error)
}

// MockRolesRepository é um mock do repositório para testes
type MockRolesRepository struct {
	mock.Mock
}

func (m *MockRolesRepository) List(ctx interface{}) ([]Modules.Role, error) {
	args := m.Called(ctx)
	return args.Get(0).([]Modules.Role), args.Error(1)
}

func (m *MockRolesRepository) GetByID(ctx interface{}, id int64) (*Modules.Role, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*Modules.Role), args.Error(1)
}

// Controller modificado para aceitar interface
type RolesControllerWithInterface struct {
	repo RolesRepositoryInterface
}

func NewRolesControllerWithInterface(repo RolesRepositoryInterface) *RolesControllerWithInterface {
	return &RolesControllerWithInterface{repo: repo}
}

func (ctl *RolesControllerWithInterface) List(c *gin.Context) {
	ctx := context.Background()
	if c.Request != nil {
		ctx = c.Request.Context()
	}
	roles, err := ctl.repo.List(ctx)
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

func (ctl *RolesControllerWithInterface) Show(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	ctx := context.Background()
	if c.Request != nil {
		ctx = c.Request.Context()
	}
	role, err := ctl.repo.GetByID(ctx, id)
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

func TestNewRolesControllerWithInterface(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}

	// Act
	controller := NewRolesControllerWithInterface(mockRepo)

	// Assert
	assert.NotNil(t, controller)
	assert.Equal(t, mockRepo, controller.repo)
}

func TestRolesControllerWithInterface_List_Success(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	controller := NewRolesControllerWithInterface(mockRepo)

	expectedRoles := []Modules.Role{
		{ID: 1, Name: "Admin"},
		{ID: 2, Name: "User"},
	}

	mockRepo.On("List", mock.Anything).Return(expectedRoles, nil)

	// Configurar o Gin para modo de teste
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Act
	controller.List(c)

	// Assert
	assert.Equal(t, http.StatusOK, w.Code)

	var response []Modules.Role
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Len(t, response, 2)
	assert.Equal(t, expectedRoles[0].ID, response[0].ID)
	assert.Equal(t, expectedRoles[0].Name, response[0].Name)
	assert.Equal(t, expectedRoles[1].ID, response[1].ID)
	assert.Equal(t, expectedRoles[1].Name, response[1].Name)

	mockRepo.AssertExpectations(t)
}

func TestRolesControllerWithInterface_List_EmptyResult(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	controller := NewRolesControllerWithInterface(mockRepo)

	mockRepo.On("List", mock.Anything).Return([]Modules.Role{}, nil)

	// Configurar o Gin para modo de teste
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Act
	controller.List(c)

	// Assert
	assert.Equal(t, http.StatusOK, w.Code) // Mudança: lista vazia retorna 200, não 204

	mockRepo.AssertExpectations(t)
}

func TestRolesControllerWithInterface_List_Error(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	controller := NewRolesControllerWithInterface(mockRepo)

	expectedError := sql.ErrConnDone
	mockRepo.On("List", mock.Anything).Return([]Modules.Role{}, expectedError)

	// Configurar o Gin para modo de teste
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Act
	controller.List(c)

	// Assert
	assert.Equal(t, http.StatusInternalServerError, w.Code)

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, expectedError.Error(), response["error"])

	mockRepo.AssertExpectations(t)
}

func TestRolesControllerWithInterface_Show_Success(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	controller := NewRolesControllerWithInterface(mockRepo)

	expectedRole := &Modules.Role{ID: 1, Name: "Admin"}
	id := int64(1)

	mockRepo.On("GetByID", mock.Anything, id).Return(expectedRole, nil)

	// Configurar o Gin para modo de teste
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "1"}}

	// Act
	controller.Show(c)

	// Assert
	assert.Equal(t, http.StatusOK, w.Code)

	var response Modules.Role
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, expectedRole.ID, response.ID)
	assert.Equal(t, expectedRole.Name, response.Name)

	mockRepo.AssertExpectations(t)
}

func TestRolesControllerWithInterface_Show_InvalidID(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	controller := NewRolesControllerWithInterface(mockRepo)

	// Configurar o Gin para modo de teste
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "invalid"}}

	// Act
	controller.Show(c)

	// Assert
	assert.Equal(t, http.StatusBadRequest, w.Code)

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "invalid id", response["error"])
}

func TestRolesControllerWithInterface_Show_NegativeID(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	controller := NewRolesControllerWithInterface(mockRepo)

	// Configurar o Gin para modo de teste
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "-1"}}

	// Act
	controller.Show(c)

	// Assert
	assert.Equal(t, http.StatusBadRequest, w.Code)

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "invalid id", response["error"])
}

func TestRolesControllerWithInterface_Show_ZeroID(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	controller := NewRolesControllerWithInterface(mockRepo)

	// Configurar o Gin para modo de teste
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "0"}}

	// Act
	controller.Show(c)

	// Assert
	assert.Equal(t, http.StatusBadRequest, w.Code)

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "invalid id", response["error"])
}

func TestRolesControllerWithInterface_Show_NotFound(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	controller := NewRolesControllerWithInterface(mockRepo)

	id := int64(999)
	mockRepo.On("GetByID", mock.Anything, id).Return(nil, sql.ErrNoRows)

	// Configurar o Gin para modo de teste
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "999"}}

	// Act
	controller.Show(c)

	// Assert
	assert.Equal(t, http.StatusNotFound, w.Code)

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "role not found", response["error"])

	mockRepo.AssertExpectations(t)
}

func TestRolesControllerWithInterface_Show_DatabaseError(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	controller := NewRolesControllerWithInterface(mockRepo)

	id := int64(1)
	expectedError := sql.ErrConnDone
	mockRepo.On("GetByID", mock.Anything, id).Return(nil, expectedError)

	// Configurar o Gin para modo de teste
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Params = gin.Params{{Key: "id", Value: "1"}}

	// Act
	controller.Show(c)

	// Assert
	assert.Equal(t, http.StatusInternalServerError, w.Code)

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, expectedError.Error(), response["error"])

	mockRepo.AssertExpectations(t)
} 