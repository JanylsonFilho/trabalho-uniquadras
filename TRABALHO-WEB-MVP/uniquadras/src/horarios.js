const apiQuadras = "http://localhost:3000/quadras";
const apiReservas = "http://localhost:3000/reservas";
const apiHorarios = "http://localhost:3000/horarios";

export function formatarDataParaExibicao(dataString) {
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Busca todas as quadras
export async function buscarQuadrasParaQuadro() {
  try {
    const res = await fetch(apiQuadras);
    if (!res.ok) throw new Error("Erro ao buscar quadras");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Busca todos os horários para uma quadra e data
export async function buscarHorariosPorQuadraEData(idQuadra, data) {
  try {
    const res = await fetch(`${apiHorarios}?id_quadra=${idQuadra}&data=${data}`);
    if (!res.ok) throw new Error("Erro ao buscar horários");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Busca todas as reservas para uma data (opcionalmente por quadra)
export async function buscarReservas(data, idQuadra = null) {
  try {
    let url = `${apiReservas}?data=${data}`;
    if (idQuadra) url += `&id_quadra=${idQuadra}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao buscar reservas");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Atualiza (reserva/cancela) uma reserva pelo id do horário
export async function atualizarReserva(horarioId, acao) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const reservaData = {
    id_usuario: usuarioLogado?.user?.id || 0,
    id_horario: horarioId
  };

  try {
    let response;
    if (acao === "reservar") {
      response = await fetch(apiReservas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservaData)
      });
    } else {
      // Buscar reserva pelo id_horario
      const reservas = await buscarReservasPorHorario(horarioId);
      const reserva = reservas[0];
      if (!reserva) throw new Error("Reserva não encontrada para cancelar.");
      response = await fetch(`${apiReservas}/${reserva.id}`, { method: "DELETE" });
    }

    if (!response.ok) throw await response.json();
  } catch (err) {
    alert("Erro ao atualizar reserva: " + (err.error || err.message));
  }
}

// Busca reservas por id_horario
export async function buscarReservasPorHorario(idHorario) {
  try {
    const res = await fetch(`${apiReservas}?id_horario=${idHorario}`);
    if (!res.ok) throw new Error("Erro ao buscar reservas por horário");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Carrega a tabela de horários para o admin
export async function carregarHorariosAdm(dataSelecionada) {
  const tabela = document.getElementById("tabelaReservasAdm");
  const horariosPadrao = [
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
    "22:00 - 23:00"
  ];

  const quadras = await buscarQuadrasParaQuadro();

  tabela.innerHTML = "";
  for (const quadra of quadras) {
    // Busca todos os horários dessa quadra para a data selecionada
    const horariosQuadra = await buscarHorariosPorQuadraEData(quadra.id, dataSelecionada);

    let row = `<tr><th>${quadra.nome}</th>`;
    for (const horarioPadrao of horariosPadrao) {
      // Busca o objeto do horário correspondente
      const horarioObj = horariosQuadra.find(h => h.horario === horarioPadrao);
      let status = "Indisponível";
      let btnClass = "btn-indisponivel";
      let horarioId = "";

      if (horarioObj) {
        horarioId = horarioObj.id;
        // Verifica se existe reserva para esse id_horario
        const reservado = horarioObj.status !== "Disponível";
        if (!reservado) {
          status = "Disponível";
          btnClass = "btn-disponivel";
        }
      }

      row += `<td><button class="btn ${btnClass} w-100" data-horario-id="${horarioId}" data-status="${status}">${status}</button></td>`;
    }
    row += `</tr>`;
    tabela.innerHTML += row;
  }

  document.querySelectorAll("#tabelaReservasAdm button").forEach(btn => {
    btn.addEventListener("click", async () => {
      const horarioId = btn.dataset.horarioId;
      const statusAtual = btn.dataset.status;
      if (!horarioId) return;
      const acao = statusAtual === "Disponível" ? "reservar" : "cancelar";
      await atualizarReserva(horarioId, acao);
      await carregarHorariosAdm(document.getElementById("dataSelecionada").value);
    });
  });
}