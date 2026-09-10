const temaToggle = document.getElementById("tema-toggle");

// Verifica se o usuário já escolheu um tema
const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "escuro") {
    document.body.classList.add("modo-escuro");
    temaToggle.checked = true;
}

// Quando o botão for clicado
temaToggle.addEventListener("change", function () {

    if (temaToggle.checked) {
        
        document.body.classList.add("modo-escuro");
        localStorage.setItem("tema", "escuro");
    } else {
        
        document.body.classList.remove("modo-escuro");
        localStorage.setItem("tema", "claro");
    }
});