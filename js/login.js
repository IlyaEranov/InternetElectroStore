const mockdata = {email: "qwezxc123@mail.ru", password: "qwezxc123"}

const user = localStorage.getItem("user")

if(user){
    window.location.href = "profile.html"
}

const loginForm = document.getElementById('loginForm');
const loginFormCard = document.getElementById('loginFormCard');
const passwordRecovery = document.getElementById('passwordRecovery');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const backToLogin = document.getElementById('backToLogin');
const loginButton = document.getElementById('loginButton');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const recoveryForm = document.getElementById('recoveryForm');
const recoveryButton = document.getElementById('recoveryButton');
const recoverySuccessMessage = document.getElementById('recoverySuccessMessage');
const vkLogin = document.getElementById('vkLogin');
const googleLogin = document.getElementById('googleLogin');
const yandexLogin = document.getElementById('yandexLogin');
const goToAccount = document.getElementById('goToAccount');

togglePasswordBtn.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

forgotPasswordLink.addEventListener('click', function (e) {
    e.preventDefault();
    loginFormCard.style.display = 'none';
    passwordRecovery.classList.add('active');
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
});

backToLogin.addEventListener('click', function (e) {
    e.preventDefault();
    passwordRecovery.classList.remove('active');
    loginFormCard.style.display = 'block';
    recoverySuccessMessage.style.display = 'none';
});

function validateLoginForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let isValid = true;
    errorMessage.style.display = 'none';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').classList.add('show');
        document.getElementById('email').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('emailError').classList.remove('show');
        document.getElementById('email').classList.remove('error');
    }
    if (!password) {
        document.getElementById('passwordError').classList.add('show');
        document.getElementById('password').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('passwordError').classList.remove('show');
        document.getElementById('password').classList.remove('error');
    }
    return isValid;
}

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateLoginForm()) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
        setTimeout(() => {
            if (email === mockdata.email && password === mockdata.password) {
                errorMessage.style.display = 'none';
                loginFormCard.style.display = 'none';
                successMessage.style.display = 'block';
                if (remember) {
                    localStorage.setItem("user", mockdata.email)
                }
            } else {
                errorMessage.style.display = 'block';
                loginButton.disabled = false;
                loginButton.innerHTML = 'Войти';
                errorMessage.style.animation = 'none';
                setTimeout(() => {
                    errorMessage.style.animation = 'shake 0.5s';
                }, 10);
            }
        }, 1500);
    }
});

goToAccount.addEventListener('click', function () {
    window.location.href = "profile.html"
});

function validateRecoveryForm() {
    const email = document.getElementById('recoveryEmail').value;
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('recoveryEmailError').classList.add('show');
        document.getElementById('recoveryEmail').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('recoveryEmailError').classList.remove('show');
        document.getElementById('recoveryEmail').classList.remove('error');
    }
    return isValid;
}

recoveryForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateRecoveryForm()) {
        recoveryButton.disabled = true;
        recoveryButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        setTimeout(() => {
            recoverySuccessMessage.style.display = 'block';
            recoveryButton.disabled = false;
            recoveryButton.innerHTML = 'Отправить ссылку';
            setTimeout(() => {
                recoverySuccessMessage.style.display = 'none';
                passwordRecovery.classList.remove('active');
                loginFormCard.style.display = 'block';
            }, 5000);
        }, 1500);
    }
});

function handleSocialLogin(provider) {
    const originalText = loginButton.innerHTML;
    loginButton.disabled = true;
    loginButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Вход через ${provider}...`;
    setTimeout(() => {
        errorMessage.style.display = 'none';
        loginFormCard.style.display = 'none';
        successMessage.style.display = 'block';
        setTimeout(() => {
            loginButton.disabled = false;
            loginButton.innerHTML = originalText;
        }, 2000);
        localStorage.setItem("user", mockdata.email)
    }, 1500);
}

vkLogin.addEventListener('click', () => handleSocialLogin('ВКонтакте'));
googleLogin.addEventListener('click', () => handleSocialLogin('Google'));
yandexLogin.addEventListener('click', () => handleSocialLogin('Яндекс'));

const emailInput = document.getElementById('email');
const passwordInputField = document.getElementById('password');

emailInput.addEventListener('input', function () {
    this.classList.remove('error');
    document.getElementById('emailError').classList.remove('show');
});

passwordInputField.addEventListener('input', function () {
    this.classList.remove('error');
    document.getElementById('passwordError').classList.remove('show');
});

emailInput.addEventListener('blur', function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
        this.classList.add('error');
        document.getElementById('emailError').classList.add('show');
    }
});