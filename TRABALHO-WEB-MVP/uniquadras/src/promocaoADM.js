const apiUsuarios = "http://localhost:3000/usuarios";
let todosUsuarios = [];

async function carregarUsuarios() {
  const res = await fetch(apiUsuarios);
  todosUsuarios = await res.json();
}
