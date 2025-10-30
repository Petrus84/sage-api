# .env.example
# Copie para .env e configure com suas credenciais

# MongoDB Atlas
MONGODB_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@seu-cluster.mongodb.net/sage-nfm?appName=sage-nfm-cluster

# JWT Secret (use um hash forte)
JWT_SECRET=seu-secret-super-seguro-aqui-min-32-caracteres

# Redis Upstash (opcional - para cache)
REDIS_URL=redis://default:senha@endpoint.upstash.io:6379

# Ambiente
NODE_ENV=production
