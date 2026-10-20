(() => {
    const CART_STORAGE_KEY = "new-ecommerce-cart";
    const LAST_SEARCH_STORAGE_KEY = "new-ecommerce-last-search";
    const THEME_STORAGE_KEY = "new-ecommerce-theme";

    function saveLastProductSearch(searchTerm) {
        try {
            if (searchTerm) {
                localStorage.setItem(LAST_SEARCH_STORAGE_KEY, searchTerm);
            } else {
                localStorage.removeItem(LAST_SEARCH_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Erro ao salvar busca", error);
        }
    }

    function updateHeaderCartCount() {
        let itemCount = 0;
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            try {
                const items = JSON.parse(storedCart);
                if (Array.isArray(items)) {
                    itemCount = items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
                }
            } catch (error) {
                console.error("Erro ao ler carrinho", error);
            }
        }
        document.querySelectorAll(".cart-count").forEach((counter) => {
            counter.textContent = String(itemCount);
        });
    }

    function submitProductSearch() {
        const input = document.getElementById("searchInput");
        const searchTerm = input?.value.trim() ?? "";
        saveLastProductSearch(searchTerm);

        if (document.querySelector("#products")) {
            if (typeof window.searchStoreProducts === "function") {
                window.searchStoreProducts(searchTerm);
                document.getElementById("productsSection")?.scrollIntoView({ behavior: "smooth" });
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

    function initializeCategoryMenu() {
        const menu = document.querySelector(".nav-category-menu");
        const toggle = menu?.querySelector(".nav-category-toggle");
        const panel = document.getElementById("navCategoryPanel");

        if (!menu || !toggle || !panel) return;

        const setOpen = (isOpen) => {
            panel.hidden = !isOpen;
            toggle.setAttribute("aria-expanded", String(isOpen));
        };

        toggle.addEventListener("click", () => {
            setOpen(panel.hidden);
        });

        document.addEventListener("click", (event) => {
            if (!menu.contains(event.target)) {
                setOpen(false);
            }
        });
    }

    function initializeThemeToggle() {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const themeBtn = document.querySelector(".theme-btn");

        const updateIcon = (isDark) => {
            if (!themeBtn) return;
            if (isDark) {
                themeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
            } else {
                themeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/><path d="M12 18a6 6 0 0 0 0-12v12z" fill="#ffffff"/><circle cx="12" cy="12" r="6"/></svg>`;
            }
        };

        const isDarkTheme = savedTheme === "dark";
        if (isDarkTheme) {
            document.body.classList.add("modo-escuro");
            updateIcon(true);
        } else {
            updateIcon(false);
        }

        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                const isDark = document.body.classList.toggle("modo-escuro");
                localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
                updateIcon(isDark);
            });
        }
    }

    function initializeSharedNavigation() {
        const searchButton = document.getElementById("btnSearch");
        const searchInput = document.getElementById("searchInput");

        initializeCategoryMenu();
        initializeThemeToggle();

        const searchParams = new URLSearchParams(window.location.search);
        if (searchInput && searchParams.has("busca")) {
            searchInput.value = searchParams.get("busca") ?? "";
            saveLastProductSearch(searchInput.value.trim());
        }

        searchButton?.addEventListener("click", submitProductSearch);
        searchInput?.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitProductSearch();
            }
        });

        updateHeaderCartCount();
    }

    document.addEventListener("DOMContentLoaded", () => {
        const headerContainer = document.querySelector("header");
        if (!headerContainer) return;

        fetch("navbar.html")
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;

                initializeSharedNavigation();

                const loggedUser = JSON.parse(localStorage.getItem("logged_user"));
                const headerActions = headerContainer.querySelector(".header-actions");

                if (loggedUser && headerActions) {
                    let userArea = document.getElementById("user-navbar-area");
                    if (!userArea) {
                        userArea = document.createElement("div");
                        userArea.id = "user-navbar-area";
                        userArea.style.display = "flex";
                        userArea.style.alignItems = "center";
                        userArea.style.gap = "10px";
                        
                        const themeBtn = headerContainer.querySelector(".theme-btn");
                        if (themeBtn) {
                            headerActions.insertBefore(userArea, themeBtn);
                        } else {
                            headerActions.appendChild(userArea);
                        }
                    }

                    if (loggedUser.role === "vendor") {
                        userArea.innerHTML = `
                            <a href="dashboard-vendedor.html" style="background: #06b6d4; color: #fff; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 0.85rem; font-weight: 600;">
                                📊 Painel Vendedor
                            </a>
                            <button id="global-logout" style="background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">Sair</button>
                        `;
                    } else {
                        userArea.innerHTML = `
                            <span style="color: #9ca3af; font-size: 0.85rem;">Olá, ${loggedUser.nome || 'Cliente'}</span>
                            <button id="global-logout" style="background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">Sair</button>
                        `;
                    }

                    const globalLogout = document.getElementById("global-logout");
                    if (globalLogout) {
                        globalLogout.addEventListener("click", () => {
                            localStorage.removeItem("logged_user");
                            window.location.href = "index.html";
                        });
                    }
                }
            })
            .catch(error => console.error("Erro ao carregar a navbar:", error));
    });
})();