const cartCount = document.getElementById('cartCount');
const addToCartBtn = document.getElementById('addToCartBtn');
const buyNowBtn = document.getElementById('buyNowBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const quantityInput = document.getElementById('quantityInput');
const decreaseQtyBtn = document.getElementById('decreaseQty');
const increaseQtyBtn = document.getElementById('increaseQty');
const colorButtons = document.querySelectorAll('#colorButtons .spec-btn');
const memoryButtons = document.querySelectorAll('#memoryButtons .spec-btn');
const currentPrice = document.getElementById('currentPrice');
const oldPrice = document.getElementById('oldPrice');
const discountBadge = document.getElementById('discountBadge');
const priceSavings = document.getElementById('priceSavings');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('mainImage');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const addReviewBtn = document.getElementById('addReviewBtn');

// Текущая конфигурация товара
let selectedColor = 'black';
let selectedMemory = '256';
let basePrice = 119999;
let currentTotalPrice = basePrice;

// Управление количеством
decreaseQtyBtn.addEventListener('click', () => {
    let currentQty = parseInt(quantityInput.value);
    if (currentQty > 1) {
        quantityInput.value = currentQty - 1;
    }
});

increaseQtyBtn.addEventListener('click', () => {
    let currentQty = parseInt(quantityInput.value);
    if (currentQty < 10) {
        quantityInput.value = currentQty + 1;
    }
});

quantityInput.addEventListener('change', () => {
    let value = parseInt(quantityInput.value);
    if (value < 1) quantityInput.value = 1;
    if (value > 10) quantityInput.value = 10;
});

// Выбор цвета
colorButtons.forEach(button => {
    button.addEventListener('click', function () {
        colorButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        selectedColor = this.getAttribute('data-color');
        const colorPrice = parseInt(this.getAttribute('data-price'));

        // Обновляем изображение
        updateMainImage(selectedColor);

        // Обновляем цену
        updatePrice();
    });
});

// Выбор объема памяти
memoryButtons.forEach(button => {
    button.addEventListener('click', function () {
        memoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        selectedMemory = this.getAttribute('data-memory');
        basePrice = parseInt(this.getAttribute('data-price'));

        // Обновляем цену
        updatePrice();
    });
});

// Обновление главного изображения
function updateMainImage(color) {
    const colors = {
        'black': { icon: 'fa-mobile-alt', color: '#1d1d1f' },
        'silver': { icon: 'fa-mobile-alt', color: '#e0e0e0' },
        'gold': { icon: 'fa-mobile-alt', color: '#ffd700' },
        'purple': { icon: 'fa-mobile-alt', color: '#9b59b6' }
    };

    mainImage.innerHTML = `<i class="fas ${colors[color].icon}" style="color: ${colors[color].color}; font-size: 48px;"></i>`;

    // Обновляем активную миниатюру
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.getAttribute('data-image') === color) {
            thumb.classList.add('active');
        }
    });
}

// Клик по миниатюрам
thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function () {
        const color = this.getAttribute('data-image');
        updateMainImage(color);

        // Активируем соответствующую кнопку цвета
        colorButtons.forEach(btn => {
            if (btn.getAttribute('data-color') === color) {
                btn.click();
            }
        });
    });
});

// Обновление цены
function updatePrice() {
    const quantity = parseInt(quantityInput.value);
    const discountPercent = 8; // 8% скидка
    const discountAmount = Math.round(basePrice * discountPercent / 100);
    const discountedPrice = basePrice - discountAmount;

    // Обновляем цены
    currentPrice.textContent = discountedPrice.toLocaleString('ru-RU') + ' ₽';
    oldPrice.textContent = basePrice.toLocaleString('ru-RU') + ' ₽';
    priceSavings.textContent = `Экономия ${discountAmount.toLocaleString('ru-RU')} ₽`;

    // Сохраняем текущую общую цену
    currentTotalPrice = discountedPrice * quantity;
}

// Показ уведомления
function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = 'notification';
    notification.classList.add('show');

    if (type === 'error') {
        notification.classList.add('error');
    } else if (type === 'warning') {
        notification.classList.add('warning');
    }

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Добавление в корзину
addToCartBtn.addEventListener('click', function () {
    const quantity = parseInt(quantityInput.value);

    // Обновляем счетчик корзины
    let currentCount = parseInt(cartCount.textContent);
    cartCount.textContent = currentCount + quantity;

    // Меняем вид кнопки
    this.innerHTML = '<i class="fas fa-check"></i> Добавлено в корзину';
    this.classList.add('added');

    // Показываем уведомление
    showNotification(`Товар добавлен в корзину! Количество: ${quantity} шт.`);

    // Возвращаем кнопку в исходное состояние через 3 секунды
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-shopping-cart"></i> Добавить в корзину';
        this.classList.remove('added');
    }, 3000);
});

// Купить сейчас
buyNowBtn.addEventListener('click', function () {
    const quantity = parseInt(quantityInput.value);

    // Обновляем счетчик корзины
    let currentCount = parseInt(cartCount.textContent);
    cartCount.textContent = currentCount + quantity;

    showNotification(`Товар добавлен в корзину! Переход к оформлению заказа...`);

    // В реальном приложении здесь будет переход на страницу оформления заказа
    setTimeout(() => {
        alert(`Оформление заказа на ${quantity} шт. iPhone 14 Pro ${selectedMemory}GB ${selectedColor}. Общая сумма: ${currentTotalPrice.toLocaleString('ru-RU')} ₽`);
    }, 1000);
});

// Добавление в избранное
wishlistBtn.addEventListener('click', function () {
    const isActive = this.classList.contains('active');

    if (isActive) {
        this.innerHTML = '<i class="far fa-heart"></i>';
        this.classList.remove('active');
        showNotification('Товар удален из избранного');
    } else {
        this.innerHTML = '<i class="fas fa-heart"></i>';
        this.classList.add('active');
        showNotification('Товар добавлен в избранное');
    }
});

// Переключение табов
tabButtons.forEach(button => {
    button.addEventListener('click', function () {
        const tabId = this.getAttribute('data-tab');

        // Убираем активный класс у всех кнопок и контента
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Добавляем активный класс текущей кнопке и контенту
        this.classList.add('active');
        document.getElementById(`${tabId}Tab`).classList.add('active');
    });
});

// Кнопка добавления отзыва
addReviewBtn.addEventListener('click', function () {
    alert('Открывается форма для добавления отзыва. В реальном приложении здесь будет модальное окно или форма.');
});

// Кнопки "В корзину" для похожих товаров
document.querySelectorAll('.product-card-btn').forEach(button => {
    button.addEventListener('click', function () {
        const productTitle = this.closest('.product-card').querySelector('.product-card-title').textContent;
        const productPrice = this.closest('.product-card').querySelector('.product-card-price').textContent;

        // Обновляем счетчик корзины
        let currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;

        // Показываем уведомление
        showNotification(`${productTitle} добавлен в корзину!`);

        // Анимация кнопки
        const originalText = this.textContent;
        this.textContent = 'Добавлено!';
        this.style.backgroundColor = '#34c759';

        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '#0071e3';
        }, 2000);
    });
});

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

// Мобильное меню
document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
    alert('Мобильное меню открыто');
});

// Подписка на рассылку
document.querySelector('.footer-newsletter button').addEventListener('click', function () {
    const emailInput = document.querySelector('.footer-newsletter input');
    const email = emailInput.value;

    if (email && email.includes('@')) {
        showNotification(`Спасибо за подписку! На адрес ${email} будут приходить наши новости.`);
        emailInput.value = '';
    } else {
        showNotification('Пожалуйста, введите корректный email адрес.', 'error');
    }
});

// Инициализация
updatePrice();