const usuario = JSON.parse(sessionStorage.getItem("usuario"));
const token = sessionStorage.getItem("token");

async function verificarToken() {
  if (!token) {
    window.location.href = "../login/index.html";
    return;
  }
  try {
    // Faz uma requisição protegida para testar o token
    const response = await fetch("http://localhost:3000/pacientes", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (response.status === 401 || response.status === 500) {
      // Token expirado ou inválido
      sessionStorage.removeItem("usuario");
      sessionStorage.removeItem("token");
      window.location.href = "../home/index.html";
    }
  } catch (err) {
    // Se houver erro de conexão, não faz nada
  }
}

if (!usuario || !token) {
  window.location.href = "../login/index.html";
} else {
  document.getElementById("nome").textContent = usuario.nome;
  document.getElementById("id").textContent = usuario.id;
  document.getElementById("email").textContent = usuario.email;
  // Não exibir senha por segurança
  verificarToken(); // Verifica o token ao carregar
}

function logout() {
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("token");
  window.location.href = "../home/index.html";
}