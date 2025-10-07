const uri = "https://tcc-ds-bkend.vercel.app";
const token = sessionStorage.getItem("token");
const medico = JSON.parse(sessionStorage.getItem("medico"));

async function verificarToken() {
    const token = sessionStorage.getItem("token");
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

document.addEventListener("DOMContentLoaded", () => {
    const medico = JSON.parse(sessionStorage.getItem("medico"));
    const token = sessionStorage.getItem("token");

    if (!medico || !token) {
        window.location.href = "../login-med/index.html";
        return;
    }

    document.getElementById("id").value = medico.id;

    verificarToken();
});
   
   
const form = document.getElementById("mensagemForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${uri}/mensmed`, {
          method: "POST",
          headers: { "Content-Type": "application/json",
            ...(token ? { "Authorization": "Bearer " + token } : {})
           },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          document.getElementById('loginError').style.color = 'green';
          document.getElementById('loginError').textContent = 'Mensagem enviada com sucesso!';
          form.reset();
        } else {
          const error = await response.json();
          document.getElementById('loginError').style.color = 'red';
          document.getElementById('loginError').textContent = "Erro: " + (error.message || "Não foi possível criar a mensagem.");
        }
      } catch (error) {
        console.error("Erro ao enviar:", error);
        document.getElementById('loginError').style.color = 'red';
        document.getElementById('loginError').textContent = "Erro ao conectar com o servidor.";
      }
    });