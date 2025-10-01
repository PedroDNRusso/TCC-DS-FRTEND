const usuario = JSON.parse(sessionStorage.getItem("usuario"));
const token = sessionStorage.getItem("token");
const API_URL = "https://tcc-ds-bkend.vercel.app";

async function verificarToken() {
  if (!token) {
    window.location.href = "../login/index.html";
    return;
  }
  try {
    const response = await fetch(`${API_URL}/pacientes`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (response.status === 401 || response.status === 500) {
      sessionStorage.removeItem("usuario");
      sessionStorage.removeItem("token");
      window.location.href = "../login/index.html";
    }
  } catch (err) {
    console.error("Erro ao verificar token:", err);
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
  window.location.href = "/index.html";
}