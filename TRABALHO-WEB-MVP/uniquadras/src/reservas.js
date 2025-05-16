// Integração completa com backend para reservas

const tipoQuadraSelect = document.getElementById('tipoQuadra');
const esporteSelect = document.getElementById('esporte');
const quadraSelect = document.getElementById('quadra');
const dataInput = document.getElementById('data');
const horarioSelect = document.getElementById('horario');

// Carrega tipos de quadra do backend (opcional, se quiser deixar dinâmico)
// Aqui mantemos estático, mas pode ser feito via fetch também
const quadrasPorTipo = {
  Aberta: ["Quadra Areia 1", "Quadra Areia 2", "Quadra Externa"],
  Fechada: ["Ginásio A", "Ginásio B", "Quadra Interna"]
};

const esportesPorQuadra = {
  Aberta: ["Futevôlei", "Beach Tênis", "Vôlei de Praia"],
  Fechada: ["Futsal", "Basquete", "Vôlei", "Handball"]
};

// Atualiza quadras e esportes conforme tipo selecionado
tipoQuadraSelect.addEventListener('change', () => {
  const tipoSelecionado = tipoQuadraSelect.value;

  // Atualiza quadras
  quadraSelect.innerHTML = '<option value="">Selecione</option>';
  if (quadrasPorTipo[tipoSelecionado]) {
    quadrasPorTipo[tipoSelecionado].forEach(quadra => {
      const option = document.createElement('option');
      option.value = quadra;
      option.textContent = quadra;
      quadraSelect.appendChild(option);
    });
  } else {
    quadraSelect.innerHTML = '<option value="">Nenhuma quadra disponível</option>';
  }

  // Atualiza esportes
  esporteSelect.innerHTML = '<option value="">Selecione</option>';
  if (esportesPorQuadra[tipoSelecionado]) {
    esportesPorQuadra[tipoSelecionado].forEach(esporte => {
      const option = document.createElement('option');
      option.value = esporte;
      option.textContent = esporte;
      esporteSelect.appendChild(option);
    });
  }
});

// Atualiza horários disponíveis consultando o backend
function atualizarHorariosDisponiveis() {
  const dataSelecionada = dataInput.value;
  const quadraSelecionada = quadraSelect.value;

  if (!dataSelecionada || !quadraSelecionada) {
    horarioSelect.innerHTML = '<option value="">Selecione a data e a quadra primeiro</option>';
    return;
  }

  // Busca horários disponíveis do backend (ajuste a rota conforme seu backend)
  fetch(`/reservas?data=${dataSelecionada}&quadra=${encodeURIComponent(quadraSelecionada)}`)
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar horários');
      return response.json();
    })
    .then(horarios => {
      horarioSelect.innerHTML = '<option value="">Selecione</option>';
      // Espera-se que o backend retorne um array de horários disponíveis
      horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        horarioSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Erro ao obter horários disponíveis:', error);
      horarioSelect.innerHTML = '<option value="">Erro ao carregar horários</option>';
    });
}

dataInput.addEventListener('change', atualizarHorariosDisponiveis);
quadraSelect.addEventListener('change', atualizarHorariosDisponiveis);




document.getElementById('reservaForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const tipoQuadra = tipoQuadraSelect.value;
  const quadra = quadraSelect.value;
  const esporte = esporteSelect.value;
  const data = dataInput.value;
  const horario = horarioSelect.value;

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!usuarioLogado || !usuarioLogado.id) {
    alert("Você precisa estar logado para fazer uma reserva.");
    window.location.href = "login.html";
    return;
  }

  if (!tipoQuadra || !quadra || !esporte || !data || !horario) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  fetch('http://localhost:3000/reservas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_usuario: usuarioLogado.id,
      tipoQuadra,
      quadra,
      esporte,
      data_reserva: data,
      horario: horario // único campo
    })
  })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao criar reserva');
      return response.json();
    })
    .then(reserva => {
      alert(`✅ Reserva confirmada!
🟢 Tipo de Quadra: ${tipoQuadra}
🏟️ Quadra: ${quadra}
🏅 Esporte: ${esporte}
📅 Data: ${data}
⏰ Horário: ${horario}`);
    })
    .catch(error => {
      alert('Erro ao criar reserva: ' + error.message);
    });
});
