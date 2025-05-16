// src/navbar.js
document.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const navbar = document.querySelector('.navbar-nav');

  if (usuarioLogado) {
    const nomeUsuario = document.createElement('li');
    nomeUsuario.classList.add('nav-item');
    nomeUsuario.innerHTML = `<a class="nav-link" href="#">${usuarioLogado.nome}</a>`;

    const logoutItem = document.createElement('li');
    logoutItem.classList.add('nav-item');
    logoutItem.innerHTML = `<a class="nav-link" href="#" id="logout">Sair</a>`;

    navbar.appendChild(nomeUsuario);
    navbar.appendChild(logoutItem);

    document.getElementById('logout').addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = '/login.html';
    });
  }
});
