# Makefile para o projeto AVA SENAI Backend

# Variáveis
BINARY_NAME=ava-senai-backend
BUILD_DIR=build
TEST_DIR=./internal/...
COVERAGE_DIR=coverage
COVERAGE_FILE=$(COVERAGE_DIR)/coverage.out
COVERAGE_HTML=$(COVERAGE_DIR)/coverage.html

# Comandos principais
.PHONY: help
help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build: ## Compila o projeto
	@echo "Compilando o projeto..."
	@mkdir -p $(BUILD_DIR)
	go build -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/api

.PHONY: run
run: ## Executa o projeto
	@echo "Executando o projeto..."
	go run ./cmd/api

.PHONY: test
test: ## Executa todos os testes
	@echo "Executando testes..."
	go test -v $(TEST_DIR)

.PHONY: test-short
test-short: ## Executa testes rápidos (sem integração)
	@echo "Executando testes rápidos..."
	go test -v -short $(TEST_DIR)

.PHONY: test-race
test-race: ## Executa testes com detecção de race conditions
	@echo "Executando testes com detecção de race conditions..."
	go test -race -v $(TEST_DIR)

.PHONY: test-coverage
test-coverage: ## Executa testes com cobertura
	@echo "Executando testes com cobertura..."
	@mkdir -p $(COVERAGE_DIR)
	go test -v -coverprofile=$(COVERAGE_FILE) $(TEST_DIR)
	go tool cover -html=$(COVERAGE_FILE) -o $(COVERAGE_HTML)
	@echo "Cobertura salva em: $(COVERAGE_HTML)"

.PHONY: test-coverage-short
test-coverage-short: ## Executa testes rápidos com cobertura
	@echo "Executando testes rápidos com cobertura..."
	@mkdir -p $(COVERAGE_DIR)
	go test -v -short -coverprofile=$(COVERAGE_FILE) $(TEST_DIR)
	go tool cover -html=$(COVERAGE_FILE) -o $(COVERAGE_HTML)
	@echo "Cobertura salva em: $(COVERAGE_HTML)"

.PHONY: test-benchmark
test-benchmark: ## Executa benchmarks
	@echo "Executando benchmarks..."
	go test -bench=. -benchmem $(TEST_DIR)

.PHONY: test-benchmark-short
test-benchmark-short: ## Executa benchmarks rápidos
	@echo "Executando benchmarks rápidos..."
	go test -bench=. -benchmem -short $(TEST_DIR)

.PHONY: test-examples
test-examples: ## Executa testes de exemplo
	@echo "Executando testes de exemplo..."
	go test -v -run=Example $(TEST_DIR)

.PHONY: test-integration
test-integration: ## Executa testes de integração
	@echo "Executando testes de integração..."
	go test -v -run=Integration $(TEST_DIR)

.PHONY: test-unit
test-unit: ## Executa apenas testes unitários
	@echo "Executando testes unitários..."
	go test -v -run=Test $(TEST_DIR) -exclude=Integration

.PHONY: test-specific
test-specific: ## Executa testes específicos (use TEST=TestName)
	@if [ -z "$(TEST)" ]; then \
		echo "Erro: Especifique o teste com TEST=TestName"; \
		echo "Exemplo: make test-specific TEST=TestRolesController_List_Success"; \
		exit 1; \
	fi
	@echo "Executando teste específico: $(TEST)"
	go test -v -run=$(TEST) $(TEST_DIR)

.PHONY: test-watch
test-watch: ## Executa testes em modo watch (requer air)
	@echo "Executando testes em modo watch..."
	@if command -v air >/dev/null 2>&1; then \
		air; \
	else \
		echo "Air não encontrado. Instalando..."; \
		go install github.com/cosmtrek/air@latest; \
		air; \
	fi

.PHONY: lint
lint: ## Executa linter
	@echo "Executando linter..."
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run; \
	else \
		echo "GolangCI-Lint não encontrado. Instalando..."; \
		go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest; \
		golangci-lint run; \
	fi

.PHONY: fmt
fmt: ## Formata o código
	@echo "Formatando código..."
	go fmt ./...

.PHONY: vet
vet: ## Executa go vet
	@echo "Executando go vet..."
	go vet ./...

.PHONY: mod-tidy
mod-tidy: ## Limpa e atualiza dependências
	@echo "Limpando e atualizando dependências..."
	go mod tidy
	go mod download

.PHONY: clean
clean: ## Limpa arquivos de build e coverage
	@echo "Limpando arquivos..."
	rm -rf $(BUILD_DIR)
	rm -rf $(COVERAGE_DIR)

.PHONY: install-deps
install-deps: ## Instala dependências de desenvolvimento
	@echo "Instalando dependências de desenvolvimento..."
	go install github.com/stretchr/testify@latest
	go install github.com/cosmtrek/air@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

.PHONY: docker-build
docker-build: ## Constrói a imagem Docker
	@echo "Construindo imagem Docker..."
	docker build -t $(BINARY_NAME) .

.PHONY: docker-run
docker-run: ## Executa o container Docker
	@echo "Executando container Docker..."
	docker run -p 8080:8080 $(BINARY_NAME)

.PHONY: docker-test
docker-test: ## Executa testes no Docker
	@echo "Executando testes no Docker..."
	docker run --rm $(BINARY_NAME) make test

.PHONY: all-tests
all-tests: test test-race test-coverage test-benchmark ## Executa todos os tipos de teste

.PHONY: pre-commit
pre-commit: fmt vet lint test-unit ## Executa verificações pré-commit

.PHONY: ci
ci: mod-tidy fmt vet lint all-tests ## Executa pipeline de CI completo

# Comandos de desenvolvimento
.PHONY: dev-setup
dev-setup: install-deps mod-tidy ## Configura ambiente de desenvolvimento

.PHONY: test-report
test-report: test-coverage ## Gera relatório de testes
	@echo "Relatório de cobertura gerado em: $(COVERAGE_HTML)"
	@echo "Cobertura total:"
	@go tool cover -func=$(COVERAGE_FILE) | tail -1

# Comandos específicos por pacote
.PHONY: test-controller
test-controller: ## Executa testes do controller
	@echo "Executando testes do controller..."
	go test -v ./internal/Controller/...

.PHONY: test-repository
test-repository: ## Executa testes do repository
	@echo "Executando testes do repository..."
	go test -v ./internal/Repository/...

.PHONY: test-modules
test-modules: ## Executa testes dos módulos
	@echo "Executando testes dos módulos..."
	go test -v ./internal/Modules/...

.PHONY: test-config
test-config: ## Executa testes de configuração
	@echo "Executando testes de configuração..."
	go test -v ./internal/Config/...

.PHONY: test-utils
test-utils: ## Executa testes de utilitários
	@echo "Executando testes de utilitários..."
	go test -v ./internal/pkg/...

# Comandos de debug
.PHONY: test-verbose
test-verbose: ## Executa testes com saída verbosa
	@echo "Executando testes com saída verbosa..."
	go test -v -count=1 $(TEST_DIR)

.PHONY: test-timeout
test-timeout: ## Executa testes com timeout
	@echo "Executando testes com timeout..."
	go test -v -timeout=30s $(TEST_DIR)

.PHONY: test-parallel
test-parallel: ## Executa testes em paralelo
	@echo "Executando testes em paralelo..."
	go test -v -parallel=4 $(TEST_DIR) 