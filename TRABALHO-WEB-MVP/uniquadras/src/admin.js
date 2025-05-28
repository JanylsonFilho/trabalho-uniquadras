// Painel do administrador - Integração com backend
import 'bootstrap/dist/css/bootstrap.min.css'; //
import 'bootstrap'; //
import 'bootstrap-icons/font/bootstrap-icons.css'; //

document.addEventListener("DOMContentLoaded", async function () { //
  const listaQuadrasContainer = document.getElementById("listaQuadras"); //
  const tabelaReservasAdm = document.getElementById("tabelaReservasAdm"); //
  const dataInputAdm = document.getElementById('dataSelecionada'); //
  const dataQuadroReservasSpan = document.getElementById('dataQuadroReservasTable'); //
  const btnAdicionarNovaQuadra = document.getElementById('btnAdicionarNovaQuadra'); //
  const modalQuadra = new bootstrap.Modal(document.getElementById('modalQuadra')); //
  const formQuadra = document.getElementById('formQuadra'); //
  const quadraIdInput = document.getElementById('quadraId'); //
  const nomeQuadraModalInput = document.getElementById('nomeQuadraModal'); //
  const tipoQuadraModalSelect = document.getElementById('tipoQuadraModal'); //
  const statusQuadraModalSelect = document.getElementById('statusQuadraModal'); //

  const apiQuadras = "http://localhost:3000/quadras"; //
  const apiReservas = "http://localhost:3000/reservas"; //
  /*
  // Redireciona se não for ADM
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")); //
  if (!usuarioLogado || usuarioLogado.user.id_tipo_usuario !== 2) { //
    alert("Acesso negado. Área restrita ao administrador."); //
    window.location.href = "login.html"; //
    return; //
  }
*/
  // --- Funções para Quadras (CRUD) ---

  async function renderizarListaQuadras() { //
    try {
      const response = await fetch(apiQuadras); //
      if (!response.ok) throw new Error('Erro ao buscar quadras.'); //
      const quadras = await response.json(); //

      listaQuadrasContainer.innerHTML = ''; // Limpa a lista existente

      if (quadras.length === 0) { //
        listaQuadrasContainer.innerHTML = '<p class="text-center text-white-50">Nenhuma quadra cadastrada.</p>'; //
        return; //
      }

      quadras.forEach(quadra => { //
        const quadraCard = document.createElement('div'); //
        quadraCard.classList.add('col-md-6', 'col-lg-4', 'mb-4'); // Colunas para responsividade
        quadraCard.innerHTML = `
          <div class="card card-custom h-100">
            <div class="card-body text-start d-flex flex-column justify-content-between">
              <div>
                <h5 class="card-title">${quadra.nome}</h5>
                <p class="card-text mb-1">Tipo: ${quadra.tipo}</p>
                <p class="card-text">Status: ${quadra.status}</p>
              </div>
              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-info btn-sm me-2 btn-editar-quadra" data-id="${quadra.id}">
                  <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm btn-remover-quadra" data-id="${quadra.id}">
                  <i class="bi bi-trash"></i> Remover
                </button>
              </div>
            </div>
          </div>
        `;
        listaQuadrasContainer.appendChild(quadraCard); //
      });

      // Adiciona eventos aos botões de editar e remover
      document.querySelectorAll('.btn-editar-quadra').forEach(button => { //
        button.addEventListener('click', (e) => preencherFormularioEdicao(e.target.dataset.id || e.target.closest('button').dataset.id)); // Pega o id do botão ou do pai se o clique for no ícone
      });

      document.querySelectorAll('.btn-remover-quadra').forEach(button => { //
        button.addEventListener('click', (e) => removerQuadra(e.target.dataset.id || e.target.closest('button').dataset.id)); // Pega o id do botão ou do pai se o clique for no ícone
      });

    } catch (error) {
      console.error("Erro ao renderizar lista de quadras:", error); //
      alert("Erro ao carregar lista de quadras."); //
    }
  }

  async function adicionarOuEditarQuadra(quadraData) { //
    try {
      let response; //
      if (quadraData.id) {
        // Edição
        response = await fetch(`${apiQuadras}/${quadraData.id}`, { //
          method: 'PUT', //
          headers: { 'Content-Type': 'application/json' }, //
          body: JSON.stringify(quadraData), //
        });
      } else {
        // Adição
        response = await fetch(apiQuadras, { //
          method: 'POST', //
          headers: { 'Content-Type': 'application/json' }, //
          body: JSON.stringify(quadraData), //
        });
      }

      if (!response.ok) { //
        const errorData = await response.json(); //
        throw new Error(errorData.error || 'Erro ao salvar quadra.'); //
      }

      alert('Quadra salva com sucesso!'); //
      modalQuadra.hide(); // Fecha o modal
      renderizarListaQuadras(); // Atualiza a lista de cards de quadra
      carregarHorariosAdm(dataInputAdm.value); // Atualiza o quadro de reservas
    } catch (error) {
      console.error("Erro ao salvar quadra:", error); //
      alert("Erro ao salvar quadra: " + error.message); //
    }
  }

  async function removerQuadra(id) { //
    if (!confirm('Tem certeza que deseja remover esta quadra? Todas as reservas associadas serão afetadas.')) return;

    try {
      const response = await fetch(`${apiQuadras}/${id}`, { //
        method: 'DELETE', //
      });

      if (!response.ok) { //
        const errorData = await response.json(); //
        throw new Error(errorData.error || 'Erro ao remover quadra.'); //
      }

      alert('Quadra removida com sucesso!'); //
      renderizarListaQuadras(); // Atualiza a lista de cards de quadra
      carregarHorariosAdm(dataInputAdm.value); // Atualiza o quadro de reservas
    } catch (error) {
      console.error("Erro ao remover quadra:", error); //
      alert("Erro ao remover quadra: " + error.message); //
    }
  }

  async function preencherFormularioEdicao(id) { //
    try {
      const response = await fetch(`${apiQuadras}/${id}`); //
      if (!response.ok) throw new Error('Quadra não encontrada.'); //
      const quadra = await response.json(); //

      quadraIdInput.value = quadra.id; //
      nomeQuadraModalInput.value = quadra.nome; //
      tipoQuadraModalSelect.value = quadra.tipo; //
      statusQuadraModalSelect.value = quadra.status; //

      modalQuadra.show(); // Abre o modal
    } catch (error) {
      console.error("Erro ao buscar dados da quadra para edição:", error); //
      alert("Erro ao carregar dados da quadra para edição: " + error.message); //
    }
  }

  // Event Listeners para o formulário do modal
  formQuadra.addEventListener('submit', async (e) => { //
    e.preventDefault(); //
    const quadraData = {
      id: quadraIdInput.value || undefined, // undefined se for nova quadra
      nome: nomeQuadraModalInput.value, //
      tipo: tipoQuadraModalSelect.value, //
      status: statusQuadraModalSelect.value, //
    };
    await adicionarOuEditarQuadra(quadraData); //
  });

  btnAdicionarNovaQuadra.addEventListener('click', () => { //
    // Limpa o formulário antes de abrir para adicionar nova quadra
    formQuadra.reset(); //
    quadraIdInput.value = ''; // Garante que o ID está vazio para nova quadra
    modalQuadra.show(); //
  });


  // --- Funções para Reservas (Quadro de Horários) ---

  // Busca reservas do backend para uma data e quadra (ajustado para aceitar id_quadra)
  async function buscarReservas(data, idQuadra = null) { //
    try {
      let url = `${apiReservas}?data_reserva=${data}`; //
      if (idQuadra) { //
        url += `&id_quadra=${idQuadra}`; //
      }
      const resp = await fetch(url); //
      if (!resp.ok) throw new Error('Erro ao buscar reservas.'); //
      return await resp.json(); //
    } catch (error) {
      console.error('Erro ao buscar reservas:', error); //
      return []; //
    }
  }

  // Busca quadras do backend (função reutilizada)
  async function buscarQuadrasParaQuadro() { //
    try {
      const resp = await fetch(apiQuadras); //
      if (!resp.ok) throw new Error('Erro ao buscar quadras.'); //
      return await resp.json(); //
    } catch (error) {
      console.error('Erro ao buscar quadras para o quadro de reservas:', error); //
      return []; //
    }
  }

  // Cria ou remove reserva no backend
  async function atualizarReserva(quadraId, data, horarioCompleto, acao) { // 'acao' pode ser 'reservar' ou 'cancelar'
    // 'horarioCompleto' já vem no formato "HH:MM - HH:MM"
    const reservaData = {
      id_usuario: usuarioLogado.user.id, // ID do administrador fazendo a alteração
      id_quadra: quadraId, //
      data_reserva: data, //
      horario_inicio: horarioCompleto // Salva o formato completo
    };

    try {
      let response; //
      if (acao === "reservar") { // Transformar em indisponível (criar reserva)
        response = await fetch(apiReservas, { //
          method: "POST", //
          headers: { "Content-Type": "application/json" }, //
          body: JSON.stringify(reservaData) //
        });
      } else { // Transformar em disponível (cancelar reserva)
        const reservasExistentes = await buscarReservas(data, quadraId); // Busca reservas específicas
        const reservaParaDeletar = reservasExistentes.find(r =>
          r.horario_inicio === horarioCompleto // Busca pela string completa do horário
        );

        if (reservaParaDeletar) { //
          response = await fetch(`${apiReservas}/${reservaParaDeletar.id}`, { //
            method: "DELETE" //
          });
        } else {
          alert("Reserva não encontrada para cancelar neste horário.");
          return;
        }
      }

      if (!response.ok) { //
        const errorData = await response.json(); //
        throw new Error(errorData.error || 'Erro ao atualizar reserva.'); //
      }
      console.log(`Reserva ${acao === "reservar" ? "criada" : "deletada"} com sucesso.`); //
    } catch (error) {
      console.error(`Erro ao ${acao} reserva:`, error); //
      alert(`Erro ao ${acao} reserva: ` + error.message); //
    }
  }


  async function carregarHorariosAdm(dataSelecionada) { //
    dataQuadroReservasSpan.textContent = formatarDataParaExibicao(dataSelecionada); //

    const quadras = await buscarQuadrasParaQuadro(); //
    const reservas = await buscarReservas(dataSelecionada); // Busca todas as reservas para a data

    // Defina os horários padrão do sistema (que agora incluem o intervalo)
    const horariosPadrao = [
      "08:00 - 10:00",
      "10:00 - 12:00",
      "12:00 - 14:00",
      "14:00 - 16:00",
      "16:00 - 18:00"
    ];

    // Atualiza o cabeçalho da tabela de horários
    const theadRow = tabelaReservasAdm.previousElementSibling.querySelector('thead tr');
    if (theadRow) {
      let headerHtml = '<th>Quadra</th>';
      horariosPadrao.forEach(horario => {
        headerHtml += `<th>${horario}</th>`;
      });
      theadRow.innerHTML = headerHtml;
    }


    tabelaReservasAdm.innerHTML = ""; //
    quadras.forEach((quadra) => { //
      let row = `<tr><th>${quadra.nome}</th>`; //
      horariosPadrao.forEach((horarioCompleto) => {
        // Verifica se existe uma reserva para esta quadra E este horário COMPLETO E esta data
        const existeReserva = reservas.some(
          (r) => r.id_quadra === quadra.id && r.horario === horarioCompleto && r.data_reserva.startsWith(dataSelecionada)
        );
        const status = existeReserva ? "Indisponível" : "Disponível";
        const btnClass = status === "Disponível" ? "btn-disponivel" : "btn-indisponivel";
        row += `<td>
          <button class="btn ${btnClass} w-100"
            data-quadra-id="${quadra.id}"
            data-horario="${horarioCompleto}"
            data-status="${status}">
            ${status}
          </button>
        </td>`;
      });
      row += `</tr>`;
      tabelaReservasAdm.innerHTML += row; //
    });

    // Adiciona eventos aos botões
    document.querySelectorAll("#tabelaReservasAdm button").forEach(btn => { //
      btn.addEventListener("click", async () => { //
        const quadraId = btn.getAttribute("data-quadra-id"); //
        const horarioCompleto = btn.getAttribute("data-horario"); //
        const statusAtual = btn.getAttribute("data-status"); //
        let acao; //

        if (statusAtual === "Disponível") { //
          acao = "reservar"; //
        } else {
          acao = "cancelar"; //
        }
        /*
        // Antes de tentar atualizar a reserva, verifique se o usuário logado é ADM
        if (usuarioLogado.user.id_tipo_usuario !== 2) { //
          alert("Permissão negada. Apenas administradores podem alterar a disponibilidade."); //
          return; //
        }
          */
        
        await atualizarReserva(quadraId, dataSelecionada, horarioCompleto, acao); //
        carregarHorariosAdm(dataSelecionada); // Recarrega para refletir a mudança
      });
    });
  }

  // Função auxiliar para formatar a data para exibição
  function formatarDataParaExibicao(dataString) { //
    const [ano, mes, dia] = dataString.split('-'); //
    return `${dia}/${mes}/${ano}`; //
  }

  // Evento para mudança de data
  if (dataInputAdm) { //
    dataInputAdm.addEventListener("change", () => { //
      const dataSelecionada = dataInputAdm.value; //
      if (dataSelecionada) { //
        carregarHorariosAdm(dataSelecionada); //
      }
    });

    // Carrega os horários para a data atual ao carregar a página
    const dataAtual = new Date().toISOString().split("T")[0]; //
    dataInputAdm.value = dataAtual; //
    carregarHorariosAdm(dataAtual); //
  }

  // Inicializa a lista de quadras ao carregar a página
  renderizarListaQuadras(); //
});