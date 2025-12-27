# FitPro - SaaS de Treino Personalizado

FitPro é um MVP de SaaS fitness que coleta dados do usuário e gera planos de treino personalizados. A versão gratuita permite gerar planos ilimitados, enquanto recursos premium estão em desenvolvimento (lista de espera).

## Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (Auth + PostgreSQL)
- **Validação**: Zod

## Funcionalidades

### MVP Gratuito
- Autenticação via Magic Link (email)
- Onboarding com coleta de dados do perfil
- Geração de planos de treino personalizados
- Visualização detalhada do plano (exercícios, séries, repetições, descanso)
- Histórico de planos gerados
- Suporte a diferentes objetivos (hipertrofia, emagrecimento, fortalecimento)
- Suporte a diferentes equipamentos (academia, casa, halteres, elásticos)

### Premium (Lista de Espera)
- Personalização com IA
- Acompanhamento de progresso
- Plano nutricional
- Vídeos tutoriais
- Suporte de coach

## Setup do Projeto

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Anote a **Project URL** e a **anon key** (em Settings > API)
4. Para o seed de exercícios, também anote a **service_role key**

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo com suas credenciais
nano .env.local
```

Conteúdo do `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### 3. Rodar Migrations

No Supabase Dashboard:

1. Vá em **SQL Editor**
2. Cole o conteúdo do arquivo `supabase/migrations/001_initial_schema.sql`
3. Execute o SQL

Ou via CLI do Supabase:
```bash
# Instale o Supabase CLI
npm install -g supabase

# Faça login
supabase login

# Link com seu projeto
supabase link --project-ref seu-project-ref

# Rode as migrations
supabase db push
```

### 4. Configurar Auth

No Supabase Dashboard:

1. Vá em **Authentication > URL Configuration**
2. Adicione `http://localhost:3000` em **Site URL**
3. Adicione `http://localhost:3000/auth/callback` em **Redirect URLs**

Para produção, adicione também seus domínios de produção.

### 5. Instalar Dependências

```bash
npm install
```

### 6. Rodar o Projeto

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 7. Seed de Exercícios

Com o projeto rodando, faça uma requisição POST para popular os exercícios:

```bash
curl -X POST http://localhost:3000/api/exercises/seed
```

Ou acesse a rota no navegador (modo dev apenas).

## Estrutura do Projeto

```
fitpro/
├── src/
│   ├── app/
│   │   ├── (app)/                    # Rotas protegidas
│   │   │   ├── dashboard/            # Dashboard principal
│   │   │   ├── onboarding/           # Formulário de perfil
│   │   │   ├── plan/[id]/            # Visualização do plano
│   │   │   └── history/              # Histórico de planos
│   │   ├── (auth)/
│   │   │   └── login/                # Página de login
│   │   ├── api/
│   │   │   ├── plan/generate/        # API para gerar plano
│   │   │   ├── waitlist/             # API para lista de espera
│   │   │   └── exercises/seed/       # API para seed (dev only)
│   │   ├── auth/callback/            # Callback do magic link
│   │   ├── waitlist/                 # Página de waitlist
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── plan/                     # Componentes do plano
│   │   │   ├── generate-plan-button.tsx
│   │   │   └── plan-viewer.tsx
│   │   ├── ui/                       # shadcn/ui components
│   │   └── logout-button.tsx
│   ├── data/
│   │   └── exercises.seed.json       # Dados de exercícios
│   ├── lib/
│   │   ├── plan/
│   │   │   └── generator.ts          # Gerador de planos
│   │   ├── supabase/
│   │   │   ├── client.ts             # Cliente browser
│   │   │   ├── server.ts             # Cliente server
│   │   │   └── middleware.ts         # Helper para middleware
│   │   ├── validations/
│   │   │   └── index.ts              # Schemas Zod
│   │   └── utils.ts
│   ├── types/
│   │   └── database.ts               # Tipos do banco
│   └── middleware.ts                 # Middleware de auth
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Schema do banco
├── .env.example
├── .env.local                        # (não commitado)
└── README.md
```

## Banco de Dados

### Tabelas

- **user_profiles**: Perfil do usuário (dados físicos, objetivos, preferências)
- **exercises**: Catálogo de exercícios (nome, grupo muscular, equipamento)
- **workout_plans**: Planos gerados (JSONB com estrutura do treino)
- **waitlist**: Lista de espera para premium
- **events**: Tracking de eventos (analytics)

### RLS (Row Level Security)

- `user_profiles`: Usuário acessa apenas seu perfil
- `workout_plans`: Usuário acessa apenas seus planos
- `exercises`: Leitura pública, escrita apenas service role
- `waitlist`: Insert público, select restrito
- `events`: Insert permitido para próprio user_id

## Lógica do Gerador de Planos

O gerador (`src/lib/plan/generator.ts`) cria planos baseados em:

1. **Dias de treino**: Define o split
   - 2-3 dias: Full Body
   - 4 dias: Upper/Lower
   - 5-6 dias: Push/Pull/Legs

2. **Objetivo**: Define séries, reps e descanso
   - Hipertrofia: 8-12 reps, 60-120s descanso
   - Emagrecimento: 12-20 reps, 30-45s descanso
   - Fortalecimento: 4-8 reps, 120-180s descanso

3. **Nível**: Ajusta volume e complexidade
4. **Equipamento**: Filtra exercícios compatíveis

## Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Rodar build
npm run lint     # Linting
```

## Deploy

### Vercel (Recomendado)

1. Conecte o repositório no Vercel
2. Adicione as variáveis de ambiente
3. Deploy automático!

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Railway
- Render
- AWS Amplify
- Netlify

## Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

MIT
