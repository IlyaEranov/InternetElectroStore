document.querySelectorAll('.btn-cart').forEach(button => {
    button.addEventListener('click', function () {
        const productTitle = this.parentElement.querySelector('.promo-title').textContent;
        const productPrice = this.parentElement.querySelector('.promo-price').textContent;
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Добавлено';
        this.style.backgroundColor = '#4CAF50';
        showNotification(`Товар "${productTitle}" добавлен в корзину за ${productPrice}`);
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.backgroundColor = '';
        }, 2000);
    });
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 1000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                animation: fadeInOut 3s ease-in-out;
            `;
    const style = document.createElement('style');
    style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-20px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
            `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}