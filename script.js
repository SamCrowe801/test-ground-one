/**
 * Cindy's Journey - Interactive Animations
 * Apple-style glassmorphic website with scroll animations
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollReveal();
    initNavDots();
    initSmoothScroll();
    initParallaxOrbs();
});

/**
 * Loading Screen Animation
 */
function initLoader() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');

    // Simulate loading (in real app, this would wait for assets)
    setTimeout(() => {
        loader.classList.add('hidden');
        mainContent.classList.remove('hidden');

        // Trigger initial animations after loader
        setTimeout(() => {
            triggerHeroAnimations();
        }, 300);
    }, 2500);
}

/**
 * Trigger hero section animations
 */
function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero-section .reveal-on-load');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 150);
    });
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
    const revealCards = document.querySelectorAll('.reveal-card');

    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealCards.forEach(card => {
        revealObserver.observe(card);
    });
}

/**
 * Navigation Dots
 */
function initNavDots() {
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = [
        document.querySelector('.hero-section'),
        document.getElementById('chapter-1'),
        document.getElementById('chapter-2'),
        document.getElementById('chapter-3'),
        document.getElementById('chapter-4'),
        document.getElementById('chapter-5'),
        document.getElementById('finale')
    ];

    // Click handlers for nav dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const section = sections[index];
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active dot on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id || 'hero';
                const index = getSectionIndex(sectionId);

                navDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section) {
            sectionObserver.observe(section);
        }
    });
}

/**
 * Get section index for nav dots
 */
function getSectionIndex(sectionId) {
    const sectionMap = {
        'hero': 0,
        'chapter-1': 1,
        'chapter-2': 2,
        'chapter-3': 3,
        'chapter-4': 4,
        'chapter-5': 5,
        'finale': 6
    };

    // Handle hero section (no id)
    if (!sectionId || sectionId === 'hero') return 0;

    return sectionMap[sectionId] ?? 0;
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Make scrollToSection available globally for onclick handlers
window.scrollToSection = scrollToSection;

/**
 * Initialize smooth scrolling with better iOS Safari support
 */
function initSmoothScroll() {
    // Check for native smooth scroll support
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;

    if (!supportsNativeSmoothScroll) {
        // Fallback for older iOS Safari
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    smoothScrollTo(target);
                }
            });
        });
    }
}

/**
 * Fallback smooth scroll for older browsers
 */
function smoothScrollTo(element) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function
        const easeInOutCubic = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startPosition + distance * easeInOutCubic);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

/**
 * Parallax effect for background orbs
 */
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.gradient-orb');
    let ticking = false;

    // Only enable on devices that can handle it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Disable on mobile for performance
    if (window.innerWidth < 768) {
        return;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const windowHeight = window.innerHeight;

                orbs.forEach((orb, index) => {
                    const speed = 0.1 + (index * 0.05);
                    const yPos = -(scrolled * speed);
                    orb.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });

            ticking = true;
        }
    });
}

/**
 * Optional: Add mouse parallax on hero section
 */
function initMouseParallax() {
    const hero = document.querySelector('.hero-section');
    const floatingCards = document.querySelectorAll('.floating-card');

    if (!hero || window.innerWidth < 768) return;

    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) / 50;
        const moveY = (clientY - centerY) / 50;

        floatingCards.forEach((card, index) => {
            const depth = 1 + index * 0.5;
            card.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        floatingCards.forEach(card => {
            card.style.transform = '';
        });
    });
}

/**
 * Add entrance animations to job cards with stagger
 */
function initJobCardAnimations() {
    const jobCards = document.querySelectorAll('.job-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    let delay = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                delay += 150;
            }
        });
    }, observerOptions);

    jobCards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * Performance optimization: Pause animations when not visible
 */
function initVisibilityOptimization() {
    document.addEventListener('visibilitychange', () => {
        const animatedElements = document.querySelectorAll('[class*="animation"], .gradient-orb');

        if (document.hidden) {
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });
}

// Initialize visibility optimization
initVisibilityOptimization();

/**
 * Add touch support for mobile
 */
function initTouchSupport() {
    // Add active states for touch devices
    const interactiveElements = document.querySelectorAll('.glass-card, .glass-button, .nav-dot');

    interactiveElements.forEach(el => {
        el.addEventListener('touchstart', () => {
            el.style.transform = 'scale(0.98)';
        }, { passive: true });

        el.addEventListener('touchend', () => {
            el.style.transform = '';
        }, { passive: true });
    });
}

// Initialize touch support on mobile
if ('ontouchstart' in window) {
    initTouchSupport();
}

/**
 * Easter egg: Konami code reveals special message
 */
function initEasterEgg() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                showEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function showEasterEgg() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(20px);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 10000;
            text-align: center;
            animation: fadeIn 0.5s ease;
        ">
            <div style="font-size: 60px; margin-bottom: 20px;">🎮</div>
            <h3 style="margin-bottom: 10px; font-size: 24px;">You found it!</h3>
            <p style="color: #86868b;">Cindy would probably say: "Why are you playing games? There's work to do!" 💪</p>
            <button onclick="this.parentElement.remove()" style="
                margin-top: 20px;
                padding: 12px 24px;
                background: #0071e3;
                border: none;
                border-radius: 100px;
                color: white;
                font-size: 16px;
                cursor: pointer;
            ">Got it!</button>
        </div>
    `;
    document.body.appendChild(message.firstElementChild);
}

// Initialize easter egg
initEasterEgg();

/**
 * Console message for curious developers
 */
console.log(`
%c🏔️ CINDY'S JOURNEY 🏔️
%cA story of adventure, resilience, and finding your way home.

Made with 💖 for the best friend ever.

If you're reading this, you're probably a developer.
Cindy would say: "Stop reading console logs and get back to work!" 😂

`,
'font-size: 20px; font-weight: bold; color: #0071e3;',
'font-size: 14px; color: #86868b;'
);
