/**
 * Controla a página inicial: catálogo, busca, filtros, carrinho, favoritos, rastreio e atendimento.
 * Os pedidos e solicitações são demonstrações locais, sem envio a serviços externos.
 */
const CART_STORAGE_KEY = "new-ecommerce-cart";
const FAVORITES_STORAGE_KEY = "new-ecommerce-favorites";
const ORDERS_STORAGE_KEY = "new-ecommerce-orders";
const SUPPORT_TICKETS_STORAGE_KEY = "new-ecommerce-support-tickets";
let activeCategory = "todos";
let activePriceRange = "all";
let activeBrand = "all";
let activeSort = "featured";
let selectedProductId = null;

const PRODUCT_PHOTOS = {
    "1": "assets/images/products/computers/laptop.jpg",
    "2": "assets/images/products/phones/smartphone-modelo-a.jpg",
    "3": "assets/images/products/audio/headphones.jpg",
    "4": "assets/images/products/wearables/smartwatch.jpg",
    "5": "assets/images/products/audio/headphones.jpg",
    "6": "assets/images/products/audio/speaker.jpg",
    "7": "assets/images/products/computers/keyboard.jpg",
    "8": "assets/images/products/tablets/tablet.jpg",
    "9": "assets/images/products/cameras/camera.jpg"
};

const PRODUCT_FEATURES = {
    "1": ["Indicado para estudos, trabalho e tarefas diárias.", "Processador, memória, armazenamento e tamanho de tela não foram informados."],
    "2": ["Smartphone para comunicação, aplicativos e entretenimento.", "Modelo e configuração não especificados."],
    "3": ["Headset para jogos, chamadas e entretenimento.", "Confirme conexão, compatibilidade e recursos do modelo."],
    "4": ["Smartwatch para notificações e atividades cotidianas.", "Compatibilidade e sensores dependem do modelo."],
    "5": ["Fone de ouvido para música e chamadas.", "Tipo de conexão e autonomia não especificados."],
    "6": ["Caixa de som para música e outros conteúdos.", "Potência, conectividade e autonomia não especificadas."],
    "7": ["Teclado mecânico para computador e setup gamer.", "Confirme layout, conexão e tipo de switch do modelo."],
    "8": ["Tablet para leitura, estudos, aplicativos e entretenimento.", "Tamanho de tela, memória e conectividade não especificados."],
    "9": ["Câmera digital para fotografia e criação de conteúdo.", "Resolução, lente e acessórios dependem do modelo."]
};

const PRODUCT_DESCRIPTIONS = {
    "1": "Notebook para estudos, trabalho e tarefas do dia a dia. Consulte as especificações do modelo antes de comprar. Foto ilustrativa.",
    "2": "Smartphone para comunicação, aplicativos e entretenimento. O modelo e o preço nesta loja são demonstrativos. Foto ilustrativa.",
    "3": "Headset para jogos, chamadas e entretenimento. Confira a compatibilidade com seu dispositivo. Foto ilustrativa.",
    "4": "Smartwatch para acompanhar notificações e atividades cotidianas. Recursos dependem do modelo. Foto ilustrativa.",
    "5": "Fone de ouvido para música e chamadas no dia a dia. Foto ilustrativa.",
    "6": "Caixa de som para ouvir suas músicas e conteúdos favoritos. Foto ilustrativa.",
    "7": "Teclado mecânico para uso em computadores e setups de jogos. Confirme o layout do modelo. Foto ilustrativa.",
    "8": "Tablet para leitura, aplicativos, estudos e entretenimento. O nome e as condições são demonstrativos. Foto ilustrativa.",
    "9": "Câmera digital para fotografia e criação de conteúdo. Consulte as especificações do modelo. Foto ilustrativa."
};

const EXTRA_PRODUCTS = [
    {
        id: "10",
        name: "Samsung Galaxy A55 5G 256GB",
        brand: "Samsung",
        price: 2199.90,
        oldPrice: 2599.90,
        image: "assets/images/products/phones/smartphone-modelo-c.jpg",
        description: "Samsung Galaxy A55 5G com 256 GB, conforme o nome do produto. Confira a versão e as especificações completas no anúncio original.",
        features: ["Conectividade 5G e armazenamento de 256 GB, conforme o nome do produto.", "Memória, tela e acessórios não especificados."]
    },
    {
        id: "11",
        name: "Motorola Edge 50 Fusion 256GB",
        brand: "Motorola",
        price: 1899.90,
        oldPrice: 2299.90,
        image: "assets/images/products/phones/smartphone-modelo-a.jpg",
        description: "Motorola Edge 50 Fusion com 256 GB, conforme o nome do produto. Consulte o anúncio original para confirmar as especificações da versão.",
        features: ["Armazenamento indicado: 256 GB.", "Memória, tela e acessórios não especificados."]
    },
    {
        id: "12",
        name: "Xiaomi Redmi Note 13 Pro 5G 256GB",
        brand: "Xiaomi",
        price: 1699.90,
        oldPrice: 1999.90,
        image: "assets/images/products/phones/smartphone-modelo-b.jpg",
        description: "Xiaomi Redmi Note 13 Pro 5G com 256 GB, conforme o nome do produto. Confira a versão e as especificações completas no anúncio original.",
        features: ["Conectividade 5G e armazenamento de 256 GB, conforme o nome do produto.", "Memória, tela e acessórios não especificados."]
    },
    {
        id: "13",
        name: "iPhone 13 Pro Max 128GB",
        brand: "Apple",
        price: 5890.90,
        oldPrice: 6299.90,
        image: "assets/images/products/phones/smartphone-modelo-d.jpg",
        description: "iPhone 13 Pro Max com 128 GB, conforme o nome do produto. Confira a condição do aparelho e a versão exata antes de comprar.",
        features: ["Armazenamento indicado: 128 GB.", "Condição e acessórios não especificados."]
    },
    {
        id: "14",
        name: "Xbox Series S 512GB",
        brand: "Microsoft",
        price: 2799.90,
        oldPrice: 3199.90,
        image: "assets/images/products/gaming/xbox-series-s.jpg",
        category: "Games",
        icon: "🎮",
        description: "Console Xbox Series S com SSD de 512 GB, conforme o nome do produto. Consulte a versão e os itens inclusos no anúncio original.",
        features: ["Armazenamento SSD indicado: 512 GB.", "Controles e acessórios inclusos não especificados."]
    },
    {
        id: "15",
        name: "PlayStation 5",
        brand: "Sony",
        price: 3799.90,
        oldPrice: 4299.90,
        image: "assets/images/products/gaming/playstation-5.jpg",
        category: "Games",
        icon: "🎮",
        description: "Console PlayStation 5 para jogos. A edição, armazenamento e itens inclusos não foram especificados; confira o anúncio original.",
        features: ["Console da linha PlayStation 5.", "Edição, armazenamento e acessórios não especificados."]
    },
    {
        id: "16",
        name: "Notebook 15 para estudos e trabalho",
        brand: "all",
        price: 2899.90,
        oldPrice: 3299.90,
        image: "assets/images/products/computers/notebook-dell.jpg",
        category: "Informática",
        icon: "💻",
        description: "Notebook Dell para estudos, trabalho e tarefas diárias. Consulte o anúncio original para confirmar processador, memória, armazenamento e tela.",
        features: ["Notebook da marca Dell.", "Processador, memória, armazenamento e tela não especificados."]
    },
    {
        id: "17",
        name: "Notebook Air 13",
        brand: "Apple",
        price: 6499.90,
        oldPrice: 7199.90,
        image: "assets/images/products/computers/notebook-ultrabook.jpg",
        category: "Informática",
        icon: "💻",
        description: "Notebook ultrafino de 13 polegadas para produtividade e mobilidade. Confirme modelo, processador, memória e armazenamento no anúncio original.",
        features: ["Tela indicada: 13 polegadas.", "Processador, memória e armazenamento não especificados."]
    },
    {
        id: "18",
        name: "Headphone Bluetooth over-ear",
        brand: "all",
        price: 449.90,
        oldPrice: 599.90,
        image: "assets/images/products/audio/headphone-sem-fio.jpg",
        category: "Fones de Ouvido",
        icon: "🎧",
        description: "Headphone Bluetooth over-ear para música e chamadas. Consulte as informações do anúncio original para confirmar autonomia, conexões e compatibilidade.",
        features: ["Formato over-ear e conexão Bluetooth, conforme o nome do produto.", "Autonomia, microfone e recursos adicionais não especificados."]
    },
    {
        id: "19",
        name: "Fone Bluetooth compacto",
        brand: "all",
        price: 249.90,
        oldPrice: 329.90,
        image: "assets/images/products/audio/earbuds.jpg",
        category: "Fones de Ouvido",
        icon: "🎧",
        description: "Fone Bluetooth compacto com estojo de carregamento. Consulte o anúncio original para confirmar autonomia, controles e compatibilidade.",
        features: ["Formato compacto Bluetooth com estojo, conforme a imagem.", "Autonomia e recursos do modelo não especificados."]
    },
    {
        id: "20",
        name: "Câmera Canon EOS Rebel",
        brand: "Canon",
        price: 3299.90,
        oldPrice: 3799.90,
        image: "assets/images/products/cameras/camera-compacta.jpg",
        category: "Câmeras",
        icon: "📷",
        description: "Câmera Canon identificada como EOS Rebel nas imagens. Confira a versão exata, lente e acessórios incluídos antes de comprar.",
        features: ["Linha EOS Rebel, conforme identificação do produto.", "Versão, lente e acessórios não especificados."]
    },
    {
        id: "21",
        name: "Câmera mirrorless Canon",
        brand: "Canon",
        price: 5299.90,
        oldPrice: 5999.90,
        image: "assets/images/products/cameras/camera-mirrorless.jpg",
        category: "Câmeras",
        icon: "📷",
        description: "Câmera mirrorless Canon para fotografia e vídeo. Consulte o anúncio original para confirmar o modelo, a lente e os acessórios incluídos.",
        features: ["Sistema mirrorless, conforme a identificação do produto.", "Modelo, lente e acessórios não especificados."]
    },
    {
        id: "22",
        name: "Smartwatch esportivo",
        brand: "all",
        price: 1299.90,
        oldPrice: 1599.90,
        image: "assets/images/products/wearables/smartwatch-sport.jpg",
        category: "Smartwatches",
        icon: "⌚",
        description: "Smartwatch esportivo para acompanhar atividades e notificações. Confirme compatibilidade, sensores e autonomia da versão antes de comprar.",
        features: ["Categoria esportiva, conforme o nome do produto.", "Sensores, autonomia e compatibilidade não especificados."]
    },
    {
        id: "23",
        name: "iPhone Pro 128GB",
        brand: "Apple",
        price: 4499.90,
        oldPrice: 4999.90,
        image: "assets/images/products/phones/iphone-modelo.jpg",
        category: "Celulares",
        icon: "📱",
        description: "Smartphone Apple com 128 GB de armazenamento, conforme o nome do produto. Confirme a geração, condição e especificações da unidade.",
        features: ["Armazenamento indicado: 128 GB.", "Geração e condição do aparelho não especificadas."]
    },
    {
        id: "24",
        name: "Redmi Watch 6",
        brand: "Xiaomi",
        price: 599.90,
        oldPrice: 749.90,
        image: "assets/images/products/wearables/redmi-watch-6/imagem 1 Redmi Watch 6 .webp",
        images: [
            "assets/images/products/wearables/redmi-watch-6/imagem 1 Redmi Watch 6 .webp",
            "assets/images/products/wearables/redmi-watch-6/imagem 2 Redmi Watch 6.webp",
            "assets/images/products/wearables/redmi-watch-6/imagem 3Redmi Watch 6.webp",
            "assets/images/products/wearables/redmi-watch-6/imagem 4 Redmi Watch 6.webp",
            "assets/images/products/wearables/redmi-watch-6/imagem 5 Redmi Watch 6.webp",
            "assets/images/products/wearables/redmi-watch-6/imagem 6 Redmi Watch 6.webp",
            "assets/images/products/wearables/redmi-watch-6/imagem 7 Redmi Watch 6 .webp"
        ],
        category: "Smartwatches",
        icon: "⌚",
        description: "Relógio inteligente apresentado nas imagens enviadas. Consulte a compatibilidade e as especificações completas do modelo antes de comprar.",
        features: ["Imagens ilustrativas; confirme a versão, compatibilidade e recursos do modelo."]
    },
    {
        id: "25",
        name: "Echo Dot com Alexa",
        brand: "Amazon",
        price: 449.90,
        oldPrice: 549.90,
        image: "assets/images/products/smart-home/echo-dot/imagem 1 Alexa Echo Dot.webp",
        images: [
            "assets/images/products/smart-home/echo-dot/imagem 1 Alexa Echo Dot.webp",
            "assets/images/products/smart-home/echo-dot/imagem 2 Alexa Echo Dot .webp",
            "assets/images/products/smart-home/echo-dot/imagem 3 Alexa Echo Dot .webp",
            "assets/images/products/smart-home/echo-dot/imagem 4 Alexa Echo Dot .webp",
            "assets/images/products/smart-home/echo-dot/imagem 5 Alexa Echo Dot .webp",
            "assets/images/products/smart-home/echo-dot/imagem 6 Alexa Echo Dot .webp"
        ],
        category: "Casa inteligente",
        icon: "🔊",
        description: "Alto-falante inteligente com Alexa para comandos de voz, música e tarefas do dia a dia. Confira nas imagens exemplos de uso.",
        features: ["Assistente de voz Alexa", "Exemplos de comandos de voz ilustrados nas imagens."]
    },
    {
        id: "26",
        name: "JBL Party — caixa de som",
        brand: "JBL",
        price: 2499.90,
        oldPrice: 2999.90,
        image: "assets/images/products/audio/jbl-party/imagem 1 Jbl Party.webp",
        images: [
            "assets/images/products/audio/jbl-party/imagem 1 Jbl Party.webp",
            "assets/images/products/audio/jbl-party/imagem 2 Jbl Party.webp",
            "assets/images/products/audio/jbl-party/imagem 3 Jbl Party.webp",
            "assets/images/products/audio/jbl-party/imagem 4 Jbl Party.webp",
            "assets/images/products/audio/jbl-party/imagem 5 jbl Party.webp",
            "assets/images/products/audio/jbl-party/imagem 6 Jbl Party.webp"
        ],
        category: "Áudio",
        icon: "🔊",
        description: "Caixa de som JBL para animar encontros e eventos. Uma das imagens informa dois woofers de 6,5 polegadas e dois tweeters de 25 mm; confirme o modelo exato antes da compra.",
        features: ["2 woofers de 6,5 pol. e 2 tweeters de 25 mm, conforme a imagem enviada", "Iluminação integrada visível nas imagens."]
    },
    {
        id: "27",
        name: "GPD WIN Max 2 (2025)",
        brand: "GPD",
        price: 6999.90,
        oldPrice: 7999.90,
        image: "assets/images/products/gaming/handheld-pc/imagem 1 mini notebook gamer.webp",
        images: [
            "assets/images/products/gaming/handheld-pc/imagem 1 mini notebook gamer.webp",
            "assets/images/products/gaming/handheld-pc/imagem 2 mini notebook gamer .webp",
            "assets/images/products/gaming/handheld-pc/imagem 3 mini notebook gamer .webp",
            "assets/images/products/gaming/handheld-pc/imagem 4 mini notebook gamer .webp",
            "assets/images/products/gaming/handheld-pc/imagem 5mini notebook gamer .webp",
            "assets/images/products/gaming/handheld-pc/imagem 6 mini notebook gamer .webp"
        ],
        category: "Games",
        icon: "🎮",
        description: "PC portátil para jogos identificado nas imagens como GPD WIN Max 2 (2025), com controles integrados e teclado. As imagens não confirmam a configuração de memória ou armazenamento.",
        features: ["Formato portátil com controles integrados", "Configuração técnica não especificada nas imagens."]
    },
    {
        id: "28",
        name: "Monitor portátil touchscreen 18,5 pol.",
        brand: "UPERFECT",
        price: 1499.90,
        oldPrice: 1799.90,
        image: "assets/images/products/computers/portable-monitor/Imagem 3 Monitor portatil.webp",
        images: [
            "assets/images/products/computers/portable-monitor/Imagem 3 Monitor portatil.webp",
            "assets/images/products/computers/portable-monitor/Imagem 1 Monitor portatil.webp",
            "assets/images/products/computers/portable-monitor/Imagem 2 Monitor portatil.webp",
            "assets/images/products/computers/portable-monitor/Imagem 4 Monitor portatil.webp",
            "assets/images/products/computers/portable-monitor/Imagem 5 Monitor portatil.webp",
            "assets/images/products/computers/portable-monitor/Imagem 6 Monitor portatil.webp"
        ],
        category: "Monitores",
        icon: "🖥️",
        description: "Monitor portátil touchscreen. As imagens informam tela de 18,5 polegadas, proporção 16:9, taxa de 120 Hz e FreeSync; confirme compatibilidade e conexões do modelo.",
        features: ["Tela de 18,5 pol. e proporção 16:9", "120 Hz e AMD FreeSync, conforme a imagem enviada", "Touchscreen; cabos e acessórios aparecem nas imagens."]
    },
    {
        id: "29",
        name: "Lixeira inteligente automática",
        brand: "all",
        price: 399.90,
        oldPrice: 499.90,
        image: "assets/images/products/smart-home/smart-bin/imagem 1 lixeira inteligente.webp",
        images: [
            "assets/images/products/smart-home/smart-bin/imagem 1 lixeira inteligente.webp",
            "assets/images/products/smart-home/smart-bin/imagem 2 lixeira inteligente.webp",
            "assets/images/products/smart-home/smart-bin/imagem 3 lixeira inteligente.webp",
            "assets/images/products/smart-home/smart-bin/imagem 4 lixeira inteligente.webp",
            "assets/images/products/smart-home/smart-bin/imagem 5 lixeira inteligente.webp"
        ],
        category: "Casa inteligente",
        icon: "🗑️",
        description: "Lixeira inteligente para a casa. As imagens mostram abertura automatizada; confira dimensões, alimentação e funcionamento do modelo antes da compra.",
        features: ["Abertura automatizada ilustrada", "Dimensões e alimentação não informadas nas imagens."]
    },
    {
        id: "30",
        name: "Robô aspirador",
        brand: "all",
        price: 1299.90,
        oldPrice: 1599.90,
        image: "assets/images/products/smart-home/robot-vacuum/imagem 1  robo aspirador.webp",
        images: [
            "assets/images/products/smart-home/robot-vacuum/imagem 1  robo aspirador.webp",
            "assets/images/products/smart-home/robot-vacuum/imagem 2 robo Aspirador.webp",
            "assets/images/products/smart-home/robot-vacuum/Imagem 3 Robo Aspirador.webp",
            "assets/images/products/smart-home/robot-vacuum/imagem 4 robo Aspirador.webp",
            "assets/images/products/smart-home/robot-vacuum/Imagem 5 Robo Aspirador.webp"
        ],
        category: "Casa inteligente",
        icon: "🤖",
        description: "Robô aspirador para auxiliar na limpeza da casa. Confira as imagens e confirme sensores, autonomia e funções de limpeza da versão exata.",
        features: ["Robô aspirador com sensores visíveis nas imagens", "Autonomia e funções não informadas nas imagens."]
    }
];

/**
 * Lê uma lista salva no armazenamento local e informa no console se os dados
 * existentes estiverem inválidos, em vez de ocultar silenciosamente o problema.
 */
function readStoredList(storageKey) {
    const storedValue = localStorage.getItem(storageKey);

    if (!storedValue) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(storedValue);

        if (Array.isArray(parsedValue)) {
            return parsedValue.filter((item) => {
                const isValid = typeof item === "object" && item !== null;

                if (!isValid) {
                    console.error(`Um registro inválido foi encontrado em "${storageKey}".`, item);
                }

                return isValid;
            });
        }

        console.error(`Os dados salvos em "${storageKey}" não são uma lista.`);
    } catch (error) {
        console.error(`Não foi possível ler os dados salvos em "${storageKey}".`, error);
    }

    return [];
}

/**
 * Simplifica um texto para permitir comparações sem diferenciar maiúsculas,
 * acentos ou o plural final das categorias.
 */
function normalizeText(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase()
        .replace(/ches$/, "ch")
        .replace(/s$/, "");
}

/**
 * Normaliza nomes de categoria que aparecem com variações de plural no HTML.
 */
function normalizeCategory(value) {
    const normalizedCategory = normalizeText(value);
    const categoryAliases = {
        celulare: "celular",
        smartwatche: "smartwatch",
        monitore: "monitor",
        "fones de ouvido": "fone de ouvido"
    };

    return categoryAliases[normalizedCategory] ?? normalizedCategory;
}

/**
 * Extrai do card as informações necessárias para salvar um produto no carrinho
 * ou nos favoritos.
 */
function getProductData(productCard) {
    const priceText = productCard.querySelector(".price")?.textContent ?? "";
    const numericPrice = Number(priceText.replace(/[^\d,]/g, "").replace(",", "."));
    const image = productCard.querySelector(".product-image img")?.getAttribute("src") ?? "";

    return {
        id: productCard.dataset.id,
        name: productCard.querySelector(".product-name")?.textContent.trim() ?? "",
        category: productCard.querySelector(".product-category")?.textContent.trim() ?? "",
        price: numericPrice,
        image,
        images: productCard.dataset.gallery?.split("|").filter(Boolean) ?? (image ? [image] : []),
        features: productCard.dataset.features?.split("|").filter(Boolean)
            ?? PRODUCT_FEATURES[productCard.dataset.id]
            ?? [],
        icon: productCard.querySelector(".product-placeholder")?.textContent.trim() ?? "",
        description: productCard.dataset.description
            ?? PRODUCT_DESCRIPTIONS[productCard.dataset.id]
            ?? `${productCard.querySelector(".product-name")?.textContent.trim() ?? "Produto"} com especificações conforme o modelo. Foto ilustrativa.`,
        quantity: 1
    };
}

/**
 * Associa uma foto local ao card e conserva o ícone como fallback se o arquivo
 * não puder ser exibido.
 */
function setProductPhoto(productCard, imagePath) {
    const imageContainer = productCard.querySelector(".product-image");
    const placeholder = imageContainer?.querySelector(".product-placeholder");

    if (!imageContainer || !placeholder) {
        return;
    }

    const image = document.createElement("img");
    image.src = imagePath;
    image.alt = productCard.querySelector(".product-name")?.textContent.trim() ?? "Produto eletrônico";
    image.loading = "lazy";
    image.addEventListener("error", () => {
        image.remove();
        placeholder.hidden = false;
    }, { once: true });
    placeholder.hidden = true;
    imageContainer.appendChild(image);
}

/**
 * Cria os cards adicionais do catálogo usando o mesmo formato dos botões
 * existentes de favoritos, detalhes e carrinho.
 */
function addAdditionalProducts() {
    const productsContainer = document.getElementById("products");

    if (!productsContainer) {
        return;
    }

    EXTRA_PRODUCTS.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product";
        card.dataset.id = product.id;
        card.dataset.brand = product.brand;
        card.dataset.description = product.description;
        card.dataset.gallery = (product.images ?? [product.image]).join("|");
        card.dataset.features = (product.features ?? []).join("|");
        if (product.id === "14") {
            card.id = "games";
        }

        const imageContainer = document.createElement("div");
        imageContainer.className = "product-image";

        const discount = document.createElement("span");
        discount.className = "discount";
        discount.textContent = `-${Math.round((1 - product.price / product.oldPrice) * 100)}%`;

        const favoriteButton = document.createElement("button");
        favoriteButton.className = "favorite";
        favoriteButton.type = "button";
        favoriteButton.dataset.favorite = product.id;
        favoriteButton.setAttribute("aria-label", `Favoritar ${product.name}`);
        favoriteButton.textContent = "♡";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = `${product.name} - foto ilustrativa`;
        image.loading = "lazy";

        const placeholder = document.createElement("span");
        placeholder.className = "product-placeholder";
        placeholder.setAttribute("aria-hidden", "true");
        placeholder.textContent = product.icon ?? "📱";
        placeholder.hidden = true;

        image.addEventListener("error", () => {
            image.remove();
            placeholder.hidden = false;
        }, { once: true });

        imageContainer.append(discount, favoriteButton, image, placeholder);

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("div");
        category.className = "product-category";
        category.textContent = product.category ?? "Celulares";

        const name = document.createElement("div");
        name.className = "product-name";
        name.textContent = product.name;

        const rating = document.createElement("div");
        rating.className = "rating";
        rating.textContent = "★★★★★";
        rating.setAttribute("aria-label", "Avaliação demonstrativa: 5 de 5");

        const oldPrice = document.createElement("div");
        oldPrice.className = "price-old";
        oldPrice.textContent = formatProductPrice(product.oldPrice);

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = formatProductPrice(product.price);

        const addButton = document.createElement("button");
        addButton.className = "add-cart";
        addButton.type = "button";
        addButton.dataset.add = product.id;
        addButton.textContent = "Adicionar ao Carrinho";

        info.append(category, name, rating, oldPrice, price, addButton);
        card.append(imageContainer, info);
        productsContainer.appendChild(card);
    });

    productsContainer.querySelectorAll(".product").forEach((card) => {
        const productId = card.dataset.id;

        if (!card.dataset.gallery) {
            const photo = card.querySelector(".product-image img")?.getAttribute("src")
                ?? PRODUCT_PHOTOS[productId];
            card.dataset.gallery = photo ?? "";
        }
        if (!card.dataset.features && PRODUCT_FEATURES[productId]) {
            card.dataset.features = PRODUCT_FEATURES[productId].join("|");
        }
        if (!card.querySelector(".product-image img") && PRODUCT_PHOTOS[productId]) {
            setProductPhoto(card, PRODUCT_PHOTOS[productId]);
        }
    });
}

/**
 * Formata o preço de cada novo item do catálogo no padrão monetário brasileiro.
 */
function formatProductPrice(price) {
    return Number(price).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/**
 * Mostra somente os produtos que correspondem à categoria selecionada e ao
 * texto digitado na busca, atualizando também a mensagem de resultados.
 */
function applyProductFilters() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = normalizeText(searchInput?.value ?? "");
    const productCards = document.querySelectorAll("#products .product");
    let visibleCount = 0;

    productCards.forEach((productCard) => {
        const name = normalizeText(productCard.querySelector(".product-name")?.textContent ?? "");
        const category = normalizeCategory(productCard.querySelector(".product-category")?.textContent ?? "");
        const searchableText = normalizeText([
            name,
            category,
            productCard.dataset.brand ?? "",
            productCard.dataset.description ?? "",
            productCard.dataset.features ?? ""
        ].join(" "));
        const price = Number(
            productCard.querySelector(".price")?.textContent
                .replace(/[^\d,]/g, "")
                .replace(",", ".") ?? 0
        );
        const matchesCategory = activeCategory === "todos"
            || category === normalizeCategory(activeCategory);
        const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
        const matchesPrice = activePriceRange === "all"
            || (activePriceRange === "3000+" && price > 3000)
            || activePriceRange.split("-").length === 2
                && price >= Number(activePriceRange.split("-")[0])
                && price <= Number(activePriceRange.split("-")[1]);
        const productBrand = productCard.dataset.brand ?? "all";
        const matchesBrand = activeBrand === "all"
            || normalizeText(productBrand) === normalizeText(activeBrand);
        const isVisible = matchesCategory && matchesSearch && matchesPrice && matchesBrand;

        productCard.hidden = !isVisible;
        visibleCount += Number(isVisible);
    });

    const productsContainer = document.getElementById("products");

    if (productsContainer) {
        const sortedCards = [...productCards].sort((firstCard, secondCard) => {
            const firstPrice = Number(firstCard.querySelector(".price")?.textContent.replace(/[^\d,]/g, "").replace(",", ".") ?? 0);
            const secondPrice = Number(secondCard.querySelector(".price")?.textContent.replace(/[^\d,]/g, "").replace(",", ".") ?? 0);
            const firstName = firstCard.querySelector(".product-name")?.textContent.trim() ?? "";
            const secondName = secondCard.querySelector(".product-name")?.textContent.trim() ?? "";

            if (activeSort === "price-asc") return firstPrice - secondPrice;
            if (activeSort === "price-desc") return secondPrice - firstPrice;
            if (activeSort === "name") return firstName.localeCompare(secondName, "pt-BR");
            return Number(firstCard.dataset.id) - Number(secondCard.dataset.id);
        });

        sortedCards.forEach((card) => productsContainer.appendChild(card));
    }

    const resultsMessage = document.getElementById("resultsMessage");

    if (resultsMessage) {
        resultsMessage.textContent = searchTerm && visibleCount === 0
            ? `Nenhum produto encontrado para “${searchInput?.value.trim() ?? ""}”.`
            : visibleCount === 1
                ? "1 produto encontrado."
                : `${visibleCount} produtos encontrados.`;
    }
}

/**
 * Executa uma busca global no catálogo, removendo filtros de categoria,
 * fabricante e preço que poderiam esconder correspondências.
 */
function searchStoreProducts(searchTerm) {
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.value = searchTerm;
    }

    activeCategory = "todos";
    activeBrand = "all";
    activePriceRange = "all";

    const brandSelect = document.getElementById("productBrand");
    const priceSelect = document.getElementById("productPrice");
    if (brandSelect) {
        brandSelect.value = "all";
    }
    if (priceSelect) {
        priceSelect.value = "all";
    }

    const allProductsButton = document.querySelector('.filter-chip[data-filter="todos"]');
    if (allProductsButton) {
        allProductsButton.click();
    } else {
        applyProductFilters();
    }
}

/**
 * Aplica os detalhes do produto selecionado no modal de compra e recomenda
 * itens relacionados pela categoria atual.
 */
function openProductDetails(productCard) {
    const dialog = document.getElementById("productDialog");

    if (!dialog || !productCard) {
        return;
    }

    const product = getProductData(productCard);
    selectedProductId = product.id;

    const title = document.getElementById("productDialogTitle");
    const category = document.getElementById("productDialogCategory");
    const description = document.getElementById("productDialogDescription");
    const rating = document.getElementById("productDialogRating");
    const price = document.getElementById("productDialogPrice");
    const imageContainer = document.getElementById("productDialogImage");
    const gallery = document.getElementById("productDialogGallery");
    const features = document.getElementById("productDialogFeatures");
    const image = document.createElement("img");
    const productImages = product.images.length ? product.images : product.image ? [product.image] : [];

    title.textContent = product.name;
    category.textContent = product.category;
    description.textContent = product.description;
    rating.textContent = "★★★★★ Avaliações demonstrativas";
    price.textContent = formatProductPrice(product.price);
    image.alt = `${product.name} - foto ilustrativa`;
    imageContainer.replaceChildren();
    gallery.replaceChildren();

    if (productImages.length) {
        image.src = productImages[0];
        image.addEventListener("error", () => {
            const fallback = document.createElement("span");
            fallback.textContent = product.icon || "📦";
            fallback.setAttribute("aria-hidden", "true");
            image.replaceWith(fallback);
        }, { once: true });
        imageContainer.appendChild(image);

        productImages.forEach((imagePath, index) => {
            const thumbnail = document.createElement("button");
            thumbnail.className = "product-gallery-thumb";
            thumbnail.type = "button";
            thumbnail.dataset.image = imagePath;
            thumbnail.setAttribute("aria-label", `Ver imagem ${index + 1} de ${product.name}`);
            thumbnail.setAttribute("aria-pressed", String(index === 0));

            const thumbnailImage = document.createElement("img");
            thumbnailImage.src = imagePath;
            thumbnailImage.alt = "";
            thumbnailImage.loading = "lazy";
            thumbnail.appendChild(thumbnailImage);
            gallery.appendChild(thumbnail);
        });
        gallery.hidden = productImages.length < 2;
    } else {
        const icon = document.createElement("span");
        icon.textContent = product.icon || "📦";
        icon.setAttribute("aria-hidden", "true");
        imageContainer.appendChild(icon);
        gallery.hidden = true;
    }

    features.replaceChildren();
    product.features.forEach((featureText) => {
        const feature = document.createElement("li");
        feature.textContent = featureText;
        features.appendChild(feature);
    });
    features.hidden = product.features.length === 0;

    dialog.showModal();
}

/**
 * Abre os detalhes de um produto a partir do botão correspondente no card.
 */
function handleProductListClick(event) {
    const addButton = event.target.closest("[data-add]");
    const favoriteButton = event.target.closest("[data-favorite]");
    const detailButton = event.target.closest("[data-product-details]");
    const productCard = event.target.closest(".product");

    if (addButton) {
        const card = addButton.closest(".product");

        if (card) {
            addProductToCart(card);
            const originalText = addButton.textContent;
            addButton.textContent = "Adicionado ao carrinho";
            window.setTimeout(() => {
                addButton.textContent = originalText;
            }, 1200);
        }
    } else if (favoriteButton) {
        toggleFavorite(favoriteButton);
    } else if (detailButton) {
        openProductDetails(detailButton.closest(".product"));
    } else if (productCard) {
        openProductDetails(productCard);
    }
}

/**
 * Abre os detalhes do card focado usando Enter ou Espaço no teclado.
 */
function handleProductListKeydown(event) {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }

    const productCard = event.target.closest(".product");

    if (productCard && event.target === productCard) {
        event.preventDefault();
        openProductDetails(productCard);
    }
}

/**
 * Adiciona um item ao carrinho diretamente pelo modal de detalhes.
 */
function addProductFromDialog() {
    const productCard = document.querySelector(`#products [data-id="${CSS.escape(selectedProductId ?? "")}"]`);

    if (productCard) {
        addProductToCart(productCard);
        const dialogButton = document.getElementById("productDialogAdd");
        dialogButton.textContent = "Adicionado ao carrinho";
        window.setTimeout(() => {
            dialogButton.textContent = "Adicionar ao Carrinho";
        }, 1200);
    }
}

/**
 * Adiciona botões de detalhes aos cards estáticos e registra todos os filtros
 * adicionais do catálogo.
 */
function initializeCatalogControls() {
    const productsContainer = document.getElementById("products");

    productsContainer?.querySelectorAll(".product-info").forEach((info) => {
        if (info.querySelector("[data-product-details]")) {
            return;
        }

        const detailsButton = document.createElement("button");
        detailsButton.className = "details-button";
        detailsButton.type = "button";
        detailsButton.dataset.productDetails = "";
        detailsButton.textContent = "Ver detalhes";
        info.appendChild(detailsButton);
    });

    productsContainer?.querySelectorAll(".product").forEach((card) => {
        const productName = card.querySelector(".product-name")?.textContent.trim() ?? "produto";
        card.tabIndex = 0;
        card.setAttribute("aria-label", `Ver detalhes de ${productName}`);
        card.setAttribute("aria-haspopup", "dialog");
    });

    productsContainer?.addEventListener("click", handleProductListClick);
    productsContainer?.addEventListener("keydown", handleProductListKeydown);

    document.getElementById("productSort")?.addEventListener("change", (event) => {
        activeSort = event.currentTarget.value;
        applyProductFilters();
    });

    document.getElementById("productPrice")?.addEventListener("change", (event) => {
        activePriceRange = event.currentTarget.value;
        applyProductFilters();
    });

    document.getElementById("productBrand")?.addEventListener("change", (event) => {
        activeBrand = event.currentTarget.value;
        applyProductFilters();
    });

    document.getElementById("productDialogAdd")?.addEventListener("click", addProductFromDialog);
    document.getElementById("productDialogGallery")?.addEventListener("click", (event) => {
        const thumbnail = event.target.closest(".product-gallery-thumb");

        if (!thumbnail) {
            return;
        }

        const mainImage = document.querySelector("#productDialogImage img");

        if (mainImage) {
            mainImage.src = thumbnail.dataset.image;
            mainImage.alt = `${document.getElementById("productDialogTitle").textContent} - foto ilustrativa`;
        }

        document.querySelectorAll(".product-gallery-thumb").forEach((button) => {
            button.setAttribute("aria-pressed", String(button === thumbnail));
        });
    });
    document.querySelector(".dialog-close")?.addEventListener("click", () => {
        document.getElementById("productDialog")?.close();
    });

    document.getElementById("productDialog")?.addEventListener("click", (event) => {
        if (event.target === event.currentTarget) {
            event.currentTarget.close();
        }
    });
}

/**
 * Faz a navegação principal filtrar a categoria correspondente ao link clicado.
 */
function handlePrimaryCategoryNavigation(event) {
    const link = event.target.closest("a[href^='#']");
    const productId = link?.dataset.navProduct;

    if (productId) {
        event.preventDefault();
        const searchInput = document.getElementById("searchInput");
        const allProductsButton = document.querySelector('.filter-chip[data-filter="todos"]');
        const productCard = document.querySelector(`#products [data-id="${CSS.escape(productId)}"]`);

        if (searchInput) {
            searchInput.value = "";
        }

        activeBrand = "all";
        activePriceRange = "all";
        document.getElementById("productBrand").value = "all";
        document.getElementById("productPrice").value = "all";
        allProductsButton?.click();

        if (productCard) {
            productCard.scrollIntoView({ behavior: "smooth", block: "center" });
            openProductDetails(productCard);
        }
        return;
    }

    const categoryByAnchor = {
        celulares: "Celulares",
        notebooks: "Informática",
        games: "Games",
        audio: "Áudio",
        ofertas: "todos"
    };
    const anchor = link?.getAttribute("href").slice(1);
    const categoryFilter = categoryByAnchor[anchor];

    if (!categoryFilter) {
        return;
    }

    const filterButton = [...document.querySelectorAll(".filter-chip")]
        .find((button) => normalizeCategory(button.dataset.filter ?? "") === normalizeCategory(categoryFilter));

    if (filterButton) {
        const searchInput = document.getElementById("searchInput");

        if (searchInput) {
            searchInput.value = "";
        }

        document.getElementById("productBrand").value = "all";
        document.getElementById("productPrice").value = "all";
        activeBrand = "all";
        activePriceRange = "all";
        filterButton.click();
    }
}

/**
 * Executa a busca solicitada pelo botão de pesquisa ou pela tecla Enter.
 */
function searchProducts() {
    applyProductFilters();
    document.getElementById("productsSection")?.scrollIntoView({ behavior: "smooth" });
}

/**
 * Abre a página de favoritos, onde o usuário pode consultar os itens salvos.
 */
function openFavorites() {
    window.location.href = "favorite.html";
}

/**
 * Atualiza o contador do cabeçalho com a soma das quantidades salvas no carrinho.
 */
function updateCartCount() {
    const cartItems = readStoredList(CART_STORAGE_KEY);
    const itemCount = cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);

    document.querySelectorAll(".cart-count").forEach((counter) => {
        counter.textContent = String(itemCount);
    });
}

/**
 * Adiciona um produto ao carrinho ou aumenta sua quantidade se ele já estiver
 * salvo, persistindo a lista e atualizando o contador da página.
 */
function addProductToCart(productCard) {
    const product = getProductData(productCard);
    const cartItems = readStoredList(CART_STORAGE_KEY);
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 0) + 1;
    } else {
        cartItems.push(product);
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    updateCartCount();
}

/**
 * Alterna o estado de favorito do produto, salvando ou removendo seus dados no
 * armazenamento local e refletindo a mudança no botão.
 */
function toggleFavorite(button) {
    const productCard = button.closest(".product");

    if (!productCard) {
        return;
    }

    const product = getProductData(productCard);
    const favorites = readStoredList(FAVORITES_STORAGE_KEY);
    const favoriteIndex = favorites.findIndex((item) => item.id === product.id);
    const isFavorite = favoriteIndex === -1;

    if (isFavorite) {
        favorites.push(product);
    } else {
        favorites.splice(favoriteIndex, 1);
    }

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    updateFavoriteButton(button, isFavorite);
}

/**
 * Apresenta visualmente se um produto está favoritado e atualiza sua descrição
 * acessível para leitores de tela.
 */
function updateFavoriteButton(button, isFavorite) {
    const productName = button.closest(".product")
        ?.querySelector(".product-name")?.textContent.trim() ?? "produto";

    button.textContent = isFavorite ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute(
        "aria-label",
        `${isFavorite ? "Remover dos favoritos" : "Favoritar"} ${productName}`
    );
}

/**
 * Restaura o estado visual dos botões de favoritos ao carregar a página.
 */
function restoreFavoriteButtons() {
    const favoriteIds = new Set(
        readStoredList(FAVORITES_STORAGE_KEY).map((item) => String(item.id))
    );

    document.querySelectorAll("#products .favorite").forEach((button) => {
        updateFavoriteButton(button, favoriteIds.has(button.dataset.favorite));
    });
}

/**
 * Mostra uma resposta informativa para o código digitado; a consulta real
 * depende da integração futura com um serviço de rastreamento.
 */
function handleTrackingSubmit(event) {
    event.preventDefault();

    const trackingInput = document.getElementById("trackingInput");
    const trackingResult = document.getElementById("trackingResult");
    const trackingCode = trackingInput?.value.trim() ?? "";

    if (!trackingCode || !trackingResult) {
        return;
    }

    const orders = readStoredList(ORDERS_STORAGE_KEY);
    const matchingOrder = orders.find(
        (order) => String(order.code).toLowerCase() === trackingCode.toLowerCase()
    );

    trackingResult.replaceChildren();

    if (!matchingOrder) {
        trackingResult.textContent = "Não encontramos esse código entre os pedidos de demonstração deste navegador.";
        trackingResult.hidden = false;
        return;
    }

    const orderTitle = document.createElement("strong");
    orderTitle.textContent = `Pedido ${matchingOrder.code} confirmado`;

    const orderStatus = document.createElement("p");
    orderStatus.textContent = "Status atual: pedido registrado neste protótipo. Não houve cobrança nem envio real.";

    const orderDate = document.createElement("p");
    orderDate.textContent = `Data do registro: ${new Date(matchingOrder.createdAt).toLocaleString("pt-BR")}`;

    trackingResult.append(orderTitle, orderStatus, orderDate);
    trackingResult.hidden = false;
}

/**
 * Informa que as opções de atendimento ainda precisam ser conectadas a um
 * canal de suporte real.
 */
function handleSupportClick(event) {
    const supportType = event.currentTarget.dataset.support;
    const supportTopics = {
        chat: "duvida",
        troca: "troca",
        pagamento: "pagamento",
        pedido: "pedido"
    };
    const supportTopic = document.getElementById("supportTopic");
    const supportForm = document.getElementById("supportForm");

    if (supportTopic && supportTopics[supportType]) {
        supportTopic.value = supportTopics[supportType];
        supportForm?.scrollIntoView({ behavior: "smooth", block: "center" });
        supportForm?.querySelector("input")?.focus({ preventScroll: true });
    }
}

/**
 * Mostra os protocolos registrados localmente neste navegador.
 */
function renderSupportTickets() {
    const ticketList = document.getElementById("supportTicketList");

    if (!ticketList) {
        return;
    }

    const tickets = readStoredList(SUPPORT_TICKETS_STORAGE_KEY);
    const topicLabels = {
        duvida: "Dúvida geral",
        pedido: "Pedido e entrega",
        troca: "Troca e devolução",
        pagamento: "Pagamento",
        produto: "Produto"
    };
    ticketList.replaceChildren();

    if (!tickets.length) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "support-empty";
        emptyMessage.textContent = "Nenhuma solicitação registrada neste navegador.";
        ticketList.appendChild(emptyMessage);
        return;
    }

    tickets.slice().reverse().forEach((ticket) => {
        const item = document.createElement("article");
        item.className = "support-ticket";

        const title = document.createElement("strong");
        title.textContent = `${ticket.protocol} · ${topicLabels[ticket.subject] ?? "Atendimento"}`;

        const date = document.createElement("p");
        date.textContent = `Registrado em ${new Date(ticket.createdAt).toLocaleString("pt-BR")}`;

        const state = document.createElement("span");
        state.className = "support-ticket-status";
        state.textContent = "Salvo neste navegador";

        item.append(title, date, state);
        ticketList.appendChild(item);
    });
}

/**
 * Registra uma solicitação de demonstração no navegador e informa seu protocolo.
 * O registro não é enviado para uma equipe sem integração de backend.
 */
function handleSupportFormSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const result = document.getElementById("supportResult");
    const formData = new FormData(form);
    const ticket = {
        protocol: `NS-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        subject: String(formData.get("topic") ?? ""),
        order: String(formData.get("order") ?? "").trim(),
        message: String(formData.get("message") ?? "").trim(),
        createdAt: new Date().toISOString()
    };

    if (!result) {
        return;
    }

    try {
        const tickets = readStoredList(SUPPORT_TICKETS_STORAGE_KEY);
        tickets.push(ticket);
        localStorage.setItem(SUPPORT_TICKETS_STORAGE_KEY, JSON.stringify(tickets));
        result.textContent = `Solicitação ${ticket.protocol} registrada neste navegador. Ela não foi enviada à equipe; conecte um serviço de atendimento para receber respostas.`;
        result.dataset.state = "success";
        result.hidden = false;
        form.reset();
        renderSupportTickets();
    } catch (error) {
        console.error("Não foi possível salvar a solicitação de atendimento.", error);
        result.textContent = "Não foi possível salvar a solicitação neste navegador. Verifique o espaço disponível e as permissões de armazenamento.";
        result.dataset.state = "error";
        result.hidden = false;
    }
}

/**
 * Filtra perguntas frequentes pelo texto digitado.
 */
function initializeSupportCenter() {
    document.getElementById("supportForm")?.addEventListener("submit", handleSupportFormSubmit);
    renderSupportTickets();

    const search = document.getElementById("supportFaqSearch");
    const faqItems = [...document.querySelectorAll(".support-faq details")];
    const emptyMessage = document.getElementById("supportFaqEmpty");

    search?.addEventListener("input", () => {
        const query = normalizeText(search.value);
        let visibleCount = 0;

        faqItems.forEach((item) => {
            const matches = normalizeText(item.textContent ?? "").includes(query);
            item.hidden = !matches;
            visibleCount += Number(matches);
        });

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount > 0;
        }
    });
}

/**
 * Conecta os benefícios a recursos existentes e informativos da página.
 */
function initializeBenefits() {
    const benefitActions = {
        shipping: () => {
            document.getElementById("trackingForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
            document.getElementById("trackingInput")?.focus({ preventScroll: true });
        },
        security: () => openBenefitFaq("security"),
        payment: () => openBenefitFaq("payment"),
        exchange: () => {
            const topic = document.getElementById("supportTopic");
            const form = document.getElementById("supportForm");

            if (topic && form) {
                topic.value = "troca";
                form.scrollIntoView({ behavior: "smooth", block: "center" });
                form.querySelector("input")?.focus({ preventScroll: true });
            }
        }
    };

    document.querySelectorAll("[data-benefit]").forEach((benefit) => {
        benefit.addEventListener("click", () => {
            benefitActions[benefit.dataset.benefit]?.();
        });
    });
}

/**
 * Abre a resposta frequente correspondente ao benefício e a traz à tela.
 */
function openBenefitFaq(topic) {
    const faq = document.querySelector(`.support-faq [data-benefit-faq="${topic}"]`);
    const search = document.getElementById("supportFaqSearch");

    if (faq) {
        if (search) {
            search.value = "";
            search.dispatchEvent(new Event("input", { bubbles: true }));
        }

        faq.open = true;
        faq.scrollIntoView({ behavior: "smooth", block: "center" });
        faq.querySelector("summary")?.focus({ preventScroll: true });
    }
}

/**
 * Aplica a categoria correspondente ao cartão clicado e leva o visitante aos
 * produtos filtrados.
 */
function handleCategoryClick(event) {
    const categoryCard = event.target.closest(".category");

    if (!categoryCard) {
        return;
    }

    const categoryName = categoryCard.querySelector("span")?.textContent.trim() ?? "";
    const categoryFilters = {
        "notebook": "Informática",
        "celular": "Celulares",
        "fone de ouvido": "Fones de Ouvido",
        "audio": "Áudio",
        "smartwatch": "Smartwatches",
        "game": "Games",
        "camera": "Câmeras",
        "casa inteligente": "Casa inteligente",
        "monitore": "Monitores"
    };
    const categoryFilter = categoryFilters[normalizeCategory(categoryName)];
    const filterButton = [...document.querySelectorAll(".filter-chip")]
        .find((button) => normalizeCategory(button.dataset.filter ?? "") === normalizeCategory(categoryFilter ?? ""));

    if (filterButton) {
        const searchInput = document.getElementById("searchInput");

        if (searchInput) {
            searchInput.value = "";
        }

        filterButton.click();
        document.getElementById("productsSection")?.scrollIntoView({ behavior: "smooth" });
    }
}

/**
 * Navega horizontalmente pelas categorias e mantém acessíveis os controles
 * conforme a posição da faixa. Em telas touch, a faixa também aceita swipe.
 */
function initializeCategoryCarousel() {
    const viewport = document.getElementById("categoriesViewport");
    const scrollButtons = [...document.querySelectorAll("[data-category-scroll]")];

    if (!viewport || !scrollButtons.length) {
        return;
    }

    const updateScrollButtons = () => {
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        scrollButtons.forEach((button) => {
            const direction = Number(button.dataset.categoryScroll);
            button.disabled = direction < 0
                ? viewport.scrollLeft <= 1
                : viewport.scrollLeft >= maxScroll - 1;
        });
    };

    scrollButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const direction = Number(button.dataset.categoryScroll);
            const scrollAmount = Math.max(viewport.clientWidth * 0.8, 180) * direction;
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            viewport.scrollBy({ left: scrollAmount, behavior: reducedMotion ? "auto" : "smooth" });
        });
    });

    viewport.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    updateScrollButtons();
}

/**
 * Direciona cada banner do carrossel para os produtos relacionados.
 */
function connectCarouselLinks() {
    const carouselCategoryFilters = ["todos", "Áudio", "Fones de Ouvido", "Smartwatches", "Informática", "Games"];

    document.querySelectorAll("#carousel .slide-link").forEach((link, index) => {
        link.href = "#productsSection";
        link.addEventListener("click", () => {
            const filterValue = carouselCategoryFilters[index] ?? "todos";
            const filterButton = [...document.querySelectorAll(".filter-chip")]
                .find((button) => normalizeCategory(button.dataset.filter ?? "") === normalizeCategory(filterValue));

            filterButton?.click();
        });
    });
}

/**
 * Conecta os eventos de busca, filtros, carrinho, favoritos, rastreio e suporte
 * depois que os elementos da página já estão disponíveis.
 */
function initializeStorefront() {
    const searchInput = document.getElementById("searchInput");
    const trackingForm = document.getElementById("trackingForm");
    const searchParams = new URLSearchParams(window.location.search);
    const initialSearch = searchParams.get("busca") ?? searchInput?.value.trim() ?? "";
    const initialProductId = searchParams.get("produto");
    const categoryByHash = {
        "#celulares": "Celulares",
        "#notebooks": "Informática",
        "#games": "Games",
        "#audio": "Áudio",
        "#ofertas": "todos"
    };
    const initialCategory = categoryByHash[window.location.hash];

    if (initialSearch && searchInput) {
        searchInput.value = initialSearch;
    }

    document.querySelector(".primary")?.addEventListener("click", handlePrimaryCategoryNavigation);
    searchInput?.addEventListener("input", applyProductFilters);

    document.querySelectorAll(".filter-chip").forEach((button) => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.filter ?? "todos";

            document.querySelectorAll(".filter-chip").forEach((chip) => {
                chip.classList.toggle("action", chip === button);
            });

            document.querySelectorAll("#categorias .category").forEach((category) => {
                const categoryName = category.querySelector("span")?.textContent.trim() ?? "";
                const categoryFilter = {
                    notebook: "Informática",
                    celular: "Celulares",
                    "fone de ouvido": "Fones de Ouvido",
                    audio: "Áudio",
                    smartwatch: "Smartwatches",
                    game: "Games",
                    camera: "Câmeras",
                    "casa inteligente": "Casa inteligente",
                    monitore: "Monitores"
                }[normalizeCategory(categoryName)];
                category.setAttribute(
                    "aria-pressed",
                    String(normalizeCategory(categoryFilter ?? "") === normalizeCategory(activeCategory))
                );
            });

            applyProductFilters();
        });
    });

    document.querySelectorAll("[data-support]").forEach((button) => {
        button.addEventListener("click", handleSupportClick);
    });

    document.querySelector(".categories")?.addEventListener("click", handleCategoryClick);
    document.querySelector(".categories")?.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            const category = event.target.closest(".category");

            if (category) {
                event.preventDefault();
                category.click();
            }
        }
    });
    trackingForm?.addEventListener("submit", handleTrackingSubmit);

    const showAllCategoriesLink = document.querySelector("#categorias .section-header a");
    showAllCategoriesLink?.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector('.filter-chip[data-filter="todos"]')?.click();
        document.getElementById("productsSection")?.scrollIntoView({ behavior: "smooth" });
    });

    const showAllProductsLink = document.querySelector("#productsSection > .section-header > a");
    showAllProductsLink?.addEventListener("click", (event) => {
        event.preventDefault();
        const allProductsButton = document.querySelector('.filter-chip[data-filter="todos"]');
        allProductsButton?.click();
        document.getElementById("productsSection")?.scrollIntoView({ behavior: "smooth" });
    });

    addAdditionalProducts();
    initializeCatalogControls();
    initializeCategoryCarousel();
    initializeSupportCenter();
    initializeBenefits();
    restoreFavoriteButtons();
    updateCartCount();
    connectCarouselLinks();

    if (initialCategory) {
        const categoryButton = [...document.querySelectorAll(".filter-chip")]
            .find((button) => normalizeCategory(button.dataset.filter ?? "") === normalizeCategory(initialCategory));
        categoryButton?.click();
    } else {
        applyProductFilters();
    }

    if (initialProductId) {
        document.querySelector(`#products [data-id="${CSS.escape(initialProductId)}"]`)
            ?.scrollIntoView({ behavior: "smooth" });
    }
}

initializeStorefront();
window.searchStoreProducts = searchStoreProducts;
