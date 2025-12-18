const mobileFiltersBtn = document.getElementById('mobileFiltersBtn');
const filtersSidebar = document.getElementById('filtersSidebar');
const applyFiltersBtn = document.getElementById('applyFilters');
const sortSelect = document.getElementById('sortSelect');
const viewGridBtn = document.getElementById('viewGrid');
const viewListBtn = document.getElementById('viewList');
const productsGrid = document.getElementById('productsGrid');
const productsCount = document.getElementById('productsCount');
const cartCount = document.querySelector('.cart-count');

const priceMinInput = document.getElementById('price-min');
const priceMaxInput = document.getElementById('price-max');
const priceSlider = document.getElementById('priceSlider');
const priceSliderFill = document.getElementById('priceSliderFill');
const priceSliderMin = document.getElementById('priceSliderMin');
const priceSliderMax = document.getElementById('priceSliderMax');

// Текущие значения слайдера
let minPrice = 10000;
let maxPrice = 120000;
let minPriceLimit = 0;
let maxPriceLimit = 200000;

// Инициализация слайдера
function updatePriceSlider() {
    const sliderWidth = priceSlider.offsetWidth;
    const minPercent = ((minPrice - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100;
    const maxPercent = ((maxPrice - minPriceLimit) / (maxPriceLimit - minPriceLimit)) * 100;

    priceSliderMin.style.left = `${minPercent}%`;
    priceSliderMax.style.left = `${maxPercent}%`;
    priceSliderFill.style.left = `${minPercent}%`;
    priceSliderFill.style.width = `${maxPercent - minPercent}%`;

    priceMinInput.value = minPrice.toLocaleString('ru-RU');
    priceMaxInput.value = maxPrice.toLocaleString('ru-RU');
}

// Обработка слайдера цены
function initPriceSlider() {
    updatePriceSlider();

    let isDraggingMin = false;
    let isDraggingMax = false;

    // Начало перетаскивания
    priceSliderMin.addEventListener('mousedown', () => isDraggingMin = true);
    priceSliderMax.addEventListener('mousedown', () => isDraggingMax = true);

    // Перетаскивание
    document.addEventListener('mousemove', (e) => {
        if (!isDraggingMin && !isDraggingMax) return;

        const sliderRect = priceSlider.getBoundingClientRect();
        const position = (e.clientX - sliderRect.left) / sliderRect.width;
        const price = minPriceLimit + position * (maxPriceLimit - minPriceLimit);

        if (isDraggingMin) {
            const newMinPrice = Math.max(minPriceLimit, Math.min(price, maxPrice - 1000));
            minPrice = Math.round(newMinPrice / 1000) * 1000;
        }

        if (isDraggingMax) {
            const newMaxPrice = Math.min(maxPriceLimit, Math.max(price, minPrice + 1000));
            maxPrice = Math.round(newMaxPrice / 1000) * 1000;
        }

        updatePriceSlider();
    });

    // Конец перетаскивания
    document.addEventListener('mouseup', () => {
        isDraggingMin = false;
        isDraggingMax = false;
    });

    // Обработка ввода в поля
    priceMinInput.addEventListener('change', () => {
        let value = parseInt(priceMinInput.value.replace(/\s/g, '')) || minPriceLimit;
        value = Math.max(minPriceLimit, Math.min(value, maxPrice - 1000));
        minPrice = Math.round(value / 1000) * 1000;
        updatePriceSlider();
    });

    priceMaxInput.addEventListener('change', () => {
        let value = parseInt(priceMaxInput.value.replace(/\s/g, '')) || maxPriceLimit;
        value = Math.min(maxPriceLimit, Math.max(value, minPrice + 1000));
        maxPrice = Math.round(value / 1000) * 1000;
        updatePriceSlider();
    });
}

// Фильтрация товаров
function filterProducts() {
    const products = document.querySelectorAll('.product-card');
    const brandFilters = {
        apple: document.getElementById('brand-apple').checked,
        samsung: document.getElementById('brand-samsung').checked,
        huawei: document.getElementById('brand-huawei').checked,
        xiaomi: document.getElementById('brand-xiaomi').checked
    };

    const memoryFilters = {
        '64': document.getElementById('memory-64').checked,
        '128': document.getElementById('memory-128').checked,
        '256': document.getElementById('memory-256').checked
    };

    let visibleCount = 0;

    products.forEach(product => {
        const brand = product.getAttribute('data-brand');
        const price = parseInt(product.getAttribute('data-price'));
        const memory = product.getAttribute('data-memory');

        // Проверка фильтров
        const brandMatch = brandFilters[brand];
        const priceMatch = price >= minPrice && price <= maxPrice;
        const memoryMatch = memoryFilters[memory];

        if (brandMatch && priceMatch && memoryMatch) {
            product.style.display = 'flex';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });

    // Обновление счетчика
    productsCount.textContent = visibleCount;

    // Если на мобильном, закрываем фильтры после применения
    if (window.innerWidth <= 768) {
        filtersSidebar.classList.remove('active');
    }
}

// Сортировка товаров
function sortProducts() {
    const sortBy = sortSelect.value;
    const container = productsGrid;
    const products = Array.from(container.querySelectorAll('.product-card'));

    products.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'));
        const priceB = parseInt(b.getAttribute('data-price'));
        const nameA = a.querySelector('.product-name').textContent.toLowerCase();
        const nameB = b.querySelector('.product-name').textContent.toLowerCase();

        switch (sortBy) {
            case 'price-asc':
                return priceA - priceB;
            case 'price-desc':
                return priceB - priceA;
            case 'name':
                return nameA.localeCompare(nameB);
            default:
                return 0; // По популярности (исходный порядок)
        }
    });

    // Очистка и перерисовка в новом порядке
    products.forEach(product => container.appendChild(product));
}

// Изменение вида отображения
function changeView(viewType) {
    if (viewType === 'grid') {
        productsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        viewGridBtn.classList.add('active');
        viewListBtn.classList.remove('active');
    } else {
        productsGrid.style.gridTemplateColumns = '1fr';
        viewListBtn.classList.add('active');
        viewGridBtn.classList.remove('active');

        // Для списка добавляем особый стиль
        document.querySelectorAll('.product-card').forEach(card => {
            if (viewType === 'list') {
                card.style.flexDirection = 'row';
                card.style.alignItems = 'center';
                card.querySelector('.product-image').style.width = '150px';
                card.querySelector('.product-image').style.height = '150px';
                card.querySelector('.product-image').style.marginRight = '20px';
                card.querySelector('.product-image').style.flexShrink = '0';
            } else {
                card.style.flexDirection = 'column';
                card.querySelector('.product-image').style.width = 'auto';
                card.querySelector('.product-image').style.height = '200px';
                card.querySelector('.product-image').style.marginRight = '0';
            }
        });
    }
}

// Обработка меню
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Обработка кнопки "В корзину"
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;

        // Обновляем счетчик корзины
        let currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;

        // Анимация кнопки
        button.textContent = 'Добавлено';
        button.style.backgroundColor = '#34c759';
        button.disabled = true;

        // Восстановление кнопки через 2 секунды
        setTimeout(() => {
            button.textContent = 'В корзину';
            button.style.backgroundColor = '#0071e3';
            button.disabled = false;
        }, 2000);

        // Сообщение
        setTimeout(() => {
            alert(`Товар "${productName}" добавлен в корзину!`);
        }, 300);
    }
});

// Обработка кнопки "Пересчет"
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('recalculate-btn') || e.target.closest('.recalculate-btn')) {
        const button = e.target.classList.contains('recalculate-btn') ? e.target : e.target.closest('.recalculate-btn');
        const productCard = button.closest('.product-card');
        const priceElement = productCard.querySelector('.product-price');
        const currentPrice = parseFloat(priceElement.textContent.replace(/[^\d]/g, ''));

        // Генерация случайной скидки от 5% до 15%
        const discountPercent = Math.floor(Math.random() * 11) + 5;
        const newPrice = Math.round(currentPrice * (1 - discountPercent / 100));

        // Форматирование новой цены
        const formattedPrice = newPrice.toLocaleString('ru-RU') + ' ₽';

        // Анимация изменения цены
        priceElement.style.color = '#ff3b30';
        priceElement.style.transition = 'color 0.5s';

        setTimeout(() => {
            priceElement.textContent = formattedPrice;
            priceElement.style.color = '#1d1d1f';
            // Обновляем data-атрибут для фильтрации
            productCard.setAttribute('data-price', newPrice.toString());
        }, 300);

        // Анимация кнопки
        button.textContent = `-${discountPercent}%`;
        button.style.backgroundColor = '#ff3b30';
        button.style.color = 'white';

        setTimeout(() => {
            button.textContent = 'Пересчет';
            button.style.backgroundColor = '#f8f8fa';
            button.style.color = '#1d1d1f';
        }, 1500);
    }
});

// Мобильное меню
document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
    alert('Мобильное меню открыто');
});

// Мобильные фильтры
mobileFiltersBtn.addEventListener('click', () => {
    filtersSidebar.classList.add('active');
});

// Закрытие фильтров при клике вне панели
filtersSidebar.addEventListener('click', (e) => {
    if (e.target === filtersSidebar) {
        filtersSidebar.classList.remove('active');
    }
});

// Применение фильтров
applyFiltersBtn.addEventListener('click', filterProducts);

// Сортировка
sortSelect.addEventListener('change', sortProducts);

// Изменение вида
viewGridBtn.addEventListener('click', () => changeView('grid'));
viewListBtn.addEventListener('click', () => changeView('list'));

// Пагинация
document.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (this.textContent !== '...') {
            document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initPriceSlider();
    filterProducts();
});
