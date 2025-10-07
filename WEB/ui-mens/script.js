const uri = "https://tcc-ds-bkend.vercel.app";
const usuario = JSON.parse(sessionStorage.getItem("usuario"));

async function verificarToken() {
    const token = sessionStorage.getItem("token");
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

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const token = sessionStorage.getItem("token");

    if (!usuario || !token) {
        window.location.href = "../login/index.html";
        return;
    }
    verificarToken();
});

async function buscarMensagensDoPaciente(pacienteId) {
  try {
    const response = await fetch(`${uri}/mensmed/paciente/${pacienteId}`, {
      headers: {
        ...(token ? { "Authorization": "Bearer " + token } : {})
      }
    });

    document.getElementById('loginError').textContent = '';

    if (!response.ok) {
      document.getElementById('loginError').style.color = 'black';
      document.getElementById('loginError').textContent = 'Você não possui mensagens ainda.';
      return; // ✅ Impede erro ao tentar fazer response.json() em resposta vazia
    }

    const mensagens = await response.json();

    // ✅ Salva a quantidade no sessionStorage para uso em outra página
    sessionStorage.setItem('quantidadeMensagens', mensagens.length);

    if (mensagens.length === 0) {
      alert("Nenhuma mensagem encontrada.");
      return;
    }

    let container = document.getElementById('cardsContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cardsContainer';
      document.body.appendChild(container);
    }

    container.innerHTML = '';

    mensagens.forEach(mensagem => {
      const card = document.createElement('div');
      card.className = 'mensagem-card';

      card.innerHTML = `
        <h3>Mensagem #${mensagem.id}</h3>
        <p><strong>Nome do Paciente:</strong> ${mensagem.nome_pac}</p>
        <p><strong>ID do Médico:</strong> ${mensagem.medicoId}</p>
        <p><strong>Mensagem:</strong> ${mensagem.mensagem}</p>
        <button type="button" class="delete-button" onclick="deletar(${mensagem.id})">Excluir</button>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    document.getElementById('loginError').style.color = 'red';
    document.getElementById('loginError').textContent =
      'Erro ao buscar mensagens. Por favor, tente novamente mais tarde.';
  }
}

function deletar(id) {
  if (!id || isNaN(Number(id))) {
    alert("ID inválido ou ausente");
    return;
  }

  if (!confirm("Tem certeza que deseja excluir esta mensagem?")) {
    return;
  }

  fetch(`${uri}/mensmed/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { "Authorization": "Bearer " + token } : {})
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Mensagem excluída com sucesso") {
        alert("Mensagem excluída com sucesso!");
        window.location.reload(); // ✅ Atualiza a lista de mensagens
      } else {
        alert("Erro ao excluir mensagem: " + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao conectar ao servidor.");
    });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!usuario || !usuario.id) {
    console.error("Usuário não encontrado na sessão.");
    window.location.href = "../login/index.html"; // redireciona se não estiver logado
    return;
  }

  buscarMensagensDoPaciente(usuario.id);
});