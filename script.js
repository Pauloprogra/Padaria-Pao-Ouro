// =========================================================
// 1. DADOS DE PRODUTOS (COM CATEGORIA E CAMINHOS PLANOS)
// ATENÇÃO: Se as suas imagens não forem .jpg, mude a extensão aqui!
// =========================================================

const products = [
    { 
        id: 1, 
        name: 'Pão Italiano de Fermentação Natural', 
        description: 'Massa madre pura, casca crocante e miolo úmido. Feito para durar.',
        price: 15.50, 
        imageUrl: 'pao.jpg',
        category: 'pães' // NOVO
    },
    { 
        id: 2, 
        name: 'Croissant Clássico de Manteiga', 
        description: '100% manteiga francesa, folheado perfeito com 27 camadas.',
        price: 8.90, 
        imageUrl: 'croassant.jpg',
        category: 'pães' // NOVO
    },
    { 
        id: 3, 
        name: 'Torta de Limão Gourmet', 
        description: 'Creme de limão siciliano, base amanteigada e merengue tostado.',
        price: 18.00, 
        imageUrl: 'torta-limao.webp',
        category: 'doces' // NOVO
    },
    { 
        id: 4, 
        name: 'Misto Quente Artesanal', 
        description: 'Pão de brioche, queijo minas padrão e presunto de peru.',
        price: 12.00, 
        imageUrl: 'misto.jpeg',
        category: 'lanches' // NOVO
    },
    { 
        id: 5, 
        name: 'Pão Integral Multigrãos', 
        description: 'Saboroso e saudável, repleto de sementes e grãos.',
        price: 14.00, 
        imageUrl: 'integral.jpg',
        category: 'pães' // NOVO
    },
    { 
        id: 6, 
        name: 'Bolo de Cenoura com Cobertura', 
        description: 'Fofinho, com cobertura generosa de brigadeiro. O queridinho!',
        price: 25.00, 
        imageUrl: 'cenhoura.webp',
        category: 'doces' // NOVO
    },
];

// =========================================================
// 2. FUNÇÕES DE CRIAÇÃO DE COMPONENTES (COMPONENTS)
// ... (sem alteração nas funções de componentes) ...
// =========================================================

/**
 * Cria o elemento DOM do Product Card para a Home/Menu.
 */
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    const description = product.description || 'Produto artesanal da Pão de Ouro.';
    card.setAttribute('data-product-id', product.id);

    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${description}</p>
        </div>
        <div class="product-actions">
            <span class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
            <button class="btn btn-primary btn-add-to-cart" data-id="${product.id}">
                Adicionar
            </button>
        </div>
    `;

    card.querySelector('.btn-add-to-cart').addEventListener('click', (e) => {
        e.stopPropagation(); 
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        addToCart(productId);
    });

    return card;
}

/**
 * Renderiza o elemento HTML para um item na lista do carrinho. 
 */
function createCartItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    
    const itemTotal = item.price * item.quantity;

    itemDiv.innerHTML = `
        <div class="item-info">
            <span class="item-name">${item.name}</span>
            <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')} / un</span>
        </div>
        <div class="item-controls">
            <button class="btn-icon btn-qty-minus" data-id="${item.id}">-</button>
            <span class="item-quantity" data-quantity="${item.quantity}">${item.quantity}</span>
            <button class="btn-icon btn-qty-plus" data-id="${item.id}">+</button>
            
            <span class="item-total">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
            <button class="btn-icon btn-remove" data-id="${item.id}">X</button>
        </div>
    `;

    itemDiv.querySelector('.btn-qty-plus').addEventListener('click', () => {
        updateItemQuantity(item.id, 1);
    });
    itemDiv.querySelector('.btn-qty-minus').addEventListener('click', () => {
        updateItemQuantity(item.id, -1);
    });
    itemDiv.querySelector('.btn-remove').addEventListener('click', (e) => {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        removeItemFromCart(productId);
    });

    return itemDiv;
}

/**
 * Cria o elemento HTML para o resumo de um item no painel Checkout.
 */
function createCheckoutItemSummary(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'checkout-item';
    const total = item.price * item.quantity;

    itemDiv.innerHTML = `
        <span>${item.name} (x${item.quantity})</span>
        <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
    `;
    return itemDiv;
}


// =========================================================
// 3. LÓGICA DO CARRINHO (CART)
// ... (sem alteração na lógica do carrinho) ...
// =========================================================

const CART_STORAGE_KEY = 'padaria_cart_items';
let cart = loadCart(); 

function loadCart() {
    const json = localStorage.getItem(CART_STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    if (document.getElementById('cart-list')) {
        renderCartItems(); 
    }
}

function updateItemQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.quantity += delta;
        
        if (item.quantity <= 0) {
            removeItemFromCart(productId);
        } else {
            saveCart();
            renderCartItems(); 
        }
    }
}

function removeItemFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    if (document.getElementById('cart-list')) {
        renderCartItems();
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
        cartCountElement.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

function renderCartItems() {
    const cartList = document.getElementById('cart-list');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    if (cartList) {
        cartList.innerHTML = '';
    }

    const hasItems = cart.length > 0;
    
    if (emptyMessage) emptyMessage.style.display = hasItems ? 'none' : 'block';
    
    if (checkoutBtn) {
        checkoutBtn.style.pointerEvents = hasItems ? 'auto' : 'none';
        checkoutBtn.style.opacity = hasItems ? 1 : 0.5;
    }
    
    if (clearCartBtn) clearCartBtn.style.display = hasItems ? 'block' : 'none';
    
    if (hasItems) {
        cart.forEach(item => {
            cartList.appendChild(createCartItemElement(item));
        });
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = hasItems ? 10.00 : 0.00;
    const total = subtotal + deliveryFee;

    if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (document.getElementById('cart-delivery')) {
         document.getElementById('cart-delivery').textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
    }
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    if (clearCartBtn) {
        clearCartBtn.removeEventListener('click', handleClearCart);
        clearCartBtn.addEventListener('click', handleClearCart);
    }
}

function handleClearCart() {
    cart = [];
    saveCart();
    renderCartItems(); 
}

function renderCheckoutSummary() {
    const summaryList = document.getElementById('checkout-summary-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');
    const emptyMessage = document.getElementById('checkout-empty-message');

    if (summaryList) summaryList.innerHTML = '';

    const hasItems = cart.length > 0;
    
    if (emptyMessage) emptyMessage.style.display = hasItems ? 'none' : 'block';

    if (hasItems && summaryList) {
        cart.forEach(item => {
            summaryList.appendChild(createCheckoutItemSummary(item));
        });
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = hasItems ? 10.00 : 0.00;
    const total = subtotal + deliveryFee;

    if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (document.getElementById('checkout-delivery')) {
         document.getElementById('checkout-delivery').textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
    }
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}


// =========================================================
// 4. LÓGICA PRINCIPAL E INICIALIZAÇÃO - INCLUINDO FILTRO
// =========================================================

/**
 * Renderiza os produtos destacados na Home Page.
 */
function renderFeaturedProducts() {
    const featuredList = document.getElementById('featured-list');
    const featured = products.slice(0, 4); 

    if (featuredList) {
        featured.forEach(product => {
            const card = createProductCard(product);
            featuredList.appendChild(card);
        });
    }
}

/**
 * Renderiza todos os produtos na página de Cardápio Completo. (MODIFICADA PARA FILTRO)
 * @param {string} filterCategory - Categoria a ser filtrada (ex: 'pães', 'doces', 'lanches').
 */
function renderMenuProducts(filterCategory = 'todos') {
    const menuList = document.getElementById('menu-list');

    if (menuList) {
        menuList.innerHTML = ''; 

        // 1. Filtra a lista de produtos
        const filteredProducts = products.filter(product => {
            return filterCategory === 'todos' || product.category === filterCategory;
        });
        
        // 2. Renderiza os produtos filtrados
        filteredProducts.forEach(product => {
            const card = createProductCard(product);
            menuList.appendChild(card);
        });
    }
}

/**
 * Configura os botões de filtro para interagir com a lista de produtos. (NOVA FUNÇÃO)
 */
function setupProductFilter() {
    const filterContainer = document.getElementById('filter-buttons');

    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.getAttribute('data-filter')) {
                
                filterContainer.querySelectorAll('.btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                renderMenuProducts(filter);
            }
        });
    }
}

/**
 * Destaca o link de navegação da página atual. 
 */
function setupActiveNavigation() {
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const path = window.location.pathname;
    const currentPage = path.substring(path.lastIndexOf('/') + 1) || 'index.html'; 

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function handleValidationError(inputElement, message) {
    const group = inputElement.closest('.form-group');
    const errorEl = group.querySelector('.error-message');
    
    if (message) {
        inputElement.classList.add('error');
        errorEl.textContent = message;
        return false;
    } else {
        inputElement.classList.remove('error');
        errorEl.textContent = '';
        return true;
    }
}

function setupCheckoutForm() {
    const deliveryForm = document.getElementById('delivery-form');

    if (deliveryForm) {
        deliveryForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nameInput = document.getElementById('name');
            const addressInput = document.getElementById('address');
            const cepInput = document.getElementById('cep');
            
            let isValid = true;
            
            isValid &= handleValidationError(nameInput, nameInput.value.trim() === '' ? "O nome é obrigatório." : "");
            isValid &= handleValidationError(addressInput, addressInput.value.trim() === '' ? "O endereço é obrigatório." : "");
            isValid &= handleValidationError(cepInput, cepInput.value.trim() === '' ? "O CEP é obrigatório." : "");
            
            if (isValid) {
                alert("🎉 Pedido Finalizado com Sucesso! Seu pedido será entregue em breve.");
                cart = [];
                saveCart();
                window.location.href = 'index.html'; 
            }
        });
    }
}

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');
            
            let isValid = true;
            
            isValid &= handleValidationError(nameInput, nameInput.value.trim() === '' ? "O nome é obrigatório." : "");
            isValid &= handleValidationError(emailInput, emailInput.value.trim() === '' ? "O e-mail é obrigatório." : "");
            isValid &= handleValidationError(subjectInput, subjectInput.value.trim() === '' ? "O assunto é obrigatório." : "");
            isValid &= handleValidationError(messageInput, messageInput.value.trim() === '' ? "A mensagem é obrigatória." : "");
            
            if (isValid) {
                alert("✅ Mensagem enviada com sucesso! Agradecemos o seu contato.");
                contactForm.reset(); 
            }
        });
    }
}

/**
 * Inicializa todos os listeners e scripts ao carregar a página.
 */
function initApp() {
    updateCartCount();
    setupActiveNavigation(); 

    if (document.getElementById('cart-list')) {
        renderCartItems(); 
    } 
    
    if (document.querySelector('.checkout-page-container')) {
        renderCheckoutSummary();
        setupCheckoutForm();
    }
    
    if (document.getElementById('contact-form')) {
        setupContactForm();
    }
    
    // RENDERIZAÇÃO ESPECÍFICA: Checa se está no menu ou na home
    if (document.getElementById('menu-list')) {
        renderMenuProducts();
        setupProductFilter(); // NOVO: Inicializa os filtros
    } else if (document.getElementById('featured-list')) {
        renderFeaturedProducts();
    }
}

// Inicializa a aplicação quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', initApp);