/**
 * Gerencia a autenticação, abas de login/cadastro, animação do indicador e interações da página.
 */
document.addEventListener("DOMContentLoaded", () => {
    const tabsContainer = document.querySelector(".auth-tabs");
    const tabBtns = document.querySelectorAll(".tab-btn");
    const nameGroup = document.getElementById("name-group");
    const roleGroup = document.getElementById("role-group");
    const nameInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("senha");
    const passwordConfirmationGroup = document.getElementById("password-confirm-group");
    const passwordConfirmationInput = document.getElementById("confirmar-senha");
    const submitButton = document.getElementById("submit-btn");
    const forgotLink = document.getElementById("forgot-link");
    const form = document.getElementById("auth-form");
    const authMessage = document.getElementById("authMessage");
    const card = document.querySelector(".login-card");

    let activeAuthMode = "login"; // "login" ou "register"
    const USERS_STORAGE_KEY = "new-ecommerce-users";
    const LOGGED_STORAGE_KEY = "logged_user";

    /**
     * Exibe mensagens de feedback para o utilizador.
     */
    function showAuthMessage(message) {
        if (authMessage) {
            authMessage.textContent = message;
        }
    }

    /**
     * Efeito visual de luz no card seguindo o rato.
     */
    if (card) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    }

    /**
     * Alterna entre as abas de Login e Criar Conta com animação fluida.
     */
    function switchTab(mode, clickedBtn, index) {
        activeAuthMode = mode;

        // Atualiza classes ativas das abas
        tabBtns.forEach(b => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
        });

        if (clickedBtn) {
            clickedBtn.classList.add("active");
            clickedBtn.setAttribute("aria-selected", "true");
        }

        // Move o indicador deslizante através do atributo data-active
        if (tabsContainer) {
            tabsContainer.setAttribute("data-active", index);
        }

        const isRegistration = mode === "register";

        // Exibe ou oculta os campos específicos de cadastro
        if (nameGroup) nameGroup.style.display = isRegistration ? "block" : "none";
        if (roleGroup) roleGroup.style.display = isRegistration ? "block" : "none";
        if (passwordConfirmationGroup) passwordConfirmationGroup.style.display = isRegistration ? "block" : "none";

        if (nameInput) {
            nameInput.required = isRegistration;
            if (!isRegistration) nameInput.value = "";
        }

        if (passwordConfirmationInput) {
            passwordConfirmationInput.required = isRegistration;
            passwordConfirmationInput.disabled = !isRegistration;
            if (!isRegistration) passwordConfirmationInput.value = "";
        }

        if (submitButton) {
            submitButton.textContent = isRegistration ? "Criar Conta" : "Entrar";
        }

        if (forgotLink) {
            forgotLink.style.display = isRegistration ? "none" : "block";
        }

        showAuthMessage("");
    }

    // Configura o evento de clique em cada aba (0 = Login, 1 = Criar Conta)
    tabBtns.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const mode = index === 0 ? "login" : "register";
            switchTab(mode, btn, index);
        });
    });

    /**
     * Processa a autenticação utilizando LocalStorage para teste imediato.
     */
    form?.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput?.value.trim() ?? "";
        const senha = passwordInput?.value ?? "";

        if (!email || !senha) {
            showAuthMessage("Preencha todos os campos obrigatórios.");
            return;
        }

        const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];

        if (activeAuthMode === "register") {
            const nome = nameInput?.value.trim() ?? "";
            const confirmSenha = passwordConfirmationInput?.value ?? "";
            const selectedRoleInput = document.querySelector('input[name="userRole"]:checked');
            const role = selectedRoleInput ? selectedRoleInput.value : "client";

            if (!nome) {
                showAuthMessage("Por favor, preencha o seu nome completo.");
                nameInput?.focus();
                return;
            }

            if (senha !== confirmSenha) {
                showAuthMessage("As senhas informadas não coincidem.");
                passwordConfirmationInput?.focus();
                return;
            }

            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                showAuthMessage("Este e-mail já está cadastrado. Faça login.");
                return;
            }

            // Regista novo utilizador
            const newUser = { nome, email, senha, role };
            users.push(newUser);
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

            // Guarda a sessão ativa
            localStorage.setItem(LOGGED_STORAGE_KEY, JSON.stringify({ nome, email, role }));

            showAuthMessage("Conta criada com sucesso! Redirecionando...");
            
            setTimeout(() => {
                if (role === "vendor") {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "index.html";
                }
            }, 1000);

        } else {
            // Fluxo de Login
            const foundUser = users.find(u => u.email === email && u.senha === senha);

            if (!foundUser) {
                showAuthMessage("E-mail ou senha incorretos.");
                return;
            }

            const role = foundUser.role || "client";

            // Guarda a sessão ativa
            localStorage.setItem(LOGGED_STORAGE_KEY, JSON.stringify({
                nome: foundUser.nome,
                email: foundUser.email,
                role: role
            }));

            showAuthMessage(`Bem-vindo de volta, ${foundUser.nome}!`);

            setTimeout(() => {
                if (role === "vendor") {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "index.html";
                }
            }, 1000);
        }
    });

    // Estado inicial padrão (Aba Login ativa)
    switchTab("login", tabBtns[0], 0);
});