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

// Generate the paths for the "circuit" traces
function initLines() {
    lines = [];
    // Generate ~30-40 lines depending on screen width
    const numLines = Math.floor(width / gridSize);

    for (let i = 0; i < numLines; i++) {
        const startX = Math.floor(Math.random() * (width / gridSize)) * gridSize;
        // Lines can start anywhere in the top 20% of the screen
        const startY = Math.random() * (height * 0.2);

        const path = [];
        path.push({ x: startX, y: startY });

        let currentX = startX;
        let currentY = startY;

        // Procedurally generate the trace moving downwards
        const numSegments = 5 + Math.floor(Math.random() * 8);
        for (let j = 0; j < numSegments; j++) {
            // Pick a direction: 0 = straight down, 1 = right, 2 = left, 3 = diagonal right, 4 = diagonal left
            const dir = Math.floor(Math.random() * 5);
            const distance = (2 + Math.floor(Math.random() * 4)) * gridSize;

            if (dir === 0) {
                currentY += distance;
            } else if (dir === 1) {
                currentX += distance;
            } else if (dir === 2) {
                currentX -= distance;
            } else if (dir === 3) {
                currentX += distance;
                currentY += distance;
            } else if (dir === 4) {
                currentX -= distance;
                currentY += distance;
            }
            // Clamp coordinates to stay somewhat within screen bounds
            currentX = Math.max(0, Math.min(width, currentX));
            path.push({ x: currentX, y: currentY });
        }

        lines.push({
            path: path,
            length: calculatePathLength(path),
            delay: Math.random() * 0.3 // Random offset for slightly organic feeling
        });
    }
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

    // Cyber/Neon styling
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';

    lines.forEach(line => {
        // Adjust individual line progress based on random delay
        let p = Math.max(0, (scrollProgress - line.delay) / (1 - line.delay));
        if (p <= 0) return; // Not started drawing yet

        ctx.beginPath();
        ctx.moveTo(line.path[0].x, line.path[0].y);

        let targetLength = line.length * p;
        let currentLength = 0;

        let drawEndNode = false;
        let endNodePos = null;

        for (let i = 1; i < line.path.length; i++) {
            const p1 = line.path[i - 1];
            const p2 = line.path[i];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);

            if (currentLength + segmentLength <= targetLength) {
                // Draw full segment
                ctx.lineTo(p2.x, p2.y);
                currentLength += segmentLength;

                // Track if we need to draw an end node
                if (i === line.path.length - 1 && p >= 0.99) {
                    drawEndNode = true;
                    endNodePos = { x: p2.x, y: p2.y };
                }
            } else {
                // Interpolate partial segment
                const ratio = (targetLength - currentLength) / segmentLength;
                const intermediateX = p1.x + dx * ratio;
                const intermediateY = p1.y + dy * ratio;
                ctx.lineTo(intermediateX, intermediateY);

                ctx.stroke(); // STROKE THE LINE FIRST TO AVOID THE BUG

                // Draw leading glow/node at the current drawing head
                drawNode(intermediateX, intermediateY);
                break;
            }
        }
        // If the line finished perfectly, make sure it is stroked
        if (p >= 0.99) {
            ctx.stroke();
        }
        if (drawEndNode && endNodePos) {
            drawNode(endNodePos.x, endNodePos.y);
        }
    });
}

function drawNode(x, y) {
    ctx.save();
    ctx.fillStyle = '#00f0ff';
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
        heroLines.push({
            path: path,
            length: calculatePathLength(path),
            delay: Math.random(),
            speed: 0.001 + Math.random() * 0.002
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
        heroLines.push({
            path: path,
            length: calculatePathLength(path),
            delay: Math.random(),
            speed: 0.001 + Math.random() * 0.002
        });
    }
}

// Hero Animation Loop
let heroTime = 0;
function animateHero() {
    heroTime += 1;
    heroCtx.clearRect(0, 0, heroWidth, heroHeight);

    heroCtx.strokeStyle = '#00f0ff';
    heroCtx.lineWidth = 2;
    heroCtx.lineCap = 'round';
    heroCtx.lineJoin = 'round';
    heroCtx.shadowBlur = 12;
    heroCtx.shadowColor = '#00f0ff';

    heroLines.forEach(line => {
        // Loop progress between 0 and 1 continuously
        let p = ((heroTime * line.speed) + line.delay) % 1.5; // Mod 1.5 adds a pause at the end
        if (p > 1.0) p = 1.0;

        heroCtx.beginPath();
        heroCtx.moveTo(line.path[0].x, line.path[0].y);

        let targetLength = line.length * p;
        let currentLength = 0;
        let drawEndNode = false;
        let endNodePos = null;

        for (let i = 1; i < line.path.length; i++) {
            const p1 = line.path[i - 1];
            const p2 = line.path[i];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);

            if (currentLength + segmentLength <= targetLength) {
                heroCtx.lineTo(p2.x, p2.y);
                currentLength += segmentLength;

                if (i === line.path.length - 1 && p >= 0.99) {
                    drawEndNode = true;
                    endNodePos = { x: p2.x, y: p2.y };
                }
            } else {
                const ratio = (targetLength - currentLength) / segmentLength;
                const intermediateX = p1.x + dx * ratio;
                const intermediateY = p1.y + dy * ratio;
                heroCtx.lineTo(intermediateX, intermediateY);

                heroCtx.stroke(); // STROKE BEFORE DRAWING NODE

                drawHeroNode(intermediateX, intermediateY);
                break;
            }
        }
        if (p >= 0.99) {
            heroCtx.stroke();
        }
        if (drawEndNode && endNodePos) {
            drawHeroNode(endNodePos.x, endNodePos.y);
        }
    });

    requestAnimationFrame(animateHero);
}

function drawHeroNode(x, y) {
    heroCtx.save();
    heroCtx.fillStyle = '#00f0ff';
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
