const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  id_quadra: { type: mongoose.Schema.Types.ObjectId, ref: 'Quadra', required: true },
  // Armazena o ID do subdocumento de horário que foi reservado
  id_horario: { type: mongoose.Schema.Types.ObjectId, required: true },
  
  // Dados duplicados para facilitar a listagem sem precisar fazer joins complexos
  data_reserva: { type: String, required: true }, // 'YYYY-MM-DD'
  horario_reserva: { type: String, required: true }, // "18:00 - 19:00"
  nome_quadra: { type: String, required: true },

  criado_em: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reserva', ReservaSchema);