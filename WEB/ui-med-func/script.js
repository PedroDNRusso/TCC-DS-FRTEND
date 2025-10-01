const uri = "https://tcc-ds-bkend.vercel.app"; 
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

if (!medico || !sessionStorage.getItem("token")) {
    window.location.href = "../login-med/index.html";
} else {
    document.getElementById("id").value = medico.id;
    document.getElementById("nome").value = medico.nome;
    document.getElementById("crm").value = medico.crm;
    verificarToken(); 
}

const form = document.getElementById("atestadoForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    for (const key in data) {
        if (!data[key] || data[key].trim() === '') {
            alert(`O campo "${key}" não pode ser vazio.`);
            return;
        }
    }

    try {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para criar um atestado.");
            window.location.href = "../login-med/index.html";
            return;
        }

        const response = await fetch(`${uri}/funcmed`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Atestado criado com sucesso!");
            form.reset();
        } else {
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || JSON.stringify(errorData);
            } catch {
                errorMessage = await response.text();
            }
            alert("Erro ao criar atestado: " + errorMessage);
            console.error("Erro no backend:", errorMessage);
        }

    } catch (error) {
        console.error("Erro ao enviar:", error);
        alert("Erro ao conectar com o servidor.");
    }
});
