// src/admin.js

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {
  renderizarListaQuadras,
  inicializarFormularioQuadra
} from './quadras.js';

import {
  carregarHorariosAdm,
  formatarDataParaExibicao,
  adicionarOuEditarHorario,
  renderizarListaQuadrasParaSelect
} from './horarios.js';

document.addEventListener("DOMContentLoaded", async function () {
  const dataInputAdm = document.getElementById('dataSelecionada');
  const dataQuadroReservasSpan = document.getElementById('dataQuadroReservasTable');
  
  // Modal de Horário
  const btnAddHorario = document.getElementById('btnAddHorario');
  const modalHorario = new bootstrap.Modal(document.getElementById('modalHorario'));
  const formHorario = document.getElementById('formHorario');
  const horarioIdInput = document.getElementById('horarioId'); // Assume que existe no modal de horário
  const modalHorarioQuadraSelect = document.getElementById('modalHorarioQuadraSelect');
  const modalHorarioDataInput = document.getElementById('modalHorarioDataInput');
  const modalHorarioHoraInput = document.getElementById('modalHorarioHoraInput');
  const modalHorarioStatusSelect = document.getElementById('modalHorarioStatusSelect');

  // Inicializa o painel
  await renderizarListaQuadras();
  inicializarFormularioQuadra();

  const dataAtual = new Date().toISOString().split("T")[0];
  dataInputAdm.value = dataAtual;
  dataQuadroReservasSpan.textContent = formatarDataParaExibicao(dataAtual);
  await carregarHorariosAdm(dataAtual);

  // Evento para mudança de data
  if (dataInputAdm) {
    dataInputAdm.addEventListener("change", async () => {
      const dataSelecionada = dataInputAdm.value;
      if (dataSelecionada) {
        dataQuadroReservasSpan.textContent = formatarDataParaExibicao(dataSelecionada);
        await carregarHorariosAdm(dataSelecionada);
      }
    });
  }

  // Evento para abrir o modal de adicionar horário
  if (btnAddHorario) {
    btnAddHorario.addEventListener('click', async () => {
      formHorario.reset();
      horarioIdInput.value = '';
      modalHorarioDataInput.value = dataInputAdm.value;
      await renderizarListaQuadrasParaSelect(modalHorarioQuadraSelect);
      modalHorario.show();
    });
  }

  // Evento para submeter o formulário de horário
  if (formHorario) {
    formHorario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        // id não é usado na criação, apenas para edição (lógica de edição não implementada neste fluxo)
        id_quadra: modalHorarioQuadraSelect.value,
        data: modalHorarioDataInput.value,
        horario: modalHorarioHoraInput.value,
        status: modalHorarioStatusSelect.value,
      };
      await adicionarOuEditarHorario(data);
      modalHorario.hide();
      await carregarHorariosAdm(dataInputAdm.value); // Recarrega a tabela
    });
  }
});