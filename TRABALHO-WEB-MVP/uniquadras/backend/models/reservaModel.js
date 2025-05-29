const pool = require('../config/db');

const Reserva = {
  async query(text, params) {
    return pool.query(text, params);
  },

  async getAll() {
    const result = await pool.query(`
      SELECT r.*, h.data, h.horario
      FROM reservas r
      JOIN horarios h ON r.id_horario = h.id
    `);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`
      SELECT r.*, h.data, h.horario
      FROM reservas r
      JOIN horarios h ON r.id_horario = h.id
      WHERE r.id = $1
    `, [id]);
    return result.rows[0];
  },

  async create(data) {
    const { id_usuario, id_quadra, id_horario } = data;
    const result = await pool.query(
      'INSERT INTO reservas (id_usuario, id_quadra, id_horario) VALUES ($1, $2, $3) RETURNING *',
      [id_usuario, id_quadra, id_horario]
    );
    return result.rows[0];
  },

  async update(id, data) {
    const { id_usuario, id_quadra, id_horario } = data;
    const result = await pool.query(
      'UPDATE reservas SET id_usuario = $1, id_quadra = $2, id_horario = $3 WHERE id = $4 RETURNING *',
      [id_usuario, id_quadra, id_horario, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM reservas WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async getByUsuarioId(id_usuario) {
    const result = await pool.query(`
      SELECT r.*, h.data, h.horario
      FROM reservas r
      JOIN horarios h ON r.id_horario = h.id
      WHERE r.id_usuario = $1
    `, [id_usuario]);
    return result.rows;
  }
};

module.exports = Reserva;