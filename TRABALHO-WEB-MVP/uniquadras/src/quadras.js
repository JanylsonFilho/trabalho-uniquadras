import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", function () {
  const apiBaseUrl = "http://localhost:3000/quadras";
  const horariosPadrao = [
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00"
  ];

  // Exibe os horários padrão no formulário, se existir o container
  const horariosContainer = document.getElementById("horariosPadrao");
  if (horariosContainer) {
    horariosPadrao.forEach(horario => {
      const span = document.createElement("span");
      span.textContent = horario + " ";
      horariosContainer.appendChild(span);
    });
  }

  // Função para listar quadras
  async function listarQuadras() {
    try {
      const response = await fetch(apiBaseUrl);
      const quadras = await response.json();

      const quadrasContainer = document.getElementById("quadrasContainer");
      if (quadrasContainer) {
        quadrasContainer.innerHTML = ""; // Limpa o container
        quadras.forEach((quadra) => {
          const quadraElement = document.createElement("div");
          quadraElement.className = "quadra-item";
          quadraElement.innerHTML = `
            <h3>${quadra.nome}</h3>
            <p>Localização: ${quadra.localizacao || "Não informado"}</p>
            <p>Tipo: ${quadra.tipo}</p>
            <p>Status: ${quadra.status || "Ativa"}</p>
            <button class="btn-delete" data-id="${quadra.id}">Deletar</button>
          `;
          quadrasContainer.appendChild(quadraElement);
        });

        // Adiciona eventos de deletar
        document.querySelectorAll(".btn-delete").forEach((button) => {
          button.addEventListener("click", async (e) => {
            const id = e.target.getAttribute("data-id");
            await deletarQuadra(id);
            listarQuadras(); // Atualiza a lista
          });
        });
      }
    } catch (error) {
      console.error("Erro ao listar quadras:", error);
    }
  }

  // Função para criar uma nova quadra
  async function criarQuadra(data) {
    try {
      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Quadra criada com sucesso!");
        // Se estiver na página de adicionar quadra, redireciona
        if (window.location.pathname.includes("adicionar-quadra.html")) {
          window.location.href = "painel-adm.html";
        } else {
          listarQuadras(); // Atualiza a lista se estiver na página de listagem
        }
      } else {
        alert("Erro ao criar quadra.");
      }
    } catch (error) {
      console.error("Erro ao criar quadra:", error);
      alert("Erro ao criar quadra.");
    }
  }

  // Função para deletar uma quadra
  async function deletarQuadra(id) {
    try {
      const response = await fetch(`${apiBaseUrl}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Quadra deletada com sucesso!");
      } else {
        alert("Erro ao deletar quadra.");
      }
    } catch (error) {
      console.error("Erro ao deletar quadra:", error);
    }
  }

  // Evento para formulário de criação (funciona em ambas as páginas)
  const formCriarQuadra = document.getElementById("formNovaQuadra") || document.getElementById("formCriarQuadra");
  if (formCriarQuadra) {
    formCriarQuadra.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("nomeQuadra")?.value || document.getElementById("nome")?.value;
      const tipo = document.getElementById("tipoQuadra")?.value || document.getElementById("tipo")?.value || "Aberta";
      const status = document.getElementById("statusQuadra")?.value || "Ativa";
      const localizacao = document.getElementById("localizacaoQuadra")?.value || document.getElementById("localizacao")?.value || "Não informado";

      if (!nome) {
        alert("Por favor, insira o nome da quadra!");
        return;
      }

      const novaQuadra = { nome, tipo, status, localizacao };
      await criarQuadra(novaQuadra);
    });
  }

  // Evento para formulário de remoção de quadra pelo nome
  const formRemoverQuadra = document.getElementById("formRemoverQuadra");
  if (formRemoverQuadra) {
    formRemoverQuadra.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nomeQuadra = document.getElementById("nomeQuadra").value.trim();
      if (!nomeQuadra) {
        alert("Por favor, insira o nome da quadra!");
        return;
      }

      try {
        // Busca todas as quadras para encontrar o ID pelo nome
        const response = await fetch(apiBaseUrl);
        if (!response.ok) {
          alert("Erro ao buscar quadras.");
          return;
        }
        const quadras = await response.json();
        const quadra = quadras.find(q => q.nome.toLowerCase() === nomeQuadra.toLowerCase());

        if (!quadra) {
          alert("Quadra não encontrada!");
          return;
        }

        // Usa a função já existente para deletar pelo ID
        await deletarQuadra(quadra.id);
        window.location.href = "painel-adm.html";
      } catch (error) {
        console.error("Erro ao remover quadra:", error);
        alert("Erro ao remover quadra.");
      }
    });
  }

  // Inicializa a listagem de quadras (se existir o container)
  if (document.getElementById("quadrasContainer")) {
    listarQuadras();
  }
});