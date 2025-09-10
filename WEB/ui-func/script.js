// Verifica se usuário está logado
const usuario = JSON.parse(sessionStorage.getItem("usuario"));
const token = sessionStorage.getItem("token");

async function verificarToken() {
  if (!token) {
    window.location.href = "../login/index.html";
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/pacientes", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (response.status === 401 || response.status === 500) {
      sessionStorage.removeItem("usuario");
      sessionStorage.removeItem("token");
      window.location.href = "../home/index.html";
    }
  } catch (err) {}
}

if (!usuario || !token) {
  window.location.href = "../login/index.html";
} else {
  verificarToken();
}

async function buscarAtestadosDoPaciente(pacienteId) {
  try {
    const response = await fetch(`http://localhost:3000/funcmed/paciente/${pacienteId}`,{
      method: "GET",
      headers: { "Content-Type": "application/json",
        ...(token ? { "Authorization": "Bearer " + token } : {})
       }
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar atestados");
    }

    const atestados = await response.json();

    if (atestados.length === 0) {
      alert("Nenhum atestado encontrado.");
      return;
    }

    let container = document.getElementById('cardsContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cardsContainer';
      document.body.appendChild(container);
    }

    container.innerHTML = '';

    atestados.forEach(atestado => {
      const card = document.createElement('div');
      card.className = 'atestado-card';

      card.innerHTML = `
        <h3>Atestado #${atestado.id}</h3>
        <p><strong>Médico:</strong> ${atestado.nome_med}</p>
        <p><strong>CRM:</strong> ${atestado.crm_med}</p>
        <p><strong>Data Consulta:</strong> ${atestado.data ? new Date(atestado.data).toLocaleDateString() : '-'}</p>
        <p><strong>Afastamento Inicial:</strong> ${atestado.afast_o ? new Date(atestado.afast_o).toLocaleDateString() : '-'}</p>
        <p><strong>Afastamento Final:</strong> ${atestado.afast_c ? new Date(atestado.afast_c).toLocaleDateString() : '-'}</p>
        <p><strong>Motivo:</strong> ${atestado.motivo}</p>
        <p><strong>Assinatura do Médico:</strong> ${atestado.ass_med}</p>
        <button class="btn-baixar-pdf">Baixar PDF</button>
      `;

      // Adiciona evento para baixar PDF
      const btn = card.querySelector('.btn-baixar-pdf');
      btn.addEventListener('click', () => baixarPDFAtestado(atestado));

      container.appendChild(card);
    });

  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
}

// Função para gerar e baixar PDF de um atestado específico
function baixarPDFAtestado(atestado) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Adiciona logo no topo
  const logoUrl = '../img/logomarca.png'; // Caminho relativo à pasta do script
  const img = new Image();
  img.src = logoUrl;
  img.onload = function() {
    pdf.addImage(img, 'PNG', 80, 5, 50, 20); // Centralizado no topo

    // Título estilizado
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(22, 82, 99); // Azul escuro
    pdf.text("Atestado Médico", 105, 35, { align: 'center' });

    // Dados do atestado com estilos
    pdf.setFont('times', 'normal');
    pdf.setFontSize(13);
    pdf.setTextColor(40, 40, 40);
    let y = 50;
    pdf.text(`ID: ${atestado.id}`, 20, y); y += 10;
    pdf.text(`Médico: ${atestado.nome_med}`, 20, y); y += 10;
    pdf.text(`CRM: ${atestado.crm_med}`, 20, y); y += 10;
    pdf.text(`Data da Consulta: ${atestado.data ? new Date(atestado.data).toLocaleDateString() : '-'}`, 20, y); y += 10;
    pdf.text(`Afastamento Inicial: ${atestado.afast_o ? new Date(atestado.afast_o).toLocaleDateString() : '-'}`, 20, y); y += 10;
    pdf.text(`Afastamento Final: ${atestado.afast_c ? new Date(atestado.afast_c).toLocaleDateString() : '-'}`, 20, y); y += 10;
    pdf.text(`Motivo: ${atestado.motivo}`, 20, y); y += 10;
    pdf.text(`Assinatura do Médico: ${atestado.ass_med}`, 20, y);

    // Rodapé
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text('Gerado por TCC-DS', 105, 285, { align: 'center' });

    pdf.save(`atestadoDD.pdf`);
  };
  // Se a imagem já estiver carregada do cache
  if (img.complete) {
    img.onload();
  }
}

// Executa a busca quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  buscarAtestadosDoPaciente(usuario.id);
});
