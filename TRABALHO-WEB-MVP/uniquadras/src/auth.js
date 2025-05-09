
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

document.addEventListener("DOMContentLoaded", function () {

        // Inicializa usuários padrão
    if (!localStorage.getItem("usuarios")) {
        const usuariosDefault = [
        {
            nome: "Administrador",
            email: "adm@unifor.br",
            telefone: "(85) 99999-9999",
            senha: "adm123",
            tipo: "adm"
        },
        {
            nome: "João Silva",
            email: "joao@unifor.br",
            telefone: "(85) 98888-7777",
            senha: "joao123",
            tipo: "usuario"
        }
        ];
        localStorage.setItem("usuarios", JSON.stringify(usuariosDefault));
    }



 // Cadastro de novos usuários
  const formCadastro = document.getElementById("formCadastro");
  if (formCadastro) {
    formCadastro.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const senha = document.getElementById("senha").value.trim();

      if (!nome || !email || !telefone || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      const novoUsuario = {
        nome,
        email,
        telefone,
        senha,
        tipo: "usuario"
      };

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      console.log("Usuários cadastrados agora:");
      console.table(usuarios);

      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";
    });
  }


 // Login de usuários
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value.trim();
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );

      if (usuarioEncontrado) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

        if (usuarioEncontrado.tipo === "adm") {
          alert(`Bem-vindo, ADM ${usuarioEncontrado.nome}!`);
          window.location.href = "painel-adm.html";
        } else {
          alert(`Bem-vindo ao sistema de reservas, ${usuarioEncontrado.nome}!`);
          window.location.href = "horarios-disponiveis.html";
        }
      } else {
        alert("Email ou senha inválidos. Tente novamente!");
      }
    });
  }


});