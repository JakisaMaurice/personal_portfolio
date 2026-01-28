/**
 * Advanced Google Analytics 4 (GA4) Integration
 * Professional Analytics Tracking for Maurice Jakisa's Portfolio
 * Version: 5.0.0
 * Created: 2025-11-28
 */

class PortfolioAnalytics {
    constructor() {
        this.init();
    }

    init() {
        // Initialize GA4 tracking
        this.setupGA4();
        this.trackPageViews();
        this.setupEventTracking();
        this.setupCustomDimensions();
        this.setupEnhancedEcommerce();
    }

    setupGA4() {
        // Google Analytics 4 Configuration
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        // Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics measurement ID
        const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your GA4 measurement ID
        
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            // Enhanced ecommerce tracking
            send_page_view: false,
            // Custom parameters
            custom_map: {
                'custom_parameter_1': 'user_type',
                'custom_parameter_2': 'visitor_country',
                'custom_parameter_3': 'device_category'
            }
        });

        // Load GA4 script
        if (!document.querySelector('script[src*="gtag/js"]')) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            document.head.appendChild(script);
        }

        // Make gtag available globally
        window.gtag = gtag;
    }

    trackPageViews() {
        // Track page views with enhanced parameters
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            // Enhanced ecommerce parameters
            user_type: this.getUserType(),
            visitor_country: this.getVisitorCountry(),
            device_category: this.getDeviceCategory(),
            // Custom page categories
            content_group1: this.getPageCategory(),
            content_group2: this.getPageType(),
            // Session tracking
            session_id: this.getSessionId(),
            engagement_time_msec: '1'
        });
    }

    setupEventTracking() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a, .btn, .cta-button');
            if (target) {
                this.trackEvent('user_interaction', 'button_click', {
                    button_text: target.textContent.trim(),
                    button_id: target.id || 'unknown',
                    button_class: target.className,
                    page_location: window.location.href,
                    click_timestamp: Date.now()
                });
            }
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.trackEvent('form_interaction', 'form_submit', {
                    form_id: e.target.id || 'unknown',
                    form_action: e.target.action || 'unknown',
                    page_location: window.location.href,
                    submit_timestamp: Date.now()
                });
            }
        });

        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.trackTimeOnPage();

        // Track section visibility
        this.trackSectionVisibility();
    }

    trackEvent(eventName, action, parameters = {}) {
        gtag('event', action, {
            event_category: eventName,
            event_label: parameters.page_location || window.location.href,
            // Add all custom parameters
            ...parameters,
            // Standard parameters
            page_location: window.location.href,
            page_title: document.title,
            timestamp: Date.now()
        });
    }

    trackScrollDepth() {
        let maxScrollDepth = 0;
        const scrollThresholds = [25, 50, 75, 90, 100];
        const trackedThresholds = new Set();

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
            }

            // Track scroll depth milestones
            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                    trackedThresholds.add(threshold);
                    this.trackEvent('engagement', 'scroll_depth', {
                        scroll_depth: threshold,
                        max_scroll_depth: maxScrollDepth,
                        page_location: window.location.href
                    });
                }
            });
        });
    }

    trackTimeOnPage() {
        const startTime = Date.now();
        let trackedTime = false;

        // Track time on page milestones
        const timeMilestones = [30, 60, 120, 300, 600]; // seconds

        const checkTimeOnPage = () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            timeMilestones.forEach(milestone => {
                if (timeSpent >= milestone && !trackedTime) {
                    this.trackEvent('engagement', 'time_on_page', {
                        time_spent: milestone,
                        page_location: window.location.href,
                        session_duration: milestone
                    });
                    trackedTime = true;
                }
            });
        };

        // Check every 5 seconds
        setInterval(checkTimeOnPage, 5000);
    }

    trackSectionVisibility() {
        const sections = document.querySelectorAll('section, .section, .hero, .about, .skills, .projects, .contact');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackEvent('content_engagement', 'section_view', {
                        section_name: entry.target.tagName.toLowerCase(),
                        section_id: entry.target.id || 'unknown',
                        visibility_ratio: entry.intersectionRatio,
                        page_location: window.location.href
                    });
                }
            });
        }, {
            threshold: 0.5 // Section is 50% visible
        });

        sections.forEach(section => observer.observe(section));
    }

    // Custom dimension helpers
    getUserType() {
        // Determine if user is new or returning
        return localStorage.getItem('visited_before') ? 'returning' : 'new';
    }

    getVisitorCountry() {
        // This would typically use IP geolocation service
        // For now, return a placeholder
        return 'unknown';
    }

    getDeviceCategory() {
        const userAgent = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
            return 'tablet';
        }
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
            return 'mobile';
        }
        return 'desktop';
    }

    getPageCategory() {
        // Determine page category based on URL
        const path = window.location.pathname;
        if (path.includes('blog')) return 'blog';
        if (path.includes('resume')) return 'resume';
        if (path.includes('projects')) return 'projects';
        if (path.includes('about')) return 'about';
        return 'homepage';
    }

    getPageType() {
        // Determine page type based on content
        if (document.querySelector('form')) return 'interactive';
        if (document.querySelector('.blog-post')) return 'content';
        return 'portfolio';
    }

    getSessionId() {
        // Generate or retrieve session ID
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    setupCustomDimensions() {
        // Set custom dimensions on page load
        gtag('config', 'GA_MEASUREMENT_ID', {
            custom_map: {
                'custom_dimension_1': 'user_type',
                'custom_dimension_2': 'device_category',
                'custom_dimension_3': 'page_category'
            }
        });
    }

    setupEnhancedEcommerce() {
        // Track conversions (contact form submissions, newsletter signups)
        this.trackConversions();
    }

    trackConversions() {
        // Contact form conversion
        document.addEventListener('contactFormSubmitted', () => {
            this.trackEvent('conversion', 'contact_form_submit', {
                event_category: 'Lead Generation',
                event_label: 'Contact Form',
                value: 1,
                currency: 'USD'
            });
        });

        // Newsletter signup conversion
        document.addEventListener('newsletterSubscribed', () => {
            this.trackEvent('conversion', 'newsletter_signup', {
                event_category: 'Email Marketing',
                event_label: 'Newsletter Subscription',
                value: 1,
                currency: 'USD'
            });
        });
    }

    // Public methods for external use
    trackCustomEvent(category, action, label = '', parameters = {}) {
        this.trackEvent(category, action, { ...parameters, custom_label: label });
    }

    trackPagePerformance() {
        // Track Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with a web vitals library
            console.log('Performance tracking initialized');
        }
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mark user as having visited before
    localStorage.setItem('visited_before', 'true');
    
    // Initialize analytics
    window.portfolioAnalytics = new PortfolioAnalytics();
    
    // Track initial page load performance
    window.portfolioAnalytics.trackPagePerformance();
});

// Export for use in other scripts
window.PortfolioAnalytics = PortfolioAnalytics;