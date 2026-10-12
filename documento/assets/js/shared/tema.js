/**
 * Restaura e salva a preferência de tema claro ou escuro escolhida no navegador.
 */
const temaToggle = document.getElementById("tema-toggle");

/**
 * Restaura o tema escolhido e sincroniza o controle quando a página oferece
 * o botão de alternância.
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem("tema");
    const isDarkTheme = savedTheme === "escuro";

    document.body.classList.toggle("modo-escuro", isDarkTheme);

    if (temaToggle) {
        temaToggle.checked = isDarkTheme;
        temaToggle.addEventListener("change", () => {
            const nextTheme = temaToggle.checked ? "escuro" : "claro";
            document.body.classList.toggle("modo-escuro", temaToggle.checked);
            localStorage.setItem("tema", nextTheme);
        });
    }
}

initializeTheme();