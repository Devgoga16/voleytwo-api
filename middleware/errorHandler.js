// Middleware para manejo global de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por middleware:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  // Error de cast (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Formato de ID inválido',
      error: 'El ID proporcionado no tiene un formato válido'
    });
  }

  // Error de duplicado (índice único)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: 'Error de duplicado',
      error: `El valor para ${field} ya existe`
    });
  }

  // Error de conexión a MongoDB
  if (err.name === 'MongoServerError' || err.name === 'MongoNetworkError') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      error: 'Servicio temporalmente no disponible'
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Error de sintaxis JSON',
      error: 'El formato JSON enviado es inválido'
    });
  }

  // Error genérico del servidor
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : 'Error interno'
  });
};

// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Middleware para logging de requests
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
};

module.exports = {
  errorHandler,
  notFound,
  requestLogger
};
