// ========================================
// THE A BEAUTY ZONE — COMPLETE SCRIPT
// Matched to index.html + style.css
// ========================================

// ─── DOM REFERENCES ─────────────────────
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('navLinks');
const backToTop    = document.getElementById('backToTop');
const contactForm  = document.getElementById('contactForm');
const preloader    = document.getElementById('preloader');

// Lightbox (static element in HTML)
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

// Testimonials slider
const testimonialsTrack = document.getElementById('testimonialsTrack');
const sliderPrev        = document.getElementById('sliderPrev');
const sliderNext        = document.getElementById('sliderNext');
const sliderDotsWrap    = document.getElementById('sliderDots');

// Gallery items (for lightbox & filter)
const galleryItems = document.querySelectorAll('.gallery-item');


// ========================================
// 1. PRELOADER
// ========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
        document.body.classList.add('loaded');
        document.documentElement.classList.add('animations-ready');
    }, 2400); // matches the CSS loadBar animation (2.2s + buffer)
});


// ========================================
// 2. AOS — ANIMATE ON SCROLL
// ========================================
AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100,
    anchorPlacement: 'top-bottom'
});


// ========================================
// 3. PARTICLE SYSTEM (canvas)
// ========================================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        this.ctx    = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse  = { x: -999, y: -999 };
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        this.animate();
    }

    resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        const isGold = Math.random() < 0.6;
        const hue = isGold ? (Math.random() * 15 + 35) : (Math.random() * 40 + 320); // Gold: 35-50, Pink/Rose: 320-360
        const saturation = isGold ? 85 : 75;
        const lightness = isGold ? 68 : 65;
        return {
            x:      Math.random() * this.canvas.width,
            y:      Math.random() * this.canvas.height,
            vx:     (Math.random() - 0.5) * 0.45,
            vy:     (Math.random() - 0.5) * 0.45,
            radius: Math.random() * 2.2 + 0.8,
            alpha:  Math.random() * 0.45 + 0.15,
            color:  `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.particles.length < 90) {
            this.particles.push(this.createParticle());
        }

        this.particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height)  p.vy *= -1;

            // Gentle mouse attraction
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                p.vx += dx * 0.008;
                p.vy += dy * 0.008;
                // Speed cap
                 const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                 if (speed > 2) { p.vx *= 0.9; p.vy *= 0.9; }
            }

            // Random fade-out to keep variety
            if (Math.random() < 0.006) {
                this.particles.splice(idx, 1);
                return;
            }

            p.rotation += p.rotSpeed;

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle   = p.color;
            this.ctx.beginPath();
             
            const cx = p.x;
            const cy = p.y;
            const spikes = 4;
            const outerRadius = p.radius * 2.8;
            const innerRadius = p.radius * 0.6;
             
            let rot = p.rotation;
            const step = Math.PI / spikes;
             
            this.ctx.moveTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            for (let i = 0; i < spikes; i++) {
                rot += step;
                this.ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
                rot += step;
                this.ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        });

        requestAnimationFrame(() => this.animate());
    }
}

new ParticleSystem();


// ========================================
// 4. NAVBAR — SCROLL + HIDE/SHOW
// ========================================
let lastScrollY = 0;

function handleScroll() {
    const scrollY = window.scrollY;

    // Scrolled glass style
    navbar.classList.toggle('scrolled', scrollY > 80);

    // Auto-hide on scroll down, reveal on scroll up
    if (scrollY > lastScrollY && scrollY > 250) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = scrollY;

    // Back-to-top button
    backToTop.classList.toggle('show', scrollY > 700);

    // Active nav link highlight
    updateActiveNavLink();
}

// Throttle scroll handler for performance
function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

window.addEventListener('scroll', throttle(handleScroll, 16));


// ========================================
// 5. ACTIVE NAV LINK ON SCROLL
// ========================================
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 200) {
            current = sec.getAttribute('id');
        }
    });
    navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
}


// ========================================
// 6. MOBILE NAVIGATION
// ========================================
// Create nav overlay dynamically (no need to add to HTML)
const navOverlay = document.createElement('div');
navOverlay.className = 'nav-overlay';
document.body.appendChild(navOverlay);

function openMobileMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

hamburger.addEventListener('click', () => {
    hamburger.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
});

navOverlay.addEventListener('click', closeMobileMenu);

// Close on nav link click
document.querySelectorAll('.nav-link, .nav-book-btn').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});


// ========================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 90;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            closeMobileMenu();
        }
    });
});


// ========================================
// 8. BACK TO TOP
// ========================================
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ========================================
// 9. ANIMATED COUNTER — HERO STATS
// ========================================
let countersRun = false;

function animateCounters() {
    if (countersRun) return;
    countersRun = true;

    document.querySelectorAll('.stat-number[data-target]').forEach(stat => {
        const target    = parseInt(stat.getAttribute('data-target'));
        const isSatisfaction = !!stat.closest('.satisfaction');
        const suffix    = isSatisfaction ? '%' : '+';
        const duration  = 2000; // ms
        const steps     = 80;
        const increment = target / steps;
        let current     = 0;
        let step        = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), target);
            stat.textContent = current + suffix;
            if (current >= target) clearInterval(timer);
        }, duration / steps);
    });
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 400);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    counterObserver.observe(heroStats);
}


// ========================================
// 10. GALLERY FILTER TABS
// ========================================
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const show = filter === 'all' || category === filter;

            if (show) {
                item.style.display = '';
                setTimeout(() => {
                    item.style.opacity   = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity   = '0';
                item.style.transform = 'scale(0.92)';
                setTimeout(() => { item.style.display = 'none'; }, 350);
            }
        });
    });
});

// Smooth transition on gallery items
galleryItems.forEach(item => {
    item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
});


// ========================================
// 11. GALLERY LIGHTBOX (uses static #lightbox from HTML)
// ========================================
let lightboxImages  = []; // array of { src, caption }
let lightboxCurrent = 0;

function buildLightboxImages() {
    lightboxImages = [];
    document.querySelectorAll('.gallery-item:not([style*="display: none"])').forEach(item => {
        lightboxImages.push({
            src:     item.querySelector('img').src,
            caption: item.querySelector('.gallery-content h4')?.textContent || 'Beauty Transformation'
        });
    });
}

function openLightbox(item) {
    buildLightboxImages();
    // Find index of clicked item within the filtered list of images
    const clickedSrc = item.querySelector('img').src;
    const clickedIndex = lightboxImages.findIndex(img => img.src === clickedSrc);

    lightboxCurrent = clickedIndex !== -1 ? clickedIndex : 0;
    showLightboxImage(lightboxCurrent);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightboxFn() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showLightboxImage(index) {
    if (!lightboxImages.length) return;
    lightboxCurrent = (index + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src                = lightboxImages[lightboxCurrent].src;
    lightboxImg.alt                = lightboxImages[lightboxCurrent].caption;
    lightboxCaption.textContent    = lightboxImages[lightboxCurrent].caption;
}

// Attach click on each gallery item
galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
});

// Lightbox controls
lightboxClose.addEventListener('click', closeLightboxFn);
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showLightboxImage(lightboxCurrent - 1); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showLightboxImage(lightboxCurrent + 1); });

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightboxFn();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightboxFn();
    if (e.key === 'ArrowLeft')   showLightboxImage(lightboxCurrent - 1);
    if (e.key === 'ArrowRight')  showLightboxImage(lightboxCurrent + 1);
});


// ========================================
// 12. TESTIMONIALS SLIDER
// ========================================
const testimonialCards = document.querySelectorAll('.testimonial-card');
let sliderIndex     = 0;
let sliderAutoplay  = null;
let isDragging      = false;
let dragStartX      = 0;
let dragScrollLeft  = 0;

function getVisibleCards() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768)  return 2;
    return 1;
}

function buildSliderDots() {
    if (!sliderDotsWrap) return;
    sliderDotsWrap.innerHTML = '';
    const total = testimonialCards.length;
    const visible = getVisibleCards();
    const dotCount = Math.max(total - visible + 1, 1);

    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        sliderDotsWrap.appendChild(dot);
    }
}

function updateDots() {
    if (!sliderDotsWrap) return;
    sliderDotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === sliderIndex);
    });
}

function goToSlide(index) {
    if (!testimonialCards.length) return;
    const visible  = getVisibleCards();
    const maxIndex = Math.max(testimonialCards.length - visible, 0);
    sliderIndex    = Math.max(0, Math.min(index, maxIndex));

    const cardWidth = testimonialCards[0].offsetWidth + 28; // card + gap (1.8rem ≈ 28px)
    testimonialsTrack.style.transform = `translateX(-${sliderIndex * cardWidth}px)`;
    updateDots();
}

function nextSlide() {
    const visible  = getVisibleCards();
    const maxIndex = Math.max(testimonialCards.length - visible, 0);
    goToSlide(sliderIndex >= maxIndex ? 0 : sliderIndex + 1);
}

function prevSlide() {
    const visible  = getVisibleCards();
    const maxIndex = Math.max(testimonialCards.length - visible, 0);
    goToSlide(sliderIndex <= 0 ? maxIndex : sliderIndex - 1);
}

function startAutoplay() {
    stopAutoplay();
    sliderAutoplay = setInterval(nextSlide, 4500);
}

function stopAutoplay() {
    clearInterval(sliderAutoplay);
}

if (sliderNext) sliderNext.addEventListener('click', () => { nextSlide(); stopAutoplay(); startAutoplay(); });
if (sliderPrev) sliderPrev.addEventListener('click', () => { prevSlide(); stopAutoplay(); startAutoplay(); });

// Touch / drag swipe
if (testimonialsTrack) {
    testimonialsTrack.addEventListener('mousedown', (e) => {
        isDragging    = true;
        dragStartX    = e.pageX - testimonialsTrack.offsetLeft;
        dragScrollLeft = sliderIndex;
        stopAutoplay();
    });

    testimonialsTrack.addEventListener('mouseleave', () => { isDragging = false; startAutoplay(); });
    testimonialsTrack.addEventListener('mouseup',    () => { isDragging = false; startAutoplay(); });

    testimonialsTrack.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x    = e.pageX - testimonialsTrack.offsetLeft;
        const walk = (x - dragStartX) / (testimonialsTrack.offsetWidth / getVisibleCards());
        if (Math.abs(walk) > 0.3) goToSlide(dragScrollLeft - Math.sign(walk));
    });

    // Touch events
    let touchStartX = 0;
    testimonialsTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        stopAutoplay();
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? nextSlide() : prevSlide();
        startAutoplay();
    }, { passive: true });
}

// Init slider
buildSliderDots();
startAutoplay();
window.addEventListener('resize', () => { buildSliderDots(); goToSlide(0); });


// ========================================
// 13. CONTACT FORM — VALIDATION + WHATSAPP
// ========================================
function showToast(message, isError = false) {
    const toast    = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.style.background = isError ? '#e53e3e' : '';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

function validateField(id, errorId, validator) {
    const field = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!field) return true;

    const valid = validator(field.value.trim());
    field.closest('.form-group')?.classList.toggle('error', !valid);
    if (error) error.style.display = valid ? 'none' : 'block';
    return valid;
}

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameValid  = validateField('name',  'nameError',  v => v.length >= 2);
    const phoneValid = validateField('phone', 'phoneError', v => /^[\d\s\+\-]{7,15}$/.test(v));

    if (!nameValid || !phoneValid) {
        showToast('Please fill in the required fields correctly.', true);
        return;
    }

    const name    = document.getElementById('name').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const email   = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    const submitBtn  = document.getElementById('submitBtn');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Loading state
    btnText.style.display    = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled       = true;

    setTimeout(() => {
        // Build WhatsApp message
        let waMsg = `Hi! I'm *${name}* and I'd like to book an appointment at *The A Beauty Zone*.`;
        if (service) waMsg += `\n\n💄 *Service:* ${service}`;
        if (message) waMsg += `\n📝 *Message:* ${message}`;
        waMsg += `\n📞 *Contact:* ${phone}`;
        if (email) waMsg += `\n📧 *Email:* ${email}`;

        const waUrl = `https://wa.me/919068627808?text=${encodeURIComponent(waMsg)}`;
        window.open(waUrl, '_blank');

        showToast('✅ Redirecting to WhatsApp...');
        contactForm.reset();

        // Clear any error states
        contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

        // Reset button
        btnText.style.display    = 'flex';
        btnLoading.style.display = 'none';
        submitBtn.disabled       = false;
    }, 800);
});

// Live validation on blur
['name', 'phone'].forEach(id => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('blur', () => {
        if (id === 'name')  validateField('name',  'nameError',  v => v.length >= 2);
        if (id === 'phone') validateField('phone', 'phoneError', v => /^[\d\s\+\-]{7,15}$/.test(v));
    });
    field.addEventListener('input', () => {
        field.closest('.form-group')?.classList.remove('error');
    });
});


// ========================================
// 14. FORM INPUT FOCUS ANIMATION
// ========================================
document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select').forEach(field => {
    field.addEventListener('focus', () => field.closest('.form-group')?.classList.add('focused'));
    field.addEventListener('blur',  () => {
        if (!field.value) field.closest('.form-group')?.classList.remove('focused');
    });
});


// ========================================
// 15. SERVICE CARD — 3D TILT HOVER (Handled via CSS transitions)
// ========================================
// Redundant mouse listeners removed to prevent conflicts with CSS hover animations


// ========================================
// 16. NAV OVERLAY CSS (injected — no HTML change needed)
// ========================================
const overlayStyle = document.createElement('style');
overlayStyle.textContent = `
    .nav-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(28, 10, 16, 0.55);
        backdrop-filter: blur(4px);
        z-index: 999;
        transition: opacity 0.35s ease;
    }
    .nav-overlay.active { display: block; }
    body.no-scroll { overflow: hidden; }
`;
document.head.appendChild(overlayStyle);


// ========================================
// 17. ANNOUNCEMENT STRIP — SEAMLESS CLONE
// ========================================
const stripTrack = document.querySelector('.strip-track');
if (stripTrack) {
    // Clone for infinite loop
    const clone = stripTrack.cloneNode(true);
    stripTrack.parentElement.appendChild(clone);
}


// ========================================
// 18. GLOBAL ERROR HANDLING
// ========================================
window.addEventListener('error',             e => console.error('JS Error:',           e.error));
window.addEventListener('unhandledrejection', e => console.error('Promise Rejection:', e.reason));

console.log('✨ The A Beauty Zone — Fully Loaded! 🌸');