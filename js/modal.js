const products = [
    { id: 1, name: "Смартфон Apple iPhone 14 128GB", brand: "Apple", price: "75 999 ₽", category: "Смартфоны" },
    { id: 2, name: "Смартфон Apple iPhone 12 64GB", brand: "Apple", price: "56 499 ₽", category: "Смартфоны" },
    { id: 3, name: "Смартфон HUAWEI nova Y61", brand: "HUAWEI", price: "17 665 ₽", category: "Смартфоны" },
    { id: 4, name: "Смартфон Xiaomi Redmi 128GB", brand: "Xiaomi", price: "23 499 ₽", category: "Смартфоны" },
    { id: 5, name: "Смартфон HUAWEI P50 Pro", brand: "HUAWEI", price: "61 999 ₽", category: "Смартфоны" },
    { id: 6, name: "Смартфон HUAWEI Mate 40", brand: "HUAWEI", price: "47 999 ₽", category: "Смартфоны" },
    { id: 7, name: "Ноутбук Apple MacBook Air M1", brand: "Apple", price: "89 999 ₽", category: "Ноутбуки" },
    { id: 8, name: "Ноутбук ASUS VivoBook 15", brand: "ASUS", price: "45 999 ₽", category: "Ноутбуки" },
    { id: 9, name: "Компьютер игровой Intel Core i5", brand: "Intel", price: "67 999 ₽", category: "Компьютеры" },
    { id: 10, name: "Телевизор Samsung QLED 55", brand: "Samsung", price: "52 999 ₽", category: "Телевизоры" },
    { id: 11, name: "Планшет Apple iPad Air", brand: "Apple", price: "48 999 ₽", category: "Планшеты" },
    { id: 12, name: "Колонка умная Яндекс Станция", brand: "Яндекс", price: "12 999 ₽", category: "Колонки" },
    { id: 13, name: "Наушники Apple AirPods Pro", brand: "Apple", price: "19 999 ₽", category: "Аксессуары" },
    { id: 14, name: "Часы Apple Watch Series 8", brand: "Apple", price: "34 999 ₽", category: "Аксессуары" }
];

const searchButton = document.getElementById('searchButton');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const noResults = document.getElementById('noResults');
const cartCount = document.querySelector('.cart-count');

searchButton.addEventListener('click', () => {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
});

closeSearch.addEventListener('click', closeSearchModal);

searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        closeSearchModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearchModal();
    }
});

function closeSearchModal() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    document.body.style.overflow = 'auto';
    searchResults.innerHTML = `
                <div class="no-results" id="noResults">
                    <div class="no-results-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <p>Введите запрос для поиска товаров</p>
                </div>
            `;
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    performSearch();
});

let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    if (searchInput.value.trim().length > 0) {
        searchTimeout = setTimeout(performSearch, 300);
    } else {
        searchResults.innerHTML = `
                    <div class="no-results" id="noResults">
                        <div class="no-results-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <p>Введите запрос для поиска товаров</p>
                    </div>
                `;
    }
});

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (query.length === 0) {
        searchResults.innerHTML = `
                    <div class="no-results" id="noResults">
                        <div class="no-results-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <p>Введите запрос для поиска товаров</p>
                    </div>
                `;
        return;
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.price.toLowerCase().includes(query)
    );

    displaySearchResults(filteredProducts, query);
}

function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = `
                    <div class="no-results">
                        <div class="no-results-icon">
                            <i class="fas fa-search-minus"></i>
                        </div>
                        <p>По запросу "<strong>${query}</strong>" ничего не найдено</p>
                        <p style="margin-top: 10px; font-size: 14px;">Попробуйте изменить запрос или искать по категориям: Смартфоны, Ноутбуки, Телевизоры</p>
                    </div>
                `;
        return;
    }

    let resultsHTML = `
                <h3 class="search-results-title">Найдено товаров: ${results.length}</h3>
                <ul class="search-results-list">
            `;

    results.forEach(product => {
        resultsHTML += `
                    <li class="search-result-item">
                        <div class="result-product-info">
                            <div class="result-product-name">${highlightText(product.name, query)}</div>
                            <div class="result-product-brand">${product.brand} • ${product.category}</div>
                            <div class="result-product-price">${product.price}</div>
                        </div>
                        <button class="result-add-to-cart" data-id="${product.id}">В корзину</button>
                    </li>
                `;
    });

    resultsHTML += '</ul>';
    searchResults.innerHTML = resultsHTML;

    document.querySelectorAll('.result-add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);

            let currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + 1;

            this.textContent = 'Добавлено';
            this.style.backgroundColor = '#34c759';
            this.disabled = true;

            setTimeout(() => {
                alert(`Товар "${product.name}" добавлен в корзину!`);
            }, 300);

            setTimeout(() => {
                this.textContent = 'В корзину';
                this.style.backgroundColor = '#0071e3';
                this.disabled = false;
            }, 2000);
        });
    });
}

function highlightText(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span style="background-color: #0071e3; color: white; padding: 2px 4px; border-radius: 3px;">$1</span>');
}