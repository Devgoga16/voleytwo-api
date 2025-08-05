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

// Configuración de CORS simplificada y permisiva
const corsOptions = {
  origin: true, // Permite todos los orígenes en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control'],
  optionsSuccessStatus: 200 // Para navegadores legacy
};

// Middlewares
app.use(cors(corsOptions));

// Middleware adicional para preflight requests
app.options('*', cors(corsOptions));

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
