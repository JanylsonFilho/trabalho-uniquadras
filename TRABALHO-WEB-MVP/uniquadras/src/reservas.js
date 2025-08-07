// src/reservas.js

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", async function () {
  const tipoQuadraSelect = document.getElementById('tipoQuadra');
  const esporteSelect = document.getElementById('esporte');
  const quadraSelect = document.getElementById('quadra');
  const dataInput = document.getElementById('data');
  const horarioSelect = document.getElementById('horario');
  const reservaForm = document.getElementById('reservaForm');

  const apiQuadras = "http://localhost:3000/quadras";
  const apiHorarios = "http://localhost:3000/horarios"; // Rota para buscar horários de uma quadra
  const apiReservas = "http://localhost:3000/reservas";

  let todasQuadras = [];

  async function carregarTodasQuadras() {
    try {
      const response = await fetch(apiQuadras);
      if (!response.ok) throw new Error('Erro ao buscar quadras.');
      todasQuadras = await response.json();
    } catch (error) {
      console.error('Erro ao carregar quadras:', error);
    }
  }

  function popularQuadrasPorTipo() {
    const tipoSelecionado = tipoQuadraSelect.value;
    quadraSelect.innerHTML = '<option value="">Selecione</option>';

    const quadrasFiltradas = todasQuadras.filter(q => q.tipo === tipoSelecionado && q.status === 'Ativa');
    quadrasFiltradas.forEach(quadra => {
      const option = document.createElement('option');
      option.value = quadra._id; // Usar _id do MongoDB
      option.textContent = quadra.nome;
      quadraSelect.appendChild(option);
    });
    horarioSelect.innerHTML = '<option value="">Selecione a data e a quadra</option>';
  }

  const esportesPorQuadraTipo = {
    "Aberta": ["Futevôlei", "Beach Tênis", "Vôlei de Praia"],
    "Fechada": ["Futsal", "Basquete", "Vôlei", "Handball", "Tênis"]
  };

  tipoQuadraSelect.addEventListener('change', () => {
    popularQuadrasPorTipo();
    const tipoSelecionado = tipoQuadraSelect.value;
    esporteSelect.innerHTML = '<option value="">Selecione</option>';
    if (esportesPorQuadraTipo[tipoSelecionado]) {
      esportesPorQuadraTipo[tipoSelecionado].forEach(esporte => {
        const option = document.createElement('option');
        option.value = esporte;
        option.textContent = esporte;
        esporteSelect.appendChild(option);
      });
    }
  });

  async function atualizarHorariosDisponiveis() {
    const dataSelecionada = dataInput.value;
    const quadraIdSelecionada = quadraSelect.value;
    horarioSelect.innerHTML = '<option value="">Carregando...</option>';

    if (!dataSelecionada || !quadraIdSelecionada) {
      horarioSelect.innerHTML = '<option value="">Selecione a data e a quadra</option>';
      return;
    }

    try {
      const response = await fetch(`${apiHorarios}?id_quadra=${quadraIdSelecionada}&data=${dataSelecionada}`);
      if (!response.ok) throw new Error('Erro ao buscar horários.');
      
      const horarios = await response.json();
      const horariosDisponiveis = horarios.filter(h => h.status === "Disponível");
      
      horarioSelect.innerHTML = '<option value="">Selecione</option>';
      if (horariosDisponiveis.length === 0) {
        horarioSelect.innerHTML = '<option value="">Nenhum horário disponível</option>';
        return;
      }

      horariosDisponiveis.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario._id; // Usar _id do subdocumento de horário
        option.textContent = horario.horario;
        horarioSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao obter horários:', error);
      horarioSelect.innerHTML = '<option value="">Erro ao carregar horários</option>';
    }
  }

  dataInput.addEventListener('change', atualizarHorariosDisponiveis);
  quadraSelect.addEventListener('change', atualizarHorariosDisponiveis);

  reservaForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const idQuadra = quadraSelect.value;
    const esporte = esporteSelect.value;
    const idHorario = horarioSelect.value;

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const usuarioId = usuarioLogado?.user?._id;

    if (!usuarioId) {
      alert("Você precisa estar logado para fazer uma reserva.");
      window.location.href = "login.html";
      return;
    }
    if (!idQuadra || !esporte || !idHorario) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch(apiReservas, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: usuarioId,
          id_quadra: idQuadra,
          id_horario: idHorario
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar reserva');
      }

      alert(`✅ Reserva confirmada com sucesso!`);
      atualizarHorariosDisponiveis(); // Recarrega os horários
    } catch (error) {
      alert('Erro ao criar reserva: ' + error.message);
    }
  });

  await carregarTodasQuadras();
  // Define a data de hoje como padrão
  dataInput.value = new Date().toISOString().split("T")[0];
});