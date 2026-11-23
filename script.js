document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    if(mobileMenuBtn && mobileNavClose && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => mobileNav.classList.add('active'));
        mobileNavClose.addEventListener('click', () => mobileNav.classList.remove('active'));
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileNav.classList.remove('active');
            }
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if(otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // مدیریت دکمه بک موبایل (اندروید و آیفون) برای چت Crisp
    window.$crisp = window.$crisp || [];
    let isCrispOpen = false;
    let hasPushedChatState = false;

    window.$crisp.push(["on", "chat:opened", () => {
        isCrispOpen = true;

        // بستن منوی موبایل اگر کاربر از داخل منو چت را باز کرده باشد
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
        }

        // ثبت یک مرحله جدید در تاریخچه مرورگر هنگام باز شدن چت
        if (!hasPushedChatState) {
            window.history.pushState({ crispChatOpen: true }, '', window.location.href);
            hasPushedChatState = true;
        }
    }]);

    window.$crisp.push(["on", "chat:closed", () => {
        isCrispOpen = false;

        // اگر کاربر چت را با دکمه ضربدر بست، مرحله اضافی از تاریخچه پاک شود
        if (hasPushedChatState) {
            hasPushedChatState = false;
            window.history.back();
        }
    }]);

    // شنود دکمه بک گوشی و سوایپ به عقب در آیفون
    window.addEventListener('popstate', () => {
        if (isCrispOpen) {
            hasPushedChatState = false;
            window.$crisp.push(["do", "chat:close"]);
        }
    });
});
