const Horario = require('../models/horarioModel');

// Lista horários por quadra e data, sempre retorna um array puro
exports.listarPorQuadraEData = (req, res) => {
  const { id_quadra, data } = req.query;
  Horario.getAllByQuadraAndData(id_quadra, data, (err, resultados) => {
    if (err) return res.status(500).json({ error: err.message || err });
    // Sempre retorna um array puro, independente do banco
    if (resultados && Array.isArray(resultados)) {
      res.json(resultados);
    } else if (resultados && resultados.rows) {
      res.json(resultados.rows);
    } else {
      res.json([]);
    }
  });
};

exports.criar = (req, res) => {
  Horario.create(req.body, (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message || err });
    // Para PostgreSQL, resultado.rows[0] é o novo horário
    if (resultado && resultado.rows && resultado.rows[0]) {
      res.status(201).json(resultado.rows[0]);
    } else {
      res.status(201).json(resultado);
    }
  });
};

exports.atualizar = (req, res) => {
  const { id } = req.params;
  Horario.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message || err });
    res.status(200).json({ message: 'Horário atualizado com sucesso' });
  });
};

exports.atualizarStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  Horario.updateStatus(id, status, (err) => {
    if (err) return res.status(500).json({ error: err.message || err });
    res.status(200).json({ message: 'Status atualizado com sucesso' });
  });
};

exports.deletar = (req, res) => {
  const { id } = req.params;
  Horario.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message || err });
    res.status(200).json({ message: 'Horário deletado com sucesso' });
  });
};