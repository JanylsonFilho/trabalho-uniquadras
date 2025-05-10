const pool = require('../config/db');

const Quadra = {
  async getAll() {
    const result = await pool.query('SELECT * FROM quadras');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM quadras WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(data) {
    const { nome, localizacao, tipo } = data;
    const result = await pool.query(
      'INSERT INTO quadras (nome, localizacao, tipo) VALUES ($1, $2, $3) RETURNING *',
      [nome, localizacao, tipo]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { nome, localizacao, tipo } = data;
    const result = await pool.query(
      'UPDATE quadras SET nome = $1, localizacao = $2, tipo = $3 WHERE id = $4 RETURNING *',
      [nome, localizacao, tipo, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM quadras WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = Quadra;
