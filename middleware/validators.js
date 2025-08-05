const { body, param, query } = require('express-validator');

// Validaciones para crear transacción
const validateCreateTransaction = [
  body('transactionType')
    .isInt({ min: 1, max: 2 })
    .withMessage('El tipo de transacción debe ser 1 (Ingreso) o 2 (Egreso)'),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('El monto debe ser un número mayor a 0')
    .toFloat(),
  
  body('details')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Los detalles son requeridos y no pueden exceder 500 caracteres'),
  
  body('createdAt')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe estar en formato ISO 8601')
    .toDate()
];

// Validaciones para parámetros de ID
const validateTransactionId = [
  param('id')
    .isMongoId()
    .withMessage('El ID debe ser un ObjectId válido de MongoDB')
];

// Validaciones para query parameters de lista
const validateTransactionQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('El límite debe ser un número entre 1 y 1000')
    .toInt(),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'amount', 'transactionType'])
    .withMessage('El campo de ordenamiento debe ser: createdAt, amount o transactionType'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('El orden debe ser asc o desc'),
  
  query('transactionType')
    .optional()
    .isInt({ min: 1, max: 2 })
    .withMessage('El tipo de transacción debe ser 1 o 2')
    .toInt(),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe estar en formato ISO 8601')
    .toDate(),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe estar en formato ISO 8601')
    .toDate()
];

module.exports = {
  validateCreateTransaction,
  validateTransactionId,
  validateTransactionQuery
};
