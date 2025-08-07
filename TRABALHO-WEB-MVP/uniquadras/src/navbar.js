// src/navbar.js

document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogadoItem = localStorage.getItem('usuarioLogado');
  const navbar = document.querySelector('.navbar-nav');
  const botaoLogin = document.getElementById('user-navbar');

  if (usuarioLogadoItem) {
    const usuarioLogado = JSON.parse(usuarioLogadoItem);
    // Acessa o objeto 'user' aninhado
    const user = usuarioLogado.user;

    if (user) {
        const nome = user.nome || 'Usuário';
        const tipo = user.id_tipo_usuario; // '1' para usuário, '2' para ADM
    
        const nomeUsuario = document.createElement('li');
        nomeUsuario.classList.add('nav-item');
        nomeUsuario.innerHTML = `<a class="nav-link fw-bold text-white" href="#" id="linkPerfil">${nome}</a>`;
    
        const logoutItem = document.createElement('li');
        logoutItem.classList.add('nav-item');
        logoutItem.innerHTML = `<a class="nav-link" href="#" id="logout">Sair <i class="bi bi-box-arrow-right"></i></a>`;
    
        navbar.appendChild(nomeUsuario);
        navbar.appendChild(logoutItem);
    
        document.getElementById('linkPerfil').addEventListener('click', (e) => {
          e.preventDefault();
          if (tipo === "2") {
            window.location.href = '/painel-adm.html'; // Caminho para admins
          } else {
            window.location.href = '/minhas-reservas.html';  // Caminho para usuários comuns
          }
        });
    
        if (botaoLogin) botaoLogin.style.display = 'none';
    
        document.getElementById('logout').addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('usuarioLogado');
          window.location.href = '/login.html';
        });
    }
  }
});