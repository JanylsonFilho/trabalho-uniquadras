import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';



document.addEventListener("DOMContentLoaded", function () {

     // Página de horários (Usuário Reserva)
  const tabelaHorarios = document.querySelector("tbody");
  const theadHorarios = document.querySelector("thead tr");

  if (tabelaHorarios && theadHorarios) {
    const horariosPadrao = JSON.parse(localStorage.getItem("horariosPadrao")) || [
      "17-18", "18-19", "19-20", "20-21", "21-22"
    ];

    // Atualiza cabeçalho de horários
    let theadContent = `<th>Quadra</th>`;
    horariosPadrao.forEach(horario => {
      theadContent += `<th>${horario}</th>`;
    });
    theadHorarios.innerHTML = theadContent;

    // Atualiza corpo da tabela
    const horarios = JSON.parse(localStorage.getItem("horarios")) || [];
    tabelaHorarios.innerHTML = "";

    horarios.forEach((quadra, indexQuadra) => {
      let row = `<tr><th>${quadra.quadra}</th>`;

      quadra.horarios.forEach((status, indexHorario) => {
        const btnClass = status === "Disponível" ? "btn-disponivel" : "btn-indisponivel";
        row += `<td>
          <button class="btn ${btnClass} w-100" data-quadra="${indexQuadra}" data-horario="${indexHorario}">
            ${status}
          </button>
        </td>`;
      });

      row += `</tr>`;
      tabelaHorarios.innerHTML += row;
    });

    // Adiciona eventos aos botões
    document.querySelectorAll("button[data-quadra]").forEach(btn => {
      btn.addEventListener("click", () => {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        const quadraIdx = btn.getAttribute("data-quadra");
        const horarioIdx = btn.getAttribute("data-horario");
        const dataSelecionada = document.querySelector('input[type="date"]').value;
        const horariosPorData = JSON.parse(localStorage.getItem("horariosPorData")) || {};
        const horarios = horariosPorData[dataSelecionada];
    
        // Se não houver usuário logado, impede
        if (!usuarioLogado) {
          alert("Você precisa estar logado para fazer uma reserva.");
          return;
        }
    
        // Se for usuário comum
        if (usuarioLogado.tipo !== "adm") {
          if (horarios[quadraIdx].horarios[horarioIdx] !== "Disponível") {
            alert("Esse horário já está indisponível.");
            return;
          }
    
          // Reserva válida
          horarios[quadraIdx].horarios[horarioIdx] = "Indisponível";
          horariosPorData[dataSelecionada] = horarios;
          localStorage.setItem("horariosPorData", JSON.stringify(horariosPorData));
    
          alert("Reserva feita com sucesso!");
          btn.textContent = "Indisponível";
          btn.classList.remove("btn-disponivel");
          btn.classList.add("btn-indisponivel");
          btn.setAttribute("disabled", "true");
    
        } else {
          // ADMIN pode alternar livremente
          const atual = horarios[quadraIdx].horarios[horarioIdx];
          const novo = atual === "Disponível" ? "Indisponível" : "Disponível";
          horarios[quadraIdx].horarios[horarioIdx] = novo;
          horariosPorData[dataSelecionada] = horarios;
          localStorage.setItem("horariosPorData", JSON.stringify(horariosPorData));
    
          btn.textContent = novo;
          btn.classList.toggle("btn-disponivel", novo === "Disponível");
          btn.classList.toggle("btn-indisponivel", novo === "Indisponível");
    
          if (novo === "Disponível") {
            btn.removeAttribute("disabled");
          } else {
            btn.setAttribute("disabled", "true");
          }
        }
      });
    });
    
  }    







  // Controle pela data 

document.addEventListener("DOMContentLoaded", function () {
    const tabelaHorarios = document.querySelector("tbody");
    const dataInput = document.querySelector('input[type="date"]');
  
    // Função para carregar horários para a data selecionada
    function carregarHorarios(dataSelecionada) {
      const horariosPorData = JSON.parse(localStorage.getItem("horariosPorData")) || {};
      const horarios = horariosPorData[dataSelecionada] || [
        { quadra: "QUADRA 1", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Disponível"] },
        { quadra: "QUADRA 2", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Disponível"] },
        { quadra: "QUADRA 3", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Disponível"] }
      ];
  
      // Atualiza corpo da tabela
      tabelaHorarios.innerHTML = "";
      horarios.forEach((quadra, indexQuadra) => {
        let row = `<tr><th>${quadra.quadra}</th>`;
        quadra.horarios.forEach((status, indexHorario) => {
          const btnClass = status === "Disponível" ? "btn-disponivel" : "btn-indisponivel";
          
          row += `<td>
            <button class="btn ${btnClass} w-100" data-quadra="${indexQuadra}" data-horario="${indexHorario}">
              ${status}
            </button>
          </td>`;
        });
        row += `</tr>`;
        tabelaHorarios.innerHTML += row;
      });
  
      // Adiciona eventos aos botões
      document.querySelectorAll("button[data-quadra]").forEach(btn => {
        btn.addEventListener("click", () => {
          const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
          const quadraIdx = btn.getAttribute("data-quadra");
          const horarioIdx = btn.getAttribute("data-horario");
          const dataSelecionada = document.querySelector('input[type="date"]').value;
          const horariosPorData = JSON.parse(localStorage.getItem("horariosPorData")) || {};
          const horarios = horariosPorData[dataSelecionada];
      
          // Se não houver usuário logado, impede
          if (!usuarioLogado) {
            alert("Você precisa estar logado para fazer uma reserva.");
            return;
          }
      
          // Se for usuário comum
          if (usuarioLogado.tipo !== "adm") {
            if (horarios[quadraIdx].horarios[horarioIdx] !== "Disponível") {
              alert("Esse horário já está indisponível.");
              return;
            }
      
            // Reserva válida
            horarios[quadraIdx].horarios[horarioIdx] = "Indisponível";
            horariosPorData[dataSelecionada] = horarios;
            localStorage.setItem("horariosPorData", JSON.stringify(horariosPorData));
      
            alert("Reserva feita com sucesso!");
            btn.textContent = "Indisponível";
            btn.classList.remove("btn-disponivel");
            btn.classList.add("btn-indisponivel");
            btn.setAttribute("disabled", "true");
      
          } else {
            // ADMIN pode alternar livremente
            const atual = horarios[quadraIdx].horarios[horarioIdx];
            const novo = atual === "Disponível" ? "Indisponível" : "Disponível";
            horarios[quadraIdx].horarios[horarioIdx] = novo;
            horariosPorData[dataSelecionada] = horarios;
            localStorage.setItem("horariosPorData", JSON.stringify(horariosPorData));
      
            btn.textContent = novo;
            btn.classList.toggle("btn-disponivel", novo === "Disponível");
            btn.classList.toggle("btn-indisponivel", novo === "Indisponível");
      
            if (novo === "Disponível") {
              btn.removeAttribute("disabled");
            } else {
              btn.setAttribute("disabled", "true");
            }
          }
        });
      });
      
    }
  
    // Função para salvar horários para a data selecionada
  
    // Evento para mudança de data
    if (dataInput) {
      dataInput.addEventListener("change", () => {
        const dataSelecionada = dataInput.value;
        if (dataSelecionada) {
          carregarHorarios(dataSelecionada);
        }
      });
  
      // Carrega os horários para a data atual ao carregar a página
      const dataAtual = new Date().toISOString().split("T")[0];
      dataInput.value = dataAtual;
      carregarHorarios(dataAtual);
    }
  });


});