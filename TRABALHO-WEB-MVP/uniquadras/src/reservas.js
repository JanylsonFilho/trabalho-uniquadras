// src/reservas.js - Integração completa com backend para reservas
import 'bootstrap/dist/css/bootstrap.min.css'; //
import 'bootstrap'; //
import 'bootstrap-icons/font/bootstrap-icons.css'; //

document.addEventListener("DOMContentLoaded", async function () { //
  const tipoQuadraSelect = document.getElementById('tipoQuadra'); //
  const esporteSelect = document.getElementById('esporte'); //
  const quadraSelect = document.getElementById('quadra'); //
  const dataInput = document.getElementById('data'); //
  const horarioSelect = document.getElementById('horario'); //
  const reservaForm = document.getElementById('reservaForm'); //

  const apiQuadras = "http://localhost:3000/quadras"; //
  const apiReservas = "http://localhost:3000/reservas"; //

  let todasQuadras = []; // Para armazenar as quadras do backend

  // Carrega todas as quadras do backend ao iniciar
  async function carregarTodasQuadras() { //
    try {
      const response = await fetch(apiQuadras); //
      if (!response.ok) throw new Error('Erro ao buscar quadras.'); //
      todasQuadras = await response.json(); //
    } catch (error) {
      console.error('Erro ao carregar quadras:', error); //
      alert('Erro ao carregar quadras disponíveis.'); //
    }
  }

  // Popula o select de quadras baseado no tipo selecionado
  function popularQuadrasPorTipo() { //
    const tipoSelecionado = tipoQuadraSelect.value; //
    quadraSelect.innerHTML = '<option value="">Selecione</option>'; //

    const quadrasFiltradas = todasQuadras.filter(q => q.tipo === tipoSelecionado && q.status === 'Ativa'); //
    if (quadrasFiltradas.length > 0) { //
      quadrasFiltradas.forEach(quadra => { //
        const option = document.createElement('option'); //
        option.value = quadra.id; // Envia o ID da quadra para o backend
        option.textContent = quadra.nome; //
        quadraSelect.appendChild(option); //
      });
    } else {
      quadraSelect.innerHTML = '<option value="">Nenhuma quadra disponível para este tipo</option>'; //
    }
    horarioSelect.innerHTML = '<option value="">Selecione a data e a quadra primeiro</option>'; // Limpa horários ao mudar a quadra
  }

  // Popula o select de esportes (mantido como exemplo, pode ser dinâmico do backend se houver)
  const esportesPorQuadraTipo = { // Mapeamento estático por enquanto
    "Aberta": ["Futevôlei", "Beach Tênis", "Vôlei de Praia"],
    "Fechada": ["Futsal", "Basquete", "Vôlei", "Handball", "Tênis"]
  };

  tipoQuadraSelect.addEventListener('change', () => { //
    popularQuadrasPorTipo(); //
    const tipoSelecionado = tipoQuadraSelect.value; //
    esporteSelect.innerHTML = '<option value="">Selecione</option>'; //
    if (esportesPorQuadraTipo[tipoSelecionado]) { //
      esportesPorQuadraTipo[tipoSelecionado].forEach(esporte => { //
        const option = document.createElement('option'); //
        option.value = esporte; //
        option.textContent = esporte; //
        esporteSelect.appendChild(option); //
      });
    }
  });


  // Atualiza horários disponíveis consultando o backend
  async function atualizarHorariosDisponiveis() { //
    const dataSelecionada = dataInput.value; //
    const quadraIdSelecionada = quadraSelect.value; // Agora é o ID da quadra

    horarioSelect.innerHTML = '<option value="">Selecione</option>'; //

    if (!dataSelecionada || !quadraIdSelecionada) { //
      horarioSelect.innerHTML = '<option value="">Selecione a data e a quadra primeiro</option>'; //
      return; //
    }

    try {
      // Horários padrão para as quadras (ajuste conforme os horários reais)
      const todosHorariosDisponiveisCliente = [ // Horários que o cliente pode selecionar
        "08:00 - 10:00",
        "10:00 - 12:00",
        "12:00 - 14:00",
        "14:00 - 16:00",
        "16:00 - 18:00"
      ];

      // Busca reservas existentes para a data e quadra selecionada
      const response = await fetch(`${apiReservas}?data_reserva=${dataSelecionada}&id_quadra=${quadraIdSelecionada}`); //
      if (!response.ok) throw new Error('Erro ao buscar reservas existentes.'); //
      const reservasExistentes = await response.json(); //

      const horariosIndisponiveis = new Set(reservasExistentes.map(r => r.horario)); //

      todosHorariosDisponiveisCliente.forEach(horarioCompleto => {
        const horarioInicio = horarioCompleto.split(' ')[0]; // Pega apenas o início do horário (ex: "08:00")
        if (!horariosIndisponiveis.has(horarioInicio)) { //
          const option = document.createElement('option'); //
          option.value = horarioCompleto; // Salva o formato completo (ex: "08:00 - 10:00")
          option.textContent = horarioCompleto; // Exibe o formato completo
          horarioSelect.appendChild(option); //
        }
      });

      if (horarioSelect.children.length === 1) { // Apenas a opção "Selecione"
        horarioSelect.innerHTML = '<option value="">Nenhum horário disponível</option>'; //
      }

    } catch (error) {
      console.error('Erro ao obter horários disponíveis:', error); //
      horarioSelect.innerHTML = '<option value="">Erro ao carregar horários</option>'; //
    }
  }

  dataInput.addEventListener('change', atualizarHorariosDisponiveis); //
  quadraSelect.addEventListener('change', atualizarHorariosDisponiveis); //

  // Lógica de submissão do formulário
  reservaForm.addEventListener('submit', async function(event) { //
    event.preventDefault(); //

    const idQuadra = quadraSelect.value; //
    const esporte = esporteSelect.value; //
    const data = dataInput.value; //
    const horarioCompleto = horarioSelect.value; // Valor é "08:00 - 10:00"

    const horarioInicio = horarioCompleto.split(' ')[0]; // Pega apenas "08:00"
    const horarioFim = horarioCompleto.split(' ')[2]; // Pega apenas "10:00"

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')); //
    if (!usuarioLogado || !usuarioLogado.user || !usuarioLogado.user.id) { // Acessa o ID do usuário logado
      alert("Você precisa estar logado para fazer uma reserva."); //
      window.location.href = "login.html"; //
      return; //
    }

    if (!idQuadra || !esporte || !data || !horarioCompleto) { //
      alert('Por favor, preencha todos os campos!'); //
      return; //
    }

    const quadraReservada = todasQuadras.find(q => q.id == idQuadra); // Comparação com == porque id do select pode ser string

    try {
      const response = await fetch(apiReservas, { //
        method: 'POST', //
        headers: { 'Content-Type': 'application/json' }, //
        body: JSON.stringify({
          id_usuario: usuarioLogado.user.id, // ID do usuário logado
          id_quadra: idQuadra, //
          data_reserva: data, //
          horario: horarioCompleto // Salva o formato completo (ex: "08:00 - 10:00")
        })
      });

      if (!response.ok) { //
        const errorData = await response.json(); //
        throw new Error(errorData.error || 'Erro ao criar reserva'); //
      }

      const reserva = await response.json(); //
          alert(`✅ Reserva confirmada!
    🟢 Quadra: ${quadraReservada ? quadraReservada.nome : 'N/A'}
    🏅 Esporte: ${esporte}
    📅 Data: ${data}
    ⏰ Horário: ${horarioCompleto}`);

      atualizarHorariosDisponiveis(); // Atualiza a lista de horários após a reserva
    } catch (error) {
      alert('Erro ao criar reserva: ' + error.message); //
    }
  });

  // Carrega as quadras ao iniciar
  await carregarTodasQuadras(); //
});