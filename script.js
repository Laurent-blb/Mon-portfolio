document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const sections = [...document.querySelectorAll('main section[id]')];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateNavbar = () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 24);
    };
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    const menuIcon = (open = false) => open
        ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
        : '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';

    const closeMenu = () => {
        navLinks?.classList.remove('active');
        mobileBtn?.setAttribute('aria-expanded', 'false');
        mobileBtn?.setAttribute('aria-label', 'Ouvrir le menu');
        if (mobileBtn) mobileBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${menuIcon()}</svg>`;
    };

    mobileBtn?.addEventListener('click', () => {
        const isOpen = !navLinks?.classList.contains('active');
        navLinks?.classList.toggle('active', isOpen);
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
        mobileBtn.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
        mobileBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${menuIcon(isOpen)}</svg>`;
    });
    document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', closeMenu));

    document.querySelectorAll('.social-placeholder').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
        });
    });

    const cvRequest = document.querySelector('#cv-request');
    cvRequest?.addEventListener('click', (event) => {
        event.preventDefault();
        const subject = encodeURIComponent('Demande d’autorisation pour consulter le CV — Laurent Bisimwa');
        const body = encodeURIComponent('Bonjour Laurent,\n\nJe souhaite recevoir l’autorisation de consulter votre CV au format PDF.\n\nNom / entreprise :\nMotif de la demande :\n\nCordialement,');
        window.location.href = `mailto:bisimwalaurent@gmail.com?subject=${subject}&body=${body}`;
    });

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('.fade-in-up').forEach((element) => revealObserver.observe(element));
    } else {
        document.querySelectorAll('.fade-in-up').forEach((element) => element.classList.add('visible'));
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            document.querySelectorAll('.nav-links a').forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));

    const avatarContainer = document.querySelector('.hex-container');
    const floatingBadges = document.querySelectorAll('.floating-badge');
    if (avatarContainer && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
        avatarContainer.addEventListener('pointermove', (event) => {
            const bounds = avatarContainer.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            floatingBadges.forEach((badge, index) => {
                const speed = (index + 1) * 9;
                badge.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
        avatarContainer.addEventListener('pointerleave', () => {
            floatingBadges.forEach((badge) => { badge.style.transform = ''; });
        });
    }

    const contactForm = document.querySelector('#contact-form');
    const successMessage = document.querySelector('#success-msg');
    contactForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.querySelector('#name')?.value.trim();
        const email = document.querySelector('#email')?.value.trim();
        const message = document.querySelector('#message')?.value.trim();
        const subject = encodeURIComponent(`Demande de collaboration — ${name}`);
        const body = encodeURIComponent(`Bonjour Laurent,\n\nNom / entreprise : ${name}\nEmail : ${email}\n\nMessage :\n${message}`);
        window.location.href = `mailto:bisimwalaurent@gmail.com?subject=${subject}&body=${body}`;
        if (successMessage) successMessage.textContent = 'Votre client email va s’ouvrir pour finaliser l’envoi.';
    });
});
