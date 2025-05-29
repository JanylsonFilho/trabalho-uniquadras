const db = require('../config/db'); //

const Horario = {
  // Novo método para buscar todos os horários de uma data específica (TODAS as quadras)
  async getAllByDate(data) { //
    const sql = 'SELECT * FROM horarios WHERE data = $1 ORDER BY horario ASC'; //
    const result = await db.query(sql, [data]); //
    return result.rows; //
  },

  // Método para buscar horários por quadra E data (renomeado para clareza)
  async getAllByQuadraAndDate(id_quadra, data) { //
    const sql = 'SELECT * FROM horarios WHERE id_quadra = $1 AND data = $2 ORDER BY horario ASC'; //
    const result = await db.query(sql, [id_quadra, data]); //
    return result.rows; //
  },

  async create(horario) { //
    const sql = 'INSERT INTO horarios (id_quadra, data, horario, status) VALUES ($1, $2, $3, $4) RETURNING *'; //
    const result = await db.query(sql, [horario.id_quadra, horario.data, horario.horario, horario.status]); //
    return result.rows[0]; //
  },

  async update(id, horario) { //
    const sql = 'UPDATE horarios SET horario = $1, status = $2 WHERE id = $3 RETURNING *'; //
    const result = await db.query(sql, [horario.horario, horario.status, id]); //
    return result.rows[0]; //
  },

  async updateStatus(id, status) { //
    const sql = 'UPDATE horarios SET status = $1 WHERE id = $2 RETURNING *'; //
    const result = await db.query(sql, [status, id]); //
    return result.rows[0]; //
  },

  async delete(id) { //
    const sql = 'DELETE FROM horarios WHERE id = $1 RETURNING *'; //
    const result = await db.query(sql, [id]); //
    return result.rows[0]; //
  }
};

module.exports = Horario; //