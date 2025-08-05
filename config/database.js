const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);

    // Eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

    // Manejo graceful de cierre
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('💤 Conexión MongoDB cerrada debido a terminación de la aplicación');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error cerrando conexión MongoDB:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
