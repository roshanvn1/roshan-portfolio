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

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initLines();
}

// Generate vertical side lines originating from the hero title area
function initLines() {
    lines = [];

    const heroSection = document.getElementById('hero');
    const heroRect = heroSection.getBoundingClientRect();
    const heroTopY = heroRect.top + window.scrollY;
    const heroCenterY = heroTopY + (heroRect.height / 2);
    const heroBottomY = heroTopY + heroRect.height;
    const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

    const margin = 25; // px from edge

    // Lines start at heroCenterY (midpoint of hero title) and end at page bottom.
    // The portion from heroCenterY -> heroBottomY is ALWAYS drawn (static part).
    // The portion from heroBottomY -> documentHeight grows with scroll progress.

    // 1. Left vertical line (Cyan)
    const leftPath = [
        { x: margin, y: heroCenterY },
        { x: margin, y: documentHeight }
    ];
    lines.push({
        path: leftPath,
        length: calculatePathLength(leftPath),
        staticLength: heroBottomY - heroCenterY, // always-shown portion
        delay: 0,
        color: '#00f0ff',
        offset: 0
    });

    // 2. Right vertical line (Gold)
    const rightPath = [
        { x: width - margin, y: heroCenterY },
        { x: width - margin, y: documentHeight }
    ];
    lines.push({
        path: rightPath,
        length: calculatePathLength(rightPath),
        staticLength: heroBottomY - heroCenterY,
        delay: 0,
        color: '#FFD700',
        offset: 0
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
    ctx.shadowBlur = 12;

    lines.forEach(line => {
        // staticLength is always drawn; scroll grows the rest
        const scrollablePortion = line.length - line.staticLength;
        const targetLength = line.staticLength + (scrollablePortion * scrollProgress);

        ctx.strokeStyle = line.color;
        ctx.shadowColor = line.color;
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

            if (segmentLength < 0.001) continue;

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
                if (i === line.path.length - 1 && targetLength >= line.length * 0.99) {
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
        if (targetLength >= line.length * 0.99) {
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

window.addEventListener('resize', () => {
    resize();
});

// Initialize everything
resize();
draw(); // render initial static portion of lines
