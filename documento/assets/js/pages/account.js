/**
 * Envia cadastro e login à API, que valida os dados, deriva a senha e mantém
 * a sessão no PostgreSQL. Nenhuma senha é salva no navegador.
 */
const tabs = document.querySelectorAll(".tab-btn");
const nameGroup = document.getElementById("name-group");
const nameInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("senha");
const passwordConfirmationGroup = document.getElementById("password-confirm-group");
const passwordConfirmationInput = document.getElementById("confirmar-senha");
const submitButton = document.getElementById("submit-btn");
const forgotLink = document.getElementById("forgot-link");
const indicator = document.querySelector(".tab-indicator");
const form = document.getElementById("auth-form");
const authMessage = document.getElementById("authMessage");
let activeAuthMode = "login";
let csrfToken = "";

/**
 * Exibe o resultado acessível de uma ação de conta.
 */
function showAuthMessage(message) {
    if (authMessage) {
        authMessage.textContent = message;
    }
}

/**
 * Faz uma requisição de mesma origem e mantém o token CSRF da sessão.
 */
async function requestAuthApi(path, { method = "GET", body } = {}) {
    const headers = {
        Accept: "application/json"
    };

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (method !== "GET") {
        if (!csrfToken) {
            const csrfResponse = await fetch("/api/auth/csrf", {
                credentials: "same-origin",
                cache: "no-store"
            });
            const csrfResult = await csrfResponse.json();

            if (!csrfResponse.ok) {
                throw new Error(csrfResult.error ?? "Não foi possível iniciar uma sessão segura.");
            }

            csrfToken = csrfResult.csrfToken;
        }

        headers["X-CSRF-Token"] = csrfToken;
    }

    const response = await fetch(path, {
        method,
        headers,
        credentials: "same-origin",
        cache: "no-store",
        body: body === undefined ? undefined : JSON.stringify(body)
    });
    const result = response.status === 204 ? {} : await response.json();

    if (!response.ok) {
        if (response.status === 403) {
            csrfToken = "";
        }

        throw new Error(result.error ?? "Não foi possível concluir a solicitação.");
    }

    if (result.csrfToken) {
        csrfToken = result.csrfToken;
    }

    return result;
}

/**
 * Exibe os dados públicos da conta autenticada e permite encerrar a sessão.
 */
function updateAccountSession(user) {
    document.getElementById("server-logout")?.remove();

    if (!user || !authMessage) {
        return;
    }

    const logoutButton = document.createElement("button");
    logoutButton.id = "server-logout";
    logoutButton.className = "btn-google";
    logoutButton.type = "button";
    logoutButton.textContent = "Sair da conta";
    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;

        try {
            await requestAuthApi("/api/auth/logout", { method: "POST", body: {} });
            csrfToken = "";
            logoutButton.remove();
            showAuthMessage("Você saiu da sua conta.");
        } catch (error) {
            console.error("Não foi possível encerrar a sessão no servidor.", error);
            showAuthMessage(error.message);
            logoutButton.disabled = false;
        }
    });

    authMessage.insertAdjacentElement("afterend", logoutButton);
    showAuthMessage(`Olá, ${user.name}. Sua sessão está ativa neste navegador.`);
}

/**
 * Restaura a sessão mantida pelo servidor ao abrir a página de conta.
 */
async function restoreAccountSession() {
    try {
        const { user } = await requestAuthApi("/api/auth/me");

        if (user) {
            updateAccountSession(user);
        }
    } catch (error) {
        console.error("Não foi possível consultar a sessão no servidor.", error);
        showAuthMessage(error.message);
    }
}

/**
 * Alterna os campos e regras do formulário entre login e criação de conta.
 */
function switchTab(type, clickedButton) {
    activeAuthMode = type;
    tabs.forEach((tab) => {
        const isActive = tab === clickedButton;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });

    const isRegistration = type === "register";
    nameGroup?.classList.toggle("aberto", isRegistration);
    passwordConfirmationGroup?.classList.toggle("aberto", isRegistration);

    if (nameInput) {
        nameInput.required = isRegistration;
        nameInput.autocomplete = isRegistration ? "name" : "off";
    }

    if (passwordInput) {
        passwordInput.autocomplete = isRegistration ? "new-password" : "current-password";
        passwordInput.minLength = isRegistration ? 10 : 1;
    }

    if (passwordConfirmationInput) {
        passwordConfirmationInput.required = isRegistration;
        passwordConfirmationInput.minLength = isRegistration ? 10 : 0;
        passwordConfirmationInput.disabled = !isRegistration;
    }

    if (submitButton) {
        submitButton.textContent = isRegistration ? "Criar minha conta" : "Entrar";
    }

    forgotLink?.classList.toggle("oculto", isRegistration);
    indicator?.classList.toggle("direita", isRegistration);
    showAuthMessage("");
}

/**
 * Valida localmente a confirmação e envia apenas os campos necessários à API.
 */
async function handleAuthSubmit(event) {
    event.preventDefault();

    if (!form?.reportValidity()) {
        return;
    }

    if (
        activeAuthMode === "register"
        && passwordInput?.value !== passwordConfirmationInput?.value
    ) {
        showAuthMessage("As senhas informadas não são iguais.");
        passwordConfirmationInput?.focus();
        return;
    }

    submitButton.disabled = true;

    try {
        const isRegistration = activeAuthMode === "register";
        const payload = {
            email: emailInput?.value.trim() ?? "",
            password: passwordInput?.value ?? ""
        };

        if (isRegistration) {
            payload.name = nameInput?.value.trim() ?? "";
            payload.passwordConfirmation = passwordConfirmationInput?.value ?? "";
        }

        const result = await requestAuthApi(
            isRegistration ? "/api/auth/register" : "/api/auth/login",
            { method: "POST", body: payload }
        );

        passwordInput.value = "";

        if (passwordConfirmationInput) {
            passwordConfirmationInput.value = "";
        }

        emailInput.value = result.user.email;
        updateAccountSession(result.user);

        if (result.message) {
            showAuthMessage(`${result.message} Olá, ${result.user.name}.`);
        }
    } catch (error) {
        console.error("Não foi possível concluir a operação de conta.", error);
        showAuthMessage(error.message);
    } finally {
        submitButton.disabled = false;
    }
}

/**
 * Informa que os provedores externos de login e recuperação ainda não estão configurados.
 */
function showUnavailableAccountIntegration(event) {
    event.preventDefault();
    showAuthMessage("Login com Google e recuperação por e-mail ainda precisam de integrações externas.");
}

/**
 * Liga as abas e formulários e consulta uma sessão existente no servidor.
 */
function initializeAccountPage() {
    tabs[0]?.addEventListener("click", () => switchTab("login", tabs[0]));
    tabs[1]?.addEventListener("click", () => switchTab("register", tabs[1]));
    form?.addEventListener("submit", handleAuthSubmit);
    document.getElementById("btn-google")?.addEventListener("click", showUnavailableAccountIntegration);
    forgotLink?.addEventListener("click", showUnavailableAccountIntegration);
    restoreAccountSession();
}

initializeAccountPage();
