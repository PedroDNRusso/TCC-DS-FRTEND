const API_URL = "https://tcc-ds-bkend.vercel.app";

async function verificarToken() {
    const token = sessionStorage.getItem("token"); // garante pegar o token atualizado
    if (!token) {
        window.location.href = "../login/index.html";
        return;
    }
    try {
        const response = await fetch(`${API_URL}/pacientes`, {
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

function logout() {
    sessionStorage.clear();
    window.location.href = "../login/index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const token = sessionStorage.getItem("token");

    if (!usuario || !token) {
        window.location.href = "../login/index.html";
        return;
    }
    document.getElementById("nome").textContent = usuario.nome;
    document.getElementById("id").textContent = usuario.id;
    document.getElementById("email").textContent = usuario.email;

    verificarToken();
});
