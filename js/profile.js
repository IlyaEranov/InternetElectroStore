const user = localStorage.getItem("user")

function userIsAuth(){
    if(!user && window.location.pathname != "login.html" && window.location.pathname != "register.html"){
        window.location.href = "login.html"
    }
}

userIsAuth()

const menuItems = document.querySelectorAll('.menu-link');
const sections = {
    personal: document.getElementById('personalSection'),
    orders: document.getElementById('ordersSection'),
    favorites: document.getElementById('favoritesSection'),
    bonuses: document.getElementById('bonusesSection'),
    settings: document.getElementById('settingsSection')
};

const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');

const sectionTitles = {
    personal: {
        title: 'Личные данные',
        subtitle: 'Управляйте вашей учетной записью и настройками'
    },
    orders: {
        title: 'Мои заказы',
        subtitle: 'История заказов и текущие статусы'
    },
    favorites: {
        title: 'Избранное',
        subtitle: 'Сохраненные товары и списки желаний'
    },
    bonuses: {
        title: 'Мои бонусы',
        subtitle: 'Бонусная программа и история начислений'
    },
    settings: {
        title: 'Настройки аккаунта',
        subtitle: 'Настройки безопасности и уведомлений'
    }
};

menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        menuItems.forEach(menuItem => {
            menuItem.classList.remove('active');
        });
        this.classList.add('active');
        Object.values(sections).forEach(section => {
            section.style.display = 'none';
        });
        if (this.id === 'menuPersonal') {
            sections.personal.style.display = 'block';
            pageTitle.textContent = sectionTitles.personal.title;
            pageSubtitle.textContent = sectionTitles.personal.subtitle;
        } else if (this.id === 'menuOrders') {
            sections.orders.style.display = 'block';
            pageTitle.textContent = sectionTitles.orders.title;
            pageSubtitle.textContent = sectionTitles.orders.subtitle;
        } else if (this.id === 'menuFavorites') {
            sections.favorites.style.display = 'block';
            pageTitle.textContent = sectionTitles.favorites.title;
            pageSubtitle.textContent = sectionTitles.favorites.subtitle;
        } else if (this.id === 'menuBonuses') {
            sections.bonuses.style.display = 'block';
            pageTitle.textContent = sectionTitles.bonuses.title;
            pageSubtitle.textContent = sectionTitles.bonuses.subtitle;
        } else if (this.id === 'menuSettings') {
            sections.settings.style.display = 'block';
            pageTitle.textContent = sectionTitles.settings.title;
            pageSubtitle.textContent = sectionTitles.settings.subtitle;
        } else if (this.id === 'menuLogout') {
            if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
                alert('Вы вышли из аккаунта. Перенаправление на главную страницу...');
                // В реальном приложении: window.location.href = '/';
            }
        }
    });
});

document.querySelectorAll('.info-edit').forEach(editBtn => {
    editBtn.addEventListener('click', function () {
        const field = this.getAttribute('data-field');
        let currentValue = this.previousElementSibling.textContent;
        let newValue = prompt(`Введите новое значение для ${getFieldName(field)}:`, currentValue);

        if (newValue && newValue.trim() !== '' && newValue !== currentValue) {
            this.previousElementSibling.textContent = newValue;
            showNotification(`Поле "${getFieldName(field)}" успешно обновлено!`);
        }
    });
});

function getFieldName(field) {
    const fieldNames = {
        'name': 'ФИО',
        'email': 'Email',
        'phone': 'Телефон',
        'birthday': 'Дата рождения',
        'address': 'Адрес',
        'address2': 'Дополнительный адрес'
    };
    return fieldNames[field] || field;
}

document.getElementById('editProfileBtn').addEventListener('click', function () {
    alert('Открывается форма редактирования профиля. В реальном приложении здесь будет модальное окно.');
});

document.getElementById('changeAvatar').addEventListener('click', function () {
    alert('Открывается загрузка аватара. В реальном приложении здесь будет форма загрузки изображения.');
});

document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const orderNumber = this.closest('.order-item').querySelector('.order-number').textContent;

        if (this.textContent === 'Повторить') {
            if (confirm(`Повторить заказ ${orderNumber}?`)) {
                showNotification('Заказ добавлен в корзину!');
            }
        } else if (this.textContent === 'Отследить') {
            alert(`Отслеживание заказа ${orderNumber}. В реальном приложении здесь будет информация о доставке.`);
        } else if (this.textContent === 'Отменить') {
            if (confirm(`Отменить заказ ${orderNumber}?`)) {
                showNotification('Заказ отменен!');
            }
        } else if (this.textContent === 'Подробнее') {
            alert(`Детали заказа ${orderNumber}. В реальном приложении здесь будет страница с деталями заказа.`);
        }
    });
});

document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const productName = this.closest('.favorite-item').querySelector('.favorite-name').textContent;

        if (this.classList.contains('add')) {
            showNotification(`Товар "${productName}" добавлен в корзину!`);
        } else if (this.classList.contains('remove')) {
            if (confirm(`Удалить "${productName}" из избранного?`)) {
                const favoriteItem = this.closest('.favorite-item');
                favoriteItem.style.opacity = '0';
                favoriteItem.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    favoriteItem.remove();
                    const favoritesCount = document.querySelector('#menuFavorites span:last-child');
                    let currentCount = parseInt(favoritesCount.textContent);
                    favoritesCount.textContent = currentCount - 1;

                    if (currentCount - 1 === 0) {
                        favoritesCount.style.display = 'none';
                    }
                }, 300);
            }
        }
    });
});

document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function () {
        const settingName = this.closest('.setting-item').querySelector('h4').textContent;
        const status = this.checked ? 'включена' : 'выключена';
        showNotification(`Настройка "${settingName}" ${status}`);
    });
});

document.querySelector('.profile-btn.primary').addEventListener('click', function () {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';
    this.disabled = true;

    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-sync"></i> Обновить';
        this.disabled = false;
        showNotification('Данные профиля обновлены!');
    }, 1500);
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #34c759;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                font-weight: 500;
                animation: slideIn 0.3s ease;
            `;

    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    const style = document.createElement('style');
    style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
    document.head.appendChild(style);
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
});

document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
    alert('Мобильное меню открыто');
});

document.querySelector('.footer-newsletter button').addEventListener('click', function () {
    const emailInput = document.querySelector('.footer-newsletter input');
    const email = emailInput.value;

    if (email && email.includes('@')) {
        showNotification(`Спасибо за подписку! На адрес ${email} будут приходить наши новости.`);
        emailInput.value = '';
    } else {
        alert('Пожалуйста, введите корректный email адрес.');
    }
});