
const pool = require('../config/db');
const bcrypt = require('bcrypt');

const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM usuarios');
  return result.rows;
};

const createUser = async (userData) => {
  const { nome, email, senha, telefone} = userData;
  const saltRounds = 10;
  const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
  const dataCadastro = new Date();
  const id_tipo_usuario = 1

  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha, telefone, data_cadastro, id_tipo_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [nome, email, senhaCriptografada, telefone, dataCadastro, id_tipo_usuario]
  );
  return result.rows[0];
};

const promoteADM = async (id) => {
  const result = await pool.query(
    'UPDATE usuarios SET id_tipo_usuario = $1 WHERE id = $2 RETURNING *',
    [2, id]
  );
  return result.rows[0];
};

const demoteADM = async (id) => {
  const result = await pool.query(
    'UPDATE usuarios SET id_tipo_usuario = $1 WHERE id = $2 RETURNING *',
    [1, id]
  );
  return result.rows[0];
};

module.exports = {
  getAllUsers,
  createUser,
  promoteADM,
  demoteADM,
};