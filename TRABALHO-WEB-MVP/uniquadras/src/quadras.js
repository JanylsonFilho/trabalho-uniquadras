// quadras.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';


document.addEventListener("DOMContentLoaded", function () {

    
  // Inicializa horários padrão
  if (!localStorage.getItem("horarios")) {
    const horariosDefault = [
      { quadra: "QUADRA 1", horarios: ["Disponível", "Indisponível", "Indisponível", "Indisponível", "Indisponível"] },
      { quadra: "QUADRA 2", horarios: ["Disponível", "Disponível", "Disponível", "Indisponível", "Indisponível"] },
      { quadra: "QUADRA 3", horarios: ["Disponível", "Disponível", "Disponível", "Disponível", "Indisponível"] }
    ];
    localStorage.setItem("horarios", JSON.stringify(horariosDefault));
  }


   // Seleção de tipo de quadra
   const btnConfirmar = document.querySelector(".btn-confirmar");
   const radios = document.getElementsByName("tipo_quadra");
 
   if (btnConfirmar) {
     btnConfirmar.addEventListener("click", function () {
       let tipoSelecionado = "";
       radios.forEach((radio) => {
         if (radio.checked) {
           tipoSelecionado = radio.value;
         }
       });
 
       if (tipoSelecionado === "aberta") {
         window.location.href = "/esportes-abertos.html";
       } else if (tipoSelecionado === "coberta") {
         window.location.href = "/esportes-fechados.html";
       } else {
         alert("Selecione o tipo de quadra para continuar.");
       }
     });
   }
 
   // Escolha de esporte
   const botoesEsporte = document.querySelectorAll(".btn.btn-primary");
   if (botoesEsporte.length > 0) {
     botoesEsporte.forEach((botao) => {
       botao.addEventListener("click", () => {
         const esporteSelecionado = botao.textContent.trim();
         localStorage.setItem("esporteSelecionado", esporteSelecionado);
         console.log("Esporte selecionado:", esporteSelecionado);
         window.location.href = "horarios-disponiveis.html";
       });
     });
   }
 
   // Info do esporte na tela
  const esporteSpan = document.getElementById("esporteSelecionado");
  if (esporteSpan) {
    const esporte = localStorage.getItem("esporteSelecionado");
    esporteSpan.textContent = esporte || "Não selecionado";
  }

  const loginBtn = document.getElementById("btn-login");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "/login.html";
    });
  }

});