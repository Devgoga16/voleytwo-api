const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionStats,
  deleteTransaction,
  getTransactionImage,
  uploadImageToTransaction,
  removeImageFromTransaction
} = require('../controllers/transactionController');

const {
  validateCreateTransaction,
  validateTransactionId,
  validateTransactionQuery
} = require('../middleware/validators');

const { upload, handleMulterError } = require('../middleware/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - transactionType
 *         - amount
 *         - details
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la transacción
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación en formato ISO 8601
 *         transactionType:
 *           type: integer
 *           enum: [1, 2]
 *           description: Tipo de transacción (1=Ingreso, 2=Egreso)
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Monto de la transacción
 *         details:
 *           type: string
 *           maxLength: 500
 *           description: Detalles de la transacción
 *         image:
 *           type: object
 *           properties:
 *             data:
 *               type: string
 *               description: Imagen en formato Base64
 *             contentType:
 *               type: string
 *               description: Tipo MIME de la imagen
 *             originalName:
 *               type: string
 *               description: Nombre original del archivo
 *             size:
 *               type: number
 *               description: Tamaño en bytes
 *       example:
 *         _id: "64f5e3a12345678901234567"
 *         createdAt: "2025-08-04T10:30:00.000Z"
 *         transactionType: 1
 *         amount: 150.75
 *         details: "Pago de cuotas mensuales"
 *         image:
 *           data: "iVBORw0KGgoAAAANSUhEUgAA..."
 *           contentType: "image/jpeg"
 *           originalName: "recibo.jpg"
 *           size: 245678
 *     
 *     TransactionInput:
 *       type: object
 *       required:
 *         - transactionType
 *         - amount
 *         - details
 *       properties:
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación (opcional, por defecto fecha actual)
 *         transactionType:
 *           type: integer
 *           enum: [1, 2]
 *           description: Tipo de transacción (1=Ingreso, 2=Egreso)
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Monto de la transacción
 *         details:
 *           type: string
 *           maxLength: 500
 *           description: Detalles de la transacción
 *         image:
 *           type: string
 *           format: binary
 *           description: Imagen opcional de la transacción (máximo 5MB)
 *       example:
 *         createdAt: "2025-08-04T10:30:00.000Z"
 *         transactionType: 1
 *         amount: 150.75
 *         details: "Pago de cuotas mensuales"
 */

/**
 * @swagger
 * /api/Transaction:
 *   post:
 *     summary: Crear una nueva transacción
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - transactionType
 *               - amount
 *               - details
 *             properties:
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de creación (opcional)
 *               transactionType:
 *                 type: integer
 *                 enum: [1, 2]
 *                 description: Tipo de transacción (1=Ingreso, 2=Egreso)
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Monto de la transacción
 *               details:
 *                 type: string
 *                 maxLength: 500
 *                 description: Detalles de la transacción
 *               image:
 *                 type: string
 *                 format: binary
 *                 required: false
 *                 description: "Imagen opcional del comprobante (máximo 5MB, formatos: JPG, PNG, GIF, WebP)"
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: Transacción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Errores de validación
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', upload.single('image'), handleMulterError, validateCreateTransaction, createTransaction);

/**
 * @swagger
 * /api/Transaction/list:
 *   get:
 *     summary: Obtener lista de todas las transacciones
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 100
 *         description: Cantidad de elementos por página
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, amount, transactionType]
 *           default: createdAt
 *         description: Campo por el cual ordenar
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden de los resultados
 *       - in: query
 *         name: transactionType
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         description: Filtrar por tipo de transacción
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de inicio para filtrar
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Fecha de fin para filtrar
 *     responses:
 *       200:
 *         description: Lista de transacciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalTransactions:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       500:
 *         description: Error interno del servidor
 */
router.get('/list', validateTransactionQuery, getAllTransactions);

/**
 * @swagger
 * /api/Transaction/{id}:
 *   get:
 *     summary: Obtener transacción por ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transacción
 *     responses:
 *       200:
 *         description: Transacción obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transacción no encontrada
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', validateTransactionId, getTransactionById);

/**
 * @swagger
 * /api/Transaction/stats/summary:
 *   get:
 *     summary: Obtener estadísticas de transacciones
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     ingresos:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         count:
 *                           type: integer
 *                     egresos:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         count:
 *                           type: integer
 *                     balance:
 *                       type: number
 *                     totalTransacciones:
 *                       type: integer
 *       500:
 *         description: Error interno del servidor
 */
router.get('/stats/summary', getTransactionStats);

/**
 * @swagger
 * /api/Transaction/{id}:
 *   delete:
 *     summary: Eliminar transacción por ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transacción
 *     responses:
 *       200:
 *         description: Transacción eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Transacción no encontrada
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', validateTransactionId, deleteTransaction);

/**
 * @swagger
 * /api/Transaction/{id}/image:
 *   get:
 *     summary: Obtener imagen de transacción por ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transacción
 *     responses:
 *       200:
 *         description: Imagen obtenida exitosamente
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/gif:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Transacción no encontrada o sin imagen
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/image', validateTransactionId, getTransactionImage);

/**
 * @swagger
 * /api/Transaction/{id}/upload-image:
 *   post:
 *     summary: Subir imagen a transacción existente
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transacción
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del comprobante (máximo 5MB, formatos JPG, PNG, GIF, WebP)
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: No se envió imagen o ID inválido
 *       404:
 *         description: Transacción no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:id/upload-image', validateTransactionId, upload.single('image'), handleMulterError, uploadImageToTransaction);

/**
 * @swagger
 * /api/Transaction/{id}/remove-image:
 *   delete:
 *     summary: Eliminar imagen de transacción
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transacción
 *     responses:
 *       200:
 *         description: Imagen eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transacción no encontrada o sin imagen
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id/remove-image', validateTransactionId, removeImageFromTransaction);

module.exports = router;
