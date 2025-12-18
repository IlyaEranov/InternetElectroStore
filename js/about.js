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

// Анимация для карточек ценностей при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к карточкам ценностей
document.querySelectorAll('.value-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Применяем анимацию к карточкам команды
document.querySelectorAll('.team-member').forEach(member => {
    member.style.opacity = '0';
    member.style.transform = 'translateY(20px)';
    member.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(member);
});

// Анимация для статистики
const statNumbers = document.querySelectorAll('.stat-number');

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            const finalValue = parseInt(statNumber.textContent.replace('+', ''));
            const duration = 2000; // 2 seconds
            const step = 20; // ms
            const increment = finalValue / (duration / step);
            let currentValue = 0;

            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    statNumber.textContent = finalValue + '+';
                    clearInterval(timer);
                } else {
                    statNumber.textContent = Math.floor(currentValue) + '+';
                }
            }, step);

            statObserver.unobserve(statNumber);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(number => {
    statObserver.observe(number);
});

// Кнопка "Написать нам сообщение"
document.querySelector('.action-button').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Открывается форма обратной связи. В реальном приложении здесь будет модальное окно или переход на страницу контактов.');
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
        alert(`Спасибо за подписку! На адрес ${email} будут приходить наши новости.`);
        emailInput.value = '';
    } else {
        alert('Пожалуйста, введите корректный email адрес.');
    }
});