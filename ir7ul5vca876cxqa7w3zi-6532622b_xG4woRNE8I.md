# 🎯 SAGE-NFM API - Sistema Neuropsicológico de Mapeamento Funcional

## 🚀 IMPLEMENTAÇÃO COMPLETA EM 20 MINUTOS

### ✅ PRÉ-REQUISITOS CONFIRMADOS
- Node.js v22.19.0 ✅
- NPM 10.9.3 ✅
- Windows 10+ ✅

### 📁 ESTRUTURA DO PROJETO
```
sage-nfm-api/
├── api/
│   └── index.js          # API centralizada (ÚNICO ARQUIVO!)
├── package.json          # Dependências
├── vercel.json          # Configuração deploy
├── .env.example         # Template variáveis
├── .env.local           # Suas credenciais (não commitar)
└── README.md            # Esta documentação
```

### 🎯 SEQUÊNCIA DE IMPLEMENTAÇÃO

#### ETAPA 1: CRIAR REPOSITÓRIO (2 min)
1. Acesse: https://github.com/new
2. Nome: `sage-nfm-api`
3. Descrição: `Sistema SAGE-NFM - API Centralizada`
4. Público ✅
5. Add README ✅
6. Create repository

#### ETAPA 2: CLONAR E PREPARAR (3 min)
```bash
# No terminal Windows
git clone https://github.com/SEU-USUARIO/sage-nfm-api.git
cd sage-nfm-api

# Criar estrutura
mkdir api
```

#### ETAPA 3: ARQUIVOS CENTRALIZADOS (5 min)
- Copiar `api/index.js` (arquivo principal)
- Copiar `package.json` (dependências)
- Copiar `vercel.json` (deploy config)
- Copiar `.env.example` (template)

#### ETAPA 4: CONFIGURAR AMBIENTE (3 min)
```bash
# Instalar dependências
npm install

# Criar arquivo de ambiente
copy .env.example .env.local
# Editar .env.local com suas credenciais
```

#### ETAPA 5: TESTAR LOCALMENTE (2 min)
```bash
# Testar API local
npm run dev
# Abrir: http://localhost:3000/api
```

#### ETAPA 6: DEPLOY PRODUÇÃO (5 min)
```bash
# Commit e push
git add .
git commit -m "feat: API SAGE-NFM centralizada funcionando"
git push origin main

# Deploy Vercel (automático via GitHub)
```

### 🔧 CONFIGURAÇÃO VERCEL
1. Acesse: https://vercel.com/dashboard
2. Import project from GitHub
3. Selecione: sage-nfm-api
4. Deploy (automático)
5. Adicione variáveis de ambiente:
   - `MONGODB_URI`
   - `REDIS_URL` (opcional)
   - `JWT_SECRET`

### 🧪 VALIDAÇÃO FINAL
- Health check: `https://seu-projeto.vercel.app/api`
- Endpoints funcionais: ✅
- Deploy automático: ✅

### 🎉 RESULTADO ESPERADO
- ✅ API completa funcionando
- ✅ Deploy automático configurado
- ✅ Todos os endpoints integrados
- ✅ Monitoramento ativo

## 📋 ENDPOINTS DISPONÍVEIS

### 🔓 Públicos
- `GET /api` - Health check
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login

### 🔒 Autenticados
- `GET /api/mps` - Listar MPS
- `POST /api/mps` - Criar MPS
- `GET /api/checkins` - Listar check-ins
- `POST /api/checkins` - Novo check-in
- `GET /api/dashboard/stats` - Estatísticas

## 🚨 TROUBLESHOOTING
- **Erro MongoDB**: Verificar connection string
- **Erro deploy**: Verificar variáveis de ambiente
- **Erro local**: Verificar Node.js versão

## 🔗 LINKS IMPORTANTES
- **GitHub**: https://github.com/seu-usuario/sage-nfm-api
- **Vercel**: https://vercel.com/dashboard
- **MongoDB**: https://cloud.mongodb.com/
- **Documentação**: Este README