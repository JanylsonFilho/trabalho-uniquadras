// admin.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {
  renderizarListaQuadras,
  adicionarOuEditarQuadra,
  removerQuadra,
  preencherFormularioEdicao,
  inicializarFormularioQuadra
} from './quadras.js';

import {
  carregarHorariosAdm,
  formatarDataParaExibicao,
  atualizarReserva,
  buscarReservas,
  buscarQuadrasParaQuadro
} from './horarios.js';

document.addEventListener("DOMContentLoaded", async function () {
  const dataInputAdm = document.getElementById('dataSelecionada');
  const dataQuadroReservasSpan = document.getElementById('dataQuadroReservasTable');

  // Inicializa lista de quadras e formulário
  await renderizarListaQuadras();
  inicializarFormularioQuadra();

  // Carrega os horários da data atual
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
});
