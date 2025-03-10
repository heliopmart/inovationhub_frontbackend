# 🚀 InvasionHub - Frontend & Backend

## 📌 Sobre o Projeto
O **InvasionHub** é uma plataforma inovadora construída com **Next.js + TypeScript**, que combina **frontend e backend na mesma aplicação**.

O projeto tem como objetivo **gerenciar e conectar projetos inovadores**, permitindo o cadastro de usuários, gerenciamento de equipes, exibição de projetos e integração com parceiros.

---

## 🛠️ Tecnologias Utilizadas
| Tecnologia | Descrição |
|------------|----------|
| **Next.js (TypeScript)** | Framework React com suporte a SSR/SSG e API Routes |
| **SCSS (SASS puro)** | Estilização modular para melhor organização |
| **Prisma ORM** | Interface eficiente para manipulação do banco de dados |
| **Supabase (PostgreSQL)** | Banco de dados relacional gratuito e escalável |
| **Upstash Redis** | Gerenciamento de cache e tokens JWT |
| **JWT (jsonwebtoken)** | Autenticação segura |
| **Bcrypt** | Criptografia segura de senhas |
| **dotenv** | Gerenciamento de variáveis de ambiente |

---

## 📂 Estrutura do Projeto

```
invasionHub_frontbackend/
├── pages/                 # 📌 Páginas do Frontend e Backend (Next.js API Routes)
│   ├── api/               # 📌 Backend - Rotas da API
│   │   ├── auth/          # 📌 APIs de autenticação (Login, Registro, Logout)
│   │   ├── projects/      # 📌 APIs para manipular projetos
│   │   ├── users/         # 📌 APIs para gerenciar usuários
│   ├── index.tsx          # 📌 Página inicial (Landing Page)
│   ├── login.tsx          # 📌 Página de Login
│   ├── register.tsx       # 📌 Página de Cadastro
│   ├── dashboard.tsx      # 📌 Painel do usuário após login
│   ├── profile.tsx        # 📌 Página de perfil do usuário
│   ├── projects.tsx       # 📌 Lista de projetos
│   ├── project/[id].tsx   # 📌 Página de detalhes do projeto
├── components/            # 📌 Componentes reutilizáveis
│   ├── Navbar.tsx         # 📌 Barra de navegação
│   ├── Footer.tsx         # 📌 Rodapé do site
│   ├── AuthForm.tsx       # 📌 Formulário de autenticação
│   ├── ProjectCard.tsx    # 📌 Card para exibição de projetos
├── lib/                   # 📌 Configurações de conexão (Banco, Redis, etc.)
│   ├── prisma.ts          # 📌 Configuração do Prisma
│   ├── supabase.ts        # 📌 Configuração do Supabase
│   ├── redis.ts           # 📌 Configuração do Upstash Redis
│   ├── auth.ts            # 📌 Funções de autenticação (JWT, Cookies, etc.)
├── prisma/                # 📌 Modelos do Banco de Dados
│   ├── schema.prisma      # 📌 Definição do Banco de Dados no Prisma
├── styles/                # 📌 Estilos SCSS globais
│   ├── globals.scss       # 📌 Estilização principal do projeto
├── .env.local             # 📌 Variáveis de ambiente (credenciais)
├── package.json           # 📌 Dependências do projeto
```

---

## 🔧 Configuração do Ambiente
### 1️⃣ Clonar o repositório
```sh
git clone https://github.com/seu-usuario/invasionHub_frontbackend.git
cd invasionHub_frontbackend
```

### 2️⃣ Instalar Dependências
```sh
npm install
```

### 3️⃣ Configurar Variáveis de Ambiente
Crie um arquivo **`.env.local`** na raiz do projeto e adicione:
```env
# Banco de Dados Supabase
DATABASE_URL="postgresql://postgres:SENHA@db.supabase.co:5432/postgres"
SUPABASE_URL="https://xyzcompany.supabase.co"
SUPABASE_ANON_KEY="seu-anon-key"

# Upstash Redis
UPSTASH_REDIS_URL="rediss://seu-url.a.upstash.io"

# Autenticação JWT
JWT_SECRET="sua-chave-secreta"
```

### 4️⃣ Executar as Migrações do Banco de Dados
```sh
npx prisma migrate dev --name init
```

### 5️⃣ Rodar o Projeto
```sh
npm run dev
```
Agora acesse:
- **Frontend (UI do usuário):** `http://localhost:3000/`
- **APIs do Backend:** `http://localhost:3000/api/...`

---

## 🌍 APIs Disponíveis
### **🔹 Autenticação**
| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/register` | Cria um novo usuário |
| `POST` | `/api/auth/login` | Realiza login e retorna JWT |
| `GET`  | `/api/auth/logout` | Encerra a sessão |

### **🔹 Usuários**
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/api/users` | Lista todos os usuários |
| `GET`  | `/api/users/[id]` | Obtém dados de um usuário |

### **🔹 Projetos**
| Método | Rota | Descrição |
|--------|------|-----------|
| `GET`  | `/api/projects` | Lista todos os projetos |
| `GET`  | `/api/projects/[id]` | Obtém um projeto específico |
| `POST` | `/api/projects` | Cria um novo projeto |

---

## 🛠️ Futuras Implementações
- 🔹 Dashboard com gráficos 📊
- 🔹 Notificações e sistema de mensagens 💬
- 🔹 Upload de arquivos 🔄

🚀 **Contribua com o projeto enviando sugestões e PRs!**

