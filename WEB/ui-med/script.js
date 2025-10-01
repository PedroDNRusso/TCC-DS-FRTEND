const uri = "https://tcc-ds-bkend.vercel.app";

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

function logout() {
    sessionStorage.clear();
    window.location.href = "../login-med/index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const medico = JSON.parse(sessionStorage.getItem("medico"));
    const token = sessionStorage.getItem("token");

    if (!medico || !token) {
        window.location.href = "../login-med/index.html";
        return;
    }
    document.getElementById("id").textContent = medico.id;
    document.getElementById("email").textContent = medico.email;
    document.getElementById("nome").textContent = medico.nome;
    document.getElementById("crm").textContent = medico.crm;


    verificarToken();
});

async function buscarPacientePorId() {
        const id = document.getElementById('searchIdPac').value;
        const resultadoDiv = document.getElementById('resultadoBuscaPac');
        resultadoDiv.innerHTML = '';

        if (!id) {
            resultadoDiv.innerHTML = '<span class="erro">Informe um ID válido.</span>';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/pacientes/${id}`,{
                method: "GET",
                headers: { "Content-Type": "application/json",
                  ...(token ? { "Authorization": "Bearer " + token } : {})
                 }
            })
            if (!response.ok) {
                resultadoDiv.innerHTML = '<span class="erro">Paciente não encontrado.</span>';
                return;
            }
            const paciente = await response.json();
            resultadoDiv.innerHTML = `
                <div class="info-card">
                    <p><strong>Nome:</strong> ${paciente.nome || '-'}</p>
                    <p><strong>Email:</strong> ${paciente.email || '-'}</p>
                    <p><strong>CPF:</strong> ${paciente.cpf || '-'}</p>
                    <p><strong>Telefone:</strong> ${paciente.telefone || '-'}</p>
                    <p><strong>Data de Nascimento:</strong> ${paciente.data_nascimento ? new Date(paciente.data_nascimento).toLocaleDateString() : '-'}</p>
                    <p><strong>Endereço:</strong> ${paciente.endereco || '-'}</p>
                </div>
            `;
        } catch (err) {
            resultadoDiv.innerHTML = '<span class="erro">Erro ao buscar paciente.</span>';
        }
}