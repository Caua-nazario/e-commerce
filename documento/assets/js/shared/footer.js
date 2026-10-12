/**
 * Conecta os atalhos de atendimento e os links informativos do rodapé.
 */
(() => {
    const footer = document.querySelector("footer");

    if (!footer) {
        return;
    }

    footer.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (!link || !footer.contains(link)) {
            return;
        }

        if (link.dataset.social) {
            event.preventDefault();
            window.alert(`O link da rede social ${link.dataset.social} ainda não foi configurado.`);
            return;
        }

        if (link.dataset.support) {
            const topic = document.getElementById("supportTopic");
            const form = document.getElementById("supportForm");

            if (topic && form) {
                event.preventDefault();
                topic.value = link.dataset.support;
                form.scrollIntoView({ behavior: "smooth", block: "center" });
                form.querySelector("input")?.focus({ preventScroll: true });
            }
            return;
        }

        if (link.getAttribute("href") === "#inicio") {
            const start = document.getElementById("inicio");

            if (start) {
                event.preventDefault();
                start.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                        ? "auto"
                        : "smooth"
                });
            }
        }
    });
})();
