const Horario = require('../models/horarioModel'); //

// Lista horários por quadra e data, ou apenas por data
exports.listarPorQuadraEData = async (req, res) => { //
  const { id_quadra, data } = req.query; //
  try {
    let resultados; //
    if (id_quadra) { //
      resultados = await Horario.getAllByQuadraAndDate(id_quadra, data); // Busca por quadra e data
    } else {
      resultados = await Horario.getAllByDate(data); // Busca apenas por data (todas as quadras)
    }
    res.json(resultados); //
  } catch (err) {
    console.error('Erro ao listar horários:', err); //
    res.status(500).json({ error: err.message || 'Erro ao listar horários.' }); //
  }
};

exports.criar = async (req, res) => { //
  try {
    const novoHorario = await Horario.create(req.body); //
    res.status(201).json(novoHorario); //
  } catch (err) {
    console.error('Erro ao criar horário:', err); //
    res.status(500).json({ error: err.message || 'Erro ao criar horário.' }); //
  }
};

exports.atualizar = async (req, res) => { //
  const { id } = req.params; //
  try {
    const horarioAtualizado = await Horario.update(id, req.body); //
    if (!horarioAtualizado) { //
      return res.status(404).json({ message: 'Horário não encontrado.' }); //
    }
    res.status(200).json({ message: 'Horário atualizado com sucesso', horario: horarioAtualizado }); //
  } catch (err) {
    console.error('Erro ao atualizar horário:', err); //
    res.status(500).json({ error: err.message || 'Erro ao atualizar horário.' }); //
  }
};

exports.atualizarStatus = async (req, res) => { //
  const { id } = req.params; //
  const { status } = req.body; //
  try {
    const horarioAtualizado = await Horario.updateStatus(id, status); //
    if (!horarioAtualizado) { //
      return res.status(404).json({ message: 'Horário não encontrado.' }); //
    }
    res.status(200).json({ message: 'Status atualizado com sucesso', horario: horarioAtualizado }); //
  } catch (err) {
    console.error('Erro ao atualizar status do horário:', err); //
    res.status(500).json({ error: err.message || 'Erro ao atualizar status do horário.' }); //
  }
};

exports.deletar = async (req, res) => { //
  const { id } = req.params; //
  try {
    const horarioDeletado = await Horario.delete(id); //
    if (!horarioDeletado) { //
      return res.status(404).json({ message: 'Horário não encontrado.' }); //
    }
    res.status(200).json({ message: 'Horário deletado com sucesso' }); //
  } catch (err) {
    console.error('Erro ao deletar horário:', err); //
    res.status(500).json({ error: err.message || 'Erro ao deletar horário.' }); //
  }
};