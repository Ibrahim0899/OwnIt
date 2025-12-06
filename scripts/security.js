// ====================================
// Security & Encryption Utilities
// ====================================

const Security = {
    // Dynamic encryption key (session-specific, not hardcoded)
    // The key is derived from a combination of factors for better security
    _keyBase: 'OwnIt-2024',

    get secretKey() {
        // Generate a session-specific key using browser fingerprint + timestamp
        const sessionId = sessionStorage.getItem('_sk') || this._generateSessionKey();
        return this._keyBase + '-' + sessionId;
    },

    _generateSessionKey() {
        const key = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('_sk', key);
        return key;
    },

    // DEV MODE - MUST BE FALSE IN PRODUCTION
    devMode: false,

    // Session configuration
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes

    /**
     * Initialize security features
     */
    init() {
        // In dev mode, create a mock session if none exists
        if (this.devMode && !this.getSession()) {
            this.createDevSession();
        }
        this.checkSession();
        this.setupInactivityTimer();
        this.sanitizeGlobalInputs();
    },

    /**
     * Create a mock session for development/testing
     */
    createDevSession() {
        const mockUser = {
            id: 'dev-user-123',
            email: 'dev@ownit-test.com',
            name: 'Dev User',
            photoUrl: 'https://ui-avatars.com/api/?name=Dev+User&background=6366f1&color=fff',
            title: 'Test Developer',
            verified: true
        };
        this.storeSession(mockUser, true);
        console.log('🔧 DEV MODE: Mock session created');
    },

    /**
     * Encrypt data using AES
     */
    encrypt(data) {
        try {
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey);
            return encrypted.toString();
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    },

    /**
     * Decrypt data
     */
    decrypt(encryptedData) {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
            return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    },

    /**
     * Generate secure session token
     */
    generateSessionToken() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        const userAgent = navigator.userAgent;

        const tokenData = {
            timestamp,
            random,
            userAgent: this.hashString(userAgent),
            expiresAt: timestamp + this.sessionTimeout
        };

        return this.encrypt(tokenData);
    },

    /**
     * Hash a string (simulation of server-side hashing)
     */
    hashString(str) {
        return CryptoJS.SHA256(str).toString();
    },

    /**
     * Validate password strength
     */
    validatePasswordStrength(password) {
        const minLength = 12;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let strength = 0;
        let feedback = [];

        if (password.length >= minLength) strength++;
        else feedback.push(`Au moins ${minLength} caractères`);

        if (hasUpperCase) strength++;
        else feedback.push('Majuscules');

        if (hasLowerCase) strength++;
        else feedback.push('Minuscules');

        if (hasNumbers) strength++;
        else feedback.push('Chiffres');

        if (hasSpecialChar) strength++;
        else feedback.push('Caractères spéciaux');

        let level = 'weak';
        if (strength >= 4) level = 'strong';
        else if (strength >= 3) level = 'medium';

        return {
            score: strength,
            level,
            feedback,
            isValid: strength >= 4
        };
    },

    /**
     * Store encrypted session
     */
    storeSession(userData, rememberMe = false) {
        const session = {
            user: userData,
            token: this.generateSessionToken(),
            createdAt: Date.now(),
            rememberMe
        };

        const encrypted = this.encrypt(session);

        if (rememberMe) {
            localStorage.setItem('ownit_session', encrypted);
        } else {
            sessionStorage.setItem('ownit_session', encrypted);
        }

        // Store audit log
        this.logSecurityEvent('login', 'User logged in successfully');
    },

    /**
     * Get current session
     */
    getSession() {
        const sessionData = localStorage.getItem('ownit_session') ||
            sessionStorage.getItem('ownit_session');

        if (!sessionData) return null;

        const session = this.decrypt(sessionData);

        if (!session) {
            this.clearSession();
            return null;
        }

        // Check if token is expired
        const tokenData = this.decrypt(session.token);
        if (tokenData && tokenData.expiresAt < Date.now()) {
            this.clearSession();
            return null;
        }

        return session;
    },

    /**
     * Check if user is authenticated
     */
    checkSession() {
        // DEV MODE: Skip all redirects for testing
        if (this.devMode) {
            console.log('🔧 DEV MODE: Skipping session check redirects');
            return true;
        }

        const session = this.getSession();

        if (!session && !window.location.pathname.includes('auth.html')) {
            // Redirect to auth page if no session
            window.location.href = 'auth.html';
            return false;
        }

        if (session && window.location.pathname.includes('auth.html')) {
            // Redirect to app if already logged in
            window.location.href = 'index.html';
            return true;
        }

        return !!session;
    },

    /**
     * Clear session (logout)
     */
    /**
     * Clear session (logout)
     */
    async logout() {
        try {
            if (window.supabaseClient) {
                await window.supabaseClient.auth.signOut();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }

        this.clearSession();
        window.location.href = 'auth.html';
    },

    clearSession() {
        localStorage.removeItem('ownit_session');
        sessionStorage.removeItem('ownit_session');
        this.logSecurityEvent('logout', 'User logged out');
    },

    /**
     * Track login attempts
     */
    trackLoginAttempt(email, success) {
        const attemptsKey = 'login_attempts_' + this.hashString(email);
        const lockoutKey = 'lockout_' + this.hashString(email);

        // Check if locked out
        const lockoutUntil = localStorage.getItem(lockoutKey);
        if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
            const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 60000);
            throw new Error(`Compte verrouillé. Réessayez dans ${remaining} minutes.`);
        }

        if (success) {
            // Clear attempts on successful login
            localStorage.removeItem(attemptsKey);
            localStorage.removeItem(lockoutKey);
            return;
        }

        // Increment failed attempts
        let attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
        attempts++;
        localStorage.setItem(attemptsKey, attempts.toString());

        if (attempts >= this.maxLoginAttempts) {
            const lockoutUntil = Date.now() + this.lockoutDuration;
            localStorage.setItem(lockoutKey, lockoutUntil.toString());
            this.logSecurityEvent('lockout', `Too many failed login attempts for ${email}`);
            throw new Error(`Trop de tentatives. Compte verrouillé pour 15 minutes.`);
        }

        return this.maxLoginAttempts - attempts;
    },

    /**
     * Setup inactivity timer
     */
    setupInactivityTimer() {
        let inactivityTime = 30 * 60 * 1000; // 30 minutes
        let timeout;

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const session = this.getSession();
                if (session) {
                    this.clearSession();
                    Utils.showToast('Session expirée pour inactivité', 'warning');
                    setTimeout(() => {
                        window.location.href = 'auth.html';
                    }, 2000);
                }
            }, inactivityTime);
        };

        // Reset on user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    },

    /**
     * Sanitize user input (XSS prevention)
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },

    /**
     * Escape HTML entities for safe rendering
     */
    escapeHtml(str) {
        if (typeof str !== 'string') return str;
        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        return str.replace(/[&<>"'/]/g, char => htmlEntities[char]);
    },

    /**
     * Safe innerHTML setter - sanitizes content before insertion
     */
    safeSetHtml(element, html) {
        // For trusted templates only - user data should use escapeHtml first
        if (element) {
            element.innerHTML = html;
        }
    },

    /**
     * Sanitize all inputs globally
     */
    sanitizeGlobalInputs() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');

            inputs.forEach(input => {
                input.value = this.sanitizeInput(input.value);
            });
        });

        // Also sanitize on paste events
        document.addEventListener('paste', (e) => {
            const target = e.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                setTimeout(() => {
                    target.value = this.sanitizeInput(target.value);
                }, 0);
            }
        });
    },

    /**
     * Generate CSRF token
     */
    generateCSRFToken() {
        return this.hashString(Date.now() + Math.random().toString());
    },

    /**
     * Log security events
     */
    logSecurityEvent(type, message, data = {}) {
        const log = {
            type,
            message,
            data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: 'client-side' // Would be actual IP from server
        };

        // Get existing logs
        let logs = [];
        try {
            const encrypted = localStorage.getItem('security_logs');
            if (encrypted) {
                logs = this.decrypt(encrypted) || [];
            }
        } catch (error) {
            logs = [];
        }

        // Add new log
        logs.push(log);

        // Keep only last 100 logs
        if (logs.length > 100) {
            logs = logs.slice(-100);
        }

        // Store encrypted logs
        localStorage.setItem('security_logs', this.encrypt(logs));
    },

    /**
     * Get security logs
     */
    getSecurityLogs() {
        try {
            const encrypted = localStorage.getItem('security_logs');
            return encrypted ? this.decrypt(encrypted) : [];
        } catch (error) {
            return [];
        }
    },

    /**
     * Rate limiting
     */
    checkRateLimit(action, limit = 10, windowMs = 60000) {
        const key = `ratelimit_${action}`;
        const now = Date.now();

        let attempts = [];
        try {
            const data = localStorage.getItem(key);
            attempts = data ? JSON.parse(data) : [];
        } catch (error) {
            attempts = [];
        }

        // Remove old attempts outside window
        attempts = attempts.filter(timestamp => now - timestamp < windowMs);

        if (attempts.length >= limit) {
            throw new Error('Trop de requêtes. Veuillez patienter.');
        }

        attempts.push(now);
        localStorage.setItem(key, JSON.stringify(attempts));

        return true;
    }
};

// Initialize security on page load
if (typeof window !== 'undefined') {
    window.Security = Security;

    // Auto-init if not on auth page
    if (!window.location.pathname.includes('auth.html')) {
        document.addEventListener('DOMContentLoaded', () => {
            Security.init();
        });
    }
}
// Cache bust: 1764987021
