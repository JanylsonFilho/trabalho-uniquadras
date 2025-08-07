const Quadra = require('../models/quadraModel');
const Reserva = require('../models/reservaModel');

// Lista todas as quadras
const listar = async (req, res) => {
  try {
    const quadras = await Quadra.find({}, { horarios: 0 }); // Não envia a lista gigante de horários
    res.json(quadras);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar quadras.' });
  }
};

// Obtém uma quadra específica pelo ID
const obter = async (req, res) => {
  try {
    const quadra = await Quadra.findById(req.params.id, { horarios: 0 });
    if (!quadra) {
      return res.status(404).json({ error: 'Quadra não encontrada.' });
    }
    res.json(quadra);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter quadra.' });
  }
};

// Cria uma nova quadra e gera seus horários
const criar = async (req, res) => {
  try {
    const { nome, tipo, status } = req.body;
    const novaQuadra = new Quadra({ nome, tipo, status });
    
    const horariosPadrao = ["18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00"];
    let horarios = [];
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() + i);
      const dataFormatada = data.toISOString().split('T')[0];
      for (const horario of horariosPadrao) {
        horarios.push({ data: dataFormatada, horario, status: 'Disponível' });
      }
    }
    novaQuadra.horarios = horarios;
    await novaQuadra.save();
    res.status(201).json(novaQuadra);
  } catch (error) {
    console.error("Erro ao criar quadra:", error);
    res.status(500).json({ error: 'Erro ao criar quadra.' });
  }
};

// Atualiza uma quadra
const atualizar = async (req, res) => {
  try {
    const quadraAtualizada = await Quadra.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quadraAtualizada) {
      return res.status(404).json({ error: 'Quadra não encontrada.' });
    }
    res.json(quadraAtualizada);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar quadra.' });
  }
};

// Deleta uma quadra e todas as reservas associadas
const deletar = async (req, res) => {
  try {
    const quadraId = req.params.id;
    // 1. Remover reservas relacionadas a esta quadra
    await Reserva.deleteMany({ id_quadra: quadraId });
    // 2. Remover a quadra
    const quadraDeletada = await Quadra.findByIdAndDelete(quadraId);
    if (!quadraDeletada) {
      return res.status(404).json({ error: 'Quadra não encontrada.' });
    }
    res.json({ message: 'Quadra e reservas associadas deletadas com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar quadra.' });
  }
};

module.exports = {
  listar,
  obter,
  criar,
  atualizar,
  deletar,
};