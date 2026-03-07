// Navbar Scroll Effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Interactive Chip Background tracking
const interactiveBg = document.querySelector('.interactive-bg');
document.addEventListener('mousemove', (e) => {
    if (interactiveBg) {
        // Calculate the mouse position as a percentage of the window size
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        // Update the CSS variables directly on the element
        interactiveBg.style.setProperty('--mouse-x', `${x}%`);
        interactiveBg.style.setProperty('--mouse-y', `${y}%`);
    }
});

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// Modal System Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Inject Modal HTML into the DOM
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-content-box window-glass">
            <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const modalClose = modalOverlay.querySelector('.modal-close');
    const modalBody = modalOverlay.querySelector('.modal-body');

    // Add click listeners to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const detailsElement = card.querySelector('.project-details');
            if (detailsElement) {
                // Transfer hidden HTML to the modal exactly as formatted
                modalBody.innerHTML = detailsElement.innerHTML;
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            }
        });
    });

    // Close logic
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore background scrolling
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});

// Interactive Circuit Background Animation
const canvas = document.getElementById('circuit-bg');
const ctx = canvas.getContext('2d');

let width, height;
let lines = [];
const gridSize = 30; // Spacing logic for circuit traces

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initLines();
}

// Generate the paths for the "circuit" traces targeting DOM chips
function initLines() {
    lines = [];
    const gSize = 25; // Grid size for rendering corners

    // 1. Identify "Chip" Targets in the DOM
    const heroBox = document.querySelector('.hero-content').getBoundingClientRect();
    const heroCenterY = heroBox.top + window.scrollY + (heroBox.height / 2);

    const targets = [
        document.querySelector('#about .container'),
        document.querySelector('#skills .container'),
        document.querySelector('#projects .container'),
        document.querySelector('#contact .container')
    ];

    // Read bounding boxes globally relative to the document
    const chipBoxes = targets.filter(el => el).map(el => {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            right: rect.right + window.scrollX,
            height: rect.height
        };
    });

    // 2. Generate targeting wires for each chip
    chipBoxes.forEach((chip, index) => {
        // We want 2 wires connecting to the left side, and 2 connecting to the right side of EACH chip
        const wiresPerSide = 2;

        for (let side = 0; side < 2; side++) {
            const isLeft = (side === 0);

            for (let i = 0; i < wiresPerSide; i++) {
                const path = [];

                // Spawn EXACTLY where the hero lines end!
                // The hero lines travel inwards and typically stop ~35% and ~65% of the screen width.
                // We'll spawn our scroll lines from those boundary edges at the center height to link them.
                const startX = isLeft ? (width * 0.35) : (width * 0.65);
                const startY = heroCenterY;

                path.push({ x: startX, y: startY });

                let cx = startX;
                let cy = startY;

                // Move OUTWARDS horizontally to the edges of the screen
                const outDist = isLeft ? (startX - 40) : (width - startX - 40);
                cx += isLeft ? -outDist : outDist;
                path.push({ x: cx, y: cy });

                // Move DOWN deeply along the flank towards the target chip
                const downDist1 = Math.max(0, chip.top - cy - (Math.random() * chip.height * 0.5));
                cy += downDist1;
                path.push({ x: cx, y: cy });

                // Move inwards roughly half way
                const inwardDist1 = (isLeft ? (chip.left / 2) : (width - chip.right) / 2) * (0.5 + Math.random() * 0.5);
                cx += (isLeft ? inwardDist1 : -inwardDist1);
                path.push({ x: cx, y: cy });

                // Move down to align exactly with a specific "plug" point on the chip's side border
                // Ensure it plugs somewhere uniquely along the chip's height
                const plugY = chip.top + (chip.height * 0.2) + (chip.height * 0.6 * Math.random());
                cy = plugY;
                path.push({ x: cx, y: cy });

                // Move precisely horizontally to intersect the chip's border!
                cx = isLeft ? chip.left : chip.right;
                path.push({ x: cx, y: cy });

                // Generate identical paths but add paired assignments
                const pathCyan = JSON.parse(JSON.stringify(path));
                const pathGold = JSON.parse(JSON.stringify(path));

                // Add to lines array with specific offset tracking tags
                lines.push({
                    path: pathCyan,
                    length: calculatePathLength(pathCyan),
                    delay: (chip.top / (document.documentElement.scrollHeight || 1)) * 0.6,
                    color: '#00f0ff',
                    offset: -3 // Shift 3 pixels left/up
                });

                lines.push({
                    path: pathGold,
                    length: calculatePathLength(pathGold),
                    delay: (chip.top / (document.documentElement.scrollHeight || 1)) * 0.6,
                    color: '#FFD700',
                    offset: 3 // Shift 3 pixels right/down
                });
            }
        }
    });

    draw();
}

function calculatePathLength(path) {
    let len = 0;
    for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i - 1].x;
        const dy = path[i].y - path[i - 1].y;
        len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
}

// Update drawing based on scroll
let scrollProgress = 0;
window.addEventListener('scroll', () => {
    // Calculate total scrollable height
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = window.scrollY / scrollHeight;
    // Add small buffer so it doesn't need to reach 100% to finish drawing
    scrollProgress = Math.min(1.0, scrollProgress * 1.1);

    requestAnimationFrame(draw);
});

function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // TRANSLATE CANVAS SO FIXED BACKGROUND SCROLLS
    ctx.translate(0, -window.scrollY);

    // Dynamic styling
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 10;

    lines.forEach(line => {
        // Adjust individual line progress based on delay
        let p = Math.max(0, (scrollProgress - line.delay) / (1 - line.delay));
        if (p <= 0) return; // Not started drawing yet

        ctx.strokeStyle = line.color;
        ctx.shadowColor = line.color;

        let targetLength = line.length * p;
        let currentLength = 0;
        let drawEndNode = false;
        let endNodePos = null;

        ctx.beginPath();
        let startedDrawing = false; // Flag to prevent offset plotting before the first move

        for (let i = 1; i < line.path.length; i++) {
            const p1 = line.path[i - 1];
            const p2 = line.path[i];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);

            // Calculate Normal Vector for Perpendicular Offset
            let offsetX = 0;
            let offsetY = 0;
            if (segmentLength > 0) {
                // Normal vector [-dy, dx] normalized, multiplied by offset radius
                offsetX = (-dy / segmentLength) * line.offset;
                offsetY = (dx / segmentLength) * line.offset;
            }

            if (!startedDrawing) {
                ctx.moveTo(p1.x + offsetX, p1.y + offsetY);
                startedDrawing = true;
            }

            if (currentLength + segmentLength <= targetLength) {
                // Draw full segment with calculated orthogonal offset
                ctx.lineTo(p2.x + offsetX, p2.y + offsetY);
                currentLength += segmentLength;

                // Track if we need to draw an end node
                if (i === line.path.length - 1 && p >= 0.99) {
                    drawEndNode = true;
                    endNodePos = { x: p2.x + offsetX, y: p2.y + offsetY };
                }
            } else {
                // Interpolate partial segment
                const ratio = (targetLength - currentLength) / segmentLength;
                const intermediateX = p1.x + dx * ratio;
                const intermediateY = p1.y + dy * ratio;
                ctx.lineTo(intermediateX + offsetX, intermediateY + offsetY);

                ctx.stroke(); // STROKE THE LINE FIRST TO AVOID THE BUG

                // Draw leading glow/node at the current drawing head
                drawNode(intermediateX + offsetX, intermediateY + offsetY, line.color);
                break;
            }
        }
        // If the line finished perfectly, make sure it is stroked
        if (p >= 0.99) {
            ctx.stroke();
        }
        if (drawEndNode && endNodePos) {
            drawNode(endNodePos.x, endNodePos.y, line.color);
        }
    });

    ctx.restore();
}

function drawNode(x, y, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// ----------------------------------------------------
// Hero Canvas Animation (Facing Circuits)
// ----------------------------------------------------
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas.getContext('2d');
let heroWidth, heroHeight;
let heroLines = [];

function initHeroCanvas() {
    heroWidth = heroCanvas.parentElement.clientWidth;
    heroHeight = heroCanvas.parentElement.clientHeight;
    heroCanvas.width = heroWidth;
    heroCanvas.height = heroHeight;
    generateHeroLines();
}

function generateHeroLines() {
    heroLines = [];
    const hGrid = 40; // larger grid for hero
    const numLinesPerSide = Math.floor(heroHeight / hGrid);

    // Generate Left Side Lines
    for (let i = 0; i < numLinesPerSide; i++) {
        const startY = Math.floor(Math.random() * (heroHeight / hGrid)) * hGrid;
        const path = [{ x: 0, y: startY }];
        let cx = 0, cy = startY;

        const segments = 3 + Math.floor(Math.random() * 4);
        for (let j = 0; j < segments; j++) {
            const dir = Math.floor(Math.random() * 3); // 0=right, 1=diag up-right, 2=diag down-right
            const dist = (1 + Math.floor(Math.random() * 3)) * hGrid;

            if (dir === 0) { cx += dist; }
            else if (dir === 1) { cx += dist; cy -= dist; }
            else if (dir === 2) { cx += dist; cy += dist; }

            // Stop before hitting the middle text area roughly
            if (cx > heroWidth * 0.4) {
                cx = heroWidth * 0.4;
            }
            path.push({ x: cx, y: cy });
        }

        const pathCyan = JSON.parse(JSON.stringify(path));
        const pathGold = JSON.parse(JSON.stringify(path));
        const sharedDelay = Math.random() * 0.8;
        const sharedSpeed = 0.001 + Math.random() * 0.0005; // SLOWED DOWN

        heroLines.push({
            path: pathCyan,
            length: calculatePathLength(pathCyan),
            delay: sharedDelay,
            speed: sharedSpeed,
            color: '#00f0ff',
            offset: -3
        });
        heroLines.push({
            path: pathGold,
            length: calculatePathLength(pathGold),
            delay: sharedDelay,
            speed: sharedSpeed,
            color: '#FFD700',
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
            const dir = Math.floor(Math.random() * 3); // 0=left, 1=diag up-left, 2=diag down-left
            const dist = (1 + Math.floor(Math.random() * 3)) * hGrid;

            if (dir === 0) { cx -= dist; }
            else if (dir === 1) { cx -= dist; cy -= dist; }
            else if (dir === 2) { cx -= dist; cy += dist; }

            // Stop before hitting the middle text area roughly
            if (cx < heroWidth * 0.6) {
                cx = heroWidth * 0.6;
            }
            path.push({ x: cx, y: cy });
        }

        const pathCyan = JSON.parse(JSON.stringify(path));
        const pathGold = JSON.parse(JSON.stringify(path));
        const sharedDelay = Math.random() * 0.8;
        const sharedSpeed = 0.001 + Math.random() * 0.0005; // SLOWED DOWN

        heroLines.push({
            path: pathCyan,
            length: calculatePathLength(pathCyan),
            delay: sharedDelay,
            speed: sharedSpeed,
            color: '#00f0ff',
            offset: -3
        });
        heroLines.push({
            path: pathGold,
            length: calculatePathLength(pathGold),
            delay: sharedDelay,
            speed: sharedSpeed,
            color: '#FFD700',
            offset: 3
        });
    }
}

// Hero Animation Loop
let heroTime = 0;
function animateHero() {
    heroTime += 1;
    heroCtx.clearRect(0, 0, heroWidth, heroHeight);

    heroCtx.lineWidth = 2;
    heroCtx.lineCap = 'round';
    heroCtx.lineJoin = 'round';
    heroCtx.shadowBlur = 12;

    let allComplete = true; // Track completion

    heroLines.forEach(line => {
        // Line progress increments strictly up to 1.0 (no looping)
        let p = (heroTime * line.speed) - line.delay;
        if (p < 0) p = 0; // Waiting for delay
        if (p < 1.0) allComplete = false; // Still drawing
        if (p >= 1.0) p = 1.0; // Cap

        if (p === 0) return; // Do not draw if unstarted

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

            // Calculate Normal Vector for Perpendicular Offset
            let offsetX = 0;
            let offsetY = 0;
            if (segmentLength > 0) {
                offsetX = (-dy / segmentLength) * line.offset;
                offsetY = (dx / segmentLength) * line.offset;
            }

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

                heroCtx.stroke(); // STROKE BEFORE DRAWING NODE

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
    }
}

function drawHeroNode(x, y, color) {
    heroCtx.save();
    heroCtx.fillStyle = color;
    heroCtx.beginPath();
    heroCtx.arc(x, y, 5, 0, Math.PI * 2);
    heroCtx.fill();
    heroCtx.restore();
}

window.addEventListener('resize', () => {
    resize();
    initHeroCanvas();
});

// Initialize everything
resize();
if (heroCanvas) {
    initHeroCanvas();
    animateHero();
}
