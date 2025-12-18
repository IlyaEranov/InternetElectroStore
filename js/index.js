document.getElementById("contacts-link").addEventListener("click", () => {
    window.scrollTo({top: 10000, left: 0, behavior: "smooth"})
})

document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
    let mobileMenu = document.querySelector('.mobile-menu');

    if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.style.cssText = `
                    position: absolute;
                    top: 70px;  
                    left: 0;
                    right: 0;
                    background-color: #1d1d1f;
                    padding: 20px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    z-index: 1000;
                    border-top: 1px solid #424245;
                `;
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const mobileLink = link.cloneNode(true);
            mobileLink.style.cssText = `
                        color: #a1a1a6;
                        text-decoration: none;
                        font-size: 18px;
                        padding: 10px 0;
                        border-bottom: 1px solid #424245;
                    `;
            mobileMenu.appendChild(mobileLink);
        });

        document.querySelector('.header').appendChild(mobileMenu);
        mobileMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.remove();
                document.querySelector('.mobile-menu-btn i').className = 'fas fa-bars';
            });
        });
        this.querySelector('i').className = 'fas fa-times';
    } else {
        mobileMenu.remove();
        this.querySelector('i').className = 'fas fa-bars';
    }
});

document.addEventListener('click', function (e) {
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (mobileMenu && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.remove();
        menuBtn.querySelector('i').className = 'fas fa-bars';
    }
});

window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuBtn = document.querySelector('.mobile-menu-btn');

        if (mobileMenu) {
            mobileMenu.remove();
            if (menuBtn) {
                menuBtn.querySelector('i').className = 'fas fa-bars';
            }
        }
    }
});