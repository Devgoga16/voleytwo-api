const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: [true, 'La fecha de creación es requerida'],
    default: Date.now
  },
  transactionType: {
    type: Number,
    required: [true, 'El tipo de transacción es requerido'],
    enum: {
      values: [1, 2],
      message: 'El tipo de transacción debe ser 1 (Ingreso) o 2 (Egreso)'
    }
  },
  amount: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto debe ser mayor a 0']
  },
  details: {
    type: String,
    required: [true, 'Los detalles son requeridos'],
    trim: true,
    maxlength: [500, 'Los detalles no pueden exceder 500 caracteres']
  },
  image: {
    data: {
      type: String,
      default: null
    },
    contentType: {
      type: String,
      default: null
    },
    originalName: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: null
    }
  }
}, {
  timestamps: false, // Usamos createdAt personalizado
  versionKey: false
});

// Índices para mejorar performance
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ transactionType: 1 });

// Método para obtener el tipo de transacción como string
transactionSchema.methods.getTransactionTypeString = function() {
  return this.transactionType === 1 ? 'Ingreso' : 'Egreso';
};

// Método estático para obtener estadísticas
transactionSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$transactionType',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return stats;
};

module.exports = mongoose.model('Transaction', transactionSchema);
