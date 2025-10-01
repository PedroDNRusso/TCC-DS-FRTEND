const uri = "https://tcc-ds-bkend.vercel.app";
const token = sessionStorage.getItem('token');

document.addEventListener("DOMContentLoaded", () => {
    const medico = JSON.parse(sessionStorage.getItem("medico"));
    const token = sessionStorage.getItem("token");

    if (!medico || !token) {
        window.location.href = "../login-med/index.html";
        return;
    }
    document.getElementById("id").textContent = medico.id;
    document.getElementById("nome").textContent = medico.nome;
    document.getElementById("crm").textContent = medico.crm;

    verificarToken();
});

async function verificarToken() {
    const token = sessionStorage.getItem("token"); // garante pegar o token atualizado
    if (!token) {
        window.location.href = "../login-med/index.html";
        return;
    }
    try {
        const response = await fetch(`${uri}/medicos`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        if (response.status === 401) {
            sessionStorage.clear();
            window.location.href = "../login-med/index.html";
        } else if (!response.ok) {
            console.error("Erro desconhecido ao verificar token:", response.status);
        }
    } catch (err) {
        console.error("Erro ao verificar token:", err);
    }
}
   
const form = document.getElementById("atestadoForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const token = sessionStorage.getItem("token");

      try {
        const response = await fetch(`${uri}/funcmed`, {
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