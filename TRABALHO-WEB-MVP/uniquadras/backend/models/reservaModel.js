const pool = require('../config/db'); //

const Reserva = {
  // Método genérico para executar queries com parâmetros
  async query(text, params) { //
    return pool.query(text, params); //
  },

  async getAll() { //
    const result = await pool.query('SELECT * FROM reservas'); //
    return result.rows; //
  },

  async getById(id) { //
    const result = await pool.query('SELECT * FROM reservas WHERE id = $1', [id]); //
    return result.rows[0]; //
  },

  async create(data) { //
    const { id_usuario, id_quadra, data_reserva, horario } = data; // Removido horario_fim
    const result = await pool.query(
      'INSERT INTO reservas (id_usuario, id_quadra, data_reserva, horario) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_usuario, id_quadra, data_reserva, horario]
    );
    return result.rows[0]; //
  },

  async update(id, data) { //
    const { id_usuario, id_quadra, data_reserva, horario } = data; // Removido horario_fim
    const result = await pool.query(
      'UPDATE reservas SET id_usuario = $1, id_quadra = $2, data_reserva = $3, horario = $4 WHERE id = $5 RETURNING *',
      [id_usuario, id_quadra, data_reserva, horario, id]
    );
    return result.rows[0]; //
  },

  async delete(id) { //
    const result = await pool.query('DELETE FROM reservas WHERE id = $1 RETURNING *', [id]); //
    return result.rows[0]; //
  },
  
  async getByUsuarioId(id_usuario) { //
    const result = await pool.query('SELECT * FROM reservas WHERE id_usuario = $1', [id_usuario]); //
    return result.rows; //
  }
};

module.exports = Reserva; //