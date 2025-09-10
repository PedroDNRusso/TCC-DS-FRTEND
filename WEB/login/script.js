const uri = 'https://tcc-ds-bkend.vercel.app'; // ✅ agora usa o backend no Vercel

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#senha");

function login() {
    const form = document.querySelector('#formLogin');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        document.getElementById('loginError').textContent = '';

        const dados = {
            email: form.email.value,
            senha: form.senha.value,
        };

        try {
            const response = await fetch(`${uri}/pacienteslgn`, { // ✅ backend do Vercel
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('loginError').style.color = 'green';
                document.getElementById('loginError').textContent = 'Login bem-sucedido!';

                // Salva dados do usuário (sem senha) e token JWT
                sessionStorage.setItem("usuario", JSON.stringify({
                    id: data.id,
                    nome: data.nome,
                    email: data.email,
                    cpf: data.cpf,
                    telefone: data.telefone,
                    data_nascimento: data.data_nascimento,
                    endereco: data.endereco
                }));
                if (data.token) {
                    sessionStorage.setItem("token", data.token);
                }

                setTimeout(() => {
                    window.location.href = '../ui/index.html'; // Redireciona para a interface
                }, 1000);
            } else {
                document.getElementById('loginError').style.color = 'red';
                document.getElementById('loginError').textContent = data.message || 'Email ou senha inválidos.';
            }
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            document.getElementById('loginError').textContent = 'Erro ao conectar com o servidor.';
        }
    });
}

togglePassword.addEventListener("click", function () {
    const type =
        password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
});

document.addEventListener('DOMContentLoaded', login);
