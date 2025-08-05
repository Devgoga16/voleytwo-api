const multer = require('multer');

// Configuración de almacenamiento en memoria (no en disco)
const storage = multer.memoryStorage();

// Filtro de archivos - solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 1 // Solo un archivo por request
  }
});

// Middleware para manejo de errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande',
        error: 'El tamaño máximo permitido es 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Demasiados archivos',
        error: 'Solo se permite un archivo por transacción'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Campo de archivo inesperado',
        error: 'Use el campo "image" para subir la imagen'
      });
    }
  }
  
  if (err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({
      success: false,
      message: 'Tipo de archivo no permitido',
      error: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'
    });
  }

  next(err);
};

module.exports = {
  upload,
  handleMulterError
};
