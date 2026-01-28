/**
 * Advanced Performance Monitoring System
 * Core Web Vitals, Performance Metrics, and Real-time Monitoring
 * Version: 5.0.0
 * Created: 2025-11-28
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.thresholds = {
            FCP: 1.8, // First Contentful Paint (seconds)
            LCP: 2.5, // Largest Contentful Paint (seconds)
            FID: 100, // First Input Delay (milliseconds)
            CLS: 0.1, // Cumulative Layout Shift
            TTFB: 0.6 // Time to First Byte (seconds)
        };
        this.init();
    }

    init() {
        this.measureCoreWebVitals();
        this.measurePageLoadMetrics();
        this.monitorResourceTiming();
        this.measureUserExperience();
        this.setupPerformanceObserver();
        this.startRealTimeMonitoring();
        this.createPerformanceDashboard();
    }

    // Measure Core Web Vitals
    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.lcp = {
                    value: lastEntry.startTime,
                    rating: this.getLCPRating(lastEntry.startTime),
                    timestamp: Date.now(),
                    url: window.location.href
                };
                
                this.trackMetric('lcp', lastEntry.startTime);
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((entryList) => {
                entryList.getEntries().forEach((entry) => {
                    this.metrics.fid = {
                        value: entry.processingStart - entry.startTime,
                        rating: this.getFIDRating(entry.processingStart - entry.startTime),
                        timestamp: Date.now(),
                        url: window.location.href,
                        eventType: entry.name
                    };
                    
                    this.trackMetric('fid', entry.processingStart - entry.startTime);
                });
            });
            
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsScore = 0;
            const clsObserver = new PerformanceObserver((entryList) => {
                entryList.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                        
                        this.metrics.cls = {
                            value: clsScore,
                            rating: this.getCLSRating(clsScore),
                            timestamp: Date.now(),
                            url: window.location.href
                        };
                    }
                });
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // First Contentful Paint (FCP)
        if ('getEntriesByType' in performance) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = {
                        value: entry.startTime,
                        rating: this.getFCPRating(entry.startTime),
                        timestamp: Date.now(),
                        url: window.location.href
                    };
                    
                    this.trackMetric('fcp', entry.startTime);
                }
            });
        }
    }

    // Measure page load metrics
    measurePageLoadMetrics() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                
                this.metrics.pageLoad = {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    domInteractive: navigation.domInteractive - navigation.navigationStart,
                    timeToFirstByte: navigation.responseStart - navigation.requestStart,
                    totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
                    timestamp: Date.now(),
                    url: window.location.href
                };
                
                this.trackPageLoadMetrics(this.metrics.pageLoad);
            }, 0);
        });
    }

    // Monitor resource timing
    monitorResourceTiming() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((entryList) => {
                entryList.getEntries().forEach((entry) => {
                    const resourceType = this.getResourceType(entry.initiatorType);
                    
                    if (this.shouldTrackResource(entry.name, resourceType)) {
                        this.trackResourceMetrics(entry, resourceType);
                    }
                });
            });
            
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    // Measure user experience metrics
    measureUserExperience() {
        // Scroll depth tracking
        let maxScrollDepth = 0;
        let scrollTrackingActive = true;
        
        const trackScrollDepth = () => {
            if (!scrollTrackingActive) return;
            
            const scrollPercent = Math.round(
                (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                
                // Track scroll milestones
                [25, 50, 75, 90, 100].forEach(milestone => {
                    if (scrollPercent >= milestone && !this.metrics.scrollMilestones?.[milestone]) {
                        this.metrics.scrollMilestones = this.metrics.scrollMilestones || {};
                        this.metrics.scrollMilestones[milestone] = {
                            timestamp: Date.now(),
                            url: window.location.href
                        };
                        
                        this.trackMetric('scroll_depth', milestone);
                    }
                });
            }
        };
        
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScrollDepth, 100);
        });
        
        // Time on page tracking
        const startTime = Date.now();
        const timeMilestones = [30, 60, 120, 300, 600]; // seconds
        let trackedMilestones = new Set();
        
        const checkTimeOnPage = () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            timeMilestones.forEach(milestone => {
                if (timeSpent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    
                    this.metrics.timeOnPage = this.metrics.timeOnPage || {};
                    this.metrics.timeOnPage[milestone] = {
                        timestamp: Date.now(),
                        url: window.location.href
                    };
                    
                    this.trackMetric('time_on_page', milestone);
                }
            });
            
            if (timeSpent < 600) { // Continue for 10 minutes
                setTimeout(checkTimeOnPage, 5000);
            }
        };
        
        setTimeout(checkTimeOnPage, 5000);

        // Bounce rate detection
        let userInteracted = false;
        const interactionEvents = ['click', 'scroll', 'keydown', 'mousemove'];
        
        interactionEvents.forEach(event => {
            document.addEventListener(event, () => {
                userInteracted = true;
            }, { once: true });
        });
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            
            if (!userInteracted && timeSpent < 10000) { // Less than 10 seconds without interaction
                this.trackMetric('bounce', 1);
            }
        });
    }

    // Setup performance observer for additional metrics
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // Measure connection information
            if ('connection' in navigator) {
                const connection = navigator.connection;
                this.metrics.connection = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData
                };
            }
            
            // Monitor memory usage
            if ('memory' in performance) {
                setInterval(() => {
                    const memory = performance.memory;
                    this.metrics.memory = {
                        usedJSHeapSize: memory.usedJSHeapSize,
                        totalJSHeapSize: memory.totalJSHeapSize,
                        jsHeapSizeLimit: memory.jsHeapSizeLimit,
                        timestamp: Date.now()
                    };
                    
                    // Alert if memory usage is high
                    const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
                    if (memoryUsagePercent > 80) {
                        this.trackMetric('high_memory_usage', memoryUsagePercent);
                    }
                }, 30000); // Check every 30 seconds
            }
        }
    }

    // Start real-time monitoring
    startRealTimeMonitoring() {
        // Monitor for errors
        window.addEventListener('error', (event) => {
            this.trackError({
                type: 'javascript_error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now(),
                url: window.location.href
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError({
                type: 'promise_rejection',
                message: event.reason?.message || 'Unhandled promise rejection',
                stack: event.reason?.stack,
                timestamp: Date.now(),
                url: window.location.href
            });
        });
        
        // Monitor for performance issues
        setInterval(() => {
            this.checkPerformanceIssues();
        }, 60000); // Check every minute
    }

    // Create performance dashboard (for development/debugging)
    createPerformanceDashboard() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const dashboard = document.createElement('div');
            dashboard.id = 'performance-dashboard';
            dashboard.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 300px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                max-height: 400px;
                overflow-y: auto;
                backdrop-filter: blur(10px);
            `;
            
            const updateDashboard = () => {
                const metrics = this.getCurrentMetrics();
                dashboard.innerHTML = `
                    <div style="margin-bottom: 10px; font-weight: bold;">Performance Metrics</div>
                    <div>LCP: ${metrics.lcp?.value?.toFixed(2) || 'N/A'}ms (${metrics.lcp?.rating || 'N/A'})</div>
                    <div>FID: ${metrics.fid?.value?.toFixed(2) || 'N/A'}ms (${metrics.fid?.rating || 'N/A'})</div>
                    <div>CLS: ${metrics.cls?.value?.toFixed(3) || 'N/A'} (${metrics.cls?.rating || 'N/A'})</div>
                    <div>FCP: ${metrics.fcp?.value?.toFixed(2) || 'N/A'}ms (${metrics.fcp?.rating || 'N/A'})</div>
                    <div>Load Time: ${metrics.pageLoad?.totalLoadTime?.toFixed(2) || 'N/A'}ms</div>
                    <div>TTFB: ${metrics.pageLoad?.timeToFirstByte?.toFixed(2) || 'N/A'}ms</div>
                    <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">
                        Last updated: ${new Date().toLocaleTimeString()}
                    </div>
                `;
            };
            
            // Toggle dashboard visibility
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                    dashboard.style.display = dashboard.style.display === 'none' ? 'block' : 'none';
                }
            });
            
            document.body.appendChild(dashboard);
            
            // Update dashboard every 5 seconds
            setInterval(updateDashboard, 5000);
            updateDashboard();
        }
    }

    // Helper methods
    getLCPRating(value) {
        return value <= this.thresholds.LCP ? 'good' : value <= 4.0 ? 'needs-improvement' : 'poor';
    }

    getFIDRating(value) {
        return value <= this.thresholds.FID ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    }

    getCLSRating(value) {
        return value <= this.thresholds.CLS ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    }

    getFCPRating(value) {
        return value <= this.thresholds.FCP ? 'good' : value <= 3.0 ? 'needs-improvement' : 'poor';
    }

    getResourceType(initiatorType) {
        const resourceTypes = {
            'img': 'image',
            'script': 'script',
            'css': 'stylesheet',
            'link': 'stylesheet',
            'fetch': 'fetch',
            'xmlhttprequest': 'fetch'
        };
        return resourceTypes[initiatorType] || 'other';
    }

    shouldTrackResource(url, type) {
        const domain = new URL(url).hostname;
        const localDomain = new URL(window.location.href).hostname;
        
        // Only track resources from the same domain
        return domain === localDomain || !domain.includes('.');
    }

    trackResourceMetrics(entry, type) {
        const resourceMetrics = {
            name: entry.name,
            type: type,
            size: entry.transferSize,
            duration: entry.duration,
            timestamp: Date.now()
        };
        
        // Track slow resources
        if (entry.duration > 1000) {
            this.trackMetric('slow_resource', entry.duration, { resource: entry.name, type: type });
        }
    }

    trackPageLoadMetrics(metrics) {
        // Track page load performance
        if (metrics.totalLoadTime > 3000) {
            this.trackMetric('slow_page_load', metrics.totalLoadTime);
        }
        
        if (metrics.timeToFirstByte > this.thresholds.TTFB * 1000) {
            this.trackMetric('slow_ttfb', metrics.timeToFirstByte);
        }
    }

    trackError(errorData) {
        console.error('Performance Monitor - Error:', errorData);
        
        // Track error to analytics
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.trackEvent('error', 'performance_error', errorData);
        }
    }

    checkPerformanceIssues() {
        const issues = [];
        
        // Check for slow loading
        if (this.metrics.pageLoad?.totalLoadTime > 5000) {
            issues.push('Slow page load time');
        }
        
        // Check for high memory usage
        if (this.metrics.memory) {
            const memoryPercent = (this.metrics.memory.usedJSHeapSize / this.metrics.memory.jsHeapSizeLimit) * 100;
            if (memoryPercent > 80) {
                issues.push('High memory usage');
            }
        }
        
        // Check for slow connection
        if (this.metrics.connection?.effectiveType === 'slow-2g' || this.metrics.connection?.effectiveType === '2g') {
            issues.push('Slow network connection');
        }
        
        // Report issues
        issues.forEach(issue => {
            this.trackMetric('performance_issue', 1, { issue: issue });
        });
    }

    trackMetric(name, value, parameters = {}) {
        // Send to Google Analytics
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.trackEvent('performance', name, {
                value: value,
                ...parameters,
                timestamp: Date.now(),
                url: window.location.href
            });
        }
        
        // Store locally for debugging
        this.metrics[name] = this.metrics[name] || [];
        this.metrics[name].push({
            value: value,
            timestamp: Date.now(),
            ...parameters
        });
    }

    getCurrentMetrics() {
        return this.metrics;
    }

    // Public API
    getPerformanceReport() {
        return {
            coreWebVitals: {
                lcp: this.metrics.lcp,
                fid: this.metrics.fid,
                cls: this.metrics.cls,
                fcp: this.metrics.fcp
            },
            pageLoad: this.metrics.pageLoad,
            connection: this.metrics.connection,
            memory: this.metrics.memory,
            scrollDepth: this.metrics.scrollMilestones,
            timeOnPage: this.metrics.timeOnPage,
            timestamp: Date.now()
        };
    }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
});

// Export for use in other scripts
window.PerformanceMonitor = PerformanceMonitor;