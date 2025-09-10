const uri = 'https://tcc-ds-bkend.vercel.app'; // ✅ agora aponta pro backend hospedado no Vercel
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#senha");

togglePassword.addEventListener("click", function (e) {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("fa-eye-slash");
});

const form = document.querySelector('form');
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const dados = {
    nome: form.nome.value,
    crm: form.crm.value,
    email: form.email.value,
    senha: form.senha.value,
    cpf: form.cpf.value,
  };

  fetch(`${uri}/medicos`, { // ✅ envia para o Vercel
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
    .then(resp => resp.status)
    .then(status => {
      if (status === 201) {
        alert('Cadastro feito com sucesso!');
      } else {
        alert('Erro ao cadastrar! Verifique os dados e tente novamente.');
      }
      window.location.reload();
    })
    .catch(err => {
      console.error("Erro na requisição:", err);
      alert("Erro ao conectar com o servidor!");
    });
});
