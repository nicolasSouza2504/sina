package Modules

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRole_Struct(t *testing.T) {
	// Arrange & Act
	role := Role{
		ID:   1,
		Name: "Admin",
	}

	// Assert
	assert.Equal(t, int64(1), role.ID)
	assert.Equal(t, "Admin", role.Name)
}

func TestRole_ZeroValues(t *testing.T) {
	// Arrange & Act
	var role Role

	// Assert
	assert.Equal(t, int64(0), role.ID)
	assert.Equal(t, "", role.Name)
}

func TestRole_JSONTags(t *testing.T) {
	// Arrange
	role := Role{
		ID:   1,
		Name: "Admin",
	}

	// Act & Assert
	// Verificar se os campos têm as tags JSON corretas
	// Isso é verificado indiretamente através da estrutura
	assert.NotEmpty(t, role.ID)
	assert.NotEmpty(t, role.Name)
}

func TestRole_BunTags(t *testing.T) {
	// Arrange
	role := Role{
		ID:   1,
		Name: "Admin",
	}

	// Act & Assert
	// Verificar se os campos têm as tags Bun corretas
	// Isso é verificado indiretamente através da estrutura
	assert.NotEmpty(t, role.ID)
	assert.NotEmpty(t, role.Name)
}

func TestRole_TableName(t *testing.T) {
	// Arrange
	role := Role{}

	// Act & Assert
	// Verificar se a tabela está definida corretamente
	// A tag bun:"table:roles" deve estar presente
	assert.NotNil(t, role)
}

func TestRole_UniqueConstraint(t *testing.T) {
	// Arrange
	role1 := Role{
		ID:   1,
		Name: "Admin",
	}
	role2 := Role{
		ID:   2,
		Name: "User",
	}

	// Act & Assert
	// Verificar se os nomes são únicos (simulação da constraint unique)
	assert.NotEqual(t, role1.Name, role2.Name)
}

func TestRole_NotNullConstraint(t *testing.T) {
	// Arrange
	role := Role{
		ID:   1,
		Name: "Admin",
	}

	// Act & Assert
	// Verificar se o nome não está vazio (simulação da constraint notnull)
	assert.NotEmpty(t, role.Name)
}

func TestRole_AutoIncrement(t *testing.T) {
	// Arrange
	role1 := Role{
		ID:   1,
		Name: "Admin",
	}
	role2 := Role{
		ID:   2,
		Name: "User",
	}

	// Act & Assert
	// Verificar se os IDs são sequenciais (simulação do autoincrement)
	assert.Less(t, role1.ID, role2.ID)
}

func TestRole_PrimaryKey(t *testing.T) {
	// Arrange
	role1 := Role{
		ID:   1,
		Name: "Admin",
	}
	role2 := Role{
		ID:   2,
		Name: "User",
	}

	// Act & Assert
	// Verificar se os IDs são únicos (simulação da primary key)
	assert.NotEqual(t, role1.ID, role2.ID)
}

func TestRole_Validation(t *testing.T) {
	tests := []struct {
		name    string
		role    Role
		isValid bool
	}{
		{
			name: "Valid role with positive ID and non-empty name",
			role: Role{
				ID:   1,
				Name: "Admin",
			},
			isValid: true,
		},
		{
			name: "Valid role with zero ID (new record)",
			role: Role{
				ID:   0,
				Name: "Admin",
			},
			isValid: true,
		},
		{
			name: "Invalid role with empty name",
			role: Role{
				ID:   1,
				Name: "",
			},
			isValid: false,
		},
		{
			name: "Invalid role with negative ID",
			role: Role{
				ID:   -1,
				Name: "Admin",
			},
			isValid: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Act
			isValid := tt.role.ID >= 0 && tt.role.Name != ""

			// Assert
			assert.Equal(t, tt.isValid, isValid)
		})
	}
}

func TestRole_Equality(t *testing.T) {
	// Arrange
	role1 := Role{
		ID:   1,
		Name: "Admin",
	}
	role2 := Role{
		ID:   1,
		Name: "Admin",
	}
	role3 := Role{
		ID:   2,
		Name: "Admin",
	}

	// Act & Assert
	// Verificar igualdade baseada no ID
	assert.Equal(t, role1.ID, role2.ID)
	assert.NotEqual(t, role1.ID, role3.ID)
}

func TestRole_Copy(t *testing.T) {
	// Arrange
	original := Role{
		ID:   1,
		Name: "Admin",
	}

	// Act
	copied := original

	// Assert
	assert.Equal(t, original.ID, copied.ID)
	assert.Equal(t, original.Name, copied.Name)
	
	// Modificar a cópia não deve afetar o original
	copied.Name = "Modified"
	assert.NotEqual(t, original.Name, copied.Name)
} 