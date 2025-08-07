const mongoose = require('mongoose');

// Schema para os horários, que serão subdocumentos dentro de cada quadra
const HorarioSchema = new mongoose.Schema({
  data: { type: String, required: true }, // Formato 'YYYY-MM-DD' para facilitar a busca
  horario: { type: String, required: true }, // Ex: "18:00 - 19:00"
  status: { type: String, enum: ['Disponível', 'Indisponível'], default: 'Disponível' }
});

const QuadraSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ['Aberta', 'Fechada'], required: true },
  status: { type: String, enum: ['Ativa', 'Inativa'], default: 'Ativa' },
  horarios: [HorarioSchema] // Array de horários
});

module.exports = mongoose.model('Quadra', QuadraSchema);