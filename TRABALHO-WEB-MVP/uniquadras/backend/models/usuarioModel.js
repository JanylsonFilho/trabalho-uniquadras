const pool = require('../config/db');

const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM usuarios');
  return result.rows;
};

const createUser = async (userData) => {
  const { nome, email, senha, telefone, data_cadastro, id_tipo_usuario } = userData;
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha, telefone, data_cadastro, id_tipo_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [nome, email, senha, telefone, data_cadastro, id_tipo_usuario]
  );
  return result.rows[0];
};

module.exports = {
  getAllUsers,
  createUser,
};
