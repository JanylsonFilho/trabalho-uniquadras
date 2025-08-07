// src/minhasReservas.js

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", async function () {
  const apiReservas = "http://localhost:3000/reservas";
  const listaReservas = document.getElementById("listaReservas");

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  // O ID do usuário agora é `_id` no MongoDB
  const usuarioId = usuarioLogado?.user?._id;

  if (!usuarioId) {
    alert("Você precisa estar logado para ver suas reservas.");
    window.location.href = "login.html";
    return;
  }

  async function listarReservas() {
    try {
      // A rota para buscar reservas por usuário agora é um endpoint específico
      const response = await fetch(`${apiReservas}/usuario/${usuarioId}`);
      if (!response.ok) throw new Error("Erro ao buscar suas reservas");

      const reservas = await response.json();

      if (reservas.length === 0) {
        listaReservas.innerHTML = `<p class="text-white-50">Você ainda não fez nenhuma reserva.</p>`;
        return;
      }

      listaReservas.innerHTML = "";

      // Ordena as reservas da mais recente para a mais antiga
      reservas.sort((a, b) => new Date(b.data_reserva) - new Date(a.data_reserva));

      reservas.forEach(reserva => {
        const card = document.createElement("div");
        card.className = "col-md-6 mb-4";
        
        // Formata a data que vem no formato 'YYYY-MM-DD'
        const dataObj = new Date(reserva.data_reserva + 'T00:00:00');
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');
        
        card.innerHTML = /*html*/`
          <div class="card border-primary h-100">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <span>Reserva ID: ${reserva._id.slice(-6)}</span>
              <button class="btn btn-sm btn-danger btn-cancelar" data-id="${reserva._id}">
                <i class="bi bi-x-circle"></i> Cancelar
              </button>
            </div>
            <div class="card-body text-dark">
              <h5 class="card-title text-dark">${reserva.nome_quadra}</h5>
              <p class="card-text mb-1"><strong>📅 Data:</strong> ${dataFormatada}</p>
              <p class="card-text"><strong>⏰ Horário:</strong> ${reserva.horario_reserva}</p>
            </div>
            <div class="card-footer text-muted">
              Feita em: ${new Date(reserva.criado_em).toLocaleString('pt-BR')}
            </div>
          </div>
        `;

        listaReservas.appendChild(card);
      });

      // Adiciona eventos aos botões de cancelar
      document.querySelectorAll('.btn-cancelar').forEach(button => {
        button.addEventListener('click', async (e) => {
          const reservaId = e.currentTarget.dataset.id;
          if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

          try {
            const resp = await fetch(`${apiReservas}/${reservaId}`, { method: 'DELETE' });
            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.error || "Erro ao cancelar reserva");
            }
            alert("Reserva cancelada com sucesso!");
            listarReservas(); // Atualiza a lista
          } catch (error) {
            alert("Erro ao cancelar: " + error.message);
          }
        });
      });

    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      listaReservas.innerHTML = `<p class="text-danger">Erro ao carregar suas reservas.</p>`;
    }
  }

  await listarReservas();
});