const uri = 'https://tcc-ds-bkend.vercel.app'; 
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#senha");

togglePassword.addEventListener("click", function (e) {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});

function cadastrar() {
  const form = document.querySelector('#cadastro form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const dados = {
      nome: form.nome.value,
      email: form.email.value,
      senha: form.senha.value,
    };
    fetch(`${uri}/pacientes`, { // ✅ usando variável uri
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(resp => resp.status)
      .then(resp => {
        if (resp === 201) {
          alert('Cadastro feito com sucesso!');
        } else {
          alert('Erro ao cadastrar!');
        }
        window.location.reload();
      })
      .catch(err => {
        console.error("Erro na requisição:", err);
        alert("Erro ao conectar com o servidor!");
      });
  });
}
