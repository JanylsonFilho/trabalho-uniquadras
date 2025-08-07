// src/horarios.js

const apiQuadras = "http://localhost:3000/quadras";
const apiHorarios = "http://localhost:3000/horarios";

// Formata data para exibição (ex: 06/08/2025)
export function formatarDataParaExibicao(dataString) {
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Busca todas as quadras para popular selects
async function buscarTodasQuadras() {
  try {
    const res = await fetch(apiQuadras);
    if (!res.ok) throw new Error("Erro ao buscar quadras");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Renderiza a lista de quadras em um elemento <select>
export async function renderizarListaQuadrasParaSelect(selectElement) {
  try {
    const quadras = await buscarTodasQuadras();
    selectElement.innerHTML = '<option value="">Selecione a Quadra</option>';
    quadras.forEach(quadra => {
      const option = document.createElement('option');
      option.value = quadra._id;
      option.textContent = quadra.nome;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar quadras para o select:', error);
  }
}

// Carrega a tabela de horários para o painel de administração
export async function carregarHorariosAdm(dataSelecionada) {
  const tabelaCompleta = document.getElementById("reservasTable");
  const thead = tabelaCompleta.querySelector('thead tr');
  const tbody = tabelaCompleta.querySelector('tbody');

  tbody.innerHTML = '<tr><td colspan="10" class="text-center">Carregando...</td></tr>';

  try {
    const quadras = await buscarTodasQuadras();
    if (quadras.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">Nenhuma quadra cadastrada.</td></tr>';
        return;
    }

    const horariosUnicos = ["18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00"];

    let headerHtml = '<th>Quadra</th>';
    horariosUnicos.forEach(horario => {
      headerHtml += `<th>${horario}</th>`;
    });
    thead.innerHTML = headerHtml;

    tbody.innerHTML = "";

    for (const quadra of quadras) {
      const res = await fetch(`${apiHorarios}?id_quadra=${quadra._id}&data=${dataSelecionada}`);
      const horariosDaQuadra = await res.json();
      
      let row = `<tr><th>${quadra.nome}</th>`;
      horariosUnicos.forEach(horarioPadrao => {
        const horarioObj = horariosDaQuadra.find(h => h.horario === horarioPadrao);
        const status = horarioObj ? horarioObj.status : "Não Existe";
        const btnClass = horarioObj?.status === "Disponível" ? "btn-disponivel" : "btn-indisponivel";
        const horarioId = horarioObj ? horarioObj._id : "";

        row += `<td>
          <button class="btn ${btnClass} w-100" data-horario-id="${horarioId}" data-status="${status}">
            ${status}
          </button>
        </td>`;
      });
      row += `</tr>`;
      tbody.innerHTML += row;
    }

    // Adiciona eventos aos botões de status para alternância rápida
    document.querySelectorAll("button[data-horario-id]").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const horarioId = e.currentTarget.dataset.horarioId;
        const statusAtual = e.currentTarget.dataset.status;

        if (!horarioId) {
          alert("Este horário não existe. Use 'Adicionar Novo Horário' para criá-lo.");
          return;
        }

        const novoStatus = statusAtual === "Disponível" ? "Indisponível" : "Disponível";
        try {
          const response = await fetch(`${apiHorarios}/${horarioId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
          });
          if (!response.ok) throw new Error("Falha ao atualizar status.");
          
          await carregarHorariosAdm(document.getElementById("dataSelecionada").value);
        } catch (error) {
          alert("Erro ao alterar status: " + error.message);
        }
      });
    });

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center text-danger">${error.message}</td></tr>`;
  }
}

// Adiciona ou edita um horário
export async function adicionarOuEditarHorario(horarioData) {
  try {
    const metodo = horarioData.id ? "PUT" : "POST";
    const url = horarioData.id ? `${apiHorarios}/${horarioData.id}` : apiHorarios;

    const response = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(horarioData),
    });

    if (!response.ok) throw new Error((await response.json()).error);
    alert("Horário salvo com sucesso!");
  } catch (error) {
    alert("Erro ao salvar horário: " + error.message);
  }
}