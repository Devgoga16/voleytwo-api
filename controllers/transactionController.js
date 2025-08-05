const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const path = require('path');
const fs = require('fs');

// Crear nueva transacción
const createTransaction = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }

    const { createdAt, transactionType, amount, details } = req.body;

    // Preparar datos de la imagen si se subió una
    let imageData = {};
    if (req.file) {
      // Convertir buffer a Base64
      const base64Data = req.file.buffer.toString('base64');
      imageData = {
        data: base64Data,
        contentType: req.file.mimetype,
        originalName: req.file.originalname,
        size: req.file.size
      };
    }

    // Crear nueva transacción
    const transaction = new Transaction({
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      transactionType,
      amount,
      details,
      image: req.file ? imageData : undefined
    });

    const savedTransaction = await transaction.save();

    console.log(`Nueva transacción creada: ${savedTransaction._id} - Tipo: ${savedTransaction.getTransactionTypeString()} - Monto: $${savedTransaction.amount}${savedTransaction.image?.originalName ? ' - Con imagen: ' + savedTransaction.image.originalName : ''}`);

    res.status(201).json({
      success: true,
      message: 'Transacción creada exitosamente',
      data: savedTransaction
    });

  } catch (error) {
    console.error('Error al crear transacción:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Obtener todas las transacciones
const getAllTransactions = async (req, res) => {
  try {
    // Parámetros de consulta opcionales
    const { 
      page = 1, 
      limit = 100, 
      sortBy = 'createdAt', 
      order = 'desc',
      transactionType,
      startDate,
      endDate
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (transactionType && [1, 2].includes(parseInt(transactionType))) {
      filters.transactionType = parseInt(transactionType);
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    // Ejecutar consulta
    const transactions = await Transaction.find(filters)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total de documentos
    const totalTransactions = await Transaction.countDocuments(filters);

    console.log(`Consulta de transacciones: ${transactions.length} resultados de ${totalTransactions} total`);

    res.status(200).json({
      success: true,
      message: 'Transacciones obtenidas exitosamente',
      data: transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTransactions / parseInt(limit)),
        totalTransactions,
        hasNext: skip + transactions.length < totalTransactions,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Obtener transacción por ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transacción obtenida exitosamente',
      data: transaction
    });

  } catch (error) {
    console.error('Error al obtener transacción:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de transacción inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Obtener estadísticas
const getTransactionStats = async (req, res) => {
  try {
    const stats = await Transaction.getStats();
    
    const formattedStats = {
      ingresos: stats.find(s => s._id === 1) || { total: 0, count: 0 },
      egresos: stats.find(s => s._id === 2) || { total: 0, count: 0 }
    };

    const balance = formattedStats.ingresos.total - formattedStats.egresos.total;

    res.status(200).json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: {
        ...formattedStats,
        balance,
        totalTransacciones: formattedStats.ingresos.count + formattedStats.egresos.count
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Eliminar transacción
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    await Transaction.findByIdAndDelete(id);

    console.log(`Transacción eliminada: ${id}${transaction.image?.originalName ? ' (con imagen: ' + transaction.image.originalName + ')' : ''}`);

    res.status(200).json({
      success: true,
      message: 'Transacción eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de transacción inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Obtener imagen de transacción
const getTransactionImage = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id, 'image');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    if (!transaction.image?.data) {
      return res.status(404).json({
        success: false,
        message: 'Esta transacción no tiene imagen asociada'
      });
    }

    // Convertir Base64 a buffer
    const imageBuffer = Buffer.from(transaction.image.data, 'base64');

    // Configurar headers
    res.set({
      'Content-Type': transaction.image.contentType,
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
      'Content-Disposition': `inline; filename="${transaction.image.originalName}"`
    });

    res.send(imageBuffer);

  } catch (error) {
    console.error('Error al obtener imagen:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de transacción inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Subir imagen a transacción existente
const uploadImageToTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha enviado ninguna imagen',
        error: 'El campo "image" es requerido para este endpoint'
      });
    }

    // Buscar la transacción
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    // Convertir buffer a Base64
    const base64Data = req.file.buffer.toString('base64');
    const imageData = {
      data: base64Data,
      contentType: req.file.mimetype,
      originalName: req.file.originalname,
      size: req.file.size
    };

    // Actualizar la transacción con la nueva imagen
    transaction.image = imageData;
    const updatedTransaction = await transaction.save();

    console.log(`Imagen agregada a transacción: ${id} - Archivo: ${req.file.originalname} (${req.file.size} bytes)`);

    res.status(200).json({
      success: true,
      message: 'Imagen agregada exitosamente a la transacción',
      data: updatedTransaction
    });

  } catch (error) {
    console.error('Error al subir imagen:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de transacción inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Eliminar imagen de transacción
const removeImageFromTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la transacción
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    if (!transaction.image?.data) {
      return res.status(404).json({
        success: false,
        message: 'Esta transacción no tiene imagen para eliminar'
      });
    }

    // Eliminar la imagen
    transaction.image = undefined;
    const updatedTransaction = await transaction.save();

    console.log(`Imagen eliminada de transacción: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Imagen eliminada exitosamente de la transacción',
      data: updatedTransaction
    });

  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de transacción inválido'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionStats,
  deleteTransaction,
  getTransactionImage,
  uploadImageToTransaction,
  removeImageFromTransaction
};
