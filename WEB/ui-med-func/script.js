const medico = JSON.parse(sessionStorage.getItem("medico"));
const token = sessionStorage.getItem("token");

async function verificarToken() {
  if (!token) {
    window.location.href = "../login-med/index.html";
    return;
  }
  try {
    // Faz uma requisição protegida para testar o token
    const response = await fetch("http://localhost:3000/medicos", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (response.status === 401 || response.status === 500) {
      // Token expirado ou inválido
      sessionStorage.removeItem("medico");
      sessionStorage.removeItem("token");
      window.location.href = "../home/index.html";
    }
  } catch (err) {
    // Se houver erro de conexão, não faz nada
  }
}

if (!medico || !token) {
  window.location.href = "../login-med/index.html";
} else {
  document.getElementById("id").value = medico.id;
  document.getElementById("nome").value = medico.nome;
  document.getElementById("crm").value = medico.crm;
  // Não exibir senha por segurança
  verificarToken(); // Verifica o token ao carregar
}
   
const form = document.getElementById("atestadoForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("http://localhost:3000/funcmed", {
          method: "POST",
          headers: { "Content-Type": "application/json",
            ...(token ? { "Authorization": "Bearer " + token } : {})
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert("Atestado criado com sucesso!");
          form.reset();
        } else {
          const error = await response.json();
          alert("Erro: " + (error.message || "Não foi possível criar o atestado."));
        }
      } catch (error) {
        console.error("Erro ao enviar:", error);
        alert("Erro ao conectar com o servidor.");
      }
    });