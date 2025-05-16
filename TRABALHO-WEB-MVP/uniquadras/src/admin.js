// Painel do administrador - Integração com backend
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", async function () {
  const tabelaHorariosAdm = document.querySelector("tbody");
  const dataInputAdm = document.querySelector('input[type="date"]');
  const apiQuadras = "http://localhost:3000/quadras";
  const apiReservas = "http://localhost:3000/reservas";

  // Busca quadras do backend
  async function buscarQuadras() {
    const resp = await fetch(apiQuadras);
    return resp.ok ? await resp.json() : [];
  }

  // Busca reservas do backend para uma data
  async function buscarReservas(data) {
    const resp = await fetch(`${apiReservas}?data=${data}`);
    return resp.ok ? await resp.json() : [];
  }

  // Cria ou remove reserva no backend
  async function atualizarReserva(quadra, data, horario, status) {
    if (status === "Indisponível") {
      // Cria reserva
      await fetch(apiReservas, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quadra, data, horario })
      });
    } else {
      // Remove reserva (busca id da reserva antes)
      const reservas = await buscarReservas(data);
      const reserva = reservas.find(r => r.quadra === quadra && r.horario === horario);
      if (reserva) {
        await fetch(`${apiReservas}/${reserva.id}`, { method: "DELETE" });
      }
    }
  }

  // Carrega horários e status das quadras para a data selecionada
  async function carregarHorariosAdm(dataSelecionada) {
    const quadras = await buscarQuadras();
    const reservas = await buscarReservas(dataSelecionada);

    // Defina os horários padrão do sistema
    const horariosPadrao = ["08:00", "10:00", "12:00", "14:00", "16:00"];

    tabelaHorariosAdm.innerHTML = "";
    quadras.forEach((quadra) => {
      let row = `<tr><th>${quadra.nome}</th>`;
      horariosPadrao.forEach((horario) => {
        const existeReserva = reservas.some(
          (r) => r.quadra === quadra.nome && r.horario === horario
        );
        const status = existeReserva ? "Indisponível" : "Disponível";
        const btnClass = status === "Disponível" ? "btn-disponivel" : "btn-indisponivel";
        row += `<td>
          <button class="btn ${btnClass} w-100" 
            data-quadra="${quadra.nome}" 
            data-horario="${horario}" 
            ${status === "Indisponível" ? "disabled" : ""}>
            ${status}
          </button>
        </td>`;
      });
      row += `</tr>`;
      tabelaHorariosAdm.innerHTML += row;
    });

    // Adiciona eventos aos botões
    document.querySelectorAll("button[data-quadra]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuarioLogado) {
          alert("Você precisa estar logado.");
          return;
        }
        const quadra = btn.getAttribute("data-quadra");
        const horario = btn.getAttribute("data-horario");
        const statusAtual = btn.textContent.trim();
        let novoStatus;

        if (usuarioLogado.tipo !== "adm") {
          if (statusAtual !== "Disponível") {
            alert("Esse horário já está indisponível.");
            return;
          }
          novoStatus = "Indisponível";
        } else {
          novoStatus = statusAtual === "Disponível" ? "Indisponível" : "Disponível";
        }

        await atualizarReserva(quadra, dataSelecionada, horario, novoStatus);

        // Atualiza a tabela após alteração
        carregarHorariosAdm(dataSelecionada);
      });
    });
  }

  // Evento para mudança de data
  if (dataInputAdm) {
    dataInputAdm.addEventListener("change", () => {
      const dataSelecionada = dataInputAdm.value;
      if (dataSelecionada) {
        carregarHorariosAdm(dataSelecionada);
      }
    });

    // Carrega os horários para a data atual ao carregar a página
    const dataAtual = new Date().toISOString().split("T")[0];
    dataInputAdm.value = dataAtual;
    carregarHorariosAdm(dataAtual);
  }
});