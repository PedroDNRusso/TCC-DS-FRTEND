const uri = "https://tcc-ds-bkend.vercel.app"; // Backend no Vercel

// Função para verificar se o token é válido
async function verificarToken() {
    const token = sessionStorage.getItem("token"); // pega token atualizado
    if (!token) {
        window.location.href = "../login/index.html";
        return;
    }
    try {
        const response = await fetch(`${uri}/pacientes`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        if (response.status === 401) {
            sessionStorage.clear();
            window.location.href = "../login/index.html";
        } else if (!response.ok) {
            console.error("Erro desconhecido ao verificar token:", response.status);
        }
    } catch (err) {
        console.error("Erro ao verificar token:", err);
    }
}

// Preencher campos do usuário e verificar token ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const token = sessionStorage.getItem("token");

    if (!usuario || !token) {
        window.location.href = "../login/index.html";
        return;
    }

    // Preenche campos do formulário
    document.getElementById("id").value = usuario.id;
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("email").value = usuario.email;
    // ⚠️ Não preencher o campo senha com valor do usuário
    document.getElementById("cpf").value = usuario.cpf;
    document.getElementById("datanasc").value = usuario.data_nascimento;
    document.getElementById("telefone").value = usuario.telefone;
    document.getElementById("endereco").value = usuario.endereco;

    verificarToken();
});

// Atualizar informações do usuário
document.getElementById("formConfiguracoes").addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = JSON.parse(sessionStorage.getItem("usuario")); // ✅ pegar usuário atual
    const token = sessionStorage.getItem("token"); // ✅ pegar token atualizado

    if (!usuario?.id) {
        alert("Usuário não encontrado. Faça login novamente.");
        window.location.href = "../login/index.html";
        return;
    }

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value; // senha em texto puro
    const cpf = document.getElementById("cpf").value;
    const data_nascimento = document.getElementById("datanasc").value;
    const endereco = document.getElementById("endereco").value;
    const telefone = document.getElementById("telefone").value;

    try {
        const response = await fetch(`${uri}/pacientes/${usuario.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": "Bearer " + token } : {})
            },
            body: JSON.stringify({
                id: usuario.id,
                nome,
                email,
                senha: senha || null, // se não alterar, backend mantém a senha
                cpf,
                telefone,
                data_nascimento,
                endereco
            }),
        });

        const result = await response.json();
        console.log("📥 Resposta do servidor:", result);

        if (response.ok) {
            alert("Informações atualizadas com sucesso!");

            // ⚠️ Atualiza sessionStorage sem senha
            sessionStorage.setItem("usuario", JSON.stringify({
                id: usuario.id,
                nome,
                email,
                cpf,
                telefone,
                data_nascimento,
                endereco
            }));
        } else {
            alert("Erro ao atualizar: " + result.message);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao conectar ao servidor.");
    }
});

// Deletar conta do usuário
function deletar() {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const token = sessionStorage.getItem("token");

    if (!usuario?.id) {
        alert("Usuário não encontrado.");
        window.location.href = "../login/index.html";
        return;
    }

    fetch(`${uri}/pacientes/${usuario.id}`, {
        method: "DELETE",
        headers: {
            ...(token ? { "Authorization": "Bearer " + token } : {})
        }
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "Paciente excluído com sucesso") {
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

// Toggle de visibilidade da senha
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#senha");
togglePassword.addEventListener("click", function () {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
});

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = "../login/index.html";
}
