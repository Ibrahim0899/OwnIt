// ====================================
// Loading States & UI Polish
// ====================================

const UIPolish = {
    /**
     * Initialize UI polish features
     */
    init() {
        this.setupLoadingStates();
        this.setupFormValidations();
        this.setupErrorHandling();
        this.setupTransitions();
    },

    /**
     * Setup loading states for async operations
     */
    setupLoadingStates() {
        // Add loading overlay component
        if (!document.getElementById('global-loading')) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'global-loading';
            loadingOverlay.className = 'global-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner-container">
                    <div class="loading-spinner"></div>
                    <p class="loading-text">Chargement...</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
        }
    },

    /**
     * Show global loading indicator
     */
    showLoading(message = 'Chargement...') {
        const loading = document.getElementById('global-loading');
        if (loading) {
            const text = loading.querySelector('.loading-text');
            if (text) text.textContent = message;
            loading.classList.add('active');
        }
    },

    /**
     * Hide global loading indicator
     */
    hideLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) {
            loading.classList.remove('active');
        }
    },

    /**
     * Setup form validations
     */
    setupFormValidations() {
        // Validate all forms on submit
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (!this.validateForm(form)) {
                e.preventDefault();
                return false;
            }
        });

        // Real-time validation for inputs
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.validateField(e.target);
            }
        });
    },

    /**
     * Validate entire form
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    },

    /**
     * Validate individual field
     */
    validateField(field) {
        // Remove existing error
        this.clearFieldError(field);

        // Required field check
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'Ce champ est requis');
            return false;
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                this.showFieldError(field, 'Adresse email invalide');
                return false;
            }
        }

        // Phone validation (basic)
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(field.value)) {
                this.showFieldError(field, 'Numéro de téléphone invalide');
                return false;
            }
        }

        // URL validation
        if (field.type === 'url' && field.value) {
            try {
                new URL(field.value);
            } catch {
                this.showFieldError(field, 'URL invalide');
                return false;
            }
        }

        // Min length
        if (field.minLength && field.value.length < field.minLength) {
            this.showFieldError(field, `Minimum ${field.minLength} caractères requis`);
            return false;
        }

        // Max length
        if (field.maxLength && field.value.length > field.maxLength) {
            this.showFieldError(field, `Maximum ${field.maxLength} caractères autorisés`);
            return false;
        }

        // Pattern validation
        if (field.pattern && field.value) {
            const regex = new RegExp(field.pattern);
            if (!regex.test(field.value)) {
                this.showFieldError(field, field.title || 'Format invalide');
                return false;
            }
        }

        // Mark as valid
        field.classList.add('valid');
        return true;
    },

    /**
     * Show field error
     */
    showFieldError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');

        // Create error message element
        const errorId = `error-${field.id || field.name}`;
        let errorElement = document.getElementById(errorId);

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'field-error';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }

        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
    },

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('invalid', 'valid');
        const errorId = `error-${field.id || field.name}`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.remove();
        }
    },

    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showError('Une erreur est survenue. Veuillez réessayer.');
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled rejection:', event.reason);
            this.showError('Une erreur est survenue. Veuillez réessayer.');
        });

        // Network error handling
        window.addEventListener('offline', () => {
            this.showError('Connexion Internet perdue. Certaines fonctionnalités peuvent ne pas fonctionner.', 'warning', 0);
        });

        window.addEventListener('online', () => {
            Utils.showToast('Connexion Internet rétablie', 'success');
        });
    },

    /**
     * Show error message
     */
    showError(message, type = 'error', duration = 5000) {
        Utils.showToast(message, type, duration);
    },

    /**
     * Setup smooth transitions
     */
    setupTransitions() {
        // Add page transition class
        document.body.classList.add('transitions-enabled');

        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });

        // Add intersection observer for fade-in animations
        this.setupScrollAnimations();
    },

    /**
     * Setup scroll animations
     */
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    },

    /**
     * Add skeleton loading for content
     */
    showSkeletonLoader(container, type = 'card') {
        const skeletons = {
            card: `
                <div class="skeleton-loader">
                    <div class="skeleton-header">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-text-block">
                            <div class="skeleton-text skeleton-text-lg"></div>
                            <div class="skeleton-text skeleton-text-sm"></div>
                        </div>
                    </div>
                    <div class="skeleton-body">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text skeleton-text-sm"></div>
                    </div>
                </div>
            `,
            list: `
                <div class="skeleton-loader">
                    ${Array(3).fill(0).map(() => `
                        <div class="skeleton-list-item">
                            <div class="skeleton-avatar skeleton-avatar-sm"></div>
                            <div class="skeleton-text"></div>
                        </div>
                    `).join('')}
                </div>
            `
        };

        if (container) {
            container.innerHTML = skeletons[type] || skeletons.card;
        }
    },

    /**
     * Consistency checks on page load
     */
    runConsistencyChecks() {
        // Check if user is authenticated
        if (window.Security && !window.location.pathname.includes('auth.html')) {
            const session = Security.getSession();
            if (!session) {
                console.warn('No active session found');
            }
        }

        // Check for required DOM elements
        const requiredElements = ['main-content', 'header', 'nav'];
        requiredElements.forEach(id => {
            if (!document.getElementById(id)) {
                console.error(`Required element missing: ${id}`);
            }
        });

        // Check for CSS loaded
        if (!document.styleSheets.length) {
            console.error('No stylesheets loaded');
        }

        // Check for JavaScript modules
        const requiredModules = ['Utils', 'MockData'];
        requiredModules.forEach(module => {
            if (!window[module]) {
                console.warn(`Module not loaded: ${module}`);
            }
        });
    }
};

// Initialize on page load
window.UIPolish = UIPolish;
document.addEventListener('DOMContentLoaded', () => {
    UIPolish.init();
    UIPolish.runConsistencyChecks();
});
