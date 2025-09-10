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
  document.getElementById("crm").value = medico.crm;
  document.getElementById("id").value = medico.id;
  document.getElementById("nome").value = medico.nome;
  document.getElementById("email").value = medico.email;
  // ⚠️ Não preencher o campo senha com valor do medico
  document.getElementById("cpf").value = medico.cpf;
  document.getElementById("telefone").value = medico.telefone;
  document.getElementById("datanasc").value = medico.data_nascimento;
  document.getElementById("endereco").value = medico.endereco;
  document.getElementById("especialidade").value = medico.especialidade;
  verificarToken(); // Verifica o token ao carregar
}

document.getElementById("formConfiguracoes").addEventListener("submit", async function (e) {
  e.preventDefault();
  
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
    const response = await fetch(`http://localhost:3000/medicos/${medico.id}`, {
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
  const id = medico.id;
  if (!id || isNaN(Number(id))) {
    alert("ID inválido ou ausente");
    return;
  }

  fetch(`http://localhost:3000/medicos/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { "Authorization": "Bearer " + token } : {})
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Medico excluído com sucesso") {
        alert("Conta excluída com sucesso!");
        sessionStorage.removeItem("medico");
        window.location.href = "../home/index.html";
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