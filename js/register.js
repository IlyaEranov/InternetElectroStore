const mockdata = {email: "qwezxc123@mail.ru", password: "qwezxc123"}

const user = localStorage.getItem("user")

if(user){
    window.location.href = "profile.html"
}

const registerForm = document.getElementById('registerForm');
const registrationForm = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');
const submitButton = document.getElementById('submitButton');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const goToLoginBtn = document.getElementById('goToLogin');

const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const termsCheckbox = document.getElementById('terms');

const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

phoneInput.addEventListener('input', function (e) {
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

togglePasswordBtn.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

toggleConfirmPasswordBtn.addEventListener('click', function () {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

function validateForm() {
    let isValid = true;
    if (!fullNameInput.value.trim()) {
        fullNameInput.classList.add('error');
        fullNameError.classList.add('show');
        isValid = false;
    } else {
        fullNameInput.classList.remove('error');
        fullNameError.classList.remove('show');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('error');
        emailError.classList.add('show');
        isValid = false;
    } else {
        emailInput.classList.remove('error');
        emailError.classList.remove('show');
    }
    const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phoneInput.value)) {
        phoneInput.classList.add('error');
        phoneError.classList.add('show');
        isValid = false;
    } else {
        phoneInput.classList.remove('error');
        phoneError.classList.remove('show');
    }
    if (passwordInput.value.length < 8) {
        passwordInput.classList.add('error');
        passwordError.classList.add('show');
        isValid = false;
    } else {
        passwordInput.classList.remove('error');
        passwordError.classList.remove('show');
    }
    if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordInput.classList.add('error');
        confirmPasswordError.classList.add('show');
        isValid = false;
    } else {
        confirmPasswordInput.classList.remove('error');
        confirmPasswordError.classList.remove('show');
    }

    if (!termsCheckbox.checked) {
        termsCheckbox.parentElement.style.color = '#ff3b30';
        isValid = false;
    } else {
        termsCheckbox.parentElement.style.color = '#1d1d1f';
    }

    return isValid;
}

registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateForm()) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';

        setTimeout(() => {
            registrationForm.style.display = 'none';
            successMessage.style.display = 'block';
        }, 1500);
    }
});

goToLoginBtn.addEventListener('click', function () {
    window.location.href = "login.html"
});

document.querySelectorAll('.social-button').forEach(button => {
    button.addEventListener('click', function () {
        const social = this.classList.contains('vk-button') ? 'ВКонтакте' :
            this.classList.contains('google-button') ? 'Google' : 'Яндекс';

        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Вход через ${social}...`;

        setTimeout(() => {
            localStorage.setItem("user", mockdata.email)
            window.location.href = "profile.html"
            submitButton.disabled = false;
            submitButton.innerHTML = 'Зарегистрироваться';
        }, 1000);
    });
});

const inputs = [fullNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput];

inputs.forEach(input => {
    input.addEventListener('input', function () {
        this.classList.remove('error');

        if (this.id === 'password') {
            if (this.value.length >= 8) {
                passwordError.classList.remove('show');
            }
        }

        if (this.id === 'confirmPassword') {
            if (this.value === passwordInput.value) {
                confirmPasswordError.classList.remove('show');
            }
        }
    });

    input.addEventListener('blur', function () {
        if (this.id === 'fullName' && !this.value.trim()) {
            this.classList.add('error');
            fullNameError.classList.add('show');
        }

        if (this.id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.value)) {
                this.classList.add('error');
                emailError.classList.add('show');
            }
        }

        if (this.id === 'phone') {
            const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(this.value)) {
                this.classList.add('error');
                phoneError.classList.add('show');
            }
        }
    });
});