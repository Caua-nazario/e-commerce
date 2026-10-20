document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("productModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const productForm = document.getElementById("productForm");
    const tableBody = document.getElementById("vendorProductsTableBody");
    const totalCountEl = document.getElementById("totalProductsCount");

    const PRODUCTS_STORAGE_KEY = "new-ecommerce-vendor-products";

    // Obtém os produtos salvos no LocalStorage
    function getProducts() {
        try {
            const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
            return data ? JSON.parse(data) : [
                { id: 1, name: "Galaxy A55 5G", category: "Celulares", price: 2199.00 },
                { id: 2, name: "Edge 50 Fusion", category: "Celulares", price: 2499.00 }
            ];
        } catch {
            return [];
        }
    }

    // Persiste os produtos no LocalStorage
    function saveProducts(products) {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }

    // Renderiza a tabela e atualiza os contadores
    function renderTable() {
        const products = getProducts();
        tableBody.innerHTML = "";
        totalCountEl.textContent = products.length;

        if (products.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 20px;">Nenhum produto cadastrado.</td></tr>`;
            return;
        }

        products.forEach((prod, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${prod.name}</strong></td>
                <td>${prod.category}</td>
                <td>R$ ${Number(prod.price).toFixed(2).replace('.', ',')}</td>
                <td>
                    <button class="action-btn delete" data-index="${index}" title="Excluir">🗑️</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Abre e fecha o modal de cadastro
    openModalBtn?.addEventListener("click", () => modal.classList.add("active"));
    closeModalBtn?.addEventListener("click", () => modal.classList.remove("active"));

    // Adiciona novo produto via formulário
    productForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("prodName").value.trim();
        const category = document.getElementById("prodCategory").value.trim();
        const price = parseFloat(document.getElementById("prodPrice").value);

        if (name && category && !isNaN(price)) {
            const products = getProducts();
            products.push({ id: Date.now(), name, category, price });
            saveProducts(products);

            productForm.reset();
            modal.classList.remove("active");
            renderTable();
        }
    });

    // Remove produto da lista
    tableBody?.addEventListener("click", (e) => {
        if (e.target.closest(".delete")) {
            const index = e.target.closest(".delete").dataset.index;
            const products = getProducts();
            products.splice(index, 1);
            saveProducts(products);
            renderTable();
        }
    });

    renderTable();
});