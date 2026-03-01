// Navbar Scroll Effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            
            // If the element contains skills, animate the progressive bars
            if (entry.target.querySelector('.skill-bar .fill')) {
                const bars = entry.target.querySelectorAll('.skill-bar .fill');
                bars.forEach(bar => {
                    bar.style.transform = 'scaleX(1)';
                });
            }

            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// Animate bars that might be visible on load without reaching a new scroll target
window.addEventListener('load', () => {
    setTimeout(() => {
        const visibleSection = document.querySelector('.skills.active');
        if(visibleSection) {
            const bars = visibleSection.querySelectorAll('.skill-bar .fill');
            bars.forEach(bar => {
                bar.style.transform = 'scaleX(1)';
            });
        }
    }, 500);
});
