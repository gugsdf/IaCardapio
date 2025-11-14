
const sidebarToggleBtns = document.querySelectorAll(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
// const searchForm = document.querySelector(".search-form"); // Você não está usando a busca
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const menuLinks = document.querySelectorAll(".menu-link");

// Atualiza o ícone do tema baseado no tema atual e no estado do sidebar
const updateThemeIcon = () => {
    const isDark = document.body.classList.contains("dark-theme");

    // Lógica para o ícone (se estiver escuro, mostra 'light_mode', senão 'dark_mode')
    const iconName = isDark ? "dark_mode" : "light_mode";

    // Se o sidebar estiver recolhido, o ícone de tema E o ícone do menu mudam
    if (sidebar.classList.contains("collapsed")) {
        themeIcon.textContent = iconName;
    } else {
        // Se estiver expandido, o ícone de tema é sempre 'dark_mode' (ou 'light_mode')
        // e o texto "Dark Mode" / "Light Mode" aparece
        themeIcon.textContent = iconName;
        // Atualiza o texto também
    }
};

// Aplica o tema escuro se estiver salvo ou for a preferência do sistema
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDarkTheme = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon(); // Atualiza o ícone na inicialização

// Alterna entre temas no clique do botão
themeToggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon();
});

// Alterna o estado (recolhido/expandido) do sidebar no clique dos botões
sidebarToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        updateThemeIcon(); // Atualiza o ícone sempre que o sidebar muda
    });
});

// Lógica para fechar o menu em telas pequenas ao clicar em um link
menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
        // Se a tela for pequena (mobile) e o menu não estiver recolhido
        if (window.innerWidth <= 768 && !sidebar.classList.contains("collapsed")) {
            sidebar.classList.add("collapsed"); // Recolhe o menu
            updateThemeIcon();
        }

        // Lógica para 'active' (opcional, mas bom ter)
        // Remove 'active' de todos
        menuLinks.forEach(l => l.classList.remove("active"));
        // Adiciona 'active' no clicado
        e.currentTarget.classList.add("active");
    });
});


// Expande o sidebar por padrão em telas grandes
if (window.innerWidth > 768) {
    sidebar.classList.remove("collapsed");
    updateThemeIcon();
}
// ... código anterior (sidebarToggleButtons, themeToggle, applySavedTheme) ...

// ======================================================
// LÓGICA DO FAQ (ACORDEÃO)
// ======================================================

const faqItem = document.querySelector('.menu-item.has-submenu');
const faqToggle = document.querySelector('.faq-toggle');
const submenuLinks = document.querySelectorAll('.submenu-link');

// 1. Alternar a abertura/fechamento do menu FAQ
faqToggle.addEventListener('click', (e) => {
    e.preventDefault(); // Evita que o link vá para '#'
    faqItem.classList.toggle('open');
});


// 2. Lógica para enviar a pergunta para o ChatBot
submenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Evita que o link vá para '#'

        // Pega a pergunta armazenada no atributo data-question
        const question = link.getAttribute('data-question');

        // Verifica se a função de envio existe no escopo global (assumindo que está em scriptChatBot.js)
        if (typeof window.sendExample === 'function') {
            window.sendExample(question);
        } else {
            console.error('A função sendExample não está definida.');
            // Opcional: Você pode querer fechar o sidebar após o clique no mobile
            // if (window.innerWidth <= 768 && !sidebar.classList.contains('collapsed')) {
            //     sidebar.classList.add('collapsed');
            // }
        }
    });
});