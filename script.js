// ============================================================
// ROSHAN V N — Portfolio Interactive Systems (Google Gemini Experience)
// Core Systems:
// 1. Interactive Subtle Grey Mesh Background Canvas (Batched 2D, <1.5% CPU)
// 2. Google Gemini Pinned Horizontal Scroll (Driven by vertical page scroll, zero wheel hijack)
// 3. Project Details Modal System
// 4. Navigation & Smooth Scroll Spy
// 5. Telemetry KPI Counters
// ============================================================

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
    initGreyMeshCanvas();
    initProjectsPinnedScroll();
    initProjectModal();
    initNavAndScroll();
    initTelemetryCounters();
});

// ============================================================
// 1. INTERACTIVE GREY MESH CANVAS BACKGROUND
// Subtle slate grey lattice, ambient drift, gentle mouse physics
// Batched 2D draw calls, 0% CPU on tab sleep, responsive resize
// ============================================================
function initGreyMeshCanvas() {
    let canvas = document.getElementById('bg-mesh-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bg-mesh-canvas';
        canvas.className = 'bg-mesh-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(canvas, document.body.firstChild);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let nodes = [];
    const CELL_SIZE = 54; // Spacing in CSS pixels

    // Mouse telemetry with smooth lerp
    let mouse = { x: -9999, y: -9999, active: false };
    let smoothMouse = { x: -9999, y: -9999 };
    let rafId = null;
    let isSleeping = false;

    function resizeMesh() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        cols = Math.ceil(width / CELL_SIZE) + 2;
        rows = Math.ceil(height / CELL_SIZE) + 2;

        nodes = [];
        for (let j = 0; j < rows; j++) {
            const rowArr = [];
            for (let i = 0; i < cols; i++) {
                rowArr.push({
                    baseX: (i - 1) * CELL_SIZE,
                    baseY: (j - 1) * CELL_SIZE,
                    x: (i - 1) * CELL_SIZE,
                    y: (j - 1) * CELL_SIZE,
                    phaseX: i * 0.42 + j * 0.28,
                    phaseY: i * 0.25 + j * 0.47
                });
            }
            nodes.push(rowArr);
        }
    }

    // Passive pointer listeners
    window.addEventListener('pointermove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
    });

    let startTime = performance.now();

    function renderMeshFrame(now) {
        if (isSleeping) return;

        const time = (now - startTime) * 0.001;

        // Smooth mouse lerping
        if (mouse.active) {
            smoothMouse.x += (mouse.x - smoothMouse.x) * 0.12;
            smoothMouse.y += (mouse.y - smoothMouse.y) * 0.12;
        } else {
            smoothMouse.x = -9999;
            smoothMouse.y = -9999;
        }

        ctx.clearRect(0, 0, width, height);

        const INFLUENCE_RADIUS = 140;
        const INFLUENCE_SQ = INFLUENCE_RADIUS * INFLUENCE_RADIUS;

        // 1. Update node physics
        for (let j = 0; j < rows; j++) {
            const rowArr = nodes[j];
            for (let i = 0; i < cols; i++) {
                const node = rowArr[i];

                // Gentle ambient trigonometric drift (3.2px max)
                const ambX = Math.sin(time * 0.8 + node.phaseX) * 3.2;
                const ambY = Math.cos(time * 0.9 + node.phaseY) * 3.2;

                let targetX = node.baseX + ambX;
                let targetY = node.baseY + ambY;

                // Mouse interaction (gentle spring displacement)
                if (mouse.active) {
                    const dx = targetX - smoothMouse.x;
                    const dy = targetY - smoothMouse.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < INFLUENCE_SQ && distSq > 1) {
                        const dist = Math.sqrt(distSq);
                        const force = (1 - dist / INFLUENCE_RADIUS);
                        targetX += (dx / dist) * force * 22;
                        targetY += (dy / dist) * force * 22;
                    }
                }

                // Spring physics integration
                node.x += (targetX - node.x) * 0.12;
                node.y += (targetY - node.y) * 0.12;
            }
        }

        // 2. BATCH DRAW CALL 1: Render All Grid Lines in a Single Stroke
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'rgba(160, 160, 185, 0.055)';

        // Horizontal line strands
        for (let j = 0; j < rows; j++) {
            ctx.moveTo(nodes[j][0].x, nodes[j][0].y);
            for (let i = 1; i < cols; i++) {
                ctx.lineTo(nodes[j][i].x, nodes[j][i].y);
            }
        }

        // Vertical line strands
        for (let i = 0; i < cols; i++) {
            ctx.moveTo(nodes[0][i].x, nodes[0][i].y);
            for (let j = 1; j < rows; j++) {
                ctx.lineTo(nodes[j][i].x, nodes[j][i].y);
            }
        }
        ctx.stroke();

        // 3. BATCH DRAW CALL 2: Render All Vertex Dots in a Single Fill
        ctx.beginPath();
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                const node = nodes[j][i];
                ctx.moveTo(node.x + 1.2, node.y);
                ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2);
            }
        }
        ctx.fillStyle = 'rgba(180, 180, 210, 0.22)';
        ctx.fill();

        // 4. Subtle Cursor Mesh Highlight Aura
        if (mouse.active && smoothMouse.x > -100 && smoothMouse.x < width + 100) {
            const aura = ctx.createRadialGradient(
                smoothMouse.x, smoothMouse.y, 0,
                smoothMouse.x, smoothMouse.y, INFLUENCE_RADIUS
            );
            aura.addColorStop(0, 'rgba(180, 200, 230, 0.06)');
            aura.addColorStop(1, 'rgba(180, 200, 230, 0)');
            ctx.fillStyle = aura;
            ctx.beginPath();
            ctx.arc(smoothMouse.x, smoothMouse.y, INFLUENCE_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }

        rafId = requestAnimationFrame(renderMeshFrame);
    }

    // Page Visibility API: Sleep when tab is hidden (Zero idle CPU)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isSleeping = true;
            if (rafId) cancelAnimationFrame(rafId);
        } else {
            isSleeping = false;
            startTime = performance.now();
            rafId = requestAnimationFrame(renderMeshFrame);
        }
    });

    resizeMesh();
    renderMeshFrame(performance.now());

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeMesh, 120);
    });
}

// ============================================================
// 2. GOOGLE GEMINI PINNED HORIZONTAL PROJECTS SCROLL
// Driven strictly by native vertical page scroll
// Zero wheel hijacking, zero freezing, 100% fluid pass-through
// ============================================================
function initProjectsPinnedScroll() {
    const section = document.getElementById('projects');
    const viewport = document.getElementById('projects-viewport');
    const track = document.getElementById('projects-track');
    const prevBtn = document.getElementById('proj-prev-btn');
    const nextBtn = document.getElementById('proj-next-btn');
    const counterCurrent = document.getElementById('projects-counter-current');
    const progressThumb = document.getElementById('projects-progress-thumb');
    const cards = document.querySelectorAll('.project-card');

    if (!section || !viewport || !track || cards.length === 0) return;

    const totalCards = cards.length;

    // Helper: calculate exact travel distance needed
    function getScrollDistance() {
        const endMargin = Math.max(60, window.innerWidth * 0.06);
        return Math.max(0, track.scrollWidth - viewport.clientWidth + endMargin);
    }

    // Clean up any pre-existing ScrollTriggers for this section
    ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section || (st.vars && st.vars.trigger === section)) {
            st.kill();
        }
    });

    // GSAP ScrollTrigger Horizontal Pinning Tween
    const horizontalTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.8, // 0.8s smooth scrub inertia matching Google Gemini feel
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
                const progress = self.progress; // 0.0 to 1.0

                // 1. Update Progress Bar Thumb
                if (progressThumb) {
                    const thumbShift = progress * (totalCards - 1) * 100;
                    progressThumb.style.transform = `translateX(${thumbShift}%)`;
                }

                // 2. Update Active Card Counter (01 to 08)
                const activeIdx = Math.min(totalCards - 1, Math.round(progress * (totalCards - 1)));
                if (counterCurrent) {
                    const formatted = String(activeIdx + 1).padStart(2, '0');
                    if (counterCurrent.textContent !== formatted) {
                        counterCurrent.textContent = formatted;
                    }
                }

                // 3. Update Prev / Next Buttons disabled state
                if (prevBtn) prevBtn.disabled = (progress <= 0.015);
                if (nextBtn) nextBtn.disabled = (progress >= 0.985);
            }
        }
    });

    // Prev Button: Smooth-scroll the window vertically to the previous card scroll offset
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const st = horizontalTween.scrollTrigger;
            if (!st) return;
            const currentProgress = st.progress;
            const targetProgress = Math.max(0, currentProgress - (1 / (totalCards - 1)));
            const targetScrollY = st.start + targetProgress * (st.end - st.start);
            gsap.to(window, {
                scrollTo: targetScrollY,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }

    // Next Button: Smooth-scroll the window vertically to the next card scroll offset
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const st = horizontalTween.scrollTrigger;
            if (!st) return;
            const currentProgress = st.progress;
            const targetProgress = Math.min(1, currentProgress + (1 / (totalCards - 1)));
            const targetScrollY = st.start + targetProgress * (st.end - st.start);
            gsap.to(window, {
                scrollTo: targetScrollY,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }

    // Keyboard Arrow navigation when section is in view
    window.addEventListener('keydown', (e) => {
        const st = horizontalTween.scrollTrigger;
        if (!st || !st.isActive) return;
        if (e.key === 'ArrowRight' && nextBtn && !nextBtn.disabled) {
            nextBtn.click();
        } else if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.disabled) {
            prevBtn.click();
        }
    });
}

// ============================================================
// 3. PROJECT DETAILS MODAL
// ============================================================
function initProjectModal() {
    let modalOverlay = document.querySelector('.modal-overlay');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.setAttribute('role', 'dialog');
        modalOverlay.setAttribute('aria-modal', 'true');
        modalOverlay.innerHTML = `
            <div class="modal-content-box">
                <button class="modal-close" aria-label="Close modal"><i class="fa-solid fa-xmark"></i></button>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }

    const modalClose = modalOverlay.querySelector('.modal-close');
    const modalBody = modalOverlay.querySelector('.modal-body');

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Attach click listeners to cards
    document.querySelectorAll('.project-card').forEach(card => {
        function triggerOpen(e) {
            if (e.target.closest('a')) return;

            const details = card.querySelector('.project-details');
            if (details) {
                modalBody.innerHTML = details.innerHTML;
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        card.addEventListener('click', triggerOpen);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerOpen(e);
            }
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============================================================
// 4. NAVIGATION, SMOOTH SCROLL & ACTIVE LINK TRACKER
// ============================================================
function initNavAndScroll() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger && hamburger.classList.remove('active');
                hamburger && hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }

            if (href === '#projects') {
                e.preventDefault();
                gsap.to(window, {
                    scrollTo: { y: 0 },
                    duration: 0.8,
                    ease: "power2.inOut"
                });
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 70 },
                    duration: 0.9,
                    ease: "power3.inOut"
                });
            }
        });
    });

    // Navbar scroll background shift
    if (navbar) {
        ScrollTrigger.create({
            start: 'top -60',
            onUpdate: (self) => {
                if (self.scroll() > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });
    }

    // Mobile Hamburger Toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        });
    }

    // Active Nav Highlighting on Scroll
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-links a[data-nav]');

    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: () => {
            let currentId = '';
            sections.forEach(sec => {
                const top = sec.offsetTop - 120;
                if (window.scrollY >= top) {
                    currentId = sec.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active-nav');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active-nav');
                }
            });
        }
    });
}

// ============================================================
// 5. TELEMETRY KPI COUNTERS
// ============================================================
function initTelemetryCounters() {
    const values = document.querySelectorAll('.telemetry-value');
    values.forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        if (isNaN(target)) return;

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.fromTo(el,
                    { innerText: 0 },
                    {
                        innerText: target,
                        duration: 1.5,
                        ease: "power2.out",
                        snap: { innerText: 1 },
                        onUpdate: function () {
                            el.textContent = Math.round(parseFloat(el.textContent));
                        }
                    }
                );
            }
        });
    });
}
