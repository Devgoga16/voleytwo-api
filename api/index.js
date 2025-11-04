const express = require('express');
const cors = require('cors');
const connectDB = require('../config/database');
const { errorHandler, notFound, requestLogger } = require('../middleware/errorHandler');
const { swaggerSpec, swaggerUi, swaggerUiOptions } = require('../config/swagger');

// Importar rutas
const transactionRoutes = require('../routes/transactions');

// Crear instancia de Express
const app = express();

// Conectar a MongoDB (solo una vez en serverless)
let isConnected = false;

const connectToDatabase = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('✅ MongoDB conectado en Vercel');
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error);
      throw error;
    }
  }
};

// Configuración de CORS simplificada para Vercel
const corsOptions = {
  origin: true, // Permite todos los orígenes
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control'],
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API VolleyFund funcionando en Vercel',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'vercel',
    platform: 'serverless'
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
    message: '🏐 VolleyFund API en Vercel',
    version: '1.0.0',
    documentation: '/api-docs',
    platform: 'vercel-serverless',
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

// Función principal para Vercel
module.exports = async (req, res) => {
  try {
    // Conectar a la base de datos
    await connectToDatabase();

    // Manejar la request con Express
    return app(req, res);
  } catch (error) {
    console.error('❌ Error en función serverless:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'Database connection failed'
    });
  }
};

// Para desarrollo local (opcional)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Serverless API corriendo en puerto ${PORT}`);
  });
}