const Quadra = require('../models/quadraModel');
const Horario = require('../models/horarioModel'); // Importa o model de horários
const pool = require('../config/db');


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

      // Horários padrão
      const horariosPadrao = [
        "18:00 - 19:00",
        "19:00 - 20:00",
        "20:00 - 21:00",
        "21:00 - 22:00",
        "22:00 - 23:00"
      ];

      // Cria horários para datas futuras (ex: próximos 365 dias)
      const hoje = new Date();
      for (let i = 0; i < 365; i++) {
        const data = new Date(hoje);
        data.setDate(data.getDate() + i);
        const dataFormatada = data.toISOString().split('T')[0];

        for (const horario of horariosPadrao) {
          await Horario.create({
            id_quadra: novaQuadra.id,
            data: dataFormatada,
            horario: horario,
            status: 'Disponível'
          });
        }
      }

      res.status(201).json(novaQuadra);
    } catch (error) {
      console.error("Erro ao criar quadra e gerar horários:", error);
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
    const quadraId = req.params.id;

    // 1. Remover reservas relacionadas aos horários dessa quadra
    await pool.query(`
      DELETE FROM reservas
      WHERE id_horario IN (SELECT id FROM horarios WHERE id_quadra = $1)
    `, [quadraId]);

    // 2. Remover horários da quadra
    await pool.query('DELETE FROM horarios WHERE id_quadra = $1', [quadraId]);

    // 3. Remover a quadra
    const quadraDeletada = await Quadra.delete(quadraId);
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
