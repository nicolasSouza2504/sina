# Testes Unitários - AVA SENAI Backend

Este documento descreve a implementação de testes unitários para o projeto AVA SENAI Backend usando o framework de testing padrão do Go.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura dos Testes](#estrutura-dos-testes)
- [Como Executar](#como-executar)
- [Tipos de Teste](#tipos-de-teste)
- [Cobertura de Código](#cobertura-de-código)
- [Boas Práticas](#boas-práticas)
- [Exemplos](#exemplos)

## 🎯 Visão Geral

Os testes unitários foram implementados seguindo as melhores práticas do Go e cobrem os principais componentes do sistema:

- **Repository Layer**: Testes para acesso a dados
- **Controller Layer**: Testes para lógica de negócio e HTTP handlers
- **Modules**: Testes para estruturas de dados
- **Config**: Testes para configuração do sistema
- **Utils**: Testes para funções utilitárias
- **Integration**: Testes de integração entre componentes

## 📁 Estrutura dos Testes

```
backend/
├── internal/
│   ├── Repository/
│   │   ├── rolesRepository.go
│   │   └── rolesRepository_test.go      # Testes do repositório
│   ├── Controller/
│   │   ├── rolesController.go
│   │   └── rolesController_test.go      # Testes do controller
│   ├── Modules/
│   │   ├── role.go
│   │   └── role_test.go                 # Testes dos módulos
│   ├── Config/
│   │   ├── database.go
│   │   └── database_test.go             # Testes de configuração
│   ├── pkg/
│   │   ├── utils.go
│   │   └── utils_test.go                # Testes de utilitários
│   └── integration_test.go              # Testes de integração
├── Makefile                             # Comandos para execução
└── TESTING.md                           # Esta documentação
```

## 🚀 Como Executar

### Pré-requisitos

```bash
# Instalar dependências de desenvolvimento
make install-deps

# Ou manualmente
go get github.com/stretchr/testify@latest
```

### Comandos Principais

```bash
# Executar todos os testes
make test

# Executar testes com cobertura
make test-coverage

# Executar testes específicos
make test-specific TEST=TestRolesController_List_Success

# Executar testes por categoria
make test-unit          # Apenas testes unitários
make test-integration   # Apenas testes de integração
make test-controller    # Testes do controller
make test-repository    # Testes do repository
```

### Comandos Avançados

```bash
# Executar testes com detecção de race conditions
make test-race

# Executar benchmarks
make test-benchmark

# Executar testes em modo watch (desenvolvimento)
make test-watch

# Gerar relatório completo
make test-report
```

## 🧪 Tipos de Teste

### 1. Testes Unitários

Testam componentes isolados usando mocks para dependências externas.

**Exemplo - Repository:**
```go
func TestRolesRepository_List_Success(t *testing.T) {
    // Arrange
    mockDB := &MockDB{}
    expectedRoles := []Modules.Role{
        {ID: 1, Name: "Admin"},
        {ID: 2, Name: "User"},
    }
    
    // Act
    roles, err := repo.List(context.Background())
    
    // Assert
    assert.NoError(t, err)
    assert.Len(t, roles, 2)
}
```

### 2. Testes de Integração

Testam a interação entre diferentes componentes do sistema.

**Exemplo - Controller + Repository:**
```go
func TestIntegration_RepositoryToController(t *testing.T) {
    // Arrange
    mockRepo := &MockRepository{}
    controller := Controller.NewRolesController(mockRepo)
    
    // Act & Assert
    // Testa o fluxo completo
}
```

### 3. Testes de Performance (Benchmarks)

Avaliam a performance de funções críticas.

**Exemplo:**
```go
func BenchmarkIsValidEmail(b *testing.B) {
    email := "test@example.com"
    for i := 0; i < b.N; i++ {
        IsValidEmail(email)
    }
}
```

### 4. Testes de Exemplo

Documentam como usar as funções através de testes.

**Exemplo:**
```go
func ExampleIsValidEmail() {
    email := "user@example.com"
    valid := IsValidEmail(email)
    // Output: true
}
```

## 📊 Cobertura de Código

### Gerar Relatório de Cobertura

```bash
# Gerar relatório HTML
make test-coverage

# Ver cobertura no terminal
go tool cover -func=coverage/coverage.out
```

### Metas de Cobertura

- **Repository Layer**: 95%+
- **Controller Layer**: 90%+
- **Modules**: 100%
- **Config**: 85%+
- **Utils**: 100%

## ✅ Boas Práticas Implementadas

### 1. Padrão AAA (Arrange, Act, Assert)

```go
func TestExample(t *testing.T) {
    // Arrange - Preparar dados e mocks
    mockRepo := &MockRepository{}
    expected := "expected result"
    
    // Act - Executar a função testada
    result := functionUnderTest()
    
    // Assert - Verificar resultados
    assert.Equal(t, expected, result)
}
```

### 2. Uso de Mocks

```go
// Mock do repositório
type MockRepository struct {
    mock.Mock
}

func (m *MockRepository) GetByID(ctx context.Context, id int64) (*Modules.Role, error) {
    args := m.Called(ctx, id)
    return args.Get(0).(*Modules.Role), args.Error(1)
}
```

### 3. Testes de Tabela (Table Driven Tests)

```go
func TestIsValidEmail(t *testing.T) {
    tests := []struct {
        name     string
        email    string
        expected bool
    }{
        {"Valid email", "test@example.com", true},
        {"Empty email", "", false},
        {"Invalid email", "invalid", false},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := IsValidEmail(tt.email)
            assert.Equal(t, tt.expected, result)
        })
    }
}
```

### 4. Cleanup e Setup

```go
func TestWithCleanup(t *testing.T) {
    // Setup
    originalEnv := os.Getenv("DATABASE_URL")
    
    // Cleanup após o teste
    defer func() {
        os.Setenv("DATABASE_URL", originalEnv)
    }()
    
    // Teste...
}
```

## 🔧 Exemplos de Uso

### Executar Teste Específico

```bash
# Testar apenas o método List do controller
make test-specific TEST=TestRolesController_List_Success

# Testar todos os métodos do controller
make test-controller
```

### Executar Testes com Debug

```bash
# Testes com saída verbosa
make test-verbose

# Testes com timeout
make test-timeout

# Testes em paralelo
make test-parallel
```

### Pipeline de CI/CD

```bash
# Executar pipeline completo
make ci

# Verificações pré-commit
make pre-commit
```

## 🐛 Debugging de Testes

### Teste Falhou? Aqui estão algumas dicas:

1. **Verificar mocks**: Certifique-se de que todos os mocks foram configurados corretamente
2. **Verificar assertions**: Use `assert.Equal(t, expected, actual)` para comparações precisas
3. **Verificar contexto**: Certifique-se de que o contexto está sendo passado corretamente
4. **Verificar cleanup**: Verifique se o cleanup está sendo executado

### Comandos de Debug

```bash
# Executar teste com saída detalhada
go test -v -run=TestName ./internal/Controller/

# Executar teste com timeout maior
go test -timeout=60s -v ./internal/Repository/

# Executar teste específico com race detection
go test -race -v -run=TestName ./internal/...
```

## 📈 Métricas e Relatórios

### Relatório de Cobertura

Após executar `make test-coverage`, você encontrará:

- `coverage/coverage.out`: Dados brutos de cobertura
- `coverage/coverage.html`: Relatório visual em HTML

### Análise de Performance

```bash
# Executar benchmarks
make test-benchmark

# Comparar benchmarks
go test -bench=. -benchmem ./internal/pkg/
```

## 🤝 Contribuindo

### Adicionando Novos Testes

1. Crie o arquivo `*_test.go` no mesmo diretório do código
2. Siga o padrão AAA (Arrange, Act, Assert)
3. Use mocks para dependências externas
4. Adicione testes para casos de sucesso e erro
5. Execute `make test` para verificar

### Padrões de Nomenclatura

- `Test[Component]_[Method]_[Scenario]` para testes unitários
- `TestIntegration_[Description]` para testes de integração
- `Benchmark[Function]` para benchmarks
- `Example[Function]` para testes de exemplo

## 📚 Recursos Adicionais

- [Go Testing Package](https://golang.org/pkg/testing/)
- [Testify Documentation](https://github.com/stretchr/testify)
- [Go Testing Best Practices](https://golang.org/doc/tutorial/add-a-test)
- [Mocking in Go](https://github.com/golang/mock)

---

**Nota**: Esta documentação é atualizada conforme novos testes são adicionados ao projeto. 