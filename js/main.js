/* ============================================================
   Hertsmere Drives & Landscapes — Demo Interactions
   ============================================================ */

(function () {
    'use strict';

    // ----------------------------------------------------------
    // 1. Sticky nav scroll class
    // ----------------------------------------------------------
    const nav = document.querySelector('[data-nav]');
    let lastScroll = 0;

    function updateNav() {
        const y = window.scrollY;
        if (y > 60) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
        lastScroll = y;
    }

    // ----------------------------------------------------------
    // 2. Hero parallax (rAF throttled, subtle)
    // ----------------------------------------------------------
    const heroImage = document.querySelector('[data-hero-image]');
    let heroTicking = false;

    function updateHero() {
        if (!heroImage) return;
        const y = window.scrollY;
        // Cap parallax travel at 24px, damping 0.08
        const offset = Math.max(-24, Math.min(0, -y * 0.08));
        heroImage.style.setProperty('--hero-y', offset + 'px');
    }

    function onScroll() {
        if (!heroTicking) {
            window.requestAnimationFrame(function () {
                updateNav();
                updateHero();
                heroTicking = false;
            });
            heroTicking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateNav();
    updateHero();

    // ----------------------------------------------------------
    // 3. IntersectionObserver for reveal-on-scroll
    // ----------------------------------------------------------
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in-view'); });
    }

    // ----------------------------------------------------------
    // 4. Mobile nav toggle
    // ----------------------------------------------------------
    const navToggle = document.querySelector('[data-nav-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function () {
            const open = mobileNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.style.overflow = open ? 'hidden' : '';
        });

        // Close on nav link click
        mobileNav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                mobileNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ----------------------------------------------------------
    // 5. Demo modal (all CTAs open this)
    // ----------------------------------------------------------
    const modal = document.querySelector('[data-modal]');
    const modalPanel = document.querySelector('[data-modal-panel]');
    const modalCloseEls = document.querySelectorAll('[data-modal-close]');
    const ctaTriggers = document.querySelectorAll('[data-modal-trigger]');

    function openModal(e) {
        if (e) { e.preventDefault(); }
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        // Focus first focusable element in modal for accessibility
        setTimeout(function () {
            const firstBtn = modalPanel && modalPanel.querySelector('button');
            if (firstBtn) firstBtn.focus();
        }, 50);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    ctaTriggers.forEach(function (el) {
        el.addEventListener('click', openModal);
    });
    modalCloseEls.forEach(function (el) {
        el.addEventListener('click', closeModal);
    });
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // ----------------------------------------------------------
    // 6. Footer year
    // ----------------------------------------------------------
    const yearEl = document.querySelector('[data-year]');
    if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

})();
