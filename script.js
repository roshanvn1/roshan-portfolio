// ============================================================
// ROSHAN V N — Portfolio Interactive Systems
// Core Features:
// 1. Metal-on-Stone Spark Cursor Trail (Dormant RAF, 0% Idle CPU)
// 2. Targeted Vector Circuit Lines with Name Exclusion Zone
// 3. Sideways-Scrolling Projects Carousel (Google AI Reference)
// 4. Modal System & Nav Telemetry
// ============================================================

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
    initSparkCursor();
    initHeroLines();
    initProjectsCarousel();
    initProjectModal();
    initNavAndScroll();
    initTelemetryCounters();
});

// ============================================================
// 1. METAL-ON-STONE SPARK CURSOR TRAIL
// Strict Zero-Idle CPU & Stationary Extinction Protocol
// ============================================================
function initSparkCursor() {
    // Only initialize on pointer-fine devices (desktops/laptops with mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const canvas = document.getElementById('cursor-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Pre-allocated Particle Pool (Zero GC allocation in frame loop)
    const MAX_PARTICLES = 70;
    const pool = Array.from({ length: MAX_PARTICLES }, () => ({
        active: false,
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 0,
        size: 1.5,
        sparkType: 0 // 0: Cerulean blue core, 1: Neon rose accent
    }));

    let isLoopRunning = false;
    let lastX = null;
    let lastY = null;

    function spawnSparks(x, y, dx, dy, speed) {
        // Spark count scaled with speed: 1 to 4 sparks per movement step
        const count = Math.min(Math.max(Math.floor(speed * 0.16), 1), 4);
        const moveAngle = Math.atan2(dy, dx);

        for (let c = 0; c < count; c++) {
            const p = pool.find(item => !item.active);
            if (!p) break;

            p.active = true;
            // Spawn point with micro jitter
            p.x = x + (Math.random() - 0.5) * 4;
            p.y = y + (Math.random() - 0.5) * 4;
            p.prevX = p.x;
            p.prevY = p.y;

            // Metal on stone: sparks sheer backwards/tangentially with scatter cone
            const scatter = (moveAngle + Math.PI) + (Math.random() - 0.5) * 1.5;
            const sparkSpeed = (Math.random() * 4.5 + 2.5) * Math.min(speed * 0.09, 1.8);

            p.vx = Math.cos(scatter) * sparkSpeed;
            p.vy = Math.sin(scatter) * sparkSpeed;
            p.maxLife = Math.floor(Math.random() * 8 + 8); // 8-16 frames (130-260ms)
            p.life = p.maxLife;
            p.size = Math.random() * 1.4 + 1.0;
            p.sparkType = Math.random() < 0.22 ? 1 : 0; // 22% Neon Rose, 78% Cerulean
        }

        // Wake up RAF loop if dormant
        if (!isLoopRunning) {
            isLoopRunning = true;
            requestAnimationFrame(renderSparkLoop);
        }
    }

    window.addEventListener('pointermove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        if (lastX !== null && lastY !== null) {
            const dx = x - lastX;
            const dy = y - lastY;
            const speed = Math.hypot(dx, dy);

            // STRICT MOTION THRESHOLD: No sparks when stationary or micro-jitter (< 2.0px)
            if (speed >= 2.0) {
                spawnSparks(x, y, dx, dy, speed);
            }
        }

        lastX = x;
        lastY = y;
    }, { passive: true });

    window.addEventListener('pointerleave', () => {
        lastX = null;
        lastY = null;
    });

    function renderSparkLoop() {
        ctx.clearRect(0, 0, width, height);
        ctx.lineCap = 'round';

        let activeCount = 0;

        for (let i = 0; i < MAX_PARTICLES; i++) {
            const p = pool[i];
            if (!p.active) continue;

            activeCount++;
            p.prevX = p.x;
            p.prevY = p.y;

            // Physical air drag deceleration and subtle downward gravity
            p.vx *= 0.88;
            p.vy = p.vy * 0.88 + 0.22;

            p.x += p.vx;
            p.y += p.vy;
            p.life--;

            if (p.life <= 0) {
                p.active = false;
                continue;
            }

            const progress = 1 - (p.life / p.maxLife); // 0 (birth) -> 1 (death)
            const alpha = Math.max(0, 1 - progress);

            ctx.beginPath();
            ctx.moveTo(p.prevX, p.prevY);
            ctx.lineTo(p.x, p.y);

            // Thermal incandescent spectrum:
            // Ignition: White-hot core -> Mid: Neon Cerulean -> Cool down: Neon Rose
            if (progress < 0.2) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = p.size * 1.3;
            } else if (p.sparkType === 1 || progress > 0.75) {
                ctx.strokeStyle = `rgba(255, 0, 127, ${alpha * 0.9})`; // Neon rose
                ctx.lineWidth = p.size * 0.85;
            } else {
                ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`; // Cerulean blue
                ctx.lineWidth = p.size;
            }

            ctx.stroke();
        }

        // STRICT DORMANT RAF ENFORCEMENT:
        // Once activeCount reaches 0, the loop halts completely (0% CPU at idle)
        if (activeCount > 0) {
            requestAnimationFrame(renderSparkLoop);
        } else {
            isLoopRunning = false;
            ctx.clearRect(0, 0, width, height);
        }
    }
}

// ============================================================
// 2. TARGETED HERO CIRCUIT LINES (CONVERGING ON TOP NAME)
// 45°/90° PCB Routing with Text Exclusion Zone Protection
// ============================================================
function initHeroLines() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let traces = [];
    let pulses = [];
    let targetBox = { left: 0, top: 0, right: 0, bottom: 0, centerX: 0, centerY: 0, titleTop: 9999 };
    let animFrameId = null;

    function updateTargetCoordinates() {
        const headerBlock = document.querySelector('.hero-header-block');
        const nameEl = document.getElementById('hero-name-target') || document.querySelector('.hero-name');
        const titleEl = document.querySelector('.hero-title');
        const eyebrowEl = document.querySelector('.hero-eyebrow');
        if (!headerBlock || !nameEl) return;

        const nameRect = nameEl.getBoundingClientRect();
        const headerRect = headerBlock.getBoundingClientRect();
        const heroRect = canvas.parentElement.getBoundingClientRect();

        const isMobile = width < 768;
        // Compute widest text element inside header to ensure pads never overlap title or eyebrow
        const titleWidth = titleEl ? titleEl.getBoundingClientRect().width : 0;
        const eyebrowWidth = eyebrowEl ? eyebrowEl.getBoundingClientRect().width : 0;
        const effectiveWidth = Math.max(nameRect.width, Math.min(titleWidth * 0.9, width - 80));

        const padX = isMobile ? Math.max(16, (width - effectiveWidth) / 2 - 20) : 50;
        const padY = isMobile ? 12 : 20;

        targetBox = {
            left: Math.max(16, nameRect.left - heroRect.left - padX),
            top: Math.max(10, nameRect.top - heroRect.top - padY),
            right: Math.min(width - 16, nameRect.right - heroRect.left + padX),
            bottom: nameRect.bottom - heroRect.top + padY,
            centerX: (nameRect.left + nameRect.right) / 2 - heroRect.left,
            centerY: (nameRect.top + nameRect.bottom) / 2 - heroRect.top,
            titleTop: titleEl ? (titleEl.getBoundingClientRect().top - heroRect.top - 16) : 9999
        };
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        updateTargetCoordinates();
        buildCircuitTraces();
    }

    function buildCircuitTraces() {
        traces = [];
        pulses = [];

        // Scale trace density by viewport dimensions (on mobile reduce to 3 per side to avoid crowding)
        const isMobile = width < 768;
        const numTracesPerSide = isMobile ? 3 : Math.min(Math.max(Math.floor(height / 80), 4), 7);
        const maxY = Math.min(targetBox.bottom, targetBox.titleTop);

        // 1. LEFT CONDUITS -> Direct toward targetBox.left
        for (let i = 0; i < numTracesPerSide; i++) {
            const startY = isMobile ? (140 + i * 45) : (70 + i * ((height * 0.7) / numTracesPerSide));
            const targetY = targetBox.top + (i / (numTracesPerSide - 1 || 1)) * (maxY - targetBox.top);
            const targetX = targetBox.left;

            const path = [{ x: 0, y: startY }];
            const midX1 = Math.min(width * 0.14 + (i % 3) * 35, targetX - 60);
            path.push({ x: midX1, y: startY });

            // 45° PCB Jog
            const dy = targetY - startY;
            const jogDist = Math.min(Math.abs(dy), Math.max(10, targetX - midX1 - 30));
            const jogEndX = midX1 + jogDist;
            const jogEndY = startY + (dy > 0 ? jogDist : -jogDist);
            path.push({ x: jogEndX, y: jogEndY });

            // Terminate precisely at exclusion zone border
            path.push({ x: targetX, y: targetY });

            const isAccent = (i % 3 === 1);
            const color = isAccent ? '#ff007f' : '#00d2ff';
            const glowColor = isAccent ? 'rgba(255, 0, 127, 0.45)' : 'rgba(0, 210, 255, 0.4)';

            traces.push({
                path: path,
                color: color,
                glowColor: glowColor,
                isAccent: isAccent,
                length: getPathLength(path),
                progress: 0,
                speed: 0.016 + Math.random() * 0.012
            });
        }

        // 2. RIGHT CONDUITS -> Direct toward targetBox.right
        for (let i = 0; i < numTracesPerSide; i++) {
            const startY = isMobile ? (140 + i * 45) : (70 + i * ((height * 0.7) / numTracesPerSide));
            const targetY = targetBox.top + (i / (numTracesPerSide - 1 || 1)) * (maxY - targetBox.top);
            const targetX = targetBox.right;

            const path = [{ x: width, y: startY }];
            const midX1 = Math.max(width - (width * 0.14 + (i % 3) * 35), targetX + 60);
            path.push({ x: midX1, y: startY });

            // 45° PCB Jog
            const dy = targetY - startY;
            const jogDist = Math.min(Math.abs(dy), Math.max(10, midX1 - targetX - 30));
            const jogEndX = midX1 - jogDist;
            const jogEndY = startY + (dy > 0 ? jogDist : -jogDist);
            path.push({ x: jogEndX, y: jogEndY });

            // Terminate precisely at exclusion zone border
            path.push({ x: targetX, y: targetY });

            const isAccent = (i % 3 === 2);
            const color = isAccent ? '#ff007f' : '#00a6ed';
            const glowColor = isAccent ? 'rgba(255, 0, 127, 0.45)' : 'rgba(0, 166, 237, 0.4)';

            traces.push({
                path: path,
                color: color,
                glowColor: glowColor,
                isAccent: isAccent,
                length: getPathLength(path),
                progress: 0,
                speed: 0.016 + Math.random() * 0.012
            });
        }

        // Initialize micro-pulses
        traces.forEach((t, idx) => {
            pulses.push({
                traceIdx: idx,
                distance: Math.random() * t.length,
                speed: 1.2 + Math.random() * 1.6,
                color: t.color
            });
        });
    }

    function getPathLength(path) {
        let len = 0;
        for (let i = 1; i < path.length; i++) {
            len += Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y);
        }
        return len;
    }

    function getPointAtDistance(path, targetDist) {
        let covered = 0;
        for (let i = 1; i < path.length; i++) {
            const segLen = Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y);
            if (covered + segLen >= targetDist) {
                const r = (targetDist - covered) / segLen;
                return {
                    x: path[i - 1].x + (path[i].x - path[i - 1].x) * r,
                    y: path[i - 1].y + (path[i].y - path[i - 1].y) * r
                };
            }
            covered += segLen;
        }
        return path[path.length - 1];
    }

    function renderHeroTraces() {
        ctx.clearRect(0, 0, width, height);

        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 1. Draw Static / Animated Conduits
        traces.forEach(t => {
            if (t.progress < 1) {
                t.progress = Math.min(1, t.progress + t.speed);
            }

            ctx.save();
            ctx.strokeStyle = t.color;
            ctx.shadowColor = t.glowColor;
            ctx.shadowBlur = 8;
            ctx.globalAlpha = 0.5;

            const currentLen = t.length * t.progress;
            let drawnLen = 0;

            ctx.beginPath();
            ctx.moveTo(t.path[0].x, t.path[0].y);

            for (let i = 1; i < t.path.length; i++) {
                const segLen = Math.hypot(t.path[i].x - t.path[i - 1].x, t.path[i].y - t.path[i - 1].y);
                if (drawnLen + segLen <= currentLen) {
                    ctx.lineTo(t.path[i].x, t.path[i].y);
                    drawnLen += segLen;
                } else {
                    const ratio = (currentLen - drawnLen) / segLen;
                    const px = t.path[i - 1].x + (t.path[i].x - t.path[i - 1].x) * ratio;
                    const py = t.path[i - 1].y + (t.path[i].y - t.path[i - 1].y) * ratio;
                    ctx.lineTo(px, py);
                    break;
                }
            }
            ctx.stroke();

            // Terminal Pads (Stationed at border of exclusion zone)
            if (t.progress >= 0.99) {
                const endPt = t.path[t.path.length - 1];
                ctx.fillStyle = t.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(endPt.x, endPt.y, 2.5, 0, Math.PI * 2);
                ctx.fill();

                // Outer concentric terminal ring
                ctx.strokeStyle = t.color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(endPt.x, endPt.y, 5.5, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        });

        // 2. Draw Traveling Signal Data Packets
        pulses.forEach(p => {
            const trace = traces[p.traceIdx];
            if (!trace || trace.progress < 0.5) return;

            p.distance += p.speed;
            if (p.distance > trace.length * trace.progress) {
                p.distance = 0;
            }

            const pt = getPointAtDistance(trace.path, p.distance);

            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.globalAlpha = 0.95;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        animFrameId = requestAnimationFrame(renderHeroTraces);
    }

    resize();
    renderHeroTraces();

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            updateTargetCoordinates();
            buildCircuitTraces();
        });
    }

    window.addEventListener('resize', () => {
        if (animFrameId) cancelAnimationFrame(animFrameId);
        resize();
        renderHeroTraces();
    });
}

// ============================================================
// 3. SIDEWAYS-SCROLLING PROJECTS (GOOGLE AI REFERENCE)
// Horizontal Track, Bilateral Fades, Controls & Counter
// ============================================================
function initProjectsCarousel() {
    const viewport = document.getElementById('projects-viewport');
    const track = document.getElementById('projects-track');
    const prevBtn = document.getElementById('proj-prev-btn');
    const nextBtn = document.getElementById('proj-next-btn');
    const counterCurrent = document.getElementById('projects-counter-current');
    const progressThumb = document.getElementById('projects-progress-thumb');
    const cards = document.querySelectorAll('.project-card');

    if (!viewport || !track || cards.length === 0) return;

    const totalCards = cards.length;
    let isProgrammaticScrolling = false;

    // Calculate individual card step distance (width + gap)
    function getCardStep() {
        if (cards.length < 2) return cards[0].offsetWidth;
        const r1 = cards[0].getBoundingClientRect();
        const r2 = cards[1].getBoundingClientRect();
        return Math.max(r2.left - r1.left, cards[0].offsetWidth + 20);
    }

    // Update Counter, Nav Buttons and Progress Bar
    function updateControls() {
        const scrollLeft = viewport.scrollLeft;
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        const cardStep = getCardStep();

        // Calculate 0-based active card index
        let activeIdx = Math.round(scrollLeft / cardStep);
        activeIdx = Math.max(0, Math.min(totalCards - 1, activeIdx));

        // Format to "01", "02", etc.
        if (counterCurrent) {
            const formatted = String(activeIdx + 1).padStart(2, '0');
            if (counterCurrent.textContent !== formatted) {
                counterCurrent.textContent = formatted;
            }
        }

        // Enable / Disable Prev and Next buttons at boundaries
        if (prevBtn) {
            prevBtn.disabled = scrollLeft <= 10;
        }
        if (nextBtn) {
            nextBtn.disabled = scrollLeft >= maxScroll - 10;
        }

        // Update Progress Bar Thumb
        if (progressThumb && maxScroll > 0) {
            const progressRatio = Math.max(0, Math.min(1, scrollLeft / maxScroll));
            // Thumb width is 12.5% (1/8th); translates across 0% to 700% of thumb width
            const thumbShift = progressRatio * (totalCards - 1) * 100;
            progressThumb.style.transform = `translateX(${thumbShift}%)`;
        }
    }

    // Throttled Scroll Listener
    let scrollRafId = null;
    viewport.addEventListener('scroll', () => {
        if (scrollRafId) return;
        scrollRafId = requestAnimationFrame(() => {
            updateControls();
            scrollRafId = null;
        });
    }, { passive: true });

    // Prev / Next Button Click Handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const step = getCardStep();
            viewport.scrollBy({ left: -step, behavior: 'smooth' });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const step = getCardStep();
            viewport.scrollBy({ left: step, behavior: 'smooth' });
        });
    }

    // Keyboard Arrow Navigation when viewport is focused
    viewport.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextBtn && nextBtn.click();
        } else if (e.key === 'ArrowLeft') {
            prevBtn && prevBtn.click();
        }
    });

    // Desktop Horizontal Wheel Scroll Integration
    viewport.addEventListener('wheel', (e) => {
        // If scrolling primarily vertical, translate into horizontal scroll
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 10) {
            const atStart = viewport.scrollLeft <= 5 && e.deltaY < 0;
            const atEnd = (viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 5) && e.deltaY > 0;
            
            // Allow page vertical scroll when at boundaries; otherwise scroll horizontally
            if (!atStart && !atEnd) {
                e.preventDefault();
                viewport.scrollLeft += e.deltaY * 0.9;
            }
        }
    }, { passive: false });

    // Drag / Swipe Distance Tracker (Prevents accidental card modal trigger on drag)
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isDraggingGesture = false;

    viewport.addEventListener('pointerdown', (e) => {
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
        isDraggingGesture = false;
    });

    viewport.addEventListener('pointermove', (e) => {
        const dist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
        if (dist > 8) {
            isDraggingGesture = true;
        }
    });

    // Expose drag state to card click handlers
    window.__isProjectsCarouselDragging = () => isDraggingGesture;

    // Initial controls update
    updateControls();
    window.addEventListener('resize', updateControls);
}

// ============================================================
// 4. PROJECT DETAILS MODAL
// ============================================================
function initProjectModal() {
    // Inject Modal DOM container
    const modalOverlay = document.createElement('div');
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

    const modalClose = modalOverlay.querySelector('.modal-close');
    const modalBody = modalOverlay.querySelector('.modal-body');

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Attach click listeners to cards
    document.querySelectorAll('.project-card').forEach(card => {
        function triggerOpen(e) {
            // Ignore if user was dragging or clicked a direct link
            if (window.__isProjectsCarouselDragging && window.__isProjectsCarouselDragging()) return;
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
// 5. NAVIGATION, SMOOTH SCROLL & ACTIVE LINK TRACKER
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
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 70 },
                    duration: 0.9,
                    ease: "power3.inOut"
                });

                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    hamburger && hamburger.classList.remove('active');
                    hamburger && hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = 'auto';
                }
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
// 6. TELEMETRY KPI COUNTERS
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
