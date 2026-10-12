/**
 * Controla o carrinho persistido, suas quantidades, o cupom e a finalização local demonstrativa.
 */
const CART_STORAGE_KEY = "new-ecommerce-cart";
const ORDERS_STORAGE_KEY = "new-ecommerce-orders";
const COUPON_STORAGE_KEY = "new-ecommerce-active-coupon";
const COUPONS = {
    NEW10: {
        discountRate: 0.1
    }
};
let activeCoupon = "";

/**
 * Formata um valor numérico como moeda brasileira.
 */
function formatCurrency(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Calcula o desconto vigente em centavos para evitar diferenças de arredondamento.
 */
function calculateCouponDiscount(subtotal) {
    const coupon = COUPONS[activeCoupon];
    return coupon ? Math.round(subtotal * coupon.discountRate * 100) / 100 : 0;
}

/**
 * Atualiza o estado acessível da mensagem de cupom.
 */
function setCouponMessage(message, state = "") {
    const couponMessage = document.getElementById("couponMessage");

    if (couponMessage) {
        couponMessage.textContent = message;
        couponMessage.dataset.state = state;
    }
}

/**
 * Lê e valida os produtos persistidos pelo catálogo; entradas inválidas são
 * registradas no console e não são renderizadas no carrinho.
 */
function loadStoredCart() {
    const storedValue = localStorage.getItem(CART_STORAGE_KEY);

    if (storedValue === null) {
        return null;
    }

    let parsedItems;

    try {
        parsedItems = JSON.parse(storedValue);
    } catch (error) {
        console.error("Não foi possível ler os produtos salvos no carrinho.", error);
        return [];
    }

    if (!Array.isArray(parsedItems)) {
        console.error("Os dados salvos no carrinho não estão no formato esperado.");
        return [];
    }

    return parsedItems.filter((item) => {
        const isValid = item
            && typeof item.id === "string"
            && typeof item.name === "string"
            && Number.isFinite(Number(item.price))
            && Number(item.price) >= 0
            && Number.isInteger(Number(item.quantity))
            && Number(item.quantity) > 0;

        if (!isValid) {
            console.error("Um item inválido salvo no carrinho foi ignorado.", item);
        }

        return isValid;
    }).map((item) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity)
    }));
}

/**
 * Cria um card de produto usando os dados do carrinho sem inserir conteúdo
 * fornecido pelo armazenamento local como HTML.
 */
function createCartItemCard(item) {
    const card = document.createElement("div");
    card.className = "cart-item-card";
    card.dataset.productId = item.id;

    const badge = document.createElement("div");
    badge.className = "item-badge";
    badge.textContent = "Destaque New";

    const image = document.createElement("img");
    image.alt = item.name;

    if (item.image) {
        image.src = item.image;
        image.addEventListener("error", () => {
            const icon = document.createElement("span");
            icon.className = "product-placeholder";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = item.icon || "📦";
            image.replaceWith(icon);
        }, { once: true });
        card.appendChild(image);
    } else {
        const icon = document.createElement("span");
        icon.className = "product-placeholder";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = item.icon || "📦";
        card.appendChild(icon);
    }

    const info = document.createElement("div");
    info.className = "item-info";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const seller = document.createElement("span");
    seller.className = "item-seller";
    seller.textContent = "Fornecido por New e-Commerce";

    const stock = document.createElement("div");
    stock.className = "item-stock";
    stock.textContent = "Pronta Entrega";
    info.append(name, seller, stock);

    const quantityBox = document.createElement("div");
    quantityBox.className = "item-quantity-box";

    const quantityLabel = document.createElement("label");
    quantityLabel.textContent = "Quantidade";

    const quantitySelector = document.createElement("div");
    quantitySelector.className = "qty-selector";

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.dataset.cartAction = "decrease";
    decreaseButton.setAttribute("aria-label", `Diminuir quantidade de ${item.name}`);
    decreaseButton.textContent = "-";

    const quantity = document.createElement("span");
    quantity.textContent = String(item.quantity);

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.dataset.cartAction = "increase";
    increaseButton.setAttribute("aria-label", `Aumentar quantidade de ${item.name}`);
    increaseButton.textContent = "+";

    quantitySelector.append(decreaseButton, quantity, increaseButton);
    quantityBox.append(quantityLabel, quantitySelector);

    const priceBox = document.createElement("div");
    priceBox.className = "item-price-box";

    const currentPrice = document.createElement("span");
    currentPrice.className = "current-price";
    currentPrice.textContent = formatCurrency(item.price);

    const priceLabel = document.createElement("span");
    priceLabel.className = "exclusive-tag";
    priceLabel.textContent = "Preço por unidade";
    priceBox.append(currentPrice, priceLabel);

    const deleteButton = document.createElement("button");
    deleteButton.className = "item-delete-btn";
    deleteButton.type = "button";
    deleteButton.dataset.cartAction = "remove";
    deleteButton.title = "Remover item";
    deleteButton.setAttribute("aria-label", `Remover ${item.name} do carrinho`);
    deleteButton.textContent = "✕";

    card.prepend(badge);
    card.append(info, quantityBox, priceBox, deleteButton);
    return card;
}

/**
 * Atualiza a lista de produtos, os valores totais e os contadores do carrinho.
 */
function renderStoredCart(items) {
    const productsList = document.querySelector(".cart-products-list");

    if (!productsList) {
        return;
    }

    productsList.replaceChildren();

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = calculateCouponDiscount(subtotal);
    const totalPrice = Math.max(0, subtotal - discount);
    const itemsCountText = document.querySelector(".items-count");
    const productsSummary = document.querySelector(".panel-details .detail-row:first-child span:first-child");
    const productsPrice = document.querySelector(".panel-details .detail-row:first-child span:last-child");
    const mainPrice = document.querySelector(".main-price");
    const discountRow = document.getElementById("couponDiscountRow");

    if (itemsCountText) {
        itemsCountText.textContent = itemCount === 1
            ? "1 produto selecionado"
            : `${itemCount} produtos selecionados`;
    }

    if (productsSummary) {
        productsSummary.textContent = `Produtos (${itemCount})`;
    }

    if (productsPrice) {
        productsPrice.textContent = formatCurrency(subtotal);
    }

    if (mainPrice) {
        mainPrice.textContent = formatCurrency(totalPrice);
    }

    if (discountRow) {
        discountRow.hidden = discount === 0;
        discountRow.querySelector("span:first-child").textContent = `Desconto (${activeCoupon})`;
        discountRow.querySelector("span:last-child").textContent = `-${formatCurrency(discount)}`;
    }

    document.querySelectorAll(".cart-count").forEach((counter) => {
        counter.textContent = String(itemCount);
    });

    if (items.length === 0) {
        activeCoupon = "";
        localStorage.removeItem(COUPON_STORAGE_KEY);
        const couponInput = document.getElementById("couponInput");

        if (couponInput) {
            couponInput.value = "";
        }
        setCouponMessage("");

        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty-message";
        emptyMessage.textContent = "Sua sacola está vazia.";

        const backToStore = document.createElement("a");
        backToStore.className = "btn-back-shopping";
        backToStore.href = "index.html";
        backToStore.textContent = "Voltar para a Loja";

        productsList.append(emptyMessage, backToStore);
        const checkoutButton = document.querySelector(".btn-proceed");

        if (checkoutButton) {
            checkoutButton.disabled = true;
        }

        return;
    }

    const checkoutButton = document.querySelector(".btn-proceed");

    if (checkoutButton) {
        checkoutButton.disabled = false;
    }
    items.forEach((item) => productsList.appendChild(createCartItemCard(item)));
}

/**
 * Aplica a ação de aumentar, diminuir ou remover um item e salva a lista
 * atualizada para que ela continue disponível entre páginas.
 */
function handleStoredCartClick(event, items) {
    const actionButton = event.target.closest("[data-cart-action]");
    const itemCard = actionButton?.closest("[data-product-id]");

    if (!actionButton || !itemCard) {
        return;
    }

    const itemIndex = items.findIndex((item) => item.id === itemCard.dataset.productId);

    if (itemIndex === -1) {
        return;
    }

    const action = actionButton.dataset.cartAction;

    if (action === "increase") {
        items[itemIndex].quantity += 1;
    } else if (action === "decrease") {
        items[itemIndex].quantity -= 1;

        if (items[itemIndex].quantity === 0) {
            items.splice(itemIndex, 1);
        }
    } else if (action === "remove") {
        items.splice(itemIndex, 1);
    } else {
        return;
    }

    if (items.length === 0) {
        activeCoupon = "";
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    renderStoredCart(items);
}

/**
 * Aplica o cupom promocional de demonstração NEW10 ou informa que o código
 * digitado não é válido.
 */
function applyCoupon(items) {
    const couponInput = document.getElementById("couponInput");
    const couponCode = couponInput?.value.trim().toUpperCase() ?? "";

    if (!couponInput || !document.getElementById("couponMessage")) {
        return;
    }

    if (items.length === 0) {
        setCouponMessage("Adicione um produto antes de aplicar um cupom.", "error");
        return;
    }

    if (!Object.hasOwn(COUPONS, couponCode)) {
        activeCoupon = "";
        localStorage.removeItem(COUPON_STORAGE_KEY);
        setCouponMessage("Cupom inválido. Experimente NEW10 para ganhar 10% de desconto.", "error");
        renderStoredCart(items);
        return;
    }

    activeCoupon = couponCode;
    localStorage.setItem(COUPON_STORAGE_KEY, activeCoupon);
    setCouponMessage(`Cupom ${activeCoupon} aplicado: 10% de desconto nos produtos.`, "success");
    renderStoredCart(items);
}

/**
 * Registra um pedido local de demonstração e avisa que a ação não realiza
 * cobrança, pagamento ou envio real.
 */
function finalizeDemoOrder(items) {
    if (items.length === 0) {
        window.alert("Adicione produtos ao carrinho antes de finalizar.");
        return;
    }

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = calculateCouponDiscount(subtotal);
    const orderCode = `NS${Date.now().toString().slice(-8)}`;
    const order = {
        code: orderCode,
        createdAt: new Date().toISOString(),
        items: items.map((item) => ({ ...item })),
        subtotal,
        couponCode: activeCoupon || null,
        discount,
        total: Math.max(0, subtotal - discount),
        status: "Registrado para demonstração"
    };
    const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    let orders = [];

    if (storedOrders) {
        try {
            const parsedOrders = JSON.parse(storedOrders);

            if (Array.isArray(parsedOrders)) {
                orders = parsedOrders;
            } else {
                console.error("Os pedidos salvos não estão no formato esperado.");
            }
        } catch (error) {
            console.error("Não foi possível ler o histórico de pedidos.", error);
        }
    }

    orders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    localStorage.removeItem(COUPON_STORAGE_KEY);
    activeCoupon = "";
    const couponInput = document.getElementById("couponInput");

    if (couponInput) {
        couponInput.value = "";
    }
    setCouponMessage("");

    const checkoutDialog = document.getElementById("checkoutDialog");
    const checkoutMessage = document.getElementById("checkoutMessage");

    if (checkoutDialog && checkoutMessage) {
        checkoutMessage.textContent = `Pedido de demonstração ${orderCode} registrado. Nenhum pagamento ou envio foi realizado. Use este código na seção de rastreio da página inicial.`;
        checkoutDialog.showModal();
    }

    renderStoredCart([]);
}

/**
 * Conecta quantidade, remoção, cupom e finalização ao carrinho salvo.
 */
function initializeStoredCart(items) {
    const productsList = document.querySelector(".cart-products-list");

    productsList?.addEventListener("click", (event) => handleStoredCartClick(event, items));
    document.getElementById("applyCoupon")?.addEventListener("click", () => applyCoupon(items));
    document.getElementById("couponInput")?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            applyCoupon(items);
        }
    });

    document.querySelector(".btn-proceed")?.addEventListener("click", (event) => {
        event.preventDefault();
        finalizeDemoOrder(items);
    });

    document.getElementById("checkoutClose")?.addEventListener("click", () => {
        document.getElementById("checkoutDialog")?.close();
    });

    renderStoredCart(items);
}

/**
 * Inicializa o carrinho persistido; uma primeira visita começa com a sacola
 * vazia, pronta para receber os produtos escolhidos no catálogo.
 */
function initializeCart() {
    let items = loadStoredCart();

    if (items === null) {
        items = [];
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }

    const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);

    if (savedCoupon && Object.hasOwn(COUPONS, savedCoupon) && items.length > 0) {
        activeCoupon = savedCoupon;
        const couponInput = document.getElementById("couponInput");

        if (couponInput) {
            couponInput.value = savedCoupon;
        }
        setCouponMessage(`Cupom ${savedCoupon} aplicado: 10% de desconto nos produtos.`, "success");
    } else if (savedCoupon) {
        localStorage.removeItem(COUPON_STORAGE_KEY);
    }

    initializeStoredCart(items);
}

document.addEventListener("DOMContentLoaded", initializeCart);
