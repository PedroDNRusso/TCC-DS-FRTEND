const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')
const uri = "https://tcc-ds-bkend.vercel.app";

async function verificarToken() {
    const token = sessionStorage.getItem("token"); // garante pegar o token atualizado
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

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async (question) => {
    const apiKey = 'AIzaSyBNBP5nLEjFVYb9FhDRrOMzPNR1E5PJBNE'
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
    ## Especialidade
    - Você é um especialista da saúde e precisa enviar as melhores dicas e informações sobre o sintoma ${question} para o paciente.
    - Não indique nenhum remédio ou tratamento, apenas dicas e informações úteis.

    ## Tarefa
    - Você deve responder as perguntas do paciente com base no seu conhecimento
    - Use dados atuais e informações relevantes
    - Responda de forma clara e objetiva, sem rodeios

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada a saúde, responda com 'Essa pergunta não está relacionada a saúde'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Não use emojis na resposta

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 1000 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o paciente está querendo.
    - Responda em Markdown somente, com dicas e informações úteis
    - Não faça perguntas de volta ao paciente, apenas responda o que ele está perguntando
    - Não use termos técnicos, responda de forma simples e direta
    - Ao final da resposta, recomende que o paciente faça um consulta pelo site Diagnostico Digital para resolver suas duvidas de saúde.

    ## Exemplo de resposta
    pergunta do paciente: Estou com dor de cabeça, o que eu faço?
    resposta: Para dor de cabeça, recomenda-se repouso em um ambiente tranquilo e escuro

    ---
    Aqui está a pergunta do paciente: ${question}
  `

    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    // chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
    event.preventDefault()
    const question = questionInput.value

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try {
        const text = await perguntarAI(question)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')
    } catch (error) {
        console.log('Erro: ', error)
    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarFormulario)

// AIzaSyBNBP5nLEjFVYb9FhDRrOMzPNR1E5PJBNE