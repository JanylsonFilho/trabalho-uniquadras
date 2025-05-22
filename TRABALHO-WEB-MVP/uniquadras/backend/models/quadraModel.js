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
    const { nome, tipo, status } = data;
    const result = await pool.query(
      'INSERT INTO quadras (nome, tipo, status) VALUES ($1, $2, $3) RETURNING *',
      [nome, tipo, status]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { nome, tipo, status } = data;
    const result = await pool.query(
      'UPDATE quadras SET nome = $1, tipo = $2, status = $3 WHERE id = $4 RETURNING *',
      [nome, tipo, status, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM quadras WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = Quadra;
