require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound, requestLogger } = require('./middleware/errorHandler');
const { swaggerSpec, swaggerUi, swaggerUiOptions } = require('./config/swagger');

// Importar rutas
const transactionRoutes = require('./routes/transactions');

// Crear instancia de Express
const app = express();

// Conectar a MongoDB
connectDB();

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // En desarrollo, permitir todos los orígenes
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Permitir requests sin origin (aplicaciones móviles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite default
      'https://voleyapi.somee.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS bloqueó origen: ${origin}`);
      callback(new Error('No permitido por política CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200 // Para navegadores legacy
};

// Middlewares
app.use(cors(corsOptions));

// Middleware adicional para preflight requests
app.options('*', cors(corsOptions));

// Middleware para agregar headers CORS manualmente (redundancia)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API VolleyFund funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Ruta para obtener el spec de Swagger en JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Rutas principales
app.use('/api/Transaction', transactionRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏐 Bienvenido a VolleyFund API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      health: '/health',
      transactions: '/api/Transaction',
      documentation: '/api-docs'
    }
  });
});

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log('🚀 =================================');
  console.log(`🏐 VolleyFund API iniciado`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`📚 Documentación: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 URL base: http://localhost:${PORT}`);
  console.log('🚀 =================================');
});

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  console.log('💤 SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('💤 Servidor cerrado');
  });
});

process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
