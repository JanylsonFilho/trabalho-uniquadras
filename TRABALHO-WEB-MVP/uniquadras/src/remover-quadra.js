 document.addEventListener("DOMContentLoaded", function () {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuarioLogado || usuarioLogado.tipo !== "adm") {
          alert("Acesso negado. Área restrita ao administrador.");
          window.location.href = "login.html";
        }

        const form = document.getElementById("formRemoverQuadra");

        form.addEventListener("submit", function (e) {
          e.preventDefault();

          const nomeQuadra = document.getElementById("nomeQuadra").value.trim();
          if (!nomeQuadra) {
            alert("Por favor, insira o nome da quadra!");
            return;
          }

          const dataSelecionada = localStorage.getItem("dataSelecionada");
          if (!dataSelecionada) {
            alert("Nenhuma data foi selecionada. Retorne ao painel do administrador.");
            return;
          }

          const horariosPorData = JSON.parse(localStorage.getItem("horariosPorData")) || {};
          const horariosDaData = horariosPorData[dataSelecionada] || [];

          const indexQuadra = horariosDaData.findIndex(q => q.quadra.toLowerCase() === nomeQuadra.toLowerCase());
          if (indexQuadra === -1) {
            alert("Essa quadra não está cadastrada para essa data!");
            return;
          }

          // Remove a quadra do array
          horariosDaData.splice(indexQuadra, 1);

          // Atualiza o localStorage
          horariosPorData[dataSelecionada] = horariosDaData;
          localStorage.setItem("horariosPorData", JSON.stringify(horariosPorData));

          alert("Quadra removida com sucesso para a data " + dataSelecionada + "!");
          window.location.href = "painel-adm.html";
        });

        // Verifica se a data está disponível no carregamento da página
        const dataSelecionada = localStorage.getItem("dataSelecionada");
        if (dataSelecionada) {
          console.log("Data selecionada:", dataSelecionada);
        } else {
          alert("Nenhuma data foi selecionada. Retorne ao painel do administrador para selecionar uma data.");
        }
      });