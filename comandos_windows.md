# 🪟 COMANDOS ESPECÍFICOS PARA WINDOWS

## Preparação inicial
```cmd
# Navegar para pasta de projetos
cd C:\Users\DELL\Documents\Projetos

# Clonar repositório
git clone https://github.com/SEU-USUARIO/sage-nfm-api.git
cd sage-nfm-api

# Criar estrutura de pastas
mkdir api
```

## Instalação e configuração
```cmd
# Instalar dependências
npm install

# Copiar template de ambiente
copy .env.example .env.local

# Editar arquivo de ambiente (usar notepad)
notepad .env.local
```

## Teste local
```cmd
# Executar API localmente
npm run dev

# Em outro terminal, testar
curl http://localhost:3000/api
```

## Deploy
```cmd
# Adicionar arquivos ao Git
git add .
git status

# Commit
git commit -m "feat: API SAGE-NFM centralizada funcionando"

# Push para GitHub
git push origin main
```

## Verificação pós-deploy
```cmd
# Testar API em produção (substitua pela sua URL)
curl https://sage-nfm-api.vercel.app/api
```
