require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');

// Datos existentes del usuario
const existingData = [
    {
        "transactionId": 53,
        "createdAt": "2025-09-27T00:00:00",
        "transactionType": 1,
        "amount": 75.00,
        "details": "Colecta Domingo 29"
    },
    {
        "transactionId": 49,
        "createdAt": "2025-08-04T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Pago cancha miércoles 36 de Agosto"
    },
    {
        "transactionId": 48,
        "createdAt": "2025-08-04T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta miercoles 06 de Agosto"
    },
    {
        "transactionId": 47,
        "createdAt": "2025-08-01T00:00:00",
        "transactionType": 2,
        "amount": 94.00,
        "details": "Pago del préstamo a la Hna Carmen Alonzo - Compra de balón"
    },
    {
        "transactionId": 46,
        "createdAt": "2025-08-01T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Pago cancha domingo 3 de Agosto"
    },
    {
        "transactionId": 45,
        "createdAt": "2025-07-31T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta domingo 3 de Agosto"
    },
    {
        "transactionId": 44,
        "createdAt": "2025-07-29T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Pago cancha miércoles 30 de julio"
    },
    {
        "transactionId": 43,
        "createdAt": "2025-07-29T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta miercoles 30 de Julio"
    },
    {
        "transactionId": 42,
        "createdAt": "2025-07-26T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Pago cancha domingo 27 de julio"
    },
    {
        "transactionId": 41,
        "createdAt": "2025-07-26T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta domingo 27 de Julio"
    },
    {
        "transactionId": 40,
        "createdAt": "2025-07-22T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Pago cancha miércoles 23 de julio"
    },
    {
        "transactionId": 39,
        "createdAt": "2025-07-22T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta miercoles 23 de Julio"
    },
    {
        "transactionId": 38,
        "createdAt": "2025-07-19T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Pago cancha domingo 20 de julio"
    },
    {
        "transactionId": 37,
        "createdAt": "2025-07-19T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta domingo 20 de Julio"
    },
    {
        "transactionId": 36,
        "createdAt": "2025-07-15T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Pago cancha miércoles 16 de julio"
    },
    {
        "transactionId": 35,
        "createdAt": "2025-07-15T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta miércoles 16 de Julio"
    },
    {
        "transactionId": 34,
        "createdAt": "2025-07-14T00:00:00",
        "transactionType": 2,
        "amount": 207.00,
        "details": "Compra de balón nuevo"
    },
    {
        "transactionId": 33,
        "createdAt": "2025-07-14T00:00:00",
        "transactionType": 1,
        "amount": 94.00,
        "details": "Préstamo para comprar nuevo balón - Hna Carmen Alonzo"
    },
    {
        "transactionId": 32,
        "createdAt": "2025-07-12T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Alquiler cancha Domingo 13 de Julio"
    },
    {
        "transactionId": 31,
        "createdAt": "2025-07-12T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta Domingo 13 de Julio"
    },
    {
        "transactionId": 30,
        "createdAt": "2025-07-08T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Pago cancha miércoles 9 de julio"
    },
    {
        "transactionId": 29,
        "createdAt": "2025-07-08T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta miércoles 9 de Julio"
    },
    {
        "transactionId": 28,
        "createdAt": "2025-07-05T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Pago alquiler cancha Domingo 5 de Julio"
    },
    {
        "transactionId": 27,
        "createdAt": "2025-07-05T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta Domingo 6 de Julio"
    },
    {
        "transactionId": 26,
        "createdAt": "2025-07-02T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Alquiler cancha Miércoles 2"
    },
    {
        "transactionId": 25,
        "createdAt": "2025-07-02T00:00:00",
        "transactionType": 1,
        "amount": 72.00,
        "details": "Colecta Miércoles 2"
    },
    {
        "transactionId": 52,
        "createdAt": "2025-06-27T00:00:00",
        "transactionType": 1,
        "amount": 75.00,
        "details": "Colecta Domingo 29"
    },
    {
        "transactionId": 51,
        "createdAt": "2025-06-27T00:00:00",
        "transactionType": 1,
        "amount": 75.00,
        "details": "Colecta Domingo 29"
    },
    {
        "transactionId": 50,
        "createdAt": "2025-06-27T00:00:00",
        "transactionType": 1,
        "amount": 75.00,
        "details": "Colecta Domingo 29"
    },
    {
        "transactionId": 24,
        "createdAt": "2025-06-27T00:00:00",
        "transactionType": 2,
        "amount": 50.00,
        "details": "Alquiler cancha Domingo 29"
    },
    {
        "transactionId": 23,
        "createdAt": "2025-06-27T00:00:00",
        "transactionType": 1,
        "amount": 75.00,
        "details": "Colecta Domingo 29"
    }
];

async function migrateData() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Limpiar colección existente (opcional)
        const existingCount = await Transaction.countDocuments();
        console.log(`📊 Transacciones existentes: ${existingCount}`);

        if (existingCount > 0) {
            const answer = require('readline-sync').question('¿Deseas eliminar las transacciones existentes? (y/N): ');
            if (answer.toLowerCase() === 'y') {
                await Transaction.deleteMany({});
                console.log('🗑️ Transacciones existentes eliminadas');
            }
        }

        // Insertar nuevas transacciones
        console.log('📝 Insertando transacciones...');
        
        let insertedCount = 0;
        for (const data of existingData) {
            try {
                const transaction = new Transaction({
                    createdAt: new Date(data.createdAt),
                    transactionType: data.transactionType,
                    amount: data.amount,
                    details: data.details
                });
                
                await transaction.save();
                insertedCount++;
                
                const type = data.transactionType === 1 ? 'Ingreso' : 'Egreso';
                console.log(`✅ ${insertedCount}/${existingData.length} - ${type}: $${data.amount} - ${data.details.substring(0, 30)}...`);
                
            } catch (error) {
                console.error(`❌ Error insertando transacción ${data.transactionId}:`, error.message);
            }
        }

        console.log(`\n🎉 Migración completada!`);
        console.log(`📊 Transacciones insertadas: ${insertedCount}/${existingData.length}`);

        // Mostrar estadísticas
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: '$transactionType',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n📈 Estadísticas:');
        stats.forEach(stat => {
            const type = stat._id === 1 ? 'Ingresos' : 'Egresos';
            console.log(`   ${type}: $${stat.total} (${stat.count} transacciones)`);
        });

        const ingresos = stats.find(s => s._id === 1)?.total || 0;
        const egresos = stats.find(s => s._id === 2)?.total || 0;
        const balance = ingresos - egresos;
        console.log(`   Balance: $${balance}`);

    } catch (error) {
        console.error('❌ Error en la migración:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Desconectado de MongoDB');
    }
}

// Ejecutar migración
migrateData();
