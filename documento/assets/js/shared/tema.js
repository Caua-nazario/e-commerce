function initializeTheme() {
    const temaToggle = document.getElementById("tema-toggle");
    
    const savedTheme = localStorage.getItem("tema");
    const isDarkTheme = savedTheme === "escuro";

    document.body.classList.toggle("modo-escuro", isDarkTheme);

    if (temaToggle) {
        temaToggle.checked = isDarkTheme;
        
        const newToggle = temaToggle.cloneNode(true);
        temaToggle.parentNode.replaceChild(newToggle, temaToggle);

        newToggle.addEventListener("change", () => {
            const nextTheme = newToggle.checked ? "escuro" : "claro";
            document.body.classList.toggle("modo-escuro", newToggle.checked);
            localStorage.setItem("tema", nextTheme);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    if (navbarPlaceholder) {
        fetch("navbar.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar a navbar.");
                }
                return response.text();
            })
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                initializeTheme();
            })
            .catch(error => {
                console.error("Erro:", error);
            });
    } else {
        initializeTheme();
    }
});