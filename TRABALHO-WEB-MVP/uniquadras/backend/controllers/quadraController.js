const Quadra = require('../models/quadraModel');

const quadraController = {
  async listar(req, res) {
    try {
      const quadras = await Quadra.getAll();
      res.json(quadras);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar quadras.' });
    }
  },

  async obter(req, res) {
    try {
      const quadra = await Quadra.getById(req.params.id);
      if (!quadra) {
        return res.status(404).json({ error: 'Quadra não encontrada.' });
      }
      res.json(quadra);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter quadra.' });
    }
  },

  async criar(req, res) {
    try {
      const novaQuadra = await Quadra.create(req.body);
      res.status(201).json(novaQuadra);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar quadra.' });
    }
  },

  async atualizar(req, res) {
    try {
      const quadraAtualizada = await Quadra.update(req.params.id, req.body);
      if (!quadraAtualizada) {
        return res.status(404).json({ error: 'Quadra não encontrada.' });
      }
      res.json(quadraAtualizada);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar quadra.' });
    }
  },

  async deletar(req, res) {
    try {
      const quadraDeletada = await Quadra.delete(req.params.id);
      if (!quadraDeletada) {
        return res.status(404).json({ error: 'Quadra não encontrada.' });
      }
      res.json({ message: 'Quadra deletada com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar quadra.' });
    }
  },
};

module.exports = quadraController;
