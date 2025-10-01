const uri = 'https://tcc-ds-bkend.vercel.app'; 

async function login() {
    const form = document.querySelector('#formLogin');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {
            email: form.email.value,
            senha: form.senha.value,
        };

        try {
            const response = await fetch(`${uri}/pacienteslgn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem("usuario", JSON.stringify({
                    id: data.id,
                    nome: data.nome,
                    email: data.email,
                    cpf: data.cpf,
                    telefone: data.telefone,
                    data_nascimento: data.data_nascimento,
                    endereco: data.endereco
                }));
                sessionStorage.setItem("token", data.token);

                window.location.href = '../ui/index.html';
            } else {
                document.getElementById('loginError').textContent = data.message;
            }
        } catch (err) {
            console.error('Erro ao fazer login:', err);
        }
    });
}
