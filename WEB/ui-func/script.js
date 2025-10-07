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

// 📄 Buscar todos os atestados do paciente logado
async function buscarAtestadosDoPaciente() {
  try {
    const response = await fetch(`${uri}/funcmed/paciente/${usuario.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) throw new Error("Erro ao buscar atestados");

    const atestados = await response.json();

    if (!atestados || atestados.length === 0) {
      alert("Nenhum atestado encontrado.");
      return;
    }

    let container = document.getElementById("cardsContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "cardsContainer";
      document.body.appendChild(container);
    }

    container.innerHTML = "";

    atestados.forEach((atestado) => {
      const card = document.createElement("div");
      card.className = "atestado-card";

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

      const btn = card.querySelector(".btn-baixar-pdf");
      btn.addEventListener("click", () => baixarPDFAtestado(atestado));

      container.appendChild(card);
    });
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  }
}

// 📝 Gerar PDF de um atestado
function baixarPDFAtestado(atestado) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // 📌 Logo
    const logo = new Image();
    logo.src = "../img/logomarca.png";

    logo.onload = () => {
      pdf.addImage(logo, "PNG", 80, 5, 50, 20);

      // 📝 Título
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(22, 82, 99);
      pdf.text("Atestado Médico", 105, 35, { align: "center" });

      // 📋 Conteúdo
      pdf.setFont("times", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(40, 40, 40);

      let y = 50;
      const linha = (texto) => {
        pdf.text(texto, 20, y);
        y += 10;
      };

      linha(`ID: ${atestado.id}`);
      linha(`Médico: ${atestado.nome_med}`);
      linha(`CRM: ${atestado.crm_med}`);
      linha(`Data da Consulta: ${atestado.data ? new Date(atestado.data).toLocaleDateString() : "-"}`);
      linha(`Afastamento Inicial: ${atestado.afast_o ? new Date(atestado.afast_o).toLocaleDateString() : "-"}`);
      linha(`Afastamento Final: ${atestado.afast_c ? new Date(atestado.afast_c).toLocaleDateString() : "-"}`);
      linha(`Motivo: ${atestado.motivo}`);
      linha(`Assinatura do Médico: ${atestado.ass_med}`);

      // 📎 Rodapé
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text("Gerado automaticamente por TCC-DS", 105, 285, { align: "center" });

      // 💾 Baixar arquivo
      pdf.save(`atestado_${atestado.id}.pdf`);
    };

    if (logo.complete) logo.onload();
}

