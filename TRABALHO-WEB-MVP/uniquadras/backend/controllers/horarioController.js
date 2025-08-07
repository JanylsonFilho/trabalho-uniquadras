const Quadra = require('../models/quadraModel');

// Lista horários de uma quadra em uma data específica
const listarPorQuadraEData = async (req, res) => {
  const { id_quadra, data } = req.query;
  if (!id_quadra || !data) {
    return res.status(400).json({ error: 'ID da quadra e data são obrigatórios.' });
  }
  try {
    const quadra = await Quadra.findById(id_quadra);
    if (!quadra) {
      return res.status(404).json({ error: 'Quadra não encontrada.' });
    }
    const horariosDoDia = quadra.horarios.filter(h => h.data === data);
    res.json(horariosDoDia);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar horários.' });
  }
};

// Adiciona um novo horário a uma quadra
const criar = async (req, res) => {
  const { id_quadra, data, horario, status } = req.body;
  try {
    const quadra = await Quadra.findById(id_quadra);
    if (!quadra) {
      return res.status(404).json({ error: 'Quadra não encontrada.' });
    }
    quadra.horarios.push({ data, horario, status });
    await quadra.save();
    res.status(201).json(quadra.horarios[quadra.horarios.length - 1]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar horário.' });
  }
};

// Atualiza um horário específico
const atualizar = async (req, res) => {
  const { id } = req.params; // ID do horário
  const { horario, status } = req.body;
  try {
    const quadra = await Quadra.findOne({ "horarios._id": id });
    if (!quadra) {
      return res.status(404).json({ message: 'Horário não encontrado.' });
    }
    const horarioSubDoc = quadra.horarios.id(id);
    horarioSubDoc.horario = horario;
    horarioSubDoc.status = status;
    await quadra.save();
    res.status(200).json({ message: 'Horário atualizado com sucesso', horario: horarioSubDoc });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar horário.' });
  }
};

// Atualiza apenas o status de um horário
const atualizarStatus = async (req, res) => {
  const { id } = req.params; // ID do horário
  const { status } = req.body;
  try {
    const quadra = await Quadra.findOne({ "horarios._id": id });
    if (!quadra) {
      return res.status(404).json({ message: 'Horário não encontrado.' });
    }
    const horarioSubDoc = quadra.horarios.id(id);
    horarioSubDoc.status = status;
    await quadra.save();
    res.status(200).json({ message: 'Status atualizado com sucesso', horario: horarioSubDoc });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar status do horário.' });
  }
};

// Deleta um horário
const deletar = async (req, res) => {
    const { id } = req.params; // ID do horário
    try {
        const quadra = await Quadra.findOne({ "horarios._id": id });
        if (!quadra) {
            return res.status(404).json({ message: 'Horário não encontrado.' });
        }
        quadra.horarios.id(id).deleteOne(); // Novo método do Mongoose 8+
        await quadra.save();
        res.status(200).json({ message: 'Horário deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar horário.' });
    }
};

module.exports = {
  listarPorQuadraEData,
  criar,
  atualizar,
  atualizarStatus,
  deletar,
};