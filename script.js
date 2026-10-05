// ============================================================
// GSAP Premium Portfolio — Motion Choreography
// ============================================================

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

// ---- Smooth scroll for nav links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            gsap.to(window, {
                scrollTo: { y: target, offsetY: 80 },
                duration: 1,
                ease: "power3.inOut"
            });
        }
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        const hamburger = document.getElementById('hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// ---- Navbar Scroll Effect ----
const navbar = document.getElementById('navbar');

ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
        if (self.scroll() > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
}

// ---- Hero Entrance Animation ----
// Set initial invisible states via JS (CSS keeps them visible as fallback)
gsap.set('.hero-eyebrow', { opacity: 0, x: -30 });
gsap.set('.hero-name-line', { opacity: 0, y: 60 });
gsap.set('.hero-subtitle', { opacity: 0, y: 30 });
gsap.set('.hero-btns', { opacity: 0, y: 20 });
gsap.set('.hero-stats', { opacity: 0, x: 40 });
gsap.set('.hero-scroll-hint', { opacity: 0, y: 20 });

const heroTL = gsap.timeline({ defaults: { ease: "power4.out" } });

heroTL
    .to('.hero-eyebrow', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.3
    })
    .to('.hero-name-line', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15
    }, '-=0.4')
    .to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, '-=0.5')
    .to('.hero-btns', {
        opacity: 1,
        y: 0,
        duration: 0.7
    }, '-=0.4')
    .to('.hero-stats', {
        opacity: 1,
        x: 0,
        duration: 0.8
    }, '-=0.5')
    .to('.hero-scroll-hint', {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, '-=0.3');

// ---- Counter Animation ----
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    
    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
            gsap.to(el, {
                innerText: target,
                duration: 1.5,
                ease: "power2.out",
                snap: { innerText: 1 },
                onUpdate: function () {
                    el.textContent = Math.round(parseFloat(el.textContent));
                }
            });
        }
    });
});

// ---- Section Reveal Animations ----
// About section
gsap.fromTo('.about .section-heading',
    { opacity: 0, y: 40 },
    {
        scrollTrigger: { trigger: '.about', start: 'top 75%', once: true },
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
    }
);

gsap.fromTo('.about-body p',
    { opacity: 0, y: 30 },
    {
        scrollTrigger: { trigger: '.about-body', start: 'top 80%', once: true },
        opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out"
    }
);

gsap.fromTo('.achievement-card',
    { opacity: 0, x: -30 },
    {
        scrollTrigger: { trigger: '.achievement-cards', start: 'top 80%', once: true },
        opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: "power3.out"
    }
);

gsap.fromTo('.interview-callout',
    { opacity: 0, y: 30 },
    {
        scrollTrigger: { trigger: '.interview-callout', start: 'top 85%', once: true },
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out"
    }
);

gsap.fromTo('.domain-card',
    { opacity: 0, scale: 0.85, y: 20 },
    {
        scrollTrigger: { trigger: '.domain-grid', start: 'top 80%', once: true },
        opacity: 1, scale: 1, y: 0, duration: 0.6,
        stagger: { amount: 0.4, from: "random" },
        ease: "back.out(1.5)"
    }
);

// Skills section
gsap.fromTo('.skills .section-heading',
    { opacity: 0, y: 40 },
    {
        scrollTrigger: { trigger: '.skills', start: 'top 75%', once: true },
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
    }
);

gsap.fromTo('.skill-block',
    { opacity: 0, y: 40 },
    {
        scrollTrigger: { trigger: '.skills-bento', start: 'top 80%', once: true },
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out"
    }
);

// Projects section
gsap.fromTo('.projects .section-heading',
    { opacity: 0, y: 40 },
    {
        scrollTrigger: { trigger: '.projects', start: 'top 75%', once: true },
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
    }
);

gsap.fromTo('.projects-subtitle',
    { opacity: 0, y: 20 },
    {
        scrollTrigger: { trigger: '.projects', start: 'top 75%', once: true },
        opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power3.out"
    }
);

// Horizontal scroll for projects track
const projectsTrack = document.querySelector('.projects-track');
if (projectsTrack) {
    gsap.to(projectsTrack, {
        x: () => -(projectsTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.1),
        ease: "none",
        scrollTrigger: {
            trigger: ".projects",
            start: "top top",
            end: () => `+=${projectsTrack.scrollWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });
}

// Fade in project cards as they enter
gsap.fromTo('.project-card',
    { opacity: 0, scale: 0.9 },
    {
        scrollTrigger: { trigger: '.projects', start: 'top 50%', once: true },
        opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out"
    }
);

// Footer section
gsap.fromTo('.footer .section-heading',
    { opacity: 0, y: 40 },
    {
        scrollTrigger: { trigger: '.footer', start: 'top 80%', once: true },
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
    }
);

gsap.fromTo('.footer-link-card',
    { opacity: 0, x: 30 },
    {
        scrollTrigger: { trigger: '.footer-links', start: 'top 85%', once: true },
        opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power3.out"
    }
);

// ---- Parallax Orbs on Scroll ----
gsap.to('.orb-1', {
    y: -150,
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2
    }
});

gsap.to('.orb-2', {
    y: -200,
    x: -80,
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 3
    }
});

gsap.to('.orb-3', {
    y: -100,
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5
    }
});

// ---- Hero Scroll Fade ----
gsap.to('.hero-content', {
    opacity: 0,
    y: -60,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '60% top',
        scrub: 1
    }
});

gsap.to('#hero-canvas', {
    opacity: 0,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '80% top',
        scrub: 1
    }
});

// ---- Modal System ----
document.addEventListener('DOMContentLoaded', () => {
    // Inject Modal HTML
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-content-box">
            <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const modalClose = modalOverlay.querySelector('.modal-close');
    const modalBody = modalOverlay.querySelector('.modal-body');

    // Add click listeners to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking a link inside the card
            if (e.target.closest('a')) return;
            
            const detailsElement = card.querySelector('.project-details');
            if (detailsElement) {
                modalBody.innerHTML = detailsElement.innerHTML;
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close logic
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});

// ---- Magnetic Hover on Cards ----
const magneticCards = document.querySelectorAll('.domain-card, .stat-item');

magneticCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(card, {
            rotateX: -y / 15,
            rotateY: x / 15,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 800
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)"
        });
    });
});

// ---- Skill Tag Hover Stagger ----
const skillBlocks = document.querySelectorAll('.skill-block');

skillBlocks.forEach(block => {
    const tags = block.querySelectorAll('.skill-tag');
    
    block.addEventListener('mouseenter', () => {
        gsap.fromTo(tags,
            { scale: 0.9, opacity: 0.5 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                stagger: 0.04,
                ease: "back.out(2)",
                overwrite: "auto"
            }
        );
    });
});

// ============================================================
// Hero Canvas Animation (Circuit Lines)
// ============================================================
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
let heroWidth, heroHeight;
let heroLines = [];
let heroAnimationDone = false;

function calculatePathLength(path) {
    let len = 0;
    for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i - 1].x;
        const dy = path[i].y - path[i - 1].y;
        len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
}

function initHeroCanvas() {
    if (!heroCanvas) return;
    heroWidth = heroCanvas.parentElement.clientWidth;
    heroHeight = heroCanvas.parentElement.clientHeight;
    heroCanvas.width = heroWidth;
    heroCanvas.height = heroHeight;
    generateHeroLines();
}

function generateHeroLines() {
    heroLines = [];
    const hGrid = 40;
    const numLinesPerSide = Math.floor(heroHeight / hGrid);

    // Generate Left Side Lines
    for (let i = 0; i < numLinesPerSide; i++) {
        const startY = Math.floor(Math.random() * (heroHeight / hGrid)) * hGrid;
        const path = [{ x: 0, y: startY }];
        let cx = 0, cy = startY;

        const segments = 3 + Math.floor(Math.random() * 4);
        for (let j = 0; j < segments; j++) {
            const dir = Math.floor(Math.random() * 3);
            const dist = (1 + Math.floor(Math.random() * 3)) * hGrid;

            if (dir === 0) { cx += dist; }
            else if (dir === 1) { cx += dist; cy -= dist; }
            else if (dir === 2) { cx += dist; cy += dist; }

            if (cx > heroWidth * 0.35) cx = heroWidth * 0.35;
            path.push({ x: cx, y: cy });
        }

        const filteredPath = path.filter((pt, k, arr) =>
            k === 0 || pt.x !== arr[k - 1].x || pt.y !== arr[k - 1].y
        );

        const accentColor = '#34d399';
        const dimColor = 'rgba(52, 211, 153, 0.3)';

        const pathAccent = JSON.parse(JSON.stringify(filteredPath));
        const pathDim = JSON.parse(JSON.stringify(filteredPath));
        const sharedDelay = Math.random() * 0.8;
        const sharedSpeed = 0.0008 + Math.random() * 0.0004;

        heroLines.push({
            path: pathAccent,
            length: calculatePathLength(pathAccent),
            delay: sharedDelay,
            speed: sharedSpeed,
            color: accentColor,
            offset: -3
        });
        heroLines.push({
            path: pathDim,
            length: calculatePathLength(pathDim),
            delay: sharedDelay,
            speed: sharedSpeed,
            color: dimColor,
            offset: 3
        });
    }

    // Generate Right Side Lines
    for (let i = 0; i < numLinesPerSide; i++) {
        const startY = Math.floor(Math.random() * (heroHeight / hGrid)) * hGrid;
        const path = [{ x: heroWidth, y: startY }];
        let cx = heroWidth, cy = startY;

        const segments = 3 + Math.floor(Math.random() * 4);
        for (let j = 0; j < segments; j++) {
            const dir = Math.floor(Math.random() * 3);
            const dist = (1 + Math.floor(Math.random() * 3)) * hGrid;

            if (dir === 0) { cx -= dist; }
            else if (dir === 1) { cx -= dist; cy -= dist; }
            else if (dir === 2) { cx -= dist; cy += dist; }

            if (cx < heroWidth * 0.65) cx = heroWidth * 0.65;
            path.push({ x: cx, y: cy });
        }

        const filteredPath = path.filter((pt, k, arr) =>
            k === 0 || pt.x !== arr[k - 1].x || pt.y !== arr[k - 1].y
        );

        const accentColor = '#34d399';
        const dimColor = 'rgba(52, 211, 153, 0.3)';

        const pathAccent = JSON.parse(JSON.stringify(filteredPath));
        const pathDim = JSON.parse(JSON.stringify(filteredPath));
        const sharedDelay = Math.random() * 0.8;
        const sharedSpeed = 0.0008 + Math.random() * 0.0004;

        heroLines.push({
            path: pathAccent,
            length: calculatePathLength(pathAccent),
            delay: sharedDelay,
            speed: sharedSpeed,
            color: accentColor,
            offset: -3
        });
        heroLines.push({
            path: pathDim,
            length: calculatePathLength(pathDim),
            delay: sharedDelay,
            speed: sharedSpeed,
            color: dimColor,
            offset: 3
        });
    }
}

// Hero Animation Loop
let heroTime = 0;

function animateHero() {
    if (!heroCtx) return;
    heroTime += 1;
    heroCtx.clearRect(0, 0, heroWidth, heroHeight);

    heroCtx.lineWidth = 1.5;
    heroCtx.lineCap = 'round';
    heroCtx.lineJoin = 'round';
    heroCtx.shadowBlur = 8;

    let allComplete = true;

    heroLines.forEach(line => {
        let p = (heroTime * line.speed) - line.delay;
        if (p < 0) p = 0;
        if (p < 1.0) allComplete = false;
        if (p >= 1.0) p = 1.0;

        if (p === 0) return;

        heroCtx.strokeStyle = line.color;
        heroCtx.shadowColor = line.color;

        let targetLength = line.length * p;
        let currentLength = 0;
        let drawEndNode = false;
        let endNodePos = null;

        heroCtx.beginPath();
        let startedDrawing = false;

        for (let i = 1; i < line.path.length; i++) {
            const p1 = line.path[i - 1];
            const p2 = line.path[i];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);

            if (segmentLength < 0.001) continue;

            let offsetX = (-dy / segmentLength) * line.offset;
            let offsetY = (dx / segmentLength) * line.offset;

            if (!startedDrawing) {
                heroCtx.moveTo(p1.x + offsetX, p1.y + offsetY);
                startedDrawing = true;
            }

            if (currentLength + segmentLength <= targetLength) {
                heroCtx.lineTo(p2.x + offsetX, p2.y + offsetY);
                currentLength += segmentLength;

                if (i === line.path.length - 1 && p >= 0.99) {
                    drawEndNode = true;
                    endNodePos = { x: p2.x + offsetX, y: p2.y + offsetY };
                }
            } else {
                const ratio = (targetLength - currentLength) / segmentLength;
                const intermediateX = p1.x + dx * ratio;
                const intermediateY = p1.y + dy * ratio;
                heroCtx.lineTo(intermediateX + offsetX, intermediateY + offsetY);
                heroCtx.stroke();
                drawHeroNode(intermediateX + offsetX, intermediateY + offsetY, line.color);
                currentLength += segmentLength;
                break;
            }
        }
        if (p >= 0.99) {
            heroCtx.stroke();
        }
        if (drawEndNode && endNodePos) {
            drawHeroNode(endNodePos.x, endNodePos.y, line.color);
        }
    });

    if (!allComplete) {
        requestAnimationFrame(animateHero);
    } else if (!heroAnimationDone) {
        heroAnimationDone = true;
    }
}

function drawHeroNode(x, y, color) {
    heroCtx.save();
    heroCtx.fillStyle = color;
    heroCtx.shadowBlur = 12;
    heroCtx.shadowColor = color;
    heroCtx.beginPath();
    heroCtx.arc(x, y, 3, 0, Math.PI * 2);
    heroCtx.fill();
    heroCtx.restore();
}

// Initialize canvas
window.addEventListener('resize', () => {
    if (heroCanvas) initHeroCanvas();
});

if (heroCanvas) {
    initHeroCanvas();
    animateHero();
}

// ---- Active Nav Link Highlighting ----
const sections = document.querySelectorAll('section, footer');
const navAnchors = document.querySelectorAll('.nav-links a[data-nav]');

ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(a => {
            a.classList.remove('active-nav');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active-nav');
            }
        });
    }
});

// Style for active nav (injected dynamically)
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-links a.active-nav {
        color: var(--accent) !important;
    }
    .nav-links a.active-nav::after {
        width: 100% !important;
    }
`;
document.head.appendChild(navStyle);
