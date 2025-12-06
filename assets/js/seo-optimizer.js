/**
 * Advanced SEO and Social Media Integration
 * Structured Data, Open Graph, and Social Sharing Optimization
 * Version: 5.0.0
 * Created: 2025-11-28
 */

class SEOOptimizer {
    constructor() {
        this.pageData = this.getPageData();
        this.init();
    }

    init() {
        this.addStructuredData();
        this.addOpenGraphTags();
        this.addTwitterCards();
        this.optimizeMetaTags();
        this.addCanonicalUrls();
        this.setupSocialSharing();
        this.addBreadcrumbs();
        this.optimizeImages();
    }

    // Get page-specific data
    getPageData() {
        const path = window.location.pathname;
        const pageData = {
            homepage: {
                title: 'Maurice Jakisa - Professional Software Developer & IT Consultant',
                description: 'Expert software developer specializing in full-stack web development, IoT solutions, and server administration. View portfolio, projects, and professional experience.',
                keywords: 'software developer, web developer, IT consultant, full-stack developer, IoT developer, server administration, PHP, JavaScript, Python, Arduino',
                image: 'https://mauricejakisa.com/assets/images/profile picture.jpg',
                url: 'https://mauricejakisa.com/',
                type: 'website',
                siteName: 'Maurice Jakisa Portfolio',
                author: 'Maurice Jakisa',
                section: 'Homepage',
                tags: ['portfolio', 'developer', 'software', 'web development']
            },
            about: {
                title: 'About Maurice Jakisa - Professional Background & Experience',
                description: 'Learn about Maurice Jakisa\'s professional journey, expertise in software development, and experience in IT consulting, web development, and IoT solutions.',
                keywords: 'about Maurice Jakisa, software developer background, IT consultant experience, web developer profile',
                image: 'https://mauricejakisa.com/assets/images/profile picture.jpg',
                url: 'https://mauricejakisa.com/about.html',
                type: 'profile',
                author: 'Maurice Jakisa',
                section: 'About'
            },
            resume: {
                title: 'Maurice Jakisa - Professional Resume & CV',
                description: 'View Maurice Jakisa\'s comprehensive professional resume, including experience, skills, and education in software development and IT consulting.',
                keywords: 'Maurice Jakisa resume, CV, professional background, software developer experience, IT consultant resume',
                image: 'https://mauricejakisa.com/assets/documents/Mungu_Jakisa_Maurice_CV.pdf',
                url: 'https://mauricejakisa.com/resume.html',
                type: 'profile',
                author: 'Maurice Jakisa',
                section: 'Resume'
            },
            projects: {
                title: 'Maurice Jakisa - Portfolio Projects & Case Studies',
                description: 'Explore Maurice Jakisa\'s portfolio of projects including web development, IoT solutions, home automation, and server administration implementations.',
                keywords: 'portfolio projects, web development examples, IoT projects, home automation, server configuration, PHP projects',
                image: 'https://mauricejakisa.com/assets/images/web-dev/1.jpg',
                url: 'https://mauricejakisa.com/projects.html',
                type: 'website',
                author: 'Maurice Jakisa',
                section: 'Projects'
            },
            contact: {
                title: 'Contact Maurice Jakisa - Professional Inquiries',
                description: 'Get in touch with Maurice Jakisa for software development projects, IT consulting, and professional collaborations.',
                keywords: 'contact Maurice Jakisa, hire software developer, IT consulting, web development services',
                image: 'https://mauricejakisa.com/assets/images/profile picture.jpg',
                url: 'https://mauricejakisa.com/contact.html',
                type: 'website',
                author: 'Maurice Jakisa',
                section: 'Contact'
            },
            blog: {
                title: 'Maurice Jakisa - Technical Blog & Articles',
                description: 'Read technical articles and insights by Maurice Jakisa covering web development, IoT, server administration, and software development best practices.',
                keywords: 'technical blog, web development articles, IoT tutorials, server administration, programming tips',
                image: 'https://mauricejakisa.com/assets/images/banner_image.jpg',
                url: 'https://mauricejakisa.com/blog.html',
                type: 'website',
                author: 'Maurice Jakisa',
                section: 'Blog'
            }
        };

        // Determine current page
        if (path.includes('about')) return pageData.about;
        if (path.includes('resume')) return pageData.resume;
        if (path.includes('projects')) return pageData.projects;
        if (path.includes('contact')) return pageData.contact;
        if (path.includes('blog')) return pageData.blog;
        
        return pageData.homepage;
    }

    // Add structured data (JSON-LD)
    addStructuredData() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Maurice Jakisa",
            "jobTitle": "Software Developer & IT Consultant",
            "description": "Professional software developer specializing in full-stack web development, IoT solutions, and server administration.",
            "url": this.pageData.url,
            "image": this.pageData.image,
            "sameAs": [
                "https://www.linkedin.com/in/mauricejakisa",
                "https://github.com/mauricejakisa",
                "https://twitter.com/mauricejakisa"
            ],
            "knowsAbout": [
                "Software Development",
                "Web Development",
                "Full-Stack Development",
                "IoT Development",
                "Server Administration",
                "PHP Development",
                "JavaScript Development",
                "Python Programming",
                "Arduino Programming",
                "Database Management"
            ],
            "worksFor": {
                "@type": "Organization",
                "name": "Independent Consulting"
            },
            "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Various Technical Institutions"
            }
        };

        // Add page-specific schema
        if (window.location.pathname.includes('projects')) {
            schema["@type"] = "CreativeWork";
            schema["creator"] = {
                "@type": "Person",
                "name": "Maurice Jakisa"
            };
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    }

    // Add Open Graph meta tags
    addOpenGraphTags() {
        const tags = {
            'og:title': this.pageData.title,
            'og:description': this.pageData.description,
            'og:image': this.pageData.image,
            'og:url': this.pageData.url,
            'og:type': this.pageData.type,
            'og:site_name': this.pageData.siteName || 'Maurice Jakisa Portfolio',
            'og:locale': 'en_US',
            'og:locale:alternate': ['en_GB', 'fr_FR', 'de_DE'],
            'og:author': this.pageData.author,
            'og:section': this.pageData.section,
            'og:tag': this.pageData.tags ? this.pageData.tags.join(', ') : ''
        };

        this.addMetaTags(tags, 'property');
    }

    // Add Twitter Card meta tags
    addTwitterCards() {
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:site': '@mauricejakisa',
            'twitter:creator': '@mauricejakisa',
            'twitter:title': this.pageData.title,
            'twitter:description': this.pageData.description,
            'twitter:image': this.pageData.image,
            'twitter:image:alt': `Profile picture of ${this.pageData.author}`,
            'twitter:domain': 'mauricejakisa.com'
        };

        this.addMetaTags(twitterTags, 'name');
    }

    // Add standard meta tags
    optimizeMetaTags() {
        const metaTags = {
            'description': this.pageData.description,
            'keywords': this.pageData.keywords,
            'author': this.pageData.author,
            'robots': 'index, follow, max-snippet:-1, max-image-preview:large',
            'googlebot': 'index, follow, max-snippet:-1, max-image-preview:large',
            'bingbot': 'index, follow, max-snippet:-1, max-image-preview:large',
            'viewport': 'width=device-width, initial-scale=1.0',
            'theme-color': '#2563eb',
            'msapplication-TileColor': '#2563eb',
            'application-name': 'Maurice Jakisa Portfolio',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'default',
            'apple-mobile-web-app-title': 'Maurice Jakisa'
        };

        this.addMetaTags(metaTags, 'name');
    }

    // Add canonical URLs
    addCanonicalUrls() {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = this.pageData.url;
        document.head.appendChild(canonical);

        // Add alternate languages
        const languages = [
            { lang: 'en', href: this.pageData.url },
            { lang: 'fr', href: this.pageData.url.replace('mauricejakisa.com', 'mauricejakisa.com/fr') },
            { lang: 'de', href: this.pageData.url.replace('mauricejakisa.com', 'mauricejakisa.com/de') }
        ];

        languages.forEach(lang => {
            const alternate = document.createElement('link');
            alternate.rel = 'alternate';
            alternate.hreflang = lang.lang;
            alternate.href = lang.href;
            document.head.appendChild(alternate);
        });
    }

    // Helper method to add meta tags
    addMetaTags(tags, attribute) {
        Object.entries(tags).forEach(([key, value]) => {
            if (value) {
                const meta = document.createElement('meta');
                meta.setAttribute(attribute, key);
                meta.content = value;
                document.head.appendChild(meta);
            }
        });
    }

    // Setup social sharing functionality
    setupSocialSharing() {
        this.addSocialShareButtons();
        this.trackSocialShares();
    }

    // Add social share buttons
    addSocialShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share-container';
        shareContainer.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const shareButtons = [
            {
                name: 'Facebook',
                icon: 'fab fa-facebook-f',
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                color: '#1877f2'
            },
            {
                name: 'Twitter',
                icon: 'fab fa-twitter',
                url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(this.pageData.title)}`,
                color: '#1da1f2'
            },
            {
                name: 'LinkedIn',
                icon: 'fab fa-linkedin-in',
                url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                color: '#0077b5'
            },
            {
                name: 'WhatsApp',
                icon: 'fab fa-whatsapp',
                url: `https://wa.me/?text=${encodeURIComponent(this.pageData.title + ' ' + window.location.href)}`,
                color: '#25d366'
            },
            {
                name: 'Copy Link',
                icon: 'fas fa-copy',
                url: 'copy',
                color: '#6b7280'
            }
        ];

        shareButtons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = 'share-btn';
            btn.innerHTML = `<i class="${button.icon}"></i>`;
            btn.title = `Share on ${button.name}`;
            btn.style.cssText = `
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: ${button.color};
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;

            btn.addEventListener('click', () => {
                if (button.url === 'copy') {
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        this.showNotification('Link copied to clipboard!');
                        this.trackShare('copy_link');
                    });
                } else {
                    window.open(button.url, '_blank', 'width=600,height=400');
                    this.trackShare(button.name.toLowerCase().replace(' ', '_'));
                }
            });

            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.1)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });

            shareContainer.appendChild(btn);
        });

        // Only show on desktop
        if (window.innerWidth > 768) {
            document.body.appendChild(shareContainer);
        }
    }

    // Track social shares
    trackSocialShares(platform) {
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.trackEvent('social', 'share', {
                platform: platform,
                page_url: window.location.href,
                page_title: this.pageData.title
            });
        }
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'seo-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add breadcrumb navigation
    addBreadcrumbs() {
        const path = window.location.pathname;
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb-nav';
        breadcrumb.setAttribute('aria-label', 'Breadcrumb');
        breadcrumb.style.cssText = `
            padding: 10px 20px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 20px;
        `;

        const breadcrumbs = [
            { name: 'Home', url: '/' },
            { name: this.getPageName(path), url: path }
        ];

        breadcrumb.innerHTML = `
            <ol style="list-style: none; margin: 0; padding: 0; display: flex; align-items: center;">
                ${breadcrumbs.map((crumb, index) => `
                    <li style="display: flex; align-items: center;">
                        ${index > 0 ? '<span style="margin: 0 8px; color: #64748b;">></span>' : ''}
                        ${index === breadcrumbs.length - 1 ? 
                            `<span style="color: #374151; font-weight: 500;">${crumb.name}</span>` :
                            `<a href="${crumb.url}" style="color: #2563eb; text-decoration: none;">${crumb.name}</a>`
                        }
                    </li>
                `).join('')}
            </ol>
        `;

        // Insert after header if exists, otherwise at top
        const header = document.querySelector('header, nav, .header, .nav');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(breadcrumb, header.nextSibling);
        } else {
            document.body.insertBefore(breadcrumb, document.body.firstChild);
        }
    }

    // Get page name from path
    getPageName(path) {
        const names = {
            '/about.html': 'About',
            '/resume.html': 'Resume',
            '/projects.html': 'Projects',
            '/contact.html': 'Contact',
            '/blog.html': 'Blog'
        };
        return names[path] || 'Page';
    }

    // Optimize images for SEO
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            // Add lazy loading
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Add alt text if missing
            if (!img.alt) {
                img.alt = this.getImageAltText(img);
            }

            // Add width and height attributes
            if (!img.width || !img.height) {
                img.addEventListener('load', () => {
                    if (!img.width) img.width = img.naturalWidth;
                    if (!img.height) img.height = img.naturalHeight;
                });
            }

            // Add srcset for responsive images
            if (img.src && !img.srcset) {
                const baseUrl = img.src;
                const extension = baseUrl.split('.').pop();
                const nameWithoutExt = baseUrl.substring(0, baseUrl.lastIndexOf('.'));
                
                if (!baseUrl.includes('placeholder') && !baseUrl.includes('data:')) {
                    img.srcset = `
                        ${nameWithoutExt}-300w.${extension} 300w,
                        ${nameWithoutExt}-600w.${extension} 600w,
                        ${nameWithoutExt}-900w.${extension} 900w,
                        ${baseUrl} 1200w
                    `;
                    img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
                }
            }
        });
    }

    // Get appropriate alt text for images
    getImageAltText(img) {
        const src = img.src.toLowerCase();
        const className = img.className.toLowerCase();
        const id = img.id.toLowerCase();

        if (src.includes('profile')) return 'Professional profile picture of Maurice Jakisa';
        if (src.includes('banner')) return 'Professional portfolio banner image';
        if (src.includes('project')) return 'Portfolio project screenshot or demonstration';
        if (src.includes('arduino')) return 'Arduino and IoT project implementation';
        if (src.includes('web-dev')) return 'Web development project showcase';
        if (src.includes('server')) return 'Server configuration and administration project';
        
        return 'Portfolio image showcasing professional work and projects';
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .share-btn:focus {
        outline: 2px solid white;
        outline-offset: 2px;
    }
    
    @media (max-width: 768px) {
        .social-share-container {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);

// Initialize SEO optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.seoOptimizer = new SEOOptimizer();
});

// Export for use in other scripts
window.SEOOptimizer = SEOOptimizer;