# Project Management System

> **Live Demo:** [https://management-project-eight.vercel.app/](https://management-project-eight.vercel.app/)

Um sistema completo e moderno de **gerenciamento de projetos** desenvolvido com **React** e **Spring Boot**, permitindo equipes colaborarem de forma eficiente através de **workspaces**, **projetos** e **tarefas**. O sistema oferece **autenticação JWT segura**, **dashboard dinâmico** com estatísticas em tempo real, **atribuição de membros**, **filtros e busca avançada**, e **persistência de dados robusta** com PostgreSQL. Construído seguindo princípios de arquitetura **RESTful** e **segurança baseada em tokens**, proporcionando uma experiência de usuário fluida e responsiva.


## Índice

- [Tecnologias](#-tecnologias)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Como Executar Localmente](#-como-executar-localmente)
- [Deploy](#-deploy)
- [Desafios Técnicos](#-desafios-técnicos)
- [Screenshots](#-screenshots)
- [Arquitetura](#-arquitetura)



## Tecnologias

### Backend
![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-brightgreen?style=for-the-badge&logo=spring)
![Spring Security](https://img.shields.io/badge/Spring_Security-6.0-blue?style=for-the-badge&logo=spring)
![JWT](https://img.shields.io/badge/JWT-Auth-black?style=for-the-badge&logo=jsonwebtokens)
![JPA/Hibernate](https://img.shields.io/badge/JPA-Hibernate-red?style=for-the-badge&logo=hibernate)

### Frontend
![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.2-purple?style=for-the-badge&logo=vite)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.8.2-purple?style=for-the-badge&logo=redux)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.12-38bdf8?style=for-the-badge&logo=tailwind-css)
![React Router](https://img.shields.io/badge/React_Router-7.8.1-red?style=for-the-badge&logo=react-router)

### Banco de Dados
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)
![Neon](https://img.shields.io/badge/Neon.tech-Database-green?style=for-the-badge)

### Infraestrutura
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=for-the-badge&logo=docker)
![Render](https://img.shields.io/badge/Render-Backend-46e3b7?style=for-the-badge&logo=render)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?style=for-the-badge&logo=vercel)

---

## Funcionalidades Principais

### 🔐 Autenticação e Segurança
- ✅ Autenticação JWT (JSON Web Tokens)
- ✅ Proteção de rotas com Spring Security
- ✅ Criptografia de senhas com BCrypt
- ✅ Tokens com expiração configurável
- ✅ Rotas protegidas no frontend

### 📊 Gestão de Workspaces
- ✅ Criação e gerenciamento de workspaces
- ✅ Múltiplos workspaces por usuário
- ✅ Troca de workspace dinâmica
- ✅ Membros e permissões por workspace

### 📁 Gestão de Projetos
- ✅ CRUD completo de projetos
- ✅ Status e prioridades configuráveis
- ✅ Timeline com datas de início e fim
- ✅ Progresso visual (barra de progresso)
- ✅ Atribuição de membros da equipe
- ✅ Team Lead por projeto

### ✅ Gestão de Tarefas
- ✅ CRUD completo de tarefas
- ✅ Tipos: Task, Bug, Feature, Improvement, Other
- ✅ Status: To Do, In Progress, Done
- ✅ Prioridades: Low, Medium, High
- ✅ Atribuição de responsáveis
- ✅ Datas de vencimento
- ✅ Comentários e discussões por tarefa
- ✅ Filtros e busca avançada

### 📈 Dashboard Dinâmico
- ✅ Estatísticas em tempo real
- ✅ Cards informativos (Total Projects, My Tasks, Overdue)
- ✅ Visão geral de projetos recentes
- ✅ Atividades recentes
- ✅ Resumo de tarefas por status
- ✅ Dados atualizados da API

### 👥 Gestão de Equipe
- ✅ Listagem de membros do workspace
- ✅ Convites por email
- ✅ Atribuição de tarefas a membros
- ✅ Visualização de tarefas por membro
- ✅ Perfis de usuário

### 🎨 Interface Moderna
- ✅ Design responsivo (mobile-first)
- ✅ Tema claro/escuro
- ✅ Animações e transições suaves
- ✅ Feedback visual com toast notifications
- ✅ Componentes reutilizáveis
- ✅ UI/UX intuitiva

---

## 📁 Estrutura do Projeto

```
project-management/
├── backend/                          # API Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/projectmanagement/
│   │       │   ├── config/          # Configurações (Security, CORS, etc)
│   │       │   ├── controller/     # REST Controllers
│   │       │   ├── dto/             # Data Transfer Objects
│   │       │   ├── model/           # Entidades JPA
│   │       │   ├── repository/     # Repositórios Spring Data
│   │       │   ├── security/       # JWT e Filtros de Autenticação
│   │       │   └── service/         # Lógica de Negócio
│   │       └── resources/
│   │           └── application.yml # Configurações da aplicação
│   ├── Dockerfile
│   └── pom.xml                      # Dependências Maven
│
├── src/                             # Frontend React
│   ├── components/                  # Componentes React
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectTasks.jsx
│   │   ├── StatsGrid.jsx
│   │   └── ...
│   ├── features/                    # Redux Slices
│   │   ├── authSlice.js
│   │   ├── workspaceSlice.js
│   │   └── themeSlice.js
│   ├── pages/                       # Páginas/Views
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetails.jsx
│   │   └── ...
│   ├── services/                    # Serviços de API
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
│
├── docker-compose.yml               # Orquestração Docker
├── Dockerfile                       # Frontend Docker
├── nginx.conf                       # Configuração Nginx
├── package.json                     # Dependências NPM
└── README.md
```

## Configuração do Ambiente

### Pré-requisitos

- **Java 17+** (JDK)
- **Node.js 18+** e **NPM**
- **PostgreSQL 15+** (ou usar Neon.tech)
- **Maven 3.8+**
- **Docker** (opcional, para desenvolvimento com Docker Compose)

### Variáveis de Ambiente

#### Backend (`application.yml` ou variáveis de ambiente)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/project_management
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

jwt:
  secret: your-secret-key-minimum-256-bits-long-for-hs512
  expiration: 86400000  # 24 horas em milissegundos

cors:
  allowed-origins: http://localhost:5173,https://management-project-eight.vercel.app
```

**Para produção (Render):**
- `SPRING_DATASOURCE_URL`: URL do banco Neon.tech
- `SPRING_DATASOURCE_USERNAME`: Usuário do banco
- `SPRING_DATASOURCE_PASSWORD`: Senha do banco
- `JWT_SECRET`: Chave secreta para JWT
- `JWT_EXPIRATION`: Tempo de expiração do token
- `CORS_ALLOWED_ORIGINS`: URL do frontend (Vercel)

#### Frontend (`.env` ou variáveis de ambiente Vercel)

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

**Para produção (Vercel):**
- Configure a variável `VITE_API_URL` com a URL do backend no Render


## Como Executar Localmente

### Opção 1: Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone <repository-url>
cd project-management

# Inicie todos os serviços (PostgreSQL + Backend)
docker-compose up -d

# O backend estará disponível em http://localhost:8080
# O PostgreSQL estará disponível em localhost:5432
```

### Opção 2: Execução Manual

#### Backend

```bash
cd backend

# Compile o projeto
mvn clean install

# Execute a aplicação
mvn spring-boot:run

# Ou execute o JAR
java -jar target/project-management-api-1.0.0.jar
```

O backend estará disponível em `http://localhost:8080`

#### Frontend

```bash
# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# O frontend estará disponível em http://localhost:5173
```

#### Banco de Dados

Se não estiver usando Docker, configure um PostgreSQL local:

```sql
CREATE DATABASE project_management;
```

E atualize as credenciais no `application.yml` do backend.


##  Deploy

### Backend (Render)

1. Conecte seu repositório ao Render
2. Configure as variáveis de ambiente:
   - `SPRING_DATASOURCE_URL` (URL do Neon.tech)
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
   - `JWT_EXPIRATION`
   - `CORS_ALLOWED_ORIGINS` (URL do frontend Vercel)
3. Configure o build command: `cd backend && mvn clean install`
4. Configure o start command: `cd backend && java -jar target/project-management-api-1.0.0.jar`
5. Deploy!

### Frontend (Vercel)

1. Conecte seu repositório ao Vercel
2. Configure a variável de ambiente:
   - `VITE_API_URL` (URL do backend Render)
3. Configure o build command: `npm run build`
4. Configure o output directory: `dist`
5. Deploy!

### Banco de Dados (Neon.tech)

1. Crie uma conta no [Neon.tech](https://neon.tech)
2. Crie um novo projeto PostgreSQL
3. Copie a connection string
4. Use a URL no `SPRING_DATASOURCE_URL` do Render


## Desafios Técnicos

### 1. Persistência de Dados entre Render e Neon.tech

**Desafio:** Garantir que o backend no Render se conecte corretamente ao banco PostgreSQL hospedado no Neon.tech, lidando com timeouts, conexões SSL e configurações de rede.

**Solução:**
- Configuração de connection pooling no Spring Boot
- Uso de variáveis de ambiente para credenciais sensíveis
- Configuração de SSL no connection string do Neon
- Health checks e retry logic para conexões instáveis
- Configuração adequada de `SPRING_JPA_HIBERNATE_DDL_AUTO=update` para migrações automáticas

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      connection-timeout: 30000
      idle-timeout: 600000
```

### 2. Configuração de CORS entre Domínios Diferentes

**Desafio:** Permitir que o frontend na Vercel (`https://management-project-eight.vercel.app`) faça requisições para o backend no Render (`https://management-project-wc4o.onrender.com`), respeitando políticas de segurança do navegador.

**Solução:**
- Configuração de CORS no Spring Security (`SecurityConfig.java`)
- Whitelist específica de origens permitidas
- Configuração de headers e métodos permitidos
- Suporte a credentials (cookies/tokens)
- Configuração de CORS também no nível do Spring MVC (`WebConfig.java`)

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("https://management-project-eight.vercel.app"));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(true);
    // ...
}
```

### 3. Sincronização de Estado entre API e Frontend

**Desafio:** Garantir que os dados exibidos no frontend estejam sempre sincronizados com o banco de dados, especialmente após refresh da página ou operações CRUD.

**Solução:**
- Implementação de `useEffect` hooks para buscar dados da API ao montar componentes
- Normalização de dados no Redux slice (`workspaceSlice.js`)
- Fallback para dados do Redux quando a API falha
- Atualização automática após operações CRUD via `fetchWorkspaces()`
- Guard clauses e optional chaining para prevenir erros de undefined

### 4. Segurança JWT e Proteção de Rotas

**Desafio:** Implementar autenticação segura com JWT, protegendo rotas tanto no backend quanto no frontend, e garantir que tokens sejam válidos e não expirados.

**Solução:**
- Filtro de autenticação JWT customizado (`JwtAuthenticationFilter`)
- Provider de tokens com validação de assinatura (`JwtTokenProvider`)
- Configuração de rotas públicas vs protegidas no Spring Security
- Proteção de rotas no frontend com `ProtectedRoute` component
- Armazenamento seguro de tokens no localStorage
- Interceptação de requisições 401 para redirecionar ao login
---

### Arquitetura RESTful

O projeto segue os princípios REST, com endpoints bem definidos:

```
/api/auth/*          - Autenticação (login, register)
/api/workspaces/*    - Gestão de workspaces
/api/projects/*      - CRUD de projetos
/api/tasks/*         - CRUD de tarefas
/api/comments/*      - Comentários em tarefas
```

### Segurança Baseada em Tokens JWT

1. **Login**: Usuário faz login → Backend valida credenciais → Retorna JWT token
2. **Requisições**: Frontend envia token no header `Authorization: Bearer <token>`
3. **Validação**: Backend valida token em cada requisição protegida
4. **Expiração**: Tokens expiram após 24 horas (configurável)

### Fluxo de Dados

```
Frontend (React + Redux)
    ↓
API Service (api.js)
    ↓
Backend (Spring Boot)
    ↓
Spring Security (JWT Validation)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (JPA)
    ↓
PostgreSQL (Neon.tech)
```

---

## 📝 Scripts Disponíveis

### Frontend

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
npm run lint     # Executa ESLint
```

### Backend

```bash
mvn clean install           # Compila o projeto
mvn spring-boot:run         # Executa a aplicação
mvn test                    # Executa testes
mvn clean package           # Cria o JAR
```
---