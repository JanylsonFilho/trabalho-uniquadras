// CÓDIGO NOVO E CORRETO
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB conectado com sucesso.');
  } catch (err) {
    console.error('Erro ao conectar com o MongoDB:', err.message);
    // Encerra o processo com falha em caso de erro na conexão
    process.exit(1);
  }
};

module.exports = connectDB;