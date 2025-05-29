const db = require('../config/db');

const Horario = {
  getAllByQuadraAndData: (id_quadra, data, callback) => {
    const sql = 'SELECT * FROM horarios WHERE id_quadra = $1 AND data = $2';
    db.query(sql, [id_quadra, data], callback);
  },

  create: (horario, callback) => {
    const sql = 'INSERT INTO horarios (id_quadra, data, horario, status) VALUES ($1, $2, $3, $4)';
    db.query(sql, [horario.id_quadra, horario.data, horario.horario, horario.status], callback);
  },

  update: (id, horario, callback) => {
    const sql = 'UPDATE horarios SET horario = $1, status = $2 WHERE id = $3';
    db.query(sql, [horario.horario, horario.status, id], callback);
  },

  updateStatus: (id, status, callback) => {
    const sql = 'UPDATE horarios SET status = $1 WHERE id = $2';
    db.query(sql, [status, id], callback);
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM horarios WHERE id = $1';
    db.query(sql, [id], callback);
  }
};

module.exports = Horario;