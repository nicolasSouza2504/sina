package Repository

import (
	"context"
	"database/sql"
	"testing"

	"ava-sesisenai/backend/internal/Modules"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Interface para o repositório para permitir mocking
type RolesRepositoryInterface interface {
	List(ctx context.Context) ([]Modules.Role, error)
	GetByID(ctx context.Context, id int64) (*Modules.Role, error)
}

// MockRolesRepository é um mock do repositório para testes
type MockRolesRepository struct {
	mock.Mock
}

func (m *MockRolesRepository) List(ctx context.Context) ([]Modules.Role, error) {
	args := m.Called(ctx)
	return args.Get(0).([]Modules.Role), args.Error(1)
}

func (m *MockRolesRepository) GetByID(ctx context.Context, id int64) (*Modules.Role, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*Modules.Role), args.Error(1)
}

func TestMockRolesRepository_List_Success(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	expectedRoles := []Modules.Role{
		{ID: 1, Name: "Admin"},
		{ID: 2, Name: "User"},
	}

	mockRepo.On("List", mock.Anything).Return(expectedRoles, nil)

	// Act
	roles, err := mockRepo.List(context.Background())

	// Assert
	assert.NoError(t, err)
	assert.Len(t, roles, 2)
	assert.Equal(t, expectedRoles[0].ID, roles[0].ID)
	assert.Equal(t, expectedRoles[0].Name, roles[0].Name)
	assert.Equal(t, expectedRoles[1].ID, roles[1].ID)
	assert.Equal(t, expectedRoles[1].Name, roles[1].Name)

	mockRepo.AssertExpectations(t)
}

func TestMockRolesRepository_List_Error(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	expectedError := sql.ErrConnDone

	mockRepo.On("List", mock.Anything).Return([]Modules.Role{}, expectedError)

	// Act
	roles, err := mockRepo.List(context.Background())

	// Assert
	assert.Error(t, err)
	assert.Equal(t, expectedError, err)
	assert.Empty(t, roles) // Mudança: verificar se está vazio, não nil

	mockRepo.AssertExpectations(t)
}

func TestMockRolesRepository_GetByID_Success(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	expectedRole := &Modules.Role{ID: 1, Name: "Admin"}
	id := int64(1)

	mockRepo.On("GetByID", mock.Anything, id).Return(expectedRole, nil)

	// Act
	role, err := mockRepo.GetByID(context.Background(), id)

	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, role)
	assert.Equal(t, expectedRole.ID, role.ID)
	assert.Equal(t, expectedRole.Name, role.Name)

	mockRepo.AssertExpectations(t)
}

func TestMockRolesRepository_GetByID_NotFound(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	id := int64(999)

	mockRepo.On("GetByID", mock.Anything, id).Return(nil, sql.ErrNoRows)

	// Act
	role, err := mockRepo.GetByID(context.Background(), id)

	// Assert
	assert.Error(t, err)
	assert.Equal(t, sql.ErrNoRows, err)
	assert.Nil(t, role)

	mockRepo.AssertExpectations(t)
}

func TestMockRolesRepository_GetByID_DatabaseError(t *testing.T) {
	// Arrange
	mockRepo := &MockRolesRepository{}
	id := int64(1)
	expectedError := sql.ErrConnDone

	mockRepo.On("GetByID", mock.Anything, id).Return(nil, expectedError)

	// Act
	role, err := mockRepo.GetByID(context.Background(), id)

	// Assert
	assert.Error(t, err)
	assert.Equal(t, expectedError, err)
	assert.Nil(t, role)

	mockRepo.AssertExpectations(t)
}

func TestMockRolesRepository_InterfaceCompliance(t *testing.T) {
	// Teste para verificar se o mock implementa a interface corretamente
	var repo RolesRepositoryInterface = &MockRolesRepository{}
	assert.NotNil(t, repo)
}

func TestMockRolesRepository_ContextHandling(t *testing.T) {
	// Teste para verificar se o contexto é passado corretamente
	t.Run("Context is passed to mock", func(t *testing.T) {
		// Arrange
		mockRepo := &MockRolesRepository{}
		ctx := context.Background()
		expectedRoles := []Modules.Role{{ID: 1, Name: "Admin"}}

		mockRepo.On("List", ctx).Return(expectedRoles, nil)

		// Act
		roles, err := mockRepo.List(ctx)

		// Assert
		assert.NoError(t, err)
		assert.Len(t, roles, 1)
		mockRepo.AssertExpectations(t)
	})
}

func TestMockRolesRepository_MultipleCalls(t *testing.T) {
	// Teste para verificar múltiplas chamadas
	t.Run("Multiple calls to repository", func(t *testing.T) {
		// Arrange
		mockRepo := &MockRolesRepository{}
		expectedRole1 := &Modules.Role{ID: 1, Name: "Admin"}
		expectedRole2 := &Modules.Role{ID: 2, Name: "User"}

		mockRepo.On("GetByID", mock.Anything, int64(1)).Return(expectedRole1, nil)
		mockRepo.On("GetByID", mock.Anything, int64(2)).Return(expectedRole2, nil)

		// Act
		role1, err1 := mockRepo.GetByID(context.Background(), 1)
		role2, err2 := mockRepo.GetByID(context.Background(), 2)

		// Assert
		assert.NoError(t, err1)
		assert.NoError(t, err2)
		assert.Equal(t, expectedRole1.ID, role1.ID)
		assert.Equal(t, expectedRole2.ID, role2.ID)

		mockRepo.AssertExpectations(t)
	})
} 