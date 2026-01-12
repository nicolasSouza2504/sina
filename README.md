# Sistema de Controle de Conteúdo (SCC) – UniSenai ADS Joinville

## Sobre o Projeto

O **Sistema de Controle de Conteúdo (SCC)** é uma plataforma web acadêmica criada para centralizar e simplificar a gestão de materiais e atividades no curso de Análise e Desenvolvimento de Sistemas do UniSenai Joinville. O SCC combate problemas das plataformas AVA tradicionais, como fragmentação das informações, lentidão, interfaces confusas e baixo engajamento dos estudantes.

O sistema busca:
- Centralizar conteúdos e atividades em um único fluxo.
- Fornecer dashboards analíticos e elementos de gamificação para docentes e alunos.
- Oferecer interface moderna, intuitiva e responsiva, otimizando a experiência de uso.
- Reduzir o esforço operacional em tarefas essenciais, como postagem, submissão de trabalhos e feedback.

## Objetivos

- Centralizar gestão dos conteúdos e atividades, eliminando a fragmentação.
- Simplificar a jornada do usuário e modernizar a interface.
- Aumentar o engajamento com gamificação (rankings, badges, pontos).
- Melhorar visibilidade do progresso acadêmico por dashboards detalhados.
- Assegurar perfis diferenciados e seguro (admin, professor, aluno).

### Funcionalidades Essenciais

- Autenticação segura para três tipos de usuários.
- Criação, edição e organização por disciplina/semestre.
- Gestão de atividades e desafios, com aferição de desempenho e feedback alternativo.
- Painéis de informações centralizados (dashboards).
- Controle de permissões e auditoria.

## Arquitetura e Tecnologias

### Pilha Tecnológica

- **Frontend:** Next.js (SPA) para navegação instantânea e fluida.
- **Backend:** Java para lógica de negócio e processamento seguro.
- **Banco de Dados:** PostgreSQL, robustez e segurança relacional.
- **Servidor:** NGINX, balanceamento de carga e segurança do tráfego.
- **Segurança:** HTTPS, autenticação JWT, hash seguro, RBAC.
- **Testes:** Unitários, integração, stress.

## Metodologia de Desenvolvimento

- Pesquisa e construção fundamentadas em **Design Science Research (DSR)**.
- Desenvolvimento incrementado pela **metodologia ágil** em sprints quinzenais.
- Backlog segmentado por domínios de negócio (DDD).
- Prototipação e validação contínuas com docentes e discentes.

## Limitações e Futuras Expansões

- Escopo inicial restrito ao MVP, com integrações parciais.
- Não possui aplicativo móvel nativo.
- Perspectivas futuras: videoconferência integrada, notificações inteligentes, gamificação avançada, IA.

## Autores

- Andrei Luciano Gomes (UniSenai Joinville)
- Gustavo Luis Schmidt (UniSenai Joinville)
- Lucas Eduardo Kroeger (UniSenai Joinville)
- Nicolas Vieira de Souza (UniSenai Joinville)
- Vitor Inzize Rausis (UniSenai Joinville)

**Orientador:** Prof. Silvio (UniSenai Joinville).

## Agradecimentos

Agradecimento à instituição UniSenai Joinville, aos docentes do curso de ADS, ao orientador e aos colegas envolvidos na elicitação de requisitos e validação do sistema.

## Guia de Execução (Run Guide)

### Pré-requisitos
- Docker e Docker Compose (opcional, para execução via containers)
- Node.js 18+ e npm (para frontend local)

---

### Backend (Java - Spring Boot)

#### Executando Localmente
1. Instale o Java 17+ e o Maven 3.9+.
2. Acesse a pasta do backend Java:
   ```bash
   cd backend/java/ava_senai
   ```
3. Compile e execute o projeto:
   ```bash
   mvn clean package -DskipTests=true
   java -jar target/*.jar
   ```
   O backend estará disponível em `http://localhost:8080`.

#### Executando com Docker
1. Construa e suba o container:
   ```bash
   cd backend/java/ava_senai
   docker build -t ava-senai-backend-java .
   docker run -p 8080:8080 ava-senai-backend-java
   ```

---

### Frontend (Next.js)

#### Executando Localmente
1. Instale as dependências:
   ```bash
   cd frontend
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O frontend estará disponível em `http://localhost:3000`.

#### Executando com Docker
1. Construa e suba o container:
   ```bash
   cd frontend
   docker build -t ava-senai-frontend .
   docker run -p 3000:3000 ava-senai-frontend
   ```

---

### Observações
- Certifique-se de que o backend esteja rodando antes de acessar o frontend.
- Ajuste variáveis de ambiente conforme necessário para integração entre frontend e backend.
