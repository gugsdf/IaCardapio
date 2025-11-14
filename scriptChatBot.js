// ======================================================
// 1. VARIÁVEIS DO DOM (Definidas uma vez no início)
// ======================================================
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const thinkingIndicator = document.getElementById('thinking');
const initialMessage = document.getElementById('initial-message');


// ======================================================
// 2. FUNÇÃO DE CONTROLE DE LAYOUT
// ======================================================
function activateChatLayout() {
    // 2.1. Esconde a mensagem inicial
    if (initialMessage && !initialMessage.classList.contains('hidden')) {
        initialMessage.classList.add('hidden');
    }

    // 2.2. Ativa o chat-log (Aparece a área de fundo e padding)
    if (chatLog && !chatLog.classList.contains('active')) {
        chatLog.classList.add('active');
    }
}


// ======================================================
// 3. FUNÇÃO PARA ADICIONAR MENSAGEM
// ======================================================
function appendMessage(sender, message) {
    const messageElement = document.createElement('p');
    // Usando innerHTML para formatar o negrito do remetente
    messageElement.innerHTML = `<b>${sender}:</b> ${message}`;

    chatLog.appendChild(messageElement);
    // Rola para a mensagem mais recente
    chatLog.scrollTop = chatLog.scrollHeight;
}


// ======================================================
// 4. FUNÇÃO PRINCIPAL DE ENVIO (sendMessage)
// ======================================================
async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) return;

    // 4.1. ESCONDE A MENSAGEM INICIAL E ATIVA O LOG
    activateChatLayout();

    // 4.2. Mostra mensagem do usuário
    appendMessage("Você", message);
    userInput.value = ""; // Limpa o input

    // 4.3. Mostra o "pensando..." (usamos 'flex' para o CSS do indicador de pontos)
    thinkingIndicator.style.display = "flex";
    chatLog.scrollTop = chatLog.scrollHeight; // Rola para mostrar o indicador

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pergunta: message }),
        });

        const data = await response.json();

        // 4.4. Esconde o "pensando..."
        thinkingIndicator.style.display = "none";

        // 4.5. Mostra resposta da IA (Ajuste esta linha se o JSON do seu backend for diferente)
        const botResponse = data.resposta || data.reply || data.message || "Sem resposta.";
        appendMessage("FanBot", botResponse);

    } catch (error) {
        // 4.6. Lógica de erro
        console.error("Erro ao comunicar com o servidor:", error);
        thinkingIndicator.style.display = "none";
        appendMessage("Erro", "Não foi possível processar sua pergunta. Verifique o servidor.");
    }

    // 4.7. Auto-scroll pro fim (para ver a resposta do bot/erro)
    chatLog.scrollTop = chatLog.scrollHeight;
}


// ======================================================
// 5. FUNÇÃO PARA BOTÕES DE SUGESTÃO/FAQ (GLOBAL)
// ======================================================
function sendExample(text) {
    // 5.1. Garante que o layout do chat está ativo
    activateChatLayout();

    // 5.2. Coloca o texto no input e simula o envio
    userInput.value = text;
    sendMessage();
}
// Torna a função acessível globalmente (necessário para onclick no HTML/JS do Sidebar)
window.sendExample = sendExample;


// ======================================================
// 6. EVENT LISTENERS
// ======================================================

// Botão de envio
sendBtn.addEventListener("click", sendMessage);

// Tecla Enter no campo de input
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // Evita a quebra de linha padrão do form/input
        sendMessage();
    }
});
// ======================================================
// 7. INICIALIZAÇÃO E LISTENER DOS BOTÕES DE SUGESTÃO
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões dentro da div suggestions
    const suggestionButtons = document.querySelectorAll('.suggestions button');

    // Adiciona um EventListener para cada botão
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pega o valor do atributo 'data-question'
            const question = button.getAttribute('data-question');

            if (question && typeof window.sendExample === 'function') {
                // Chama a função global de envio
                window.sendExample(question);
            }
        });
    });
});s