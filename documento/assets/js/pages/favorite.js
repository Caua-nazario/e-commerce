/**
 * Carrega, renderiza e remove os produtos favoritos armazenados neste navegador.
 */
const FAVORITES_STORAGE_KEY = "new-ecommerce-favorites";

/**
 * Lê os favoritos salvos e valida os dados antes de usá-los na página.
 */
function loadFavorites() {
    const storedValue = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!storedValue) {
        return [];
    }

    let favorites;

    try {
        favorites = JSON.parse(storedValue);
    } catch (error) {
        console.error("Não foi possível ler os favoritos salvos.", error);
        return [];
    }

    if (!Array.isArray(favorites)) {
        console.error("Os favoritos salvos não estão no formato esperado.");
        return [];
    }

    return favorites.filter((item) => {
        const isValid = item
            && typeof item.id === "string"
            && typeof item.name === "string"
            && Number.isFinite(Number(item.price));

        if (!isValid) {
            console.error("Um favorito inválido foi ignorado.", item);
        }

        return isValid;
    });
}

/**
 * Cria um card seguro para o produto favorito, preenchendo seus textos sem
 * interpretar dados salvos como HTML.
 */
function createFavoriteCard(item) {
    const card = document.createElement("article");
    card.className = "fav-card";
    card.dataset.productId = item.id;

    const imageContainer = document.createElement("div");
    imageContainer.className = "fav-image-placeholder";

    if (item.image) {
        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;
        image.addEventListener("error", () => {
            image.remove();
            imageContainer.textContent = item.name;
        }, { once: true });
        imageContainer.appendChild(image);
    } else {
        const icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = item.icon || "📦";
        imageContainer.appendChild(icon);
    }

    const content = document.createElement("div");
    content.className = "fav-card-content";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "fav-price";
    price.textContent = Number(item.price).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const actions = document.createElement("div");
    actions.className = "fav-actions";

    const viewButton = document.createElement("button");
    viewButton.className = "btn-primary";
    viewButton.type = "button";
    viewButton.dataset.viewProduct = "";
    viewButton.textContent = "Ver produtos";

    const removeButton = document.createElement("button");
    removeButton.className = "btn-remove";
    removeButton.type = "button";
    removeButton.dataset.removeFavorite = "";
    removeButton.title = "Remover dos favoritos";
    removeButton.setAttribute("aria-label", `Remover ${item.name} dos favoritos`);
    removeButton.textContent = "♡";

    actions.append(viewButton, removeButton);
    content.append(name, price, actions);
    card.append(imageContainer, content);
    return card;
}

/**
 * Desenha a lista atual de favoritos ou uma mensagem quando ela estiver vazia.
 */
function renderFavorites() {
    const favoritesGrid = document.querySelector(".fav-grid");

    if (!favoritesGrid) {
        return;
    }

    const favorites = loadFavorites();
    favoritesGrid.replaceChildren();

    if (favorites.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "fav-empty";
        emptyMessage.textContent = "Você ainda não adicionou produtos aos favoritos.";
        favoritesGrid.appendChild(emptyMessage);
        return;
    }

    favorites.forEach((item) => {
        favoritesGrid.appendChild(createFavoriteCard(item));
    });
}

/**
 * Remove o produto selecionado da lista persistida e atualiza os cards.
 */
function removeFavorite(event) {
    const removeButton = event.target.closest("[data-remove-favorite]");
    const card = removeButton?.closest("[data-product-id]");

    if (!card) {
        return;
    }

    const favorites = loadFavorites().filter((item) => item.id !== card.dataset.productId);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    renderFavorites();
}

/**
 * Conecta os botões de remoção e de retorno à seção de produtos.
 */
function initializeFavoritePage() {
    const favoritesGrid = document.querySelector(".fav-grid");

    if (!favoritesGrid) {
        return;
    }

    favoritesGrid.addEventListener("click", (event) => {
        if (event.target.closest("[data-remove-favorite]")) {
            removeFavorite(event);
        } else if (event.target.closest("[data-view-product]")) {
            const card = event.target.closest("[data-product-id]");
            const destination = new URL("index.html", window.location.href);
            destination.searchParams.set("produto", card?.dataset.productId ?? "");
            destination.hash = "productsSection";
            window.location.href = destination.href;
        }
    });

    renderFavorites();
}

initializeFavoritePage();
