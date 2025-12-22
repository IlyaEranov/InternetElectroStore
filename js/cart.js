const cartCount = document.getElementById('cartCount');
const cartItemsList = document.getElementById('cartItemsList');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const backToCartBtn = document.getElementById('backToCartBtn');
const applyBonusBtn = document.getElementById('applyBonusBtn');
const bonusInput = document.getElementById('bonusInput');

const orderSummaryCard = document.getElementById('orderSummaryCard');
const checkoutFormSection = document.getElementById('checkoutFormSection');
const cartItemsSection = document.getElementById('cartItemsSection');

const itemsTotal = document.getElementById('itemsTotal');
const discountTotal = document.getElementById('discountTotal');
const shippingCost = document.getElementById('shippingCost');
const orderTotal = document.getElementById('orderTotal');

const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Данные о товарах в корзине
let cartItems = [
    { id: 1, name: "Смартфон Apple iPhone 14 Pro 256GB", price: 119999, quantity: 1, color: "черный", memory: "256 ГБ" },
    { id: 2, name: "Наушники Apple AirPods Pro 2", price: 19999, quantity: 1, specs: "Беспроводные • Активное шумоподавление" },
    { id: 3, name: "Чехол для iPhone 14 Pro", price: 2999, quantity: 1, color: "синий", type: "силиконовый" }
];

let appliedBonus = 0;
let shippingPrice = 0;
let discountAmount = 10000;
let currentStep = 1;

// Инициализация корзины
function initCart() {
    updateCartCount();
    updateOrderSummary();
}

// Обновление счетчика корзины
function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Обновление итоговой суммы
function updateOrderSummary() {
    const itemsSum = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = itemsSum - discountAmount - appliedBonus + shippingPrice;

    itemsTotal.textContent = formatPrice(itemsSum);
    discountTotal.textContent = `-${formatPrice(discountAmount)}`;
    shippingCost.textContent = formatPrice(shippingPrice);
    orderTotal.textContent = formatPrice(total);

    // Обновляем также в подтверждении
    document.getElementById('confirmTotal').textContent = formatPrice(total);
}

// Форматирование цены
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
}

// Удаление товара из корзины
function removeCartItem(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);

    // Удаляем элемент из DOM
    const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
    if (itemElement) {
        itemElement.style.opacity = '0';
        itemElement.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            itemElement.remove();
            updateCartCount();
            updateOrderSummary();

            // Если корзина пуста, показываем сообщение
            if (cartItems.length === 0) {
                showEmptyCart();
            }
        }, 300);
    }
}

// Обновление количества товара
function updateCartItemQuantity(itemId, newQuantity) {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateCartCount();
        updateOrderSummary();
    }
}

// Показать пустую корзину
function showEmptyCart() {
    cartItemsList.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 class="empty-cart-title">Корзина пуста</h3>
                    <p class="empty-cart-text">
                        Добавьте товары из каталога, чтобы они появились здесь. 
                        У нас есть много интересных предложений!
                    </p>
                    <a href="#" class="continue-shopping" id="continueShoppingEmptyBtn">
                        <i class="fas fa-arrow-left"></i> Перейти в каталог
                    </a>
                </div>
            `;

    orderSummaryCard.style.display = 'none';

    document.getElementById('continueShoppingEmptyBtn').addEventListener('click', function (e) {
        e.preventDefault();
        alert('Переход в каталог товаров');
    });
}

// Показать уведомление
function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.className = 'notification';
    notification.classList.add('show');

    if (type === 'error') {
        notification.classList.add('error');
    }

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Переключение шагов оформления заказа
function goToStep(stepNumber) {
    // Обновляем активный шаг
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.getAttribute('data-step')) === stepNumber) {
            step.classList.add('active');
        }
    });

    // Показываем активную секцию формы
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');

    currentStep = stepNumber;
}

// Валидация формы
function validateStep(step) {
    let isValid = true;

    if (step === 1) {
        // Валидация данных доставки
        const fullName = document.getElementById('fullName');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const address = document.getElementById('address');

        if (!fullName.value.trim()) {
            fullName.classList.add('error');
            document.getElementById('fullNameError').classList.add('show');
            isValid = false;
        } else {
            fullName.classList.remove('error');
            document.getElementById('fullNameError').classList.remove('show');
        }

        // Простая валидация телефона
        const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phone.value)) {
            phone.classList.add('error');
            document.getElementById('phoneError').classList.add('show');
            isValid = false;
        } else {
            phone.classList.remove('error');
            document.getElementById('phoneError').classList.remove('show');
        }

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('error');
            document.getElementById('emailError').classList.add('show');
            isValid = false;
        } else {
            email.classList.remove('error');
            document.getElementById('emailError').classList.remove('show');
        }

        if (!address.value.trim()) {
            address.classList.add('error');
            document.getElementById('addressError').classList.add('show');
            isValid = false;
        } else {
            address.classList.remove('error');
            document.getElementById('addressError').classList.remove('show');
        }
    }

    return isValid;
}

// Обновление данных в подтверждении заказа
function updateConfirmationData() {
    document.getElementById('confirmFullName').textContent = document.getElementById('fullName').value || 'Иванов Иван Иванович';
    document.getElementById('confirmPhone').textContent = document.getElementById('phone').value || '+7 (999) 123-45-67';
    document.getElementById('confirmAddress').textContent = document.getElementById('address').value || 'г. Москва, ул. Ленина, д. 25, кв. 78';

    // Способ доставки
    const selectedDelivery = document.querySelector('.delivery-option.selected');
    document.getElementById('confirmDelivery').textContent = selectedDelivery ? selectedDelivery.querySelector('.delivery-name').textContent : 'Курьерская доставка';

    // Способ оплаты
    const selectedPayment = document.querySelector('.payment-option.selected');
    document.getElementById('confirmPayment').textContent = selectedPayment ? selectedPayment.querySelector('.payment-name').textContent : 'Банковская карта';
}

// Оформление заказа
function placeOrder() {
    // В реальном приложении здесь был бы запрос на сервер
    showNotification('Заказ успешно оформлен! Номер заказа: #24579', 'success');

    // Очищаем корзину
    cartItems = [];
    updateCartCount();

    // Показываем успешное сообщение
    setTimeout(() => {
        alert('Заказ #24579 успешно оформлен! Спасибо за покупку! На ваш email отправлено подтверждение.');
        // Возвращаемся на главную
        window.location.href = '#';
    }, 1000);
}

// Инициализация событий
function initEvents() {
    // Удаление товаров из корзины
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            if (confirm('Удалить товар из корзины?')) {
                removeCartItem(itemId);
                showNotification('Товар удален из корзины');
            }
        });
    });

    // Изменение количества товаров
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            const input = document.querySelector(`.quantity-input[data-id="${itemId}"]`);
            let currentQty = parseInt(input.value);

            if (currentQty > 1) {
                input.value = currentQty - 1;
                updateCartItemQuantity(itemId, currentQty - 1);
                showNotification('Количество товара изменено');
            }
        });
    });

    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            const input = document.querySelector(`.quantity-input[data-id="${itemId}"]`);
            let currentQty = parseInt(input.value);

            if (currentQty < 10) {
                input.value = currentQty + 1;
                updateCartItemQuantity(itemId, currentQty + 1);
                showNotification('Количество товара изменено');
            }
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function () {
            const itemId = parseInt(this.getAttribute('data-id'));
            let value = parseInt(this.value);

            if (value < 1) {
                value = 1;
                this.value = 1;
            }

            if (value > 10) {
                value = 10;
                this.value = 10;
            }

            updateCartItemQuantity(itemId, value);
        });
    });

    // Очистка корзины
    clearCartBtn.addEventListener('click', function () {
        if (cartItems.length > 0 && confirm('Очистить всю корзину?')) {
            cartItems = [];
            cartItemsList.innerHTML = '';
            showEmptyCart();
            showNotification('Корзина очищена');
        }
    });

    // Продолжить покупки
    continueShoppingBtn.addEventListener('click', function () {
        alert('Переход в каталог товаров');
    });

    // Оформление заказа
    checkoutBtn.addEventListener('click', function () {
        if (cartItems.length === 0) {
            showNotification('Корзина пуста. Добавьте товары для оформления заказа.', 'error');
            return;
        }

        orderSummaryCard.style.display = 'none';
        checkoutFormSection.style.display = 'block';
        cartItemsSection.style.display = 'none';

        // Скрываем кнопки действий корзины
        document.querySelector('.cart-actions').style.display = 'none';

        // Обновляем заголовок
        document.querySelector('.page-title').textContent = 'Оформление заказа';
    });

    // Назад к корзине
    backToCartBtn.addEventListener('click', function () {
        orderSummaryCard.style.display = 'block';
        checkoutFormSection.style.display = 'none';
        cartItemsSection.style.display = 'block';

        // Показываем кнопки действий корзины
        document.querySelector('.cart-actions').style.display = 'flex';

        // Обновляем заголовок
        document.querySelector('.page-title').textContent = 'Корзина';

        goToStep(1);
    });

    // Применение бонусов
    applyBonusBtn.addEventListener('click', function () {
        const bonusValue = parseInt(bonusInput.value) || 0;
        const maxBonus = 5240;

        if (bonusValue <= 0) {
            showNotification('Введите количество баллов', 'error');
            return;
        }

        if (bonusValue > maxBonus) {
            showNotification(`Максимальное количество баллов: ${maxBonus}`, 'error');
            bonusInput.value = maxBonus;
            return;
        }

        appliedBonus = bonusValue;
        updateOrderSummary();
        showNotification(`Применено ${bonusValue} бонусных баллов`);
    });

    // Выбор способа доставки
    document.querySelectorAll('.delivery-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.delivery-option').forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('.delivery-radio').checked = false;
            });

            this.classList.add('selected');
            this.querySelector('.delivery-radio').checked = true;

            shippingPrice = parseInt(this.getAttribute('data-price'));
            updateOrderSummary();
        });
    });

    // Выбор способа оплаты
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            this.classList.add('selected');

            // Показываем/скрываем детали карты
            const cardDetails = document.getElementById('cardDetails');
            const method = this.getAttribute('data-method');

            if (method === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });

    // Переход к оплате
    document.getElementById('nextToPaymentBtn').addEventListener('click', function () {
        if (validateStep(1)) {
            updateConfirmationData();
            goToStep(2);
        }
    });

    // Назад к доставке
    document.getElementById('backToDeliveryBtn').addEventListener('click', function () {
        goToStep(1);
    });

    // Переход к подтверждению
    document.getElementById('nextToConfirmationBtn').addEventListener('click', function () {
        updateConfirmationData();
        goToStep(3);
    });

    // Назад к оплате
    document.getElementById('backToPaymentBtn2').addEventListener('click', function () {
        goToStep(2);
    });

    // Подтверждение заказа
    document.getElementById('confirmOrderBtn').addEventListener('click', function () {
        placeOrder();
    });

    // Шаги оформления
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.addEventListener('click', function () {
            const stepNumber = parseInt(this.getAttribute('data-step'));

            // Проверяем валидность предыдущих шагов
            if (stepNumber === 2 && !validateStep(1)) {
                showNotification('Заполните все обязательные поля в разделе "Доставка"', 'error');
                return;
            }

            if (stepNumber === 3) {
                if (!validateStep(1)) {
                    showNotification('Заполните все обязательные поля в разделе "Доставка"', 'error');
                    goToStep(1);
                    return;
                }
                updateConfirmationData();
            }

            goToStep(stepNumber);
        });
    });

    // Маска для телефона
    document.getElementById('phone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length === 0) {
            e.target.value = '';
            return;
        }

        let formattedValue = '+7 ';

        if (value.length > 1) {
            formattedValue += '(' + value.substring(1, 4);
        }

        if (value.length >= 4) {
            formattedValue += ') ' + value.substring(4, 7);
        }

        if (value.length >= 7) {
            formattedValue += '-' + value.substring(7, 9);
        }

        if (value.length >= 9) {
            formattedValue += '-' + value.substring(9, 11);
        }

        e.target.value = formattedValue;
    });

    // Маска для номера карты
    document.getElementById('cardNumber').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 16);

        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }

        e.target.value = formattedValue;
    });

    // Маска для срока действия карты
    document.getElementById('cardExpiry').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 4);

        if (value.length >= 2) {
            e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        } else {
            e.target.value = value;
        }
    });
}