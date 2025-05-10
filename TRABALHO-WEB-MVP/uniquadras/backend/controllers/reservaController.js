const Reserva = require('../models/reservaModel');

const reservaController = {
  async listar(req, res) {
    try {
      const reservas = await Reserva.getAll();
      res.json(reservas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar reservas.' });
    }
  },

  async obter(req, res) {
    try {
      const reserva = await Reserva.getById(req.params.id);
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva não encontrada.' });
      }
      res.json(reserva);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter reserva.' });
    }
  },

  async criar(req, res) {
    try {
      const novaReserva = await Reserva.create(req.body);
      res.status(201).json(novaReserva);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar reserva.' });
    }
  },

  async atualizar(req, res) {
    try {
      const reservaAtualizada = await Reserva.update(req.params.id, req.body);
      if (!reservaAtualizada) {
        return res.status(404).json({ error: 'Reserva não encontrada.' });
      }
      res.json(reservaAtualizada);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar reserva.' });
    }
  },

  async deletar(req, res) {
    try {
      const reservaDeletada = await Reserva.delete(req.params.id);
      if (!reservaDeletada) {
        return res.status(404).json({ error: 'Reserva não encontrada.' });
      }
      res.json({ message: 'Reserva deletada com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar reserva.' });
    }
  },
};

module.exports = reservaController;
