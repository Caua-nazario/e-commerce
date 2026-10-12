/**
 * Compartilha busca, navegação, contador do carrinho e avisos de links não configurados entre páginas.
 */
(() => {
    const CART_STORAGE_KEY = "new-ecommerce-cart";
    const LAST_SEARCH_STORAGE_KEY = "new-ecommerce-last-search";

    /**
     * Guarda a consulta mais recente para restaurá-la quando a loja for aberta
     * novamente ou após navegar para outra página.
     */
    function saveLastProductSearch(searchTerm) {
        try {
            if (searchTerm) {
                localStorage.setItem(LAST_SEARCH_STORAGE_KEY, searchTerm);
            } else {
                localStorage.removeItem(LAST_SEARCH_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Não foi possível salvar a última busca neste navegador.", error);
        }
    }

    /**
     * Lê os itens do carrinho para atualizar o contador compartilhado do cabeçalho.
     */
    function updateHeaderCartCount() {
        let itemCount = 0;
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);

        if (storedCart) {
            try {
                const items = JSON.parse(storedCart);

                if (Array.isArray(items)) {
                    itemCount = items.reduce(
                        (total, item) => total + (Number(item.quantity) || 0),
                        0
                    );
                } else {
                    console.error("Os dados salvos no carrinho não estão no formato esperado.");
                }
            } catch (error) {
                console.error("Não foi possível ler o carrinho para atualizar o cabeçalho.", error);
            }
        }

        document.querySelectorAll(".cart-count").forEach((counter) => {
            counter.textContent = String(itemCount);
        });
    }

    /**
     * Envia a busca ao catálogo e mantém o texto de pesquisa ao navegar entre páginas.
     */
    function submitProductSearch() {
        const input = document.getElementById("searchInput");
        const searchTerm = input?.value.trim() ?? "";
        saveLastProductSearch(searchTerm);

        if (document.querySelector("#products")) {
            if (typeof window.searchStoreProducts === "function") {
                window.searchStoreProducts(searchTerm);
                document.getElementById("productsSection")?.scrollIntoView({ behavior: "smooth" });
            } else {
                console.error("A busca do catálogo não está disponível nesta página.");
            }

            return;
        }

        const destination = new URL("index.html", window.location.href);

        if (searchTerm) {
            destination.searchParams.set("busca", searchTerm);
        }

        destination.hash = "productsSection";
        window.location.href = destination.href;
    }

    /**
     * Abre o menu de categorias por hover, foco ou toque e permite fechá-lo
     * pelo teclado ou clicando fora dele.
     */
    function initializeCategoryMenu() {
        const menu = document.querySelector(".nav-category-menu");
        const toggle = menu?.querySelector(".nav-category-toggle");
        const panel = document.getElementById("navCategoryPanel");

        if (!menu || !toggle || !panel) {
            return;
        }

        const setOpen = (isOpen) => {
            panel.hidden = !isOpen;
            toggle.setAttribute("aria-expanded", String(isOpen));
        };

        menu.addEventListener("mouseenter", () => setOpen(true));
        menu.addEventListener("mouseleave", () => {
            if (!menu.contains(document.activeElement)) {
                setOpen(false);
            }
        });
        menu.addEventListener("focusin", () => setOpen(true));
        menu.addEventListener("focusout", (event) => {
            if (!menu.contains(event.relatedTarget)) {
                setOpen(false);
            }
        });
        toggle.addEventListener("click", () => {
            const isDesktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
            setOpen(isDesktopPointer || panel.hidden);
        });
        menu.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !panel.hidden) {
                setOpen(false);
                toggle.focus();
            }
        });
        document.addEventListener("click", (event) => {
            if (!menu.contains(event.target)) {
                setOpen(false);
            }
        });
    }

    /**
     * Conecta os controles comuns do cabeçalho e inicializa os contadores da página.
     */
    function initializeSharedNavigation() {
        const searchButton = document.getElementById("btnSearch");
        const searchInput = document.getElementById("searchInput");
        const primaryNavigation = document.querySelector(".primary");

        initializeCategoryMenu();
        const searchParams = new URLSearchParams(window.location.search);
        if (searchInput && searchParams.has("busca")) {
            searchInput.value = searchParams.get("busca") ?? "";
            saveLastProductSearch(searchInput.value.trim());
        } else if (searchInput) {
            try {
                searchInput.value = localStorage.getItem(LAST_SEARCH_STORAGE_KEY) ?? "";
            } catch (error) {
                console.error("Não foi possível restaurar a última busca deste navegador.", error);
            }
        }

        searchButton?.addEventListener("click", submitProductSearch);
        searchInput?.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitProductSearch();
            }
        });

        primaryNavigation?.addEventListener("click", (event) => {
            const link = event.target.closest("a[href^='#']");

            if (!link) {
                return;
            }

            const targetId = link.getAttribute("href").slice(1);
            const target = targetId ? document.getElementById(targetId) : null;

            if (!target) {
                event.preventDefault();
                const destination = new URL("index.html", window.location.href);
                if (link.dataset.navProduct) {
                    destination.searchParams.set("produto", link.dataset.navProduct);
                }
                destination.hash = targetId;
                window.location.href = destination.href;
            } else if (target.hidden) {
                const searchField = document.getElementById("searchInput");
                const allProductsButton = document.querySelector('.filter-chip[data-filter="todos"]');

                if (searchField) {
                    searchField.value = "";
                }

                allProductsButton?.click();
            }
        });

        updateHeaderCartCount();
    }

    initializeSharedNavigation();
})();
