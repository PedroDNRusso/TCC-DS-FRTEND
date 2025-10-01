const uri = "https://tcc-ds-bkend.vercel.app";

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
    document.getElementById("nome").value = medico.nome;
    document.getElementById("email").value = medico.email;
    document.getElementById("cpf").value = medico.cpf;
    document.getElementById("datanasc").value = medico.data_nascimento;
    document.getElementById("telefone").value = medico.telefone;
    document.getElementById("endereco").value = medico.endereco;

    verificarToken();
});

document.getElementById("formConfiguracoes").addEventListener("submit", async function (e) {
    e.preventDefault();

    const medico = JSON.parse(sessionStorage.getItem("medico"));
    const token = sessionStorage.getItem("token");

    if (!medico?.id) {
        alert("Usuário não encontrado. Faça login novamente.");
        window.location.href = "../login-med/index.html";
        return;
    }
  
  const nome = document.getElementById("nome").value;
  const crm = document.getElementById("crm").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const cpf = document.getElementById("cpf").value;
  const telefone = document.getElementById("telefone").value;
  const data_nascimento = document.getElementById("datanasc").value;
  const endereco = document.getElementById("endereco").value;
  const especialidade = document.getElementById("especialidade").value;

  try {
    const response = await fetch(`${uri}/medicos/${medico.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": "Bearer " + token } : {})
      },
      body: JSON.stringify({ 
        id: medico.id, 
        crm, 
        nome, 
        email, 
        senha: senha || null,
        cpf, 
        telefone, 
        data_nascimento, 
        endereco, 
        especialidade  }),
    });

    const result = await response.json();
    console.log(response);

    if (response.ok) {
      alert("Informações atualizadas com sucesso!");

      sessionStorage.setItem("medico", JSON.stringify({ 
        id: medico.id, 
        crm, 
        nome, 
        email, 
        cpf, 
        telefone, 
        data_nascimento, 
        endereco, 
        especialidade }));
    } else {
      alert("Erro ao atualizar: " + result.message);
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao conectar ao servidor.");
  }
});

function deletar() {
    const medico = JSON.parse(sessionStorage.getItem("medico"));
    const token = sessionStorage.getItem("token");

    if (!medico?.id) {
        alert("Usuário não encontrado.");
        window.location.href = "../login-med/index.html";
        return;
    }

  fetch(`${uri}/medicos/${medico.id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { "Authorization": "Bearer " + token } : {})
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Medico excluído com sucesso") {
        alert("Conta excluída com sucesso!");
        sessionStorage.clear();
        window.location.href = "../../index.html";
      } else {
        alert("Erro ao excluir conta: " + data.message);
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Erro ao conectar ao servidor.");
    });
}

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#senha");
togglePassword.addEventListener("click", function (e) {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});