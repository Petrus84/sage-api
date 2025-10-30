// 🎯 SAGE-NFM API - Sistema Neuropsicológico de Mapeamento Funcional
// Arquivo único centralizado - Versão de produção

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 CONFIGURAÇÕES DE SEGURANÇA
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://sage-nfm.vercel.app', 'https://www.sage-nfm.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🗄️ CONEXÃO MONGODB
let db;
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️ MONGODB_URI não configurado - usando dados mock');
      return null;
    }
    
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db('sage-nfm');
    console.log('✅ MongoDB conectado com sucesso');
    return db;
  } catch (error) {
    console.error('❌ Erro MongoDB:', error.message);
    return null;
  }
};

// 🔐 MIDDLEWARE DE AUTENTICAÇÃO
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acesso requerido' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'sage-nfm-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }
    req.user = user;
    next();
  });
};

// 📊 DADOS MOCK PARA DESENVOLVIMENTO
const mockData = {
  users: [
    {
      id: '1',
      email: 'petrus@sage-nfm.com',
      name: 'Petrucio Barros',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
    }
  ],
  mps: [
    {
      id: '1',
      userId: '1',
      timestamp: new Date().toISOString(),
      energia: 7,
      foco: 6,
      humor: 8,
      motivacao: 7,
      ansiedade: 4,
      notas: 'Dia produtivo, boa energia pela manhã'
    }
  ],
  checkins: [
    {
      id: '1',
      userId: '1',
      timestamp: new Date().toISOString(),
      tipo: 'matinal',
      prioridades: ['SAGE-NFM API', 'Documentação', 'Testes'],
      energia_atual: 8,
      foco_principal: 'Desenvolvimento',
      bloqueios: ['Configuração ambiente'],
      proximos_passos: ['Deploy Vercel', 'Testes API']
    }
  ]
};

// 🏠 ROTA PRINCIPAL - HEALTH CHECK
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎯 SAGE-NFM API - Sistema Neuropsicológico de Mapeamento Funcional',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login'],
      mps: ['/api/mps'],
      checkins: ['/api/checkins'],
      dashboard: ['/api/dashboard/stats']
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🎯 SAGE-NFM API funcionando!',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// 🔐 AUTENTICAÇÃO - REGISTRO
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, senha e nome são obrigatórios'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simular salvamento (usar MongoDB em produção)
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    if (db) {
      await db.collection('users').insertOne(newUser);
    } else {
      mockData.users.push(newUser);
    }

    // Gerar token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'sage-nfm-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// 🔐 AUTENTICAÇÃO - LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    let user;
    if (db) {
      user = await db.collection('users').findOne({ email });
    } else {
      user = mockData.users.find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'sage-nfm-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// 📊 MPS - LISTAR
app.get('/api/mps', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 10, offset = 0 } = req.query;

    let mps;
    if (db) {
      mps = await db.collection('mps')
        .find({ userId })
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .toArray();
    } else {
      mps = mockData.mps.filter(m => m.userId === userId);
    }

    res.json({
      success: true,
      data: mps,
      total: mps.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Erro ao buscar MPS:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// 📊 MPS - CRIAR
app.post('/api/mps', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { energia, foco, humor, motivacao, ansiedade, notas } = req.body;

    const newMps = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      energia: parseInt(energia),
      foco: parseInt(foco),
      humor: parseInt(humor),
      motivacao: parseInt(motivacao),
      ansiedade: parseInt(ansiedade),
      notas: notas || ''
    };

    if (db) {
      await db.collection('mps').insertOne(newMps);
    } else {
      mockData.mps.push(newMps);
    }

    res.status(201).json({
      success: true,
      message: 'MPS registrado com sucesso',
      data: newMps
    });

  } catch (error) {
    console.error('Erro ao criar MPS:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ✅ CHECK-INS - LISTAR
app.get('/api/checkins', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 10, offset = 0 } = req.query;

    let checkins;
    if (db) {
      checkins = await db.collection('checkins')
        .find({ userId })
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .toArray();
    } else {
      checkins = mockData.checkins.filter(c => c.userId === userId);
    }

    res.json({
      success: true,
      data: checkins,
      total: checkins.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Erro ao buscar check-ins:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ✅ CHECK-INS - CRIAR
app.post('/api/checkins', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { tipo, prioridades, energia_atual, foco_principal, bloqueios, proximos_passos } = req.body;

    const newCheckin = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      tipo,
      prioridades: prioridades || [],
      energia_atual: parseInt(energia_atual),
      foco_principal,
      bloqueios: bloqueios || [],
      proximos_passos: proximos_passos || []
    };

    if (db) {
      await db.collection('checkins').insertOne(newCheckin);
    } else {
      mockData.checkins.push(newCheckin);
    }

    res.status(201).json({
      success: true,
      message: 'Check-in registrado com sucesso',
      data: newCheckin
    });

  } catch (error) {
    console.error('Erro ao criar check-in:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// 📈 DASHBOARD - ESTATÍSTICAS
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    let mps, checkins;
    if (db) {
      mps = await db.collection('mps').find({ userId }).toArray();
      checkins = await db.collection('checkins').find({ userId }).toArray();
    } else {
      mps = mockData.mps.filter(m => m.userId === userId);
      checkins = mockData.checkins.filter(c => c.userId === userId);
    }

    // Calcular estatísticas
    const totalMps = mps.length;
    const totalCheckins = checkins.length;
    
    const avgEnergia = totalMps > 0 
      ? (mps.reduce((sum, m) => sum + m.energia, 0) / totalMps).toFixed(1)
      : 0;
    
    const avgFoco = totalMps > 0 
      ? (mps.reduce((sum, m) => sum + m.foco, 0) / totalMps).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        resumo: {
          total_mps: totalMps,
          total_checkins: totalCheckins,
          media_energia: parseFloat(avgEnergia),
          media_foco: parseFloat(avgFoco)
        },
        ultimos_mps: mps.slice(-5),
        ultimos_checkins: checkins.slice(-3)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// 🚫 ROTA NÃO ENCONTRADA
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    availableEndpoints: [
      'GET /api - Health check',
      'POST /api/auth/register - Registro',
      'POST /api/auth/login - Login',
      'GET /api/mps - Listar MPS',
      'POST /api/mps - Criar MPS',
      'GET /api/checkins - Listar check-ins',
      'POST /api/checkins - Criar check-in',
      'GET /api/dashboard/stats - Estatísticas'
    ]
  });
});

// 🚀 INICIALIZAÇÃO DO SERVIDOR
const startServer = async () => {
  try {
    // Conectar ao MongoDB (opcional)
    await connectDB();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🎯 SAGE-NFM API rodando na porta ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api`);
      console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 MongoDB: ${db ? 'Conectado' : 'Mock data'}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Inicializar apenas se não estiver sendo importado
if (require.main === module) {
  startServer();
}

module.exports = app;