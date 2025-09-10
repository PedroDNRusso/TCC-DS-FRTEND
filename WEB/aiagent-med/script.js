const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')
const token = sessionStorage.getItem("token");
const medico = JSON.parse(sessionStorage.getItem("medico"));

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
      window.location.href = "../home/index.html";
    }
  } catch (err) {
    // Se houver erro de conexão, não faz nada
  }
}

if (!medico || !token) {
  window.location.href = "../login-med/index.html";
} else {
  verificarToken(); 
}

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
    - Você é um especialista da saúde e precisa enviar as melhores dicas e informações sobre o sintoma ${question} para o medico que esta fazendo a pergunta sobre algo envolvendo saúde.
    - Indique as melhores soluções, dicas e informações úteis para o medico.

    ## Tarefa
    - Você deve responder as perguntas do medico com base no seu conhecimento
    - Use dados atuais e informações relevantes
    - Responda de forma clara e objetiva, use alguns termos tecnicos se necessário

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada a saúde, responda com 'Essa pergunta não está relacionada a saúde'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Não use emojis na resposta

    ## Resposta
    - Economize na resposta, mas tente responder o máximo possível
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o medico está querendo.
    - Responda em Markdown somente, com dicas e informações úteis
    - Não faça perguntas de volta ao medico, apenas responda o que ele está perguntando
    - Ao final da resposta, mostre os sites de referência que você usou para responder a pergunta, se possível

    ## Exemplo de resposta
    Pergunta do medico: "Quais são as melhores recomendações para um paciente que está sofrendo de dor de cabeça frequente?"
    Resposta: "As melhores recomendações para um paciente com dor de cabeça frequente incluem: manter uma boa hidratação, evitar gatilhos como estresse e certos alimentos, garantir um sono adequado e praticar técnicas de relaxamento. Se as dores persistirem, é importante consultar um neurologista para uma avaliação mais detalhada."

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