/**
 * Advanced Email Integration & Newsletter System
 * Newsletter Signup, Email Validation, and Professional Email Handling
 * Version: 5.0.0
 * Created: 2025-11-28
 */

class EmailIntegration {
    constructor() {
        this.apiEndpoint = '/api/newsletter';
        this.validationRules = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            name: /^[a-zA-Z\s]{2,50}$/,
            phone: /^[\+]?[1-9][\d]{0,15}$/
        };
        this.init();
    }

    init() {
        this.createNewsletterWidget();
        this.setupFormValidation();
        this.integrateContactForm();
        this.createEmailTemplates();
        this.setupOfflineEmailQueue();
        this.addEmailAnalytics();
    }

    // Create newsletter signup widget
    createNewsletterWidget() {
        const widget = document.createElement('div');
        widget.id = 'newsletter-widget';
        widget.className = 'newsletter-widget';
        widget.innerHTML = `
            <div class="newsletter-content">
                <div class="newsletter-icon">📧</div>
                <div class="newsletter-text">
                    <h3>Stay Updated</h3>
                    <p>Get the latest articles, project updates, and tech insights delivered to your inbox.</p>
                </div>
                <form class="newsletter-form" id="newsletter-form">
                    <div class="form-group">
                        <input type="text" name="firstName" placeholder="First Name" required>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Your Email" required>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="web-dev">
                            <span class="checkmark"></span>
                            Web Development
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="iot">
                            <span class="checkmark"></span>
                            IoT & Arduino
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="server-admin">
                            <span class="checkmark"></span>
                            Server Administration
                        </label>
                    </div>
                    <button type="submit" class="newsletter-submit">
                        <span class="btn-text">Subscribe</span>
                        <span class="btn-loading" style="display: none;">Subscribing...</span>
                    </button>
                </form>
                <div class="newsletter-success" style="display: none;">
                    <div class="success-icon">✅</div>
                    <p>Welcome! Check your email for confirmation.</p>
                </div>
            </div>
        `;

        // Style the widget
        widget.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 350px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 25px;
            color: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000;
            backdrop-filter: blur(10px);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        `;

        // Show widget after 5 seconds
        setTimeout(() => {
            widget.style.transform = 'translateY(0)';
            widget.style.opacity = '1';
        }, 5000);

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'newsletter-close';
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        closeBtn.addEventListener('click', () => {
            widget.style.transform = 'translateY(100px)';
            widget.style.opacity = '0';
            setTimeout(() => widget.remove(), 300);
        });

        widget.appendChild(closeBtn);
        document.body.appendChild(widget);

        // Handle form submission
        this.handleNewsletterSubmission(widget);
    }

    // Handle newsletter form submission
    handleNewsletterSubmission(widget) {
        const form = widget.querySelector('#newsletter-form');
        const submitBtn = form.querySelector('.newsletter-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const successDiv = widget.querySelector('.newsletter-success');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                firstName: formData.get('firstName'),
                email: formData.get('email'),
                interests: formData.getAll('interests'),
                source: 'newsletter_widget',
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            };

            // Validate form data
            if (!this.validateNewsletterData(data)) {
                this.showFieldErrors(form, data);
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            try {
                await this.submitNewsletter(data);
                
                // Show success message
                form.style.display = 'none';
                successDiv.style.display = 'block';
                
                // Track conversion
                this.trackNewsletterConversion(data);
                
                // Send success event
                document.dispatchEvent(new CustomEvent('newsletterSubscribed', { 
                    detail: data 
                }));

            } catch (error) {
                console.error('Newsletter subscription failed:', error);
                this.showError(form, 'Subscription failed. Please try again.');
            } finally {
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });
    }

    // Validate newsletter data
    validateNewsletterData(data) {
        let isValid = true;

        // Validate first name
        if (!data.firstName || data.firstName.length < 2 || data.firstName.length > 50) {
            isValid = false;
        }

        // Validate email
        if (!data.email || !this.validationRules.email.test(data.email)) {
            isValid = false;
        }

        return isValid;
    }

    // Show field validation errors
    showFieldErrors(form, data) {
        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });

        // Show specific errors
        if (!data.firstName || data.firstName.length < 2) {
            const error = form.querySelector('input[name="firstName"]').nextElementSibling;
            error.textContent = 'Please enter a valid first name';
        }

        if (!data.email || !this.validationRules.email.test(data.email)) {
            const error = form.querySelector('input[name="email"]').nextElementSibling;
            error.textContent = 'Please enter a valid email address';
        }
    }

    // Submit newsletter data
    async submitNewsletter(data) {
        try {
            // Store locally if offline
            if (!navigator.onLine) {
                await this.storeOfflineNewsletter(data);
                return { status: 'queued', message: 'Subscription queued for when you\'re back online' };
            }

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            // Fallback to local storage if API fails
            await this.storeOfflineNewsletter(data);
            return { status: 'queued', message: 'Subscription saved locally' };
        }
    }

    // Store newsletter data offline
    async storeOfflineNewsletter(data) {
        const queue = JSON.parse(localStorage.getItem('newsletterQueue') || '[]');
        queue.push(data);
        localStorage.setItem('newsletterQueue', JSON.stringify(queue));

        // Register for background sync if available
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('newsletter-sync');
        }
    }

    // Setup form validation for contact forms
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.id !== 'newsletter-form') {
                this.enhanceContactForm(form);
            }
        });
    }

    // Enhance contact form with validation
    enhanceContactForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add real-time validation
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Enhanced form submission
        form.addEventListener('submit', async (e) => {
            if (!this.validateForm(form)) {
                e.preventDefault();
                return;
            }

            this.trackFormSubmission(form);
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'email':
                if (!value || !this.validationRules.email.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'name':
                if (!value || value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
            case 'phone':
                if (value && !this.validationRules.phone.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
        }

        // Show/hide error
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = isValid ? '' : errorMessage;
        }

        field.classList.toggle('error', !isValid);
        return isValid;
    }

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = '';
        }
    }

    // Validate entire form
    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Track form submission
    trackFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Track with analytics
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.trackEvent('form', 'submit', {
                form_id: form.id || 'unknown',
                form_name: form.name || 'unknown',
                fields_count: inputs.length,
                ...data
            });
        }
    }

    // Create email templates
    createEmailTemplates() {
        this.templates = {
            welcome: {
                subject: 'Welcome to Maurice Jakisa\'s Newsletter!',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Welcome to the Newsletter</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #f8f9fa; padding: 30px; }
                            .footer { background: #343a40; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
                            .btn { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Welcome to My Newsletter! 🚀</h1>
                                <p>Thank you for subscribing to get updates about my latest projects and insights</p>
                            </div>
                            <div class="content">
                                <h2>Hello {{firstName}},</h2>
                                <p>Welcome to my newsletter! I'm excited to share my latest projects, technical insights, and industry knowledge with you.</p>
                                
                                <h3>What you'll receive:</h3>
                                <ul>
                                    <li>📚 Weekly technical articles and tutorials</li>
                                    <li>🚀 Updates on my latest projects and innovations</li>
                                    <li>💡 Industry insights and best practices</li>
                                    <li>🔧 Exclusive tips for developers</li>
                                </ul>
                                
                                <p>In the meantime, feel free to explore my portfolio and connect with me on social media!</p>
                                
                                <a href="https://mauricejakisa.com" class="btn">Visit My Portfolio</a>
                            </div>
                            <div class="footer">
                                <p>Best regards,<br>Maurice Jakisa<br>Software Developer & IT Consultant</p>
                                <p style="font-size: 12px; opacity: 0.8;">You received this email because you subscribed to my newsletter. <a href="{{unsubscribe_url}}" style="color: #ccc;">Unsubscribe</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                text: `
                    Welcome to My Newsletter!
                    
                    Hello {{firstName}},
                    
                    Thank you for subscribing! You'll receive:
                    - Weekly technical articles and tutorials
                    - Updates on my latest projects
                    - Industry insights and best practices
                    - Exclusive tips for developers
                    
                    Visit my portfolio: https://mauricejakisa.com
                    
                    Best regards,
                    Maurice Jakisa
                    
                    To unsubscribe, visit: {{unsubscribe_url}}
                `
            },
            confirmation: {
                subject: 'Please Confirm Your Email Subscription',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Email Confirmation</title>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
                            .btn { background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Confirm Your Email 📧</h1>
                            <p>Click the button below to confirm your subscription to my newsletter:</p>
                            <a href="{{confirmation_url}}" class="btn">Confirm Subscription</a>
                            <p style="margin-top: 30px; color: #666;">If the button doesn't work, copy and paste this link into your browser:<br>{{confirmation_url}}</p>
                        </div>
                    </body>
                    </html>
                `
            }
        };
    }

    // Setup offline email queue
    setupOfflineEmailQueue() {
        // Process queued emails when back online
        window.addEventListener('online', () => {
            this.processEmailQueue();
        });

        // Process queue periodically
        setInterval(() => {
            if (navigator.onLine) {
                this.processEmailQueue();
            }
        }, 60000); // Every minute
    }

    // Process queued emails
    async processEmailQueue() {
        const queue = JSON.parse(localStorage.getItem('newsletterQueue') || '[]');
        
        if (queue.length === 0) return;

        for (const emailData of queue) {
            try {
                await this.submitNewsletter(emailData);
                // Remove from queue on success
                queue.shift();
            } catch (error) {
                console.error('Failed to process queued email:', error);
                break; // Stop processing if there's an error
            }
        }

        localStorage.setItem('newsletterQueue', JSON.stringify(queue));
    }

    // Add email analytics
    addEmailAnalytics() {
        // Track email engagement
        if (window.portfolioAnalytics) {
            // Track email opens (using tracking pixels)
            this.trackEmailOpens();
            
            // Track link clicks
            this.trackEmailClicks();
        }
    }

    // Track email opens
    trackEmailOpens() {
        // This would be implemented with email service provider
        // For now, just log the intention
        console.log('Email tracking initialized');
    }

    // Track email clicks
    trackEmailClicks() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('a[data-email-tracking="true"]')) {
                const link = e.target.closest('a');
                const emailId = link.dataset.emailId;
                
                if (window.portfolioAnalytics) {
                    window.portfolioAnalytics.trackEvent('email', 'click', {
                        email_id: emailId,
                        link_url: link.href,
                        timestamp: Date.now()
                    });
                }
            }
        });
    }

    // Track newsletter conversion
    trackNewsletterConversion(data) {
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.trackEvent('conversion', 'newsletter_signup', {
                source: data.source,
                interests: data.interests.join(', '),
                user_agent: data.userAgent,
                timestamp: data.timestamp
            });
        }
    }

    // Show error message
    showError(form, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: #fee2e2;
            color: #dc2626;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            font-size: 14px;
        `;

        const existingError = form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        form.insertBefore(errorDiv, form.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// CSS for newsletter widget
const emailStyles = document.createElement('style');
emailStyles.textContent = `
    .newsletter-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .form-group input {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        background: rgba(255,255,255,0.2);
        color: white;
        backdrop-filter: blur(10px);
    }
    
    .form-group input::placeholder {
        color: rgba(255,255,255,0.7);
    }
    
    .form-group input.error {
        border: 2px solid #ef4444;
    }
    
    .error-message {
        color: #fef2f2;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    }
    
    .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        cursor: pointer;
    }
    
    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }
    
    .newsletter-submit {
        background: rgba(255,255,255,0.2);
        border: 2px solid rgba(255,255,255,0.3);
        color: white;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .newsletter-submit:hover {
        background: rgba(255,255,255,0.3);
        border-color: rgba(255,255,255,0.5);
    }
    
    .newsletter-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .newsletter-success {
        text-align: center;
    }
    
    .success-icon {
        font-size: 48px;
        margin-bottom: 15px;
    }
    
    @media (max-width: 768px) {
        #newsletter-widget {
            width: calc(100vw - 40px);
            right: 20px;
        }
    }
`;
document.head.appendChild(emailStyles);

// Initialize email integration
document.addEventListener('DOMContentLoaded', () => {
    window.emailIntegration = new EmailIntegration();
});

// Export for use in other scripts
window.EmailIntegration = EmailIntegration;