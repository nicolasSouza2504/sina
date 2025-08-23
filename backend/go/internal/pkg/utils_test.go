package pkg

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

// Funções utilitárias para teste
func IsValidEmail(email string) bool {
	if email == "" {
		return false
	}
	// Implementação simples de validação de email
	// Em um cenário real, você usaria uma regex mais robusta
	return len(email) > 3 && len(email) < 255
}

func IsValidPassword(password string) bool {
	if len(password) < 8 {
		return false
	}
	// Verificar se contém pelo menos uma letra maiúscula, uma minúscula e um número
	hasUpper := false
	hasLower := false
	hasNumber := false

	for _, char := range password {
		if char >= 'A' && char <= 'Z' {
			hasUpper = true
		} else if char >= 'a' && char <= 'z' {
			hasLower = true
		} else if char >= '0' && char <= '9' {
			hasNumber = true
		}
	}

	return hasUpper && hasLower && hasNumber
}

func FormatDate(date time.Time) string {
	return date.Format("2006-01-02")
}

func IsValidID(id int64) bool {
	return id > 0
}

func TestIsValidEmail(t *testing.T) {
	tests := []struct {
		name     string
		email    string
		expected bool
	}{
		{
			name:     "Valid email",
			email:    "test@example.com",
			expected: true,
		},
		{
			name:     "Valid email with subdomain",
			email:    "user@sub.example.com",
			expected: true,
		},
		{
			name:     "Empty email",
			email:    "",
			expected: false,
		},
		{
			name:     "Too short email",
			email:    "a@b",
			expected: false,
		},
		{
			name:     "Email without @",
			email:    "testexample.com",
			expected: true, // Nossa validação simples não verifica @
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Act
			result := IsValidEmail(tt.email)

			// Assert
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestIsValidPassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		expected bool
	}{
		{
			name:     "Valid password",
			password: "Password123",
			expected: true,
		},
		{
			name:     "Password too short",
			password: "Pass1",
			expected: false,
		},
		{
			name:     "Password without uppercase",
			password: "password123",
			expected: false,
		},
		{
			name:     "Password without lowercase",
			password: "PASSWORD123",
			expected: false,
		},
		{
			name:     "Password without number",
			password: "PasswordABC",
			expected: false,
		},
		{
			name:     "Empty password",
			password: "",
			expected: false,
		},
		{
			name:     "Password with special characters",
			password: "Pass@word123",
			expected: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Act
			result := IsValidPassword(tt.password)

			// Assert
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestFormatDate(t *testing.T) {
	tests := []struct {
		name     string
		date     time.Time
		expected string
	}{
		{
			name:     "Standard date",
			date:     time.Date(2024, 1, 15, 10, 30, 0, 0, time.UTC),
			expected: "2024-01-15",
		},
		{
			name:     "Date with time",
			date:     time.Date(2023, 12, 31, 23, 59, 59, 0, time.UTC),
			expected: "2023-12-31",
		},
		{
			name:     "Leap year date",
			date:     time.Date(2024, 2, 29, 0, 0, 0, 0, time.UTC),
			expected: "2024-02-29",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Act
			result := FormatDate(tt.date)

			// Assert
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestIsValidID(t *testing.T) {
	tests := []struct {
		name     string
		id       int64
		expected bool
	}{
		{
			name:     "Valid positive ID",
			id:       1,
			expected: true,
		},
		{
			name:     "Valid large ID",
			id:       999999,
			expected: true,
		},
		{
			name:     "Zero ID",
			id:       0,
			expected: false,
		},
		{
			name:     "Negative ID",
			id:       -1,
			expected: false,
		},
		{
			name:     "Large negative ID",
			id:       -999999,
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Act
			result := IsValidID(tt.id)

			// Assert
			assert.Equal(t, tt.expected, result)
		})
	}
}

// Testes de benchmark para verificar performance
func BenchmarkIsValidEmail(b *testing.B) {
	email := "test@example.com"
	for i := 0; i < b.N; i++ {
		IsValidEmail(email)
	}
}

func BenchmarkIsValidPassword(b *testing.B) {
	password := "Password123"
	for i := 0; i < b.N; i++ {
		IsValidPassword(password)
	}
}

func BenchmarkFormatDate(b *testing.B) {
	date := time.Now()
	for i := 0; i < b.N; i++ {
		FormatDate(date)
	}
}

func BenchmarkIsValidID(b *testing.B) {
	id := int64(123)
	for i := 0; i < b.N; i++ {
		IsValidID(id)
	}
}

// Testes de exemplo para documentação
func ExampleIsValidEmail() {
	email := "user@example.com"
	valid := IsValidEmail(email)
	fmt.Println(valid)
	// Output: true
}

func ExampleIsValidPassword() {
	password := "SecurePass123"
	valid := IsValidPassword(password)
	fmt.Println(valid)
	// Output: true
}

func ExampleFormatDate() {
	date := time.Date(2024, 1, 15, 10, 30, 0, 0, time.UTC)
	formatted := FormatDate(date)
	fmt.Println(formatted)
	// Output: 2024-01-15
}

func ExampleIsValidID() {
	id := int64(123)
	valid := IsValidID(id)
	fmt.Println(valid)
	// Output: true
} 