/* ===== Navigation ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navAnchors = navLinks.querySelectorAll('a');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

navAnchors.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Active section highlighting
const sections = document.querySelectorAll('.section, .hero');

function updateActiveNav() {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            navAnchors.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

/* ===== Typing Effect ===== */
const typingEl = document.getElementById('typingText');
const roles = [
    'Staff AI/Data Architect',
    'GenAI Platform Lead',
    'Data Engineering Expert',
    'LLM & RAG Specialist',
    'Agentic AI Builder'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 70;

function typeEffect() {
    const current = roles[roleIndex];

    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 35;
    } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 70;
    }

    if (!isDeleting && charIndex === current.length) {
        typeSpeed = 2200;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

typeEffect();

/* ===== Animated Counters ===== */
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        if (counter.dataset.animated) return;
        const target = parseInt(counter.dataset.target);
        const duration = 1800;
        const start = performance.now();

        counter.dataset.animated = 'true';

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(update);
    });
}

// Trigger counters when hero stats become visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Small delay to sync with fadeInUp animation
            setTimeout(animateCounters, 600);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ===== Scroll Animations (Intersection Observer) ===== */
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width + '%';
                    bar.classList.add('animated');
                }, 200);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
});

/* ===== Custom Cursor Glow ===== */
const cursorGlow = document.getElementById('cursorGlow');

if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        // Smooth follow
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(updateCursor);
    }

    updateCursor();
}

/* ===== Back to Top ===== */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== Contact Form ===== */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="name"]').value;
    const email = contactForm.querySelector('[name="email"]').value;
    const message = contactForm.querySelector('[name="message"]').value;

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    window.location.href = `mailto:neeraj.football@gmail.com?subject=${subject}&body=${body}`;
});

/* ===== Project Card 3D Tilt Effect ===== */
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.project-card[data-tilt]').forEach(card => {
        const inner = card.querySelector('.project-card-inner');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 4;
            const rotateY = ((centerX - x) / centerX) * 4;

            inner.style.transform =
                `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            inner.style.transform = '';
            inner.style.transition = 'transform 0.4s ease';
            setTimeout(() => { inner.style.transition = ''; }, 400);
        });

        card.addEventListener('mouseenter', () => {
            inner.style.transition = 'none';
        });
    });
}

/* ===== Stagger animation delays ===== */
document.querySelectorAll('.expertise-cards .animate-on-scroll').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
});

document.querySelectorAll('.projects-grid .animate-on-scroll').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.07}s`;
});

document.querySelectorAll('.certs-grid .animate-on-scroll').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
});

document.querySelectorAll('.timeline-item.animate-on-scroll').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
});
