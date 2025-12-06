/**
 * Modern Portfolio JavaScript
 * Author: Mungu Jakisa Maurice
 * Description: Modern, accessible JavaScript for portfolio website
 */

'use strict';

// ===== UTILITY FUNCTIONS =====
const utils = {
    // Debounce function to limit function calls
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Smooth scroll to element
    scrollTo: (target, offset = 80) => {
        const element = document.querySelector(target);
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    },

    // Check if element is in viewport
    isInViewport: (element, threshold = 0.1) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top <= windowHeight * (1 + threshold) &&
            rect.bottom >= -windowHeight * threshold &&
            rect.left <= windowWidth * (1 + threshold) &&
            rect.right >= -windowWidth * threshold
        );
    },

    // Format phone numbers
    formatPhone: (phone) => {
        return phone.replace(/(\+256)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    }
};

// ===== NAVIGATION MODULE =====
const navigation = {
    init() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (!this.navToggle || !this.navMenu) return;
        
        this.bindEvents();
        this.updateActiveLink();
    },

    bindEvents() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });

        // Update active link on scroll
        window.addEventListener('scroll', utils.throttle(() => {
            this.updateActiveLink();
        }, 100));
    },

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Update aria attributes
        const isExpanded = this.navMenu.classList.contains('active');
        this.navToggle.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    },

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    },

    updateActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash;
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            const linkHref = link.getAttribute('href');
            const linkPath = linkHref.split('/').pop();
            
            if (linkPath === currentPath || 
                (currentPath === '' && linkPath === 'index.html') ||
                (currentHash && linkHref.includes(currentHash))) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }
};

// ===== SMOOTH SCROLLING MODULE =====
const smoothScroll = {
    init() {
        // Handle anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = link.getAttribute('href');
                utils.scrollTo(target);
            }
        });
    }
};

// ===== ANIMATION MODULE =====
const animations = {
    init() {
        // Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

            // Observe elements for animation
            this.observeElements();
        }

        // Animate skill bars when visible
        this.animateSkillBars();
    },

    observeElements() {
        const animatedElements = document.querySelectorAll(
            '.project-card, .skill-item, .hero-stats .stat-item'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            this.observer.observe(el);
        });
    },

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                this.observer.unobserve(entry.target);
            }
        });
    },

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const skillObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target;
                        const progress = progressBar.dataset.progress || 0;

                        setTimeout(() => {
                            progressBar.style.width = progress + '%';
                        }, 200);

                        skillObserver.unobserve(progressBar);
                    }
                });
            },
            { threshold: 0.1 } // Lower threshold to catch bars sooner
        );

        // Also set initial width for bars that are already visible
        skillBars.forEach(bar => {
            if (utils.isInViewport(bar, 0.1)) {
                // If already visible, animate immediately
                setTimeout(() => {
                    bar.style.width = (bar.dataset.progress || 0) + '%';
                }, 200);
            } else {
                skillObserver.observe(bar);
            }
        });
    }
}

// ===== STATISTICS ANIMATION MODULE =====
const statistics = {
    init() {
        // Animate statistics when they come into view
        this.animateStats();
    },

    animateStats() {
        const statElements = document.querySelectorAll('.stat-number');
        const statObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const statElement = entry.target;
                        const targetValue = this.extractTargetValue(statElement.textContent);
                        const duration = 2000; // 2 seconds animation
                        const startTime = performance.now();

                        // Start animation
                        const animate = (currentTime) => {
                            const elapsedTime = currentTime - startTime;
                            const progress = Math.min(elapsedTime / duration, 1);
                            const currentValue = Math.floor(targetValue * progress);

                            // Format the value with + if it's a plus value
                            const formattedValue = targetValue.toString().includes('+')
                                ? `${currentValue}+`
                                : currentValue;

                            statElement.textContent = formattedValue;

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                // Mark as animated when complete
                                statElement.setAttribute('data-animated', 'true');
                            }
                        };

                        requestAnimationFrame(animate);
                        statObserver.unobserve(statElement);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statElements.forEach(stat => statObserver.observe(stat));
    },

    extractTargetValue(text) {
        // Extract numeric value from text (e.g., "3+" -> 3, "15+" -> 15, "24/7" -> 24)
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }
};

// ===== CONTACT FORM MODULE =====
const contactForm = {
    init() {
        const form = document.querySelector('.contact-page-form');
        if (!form) return;

        this.form = form;
        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    },

    async handleSubmit() {
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('input[type="submit"]');
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.value = 'Sending...';

        try {
            const response = await fetch('api/contact.php', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showMessage('Thank you! Your message has been sent successfully.', 'success');
                this.form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.value = 'Submit';
        }
    },

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing errors
        this.clearFieldError(field);

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'telephone':
                const phoneRegex = /^(\+256)?[0-9]{9}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid Ugandan phone number';
                }
                break;
            case 'feedback':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    },

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    },

    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Insert message at the top of the form
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
};

// ===== PERFORMANCE MODULE =====
const performance = {
    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
    },

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    preloadCriticalResources() {
        // Preload hero image
        const heroImg = new Image();
        heroImg.src = 'assets/images/optimized/banner_image2.webp';
    }
};

// ===== ACCESSIBILITY MODULE =====
const accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLiveRegions();
        this.setupReducedMotion();
    },

    setupKeyboardNavigation() {
        // Handle keyboard navigation for custom components
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    },

    setupAriaLiveRegions() {
        // Create live region for dynamic content announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    },

    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
        }
    }
};

// ===== ERROR HANDLING =====
const errorHandler = {
    init() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            // You could send this to an error tracking service
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            // You could send this to an error tracking service
        });
    }
};

// ===== MAIN APPLICATION =====
class PortfolioApp {
    constructor() {
        this.modules = [];
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            // Initialize all modules
            navigation.init();
            smoothScroll.init();
            animations.init();
            statistics.init();
            contactForm.init();
            performance.init();
            accessibility.init();
            errorHandler.init();

            console.log('Portfolio application initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio application:', error);
        }
    }
}

// ===== ADDITIONAL CSS FOR ANIMATIONS =====
const additionalStyles = `
    /* Scroll Animation Styles */
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .animate-visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* Keyboard Navigation Styles */
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }

    /* Reduced Motion Styles */
    .reduce-motion *,
    .reduce-motion *::before,
    .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    /* Form Styles */
    .form-message {
        padding: var(--space-md);
        margin-bottom: var(--space-md);
        border-radius: 6px;
        font-weight: 500;
    }

    .form-message.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .form-message.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    .field-error {
        color: #721c24;
        font-size: var(--font-size-sm);
        margin-top: var(--space-xs);
    }

    .error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application
const app = new PortfolioApp();
app.init();