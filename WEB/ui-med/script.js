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
      window.location.href = "../../index.html";
    }
  } catch (err) {
    // Se houver erro de conexão, não faz nada
  }
}

if (!medico || !token) {
  window.location.href = "../login-med/index.html";
} else {
  document.getElementById("id").textContent = medico.id;
  document.getElementById("nome").textContent = medico.nome;
  document.getElementById("email").textContent = medico.email;
  document.getElementById("crm").textContent = medico.crm;
  // Não exibir senha por segurança
  verificarToken(); // Verifica o token ao carregar
}

function logout() {
  sessionStorage.removeItem("medico");
  window.location.href = "../../index.html";
}

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