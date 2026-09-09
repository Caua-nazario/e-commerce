document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos da página
    const qtySpan = document.querySelector('.qty-selector span');
    const minusBtn = document.querySelector('.qty-selector button:first-child');
    const plusBtn = document.querySelector('.qty-selector button:last-child');
    const deleteBtn = document.querySelector('.item-delete-btn');
    const cartItemCard = document.querySelector('.cart-item-card');
    const itemsCountText = document.querySelector('.items-count');
    const mainPriceElement = document.querySelector('.main-price');
    const subtotalDetail = document.querySelector('.detail-row span:last-child');
    const cartCountBadge = document.querySelector('.cart-count');

    // Valor inicial do produto (pode ser alterado conforme necessário )
    const unitPrice = 4599.00;
    let quantity = 1;

    // Função para formatar números para o padrão de moeda do Brasil (R$ X.XXX,XX)
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Função para atualizar os valores na tela conforme a quantidade
    function updateCartTotals() {
        const total = unitPrice * quantity;
        const formattedTotal = formatCurrency(total);

        // Atualiza quantidade exibida no seletor
        qtySpan.textContent = quantity;

        // Atualiza resumo de valores
        if (subtotalDetail) subtotalDetail.textContent = formattedTotal;
        if (mainPriceElement) mainPriceElement.textContent = formattedTotal;

        // Atualiza textos de contagem
        if (itemsCountText) {
            itemsCountText.textContent = quantity === 1 ? '1 produto selecionado' : `${quantity} produtos selecionados`;
        }
        if (cartCountBadge) {
            cartCountBadge.textContent = quantity;
        }
    }

    // botão de somar (+)
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            quantity++;
            updateCartTotals();
        });
    }

    // botao de subtrair (-)
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                updateCartTotals();
            }
        });
    }

    //remover item do carrinho
    if (deleteBtn && cartItemCard) {
        deleteBtn.addEventListener('click', () => {
            cartItemCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            cartItemCard.style.opacity = '0';
            cartItemCard.style.transform = 'scale(0.95)';

            setTimeout(() => {
                cartItemCard.remove();
                quantity = 0;
                updateCartTotals();

                // mensagem de carrinho vazio
                const productsList = document.querySelector('.cart-products-list');
                if (productsList) {
                    productsList.innerHTML = `
                        <div style="text-align: center; padding: 40px; background: #fff; border-radius: 16px; border: 1px solid var(--border-subtle);">
                            <p style="color: var(--text-muted); font-size: 16px; margin-bottom: 16px;">Sua sacola está vazia.</p>
                            <a href="index.html" style="color: var(--brand-blue); font-weight: 700; text-decoration: none;">Voltar para a Loja</a>
                        </div>
                    `;
                }
            }, 300);
        });
    }
});