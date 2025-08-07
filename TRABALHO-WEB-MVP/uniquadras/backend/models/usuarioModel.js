const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  senha: { type: String, required: true },
  telefone: { type: String, required: true },
  data_cadastro: { type: Date, default: Date.now },
  id_tipo_usuario: { type: String, enum: ['1', '2'], default: '1' } // 1: Usuário, 2: ADM
});

// Middleware (hook) para criptografar a senha antes de salvar um novo usuário
UsuarioSchema.pre('save', async function(next) {
  // Executa o hash apenas se a senha foi modificada (ou é nova)
  if (!this.isModified('senha')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);