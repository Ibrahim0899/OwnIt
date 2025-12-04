// ====================================
// Utility Functions
// ====================================

const Utils = {
    /**
     * Format a date to relative time (e.g., "Il y a 2 heures")
     */
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
        if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
        if (weeks < 4) return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
        if (months < 12) return `Il y a ${months} mois`;
        return `Il y a ${years} an${years > 1 ? 's' : ''}`;
    },

    /**
     * Format duration in seconds to MM:SS
     */
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Create an element with attributes and children
     */
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on')) {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });

        return element;
    },

    /**
     * Show a toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = this.createElement('div', {
            className: `toast toast-${type}`,
            'aria-live': 'polite'
        }, [message]);

        // Add toast styles if not already present
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    bottom: 100px;
                    left: 50%;
                    transform: translateX(-50%) translateY(100px);
                    background-color: var(--color-text-primary);
                    color: white;
                    padding: var(--space-4) var(--space-6);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-xl);
                    z-index: 1000;
                    opacity: 0;
                    transition: all var(--transition-normal);
                    max-width: 90%;
                    text-align: center;
                }
                .toast.show {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                .toast-success {
                    background-color: var(--color-success);
                }
                .toast-warning {
                    background-color: var(--color-warning);
                }
                .toast-error {
                    background-color: var(--color-error);
                }
                @media (max-width: 768px) {
                    .toast {
                        bottom: calc(var(--mobile-nav-height) + var(--space-4));
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Debounce function calls
     */
    debounce(func, wait) {
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

    /**
     * Generate a random ID
     */
    generateId() {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Check if browser supports required APIs
     */
    checkBrowserSupport() {
        const support = {
            mediaRecorder: typeof MediaRecorder !== 'undefined',
            speechSynthesis: typeof speechSynthesis !== 'undefined',
            speechRecognition: typeof webkitSpeechRecognition !== 'undefined' || typeof SpeechRecognition !== 'undefined',
            audioContext: typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined'
        };

        return support;
    },

    /**
     * Request microphone permission
     */
    async requestMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            return false;
        }
    }
};

// Make Utils globally available
window.Utils = Utils;
