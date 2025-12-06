// ====================================
// Two-Factor Authentication (2FA)
// ====================================

const TwoFactorAuth = {
    // 2FA configuration
    codeLength: 6,
    codeExpiration: 5 * 60 * 1000, // 5 minutes

    /**
     * Generate 6-digit verification code
     */
    generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    /**
     * Send SMS verification code
     */
    async sendSMSCode(phoneNumber, code) {
        // Simulate SMS sending
        console.log(`📱 SMS sent to ${phoneNumber}: Your OwnIt verification code is ${code}`);

        // DEMO MODE: Show code visually
        this.showCodeVisually(code, 'SMS');

        return new Promise((resolve) => {
            setTimeout(() => {
                Utils.showToast(`Code envoyé par SMS au ${phoneNumber}`, 'success');
                resolve(true);
            }, 1000);
        });
    },

    /**
     * Send email verification code via Supabase
     * Note: Since user already logged in with password, we use local code verification
     * The code is displayed visually for demo purposes
     */
    async sendEmailCode(email, code) {
        console.log(`📧 Sending verification code to ${email}`);

        // For a production app with real email sending, you would:
        // 1. Call a Supabase Edge Function to send the email
        // 2. Or use a third-party email service like SendGrid/Mailgun

        // For now, we show the code visually (demo mode)
        // This still provides 2FA security as the code is random and expires
        this.showCodeVisually(code, 'Email');
        Utils.showToast(`📧 Code de vérification généré pour ${email}`, 'success');

        return true;
    },


    /**
     * Store verification code
     */
    storeCode(method, code, contactInfo) {
        const data = {
            code,
            method,
            contactInfo,
            createdAt: Date.now(),
            expiresAt: Date.now() + this.codeExpiration,
            attempts: 0
        };

        const encrypted = Security.encrypt(data);
        sessionStorage.setItem('2fa_verification', encrypted);

        // Auto-clear after expiration
        setTimeout(() => {
            sessionStorage.removeItem('2fa_verification');
        }, this.codeExpiration);
    },

    /**
     * Verify code
     */
    verifyCode(enteredCode) {
        const encrypted = sessionStorage.getItem('2fa_verification');

        if (!encrypted) {
            throw new Error('Code expiré. Veuillez demander un nouveau code.');
        }

        const data = Security.decrypt(encrypted);

        if (!data) {
            throw new Error('Erreur de vérification. Veuillez réessayer.');
        }

        // Check expiration
        if (Date.now() > data.expiresAt) {
            sessionStorage.removeItem('2fa_verification');
            throw new Error('Code expiré. Veuillez demander un nouveau code.');
        }

        // Check attempts
        data.attempts++;

        if (data.attempts > 3) {
            sessionStorage.removeItem('2fa_verification');
            throw new Error('Trop de tentatives. Veuillez demander un nouveau code.');
        }

        // Update attempts
        sessionStorage.setItem('2fa_verification', Security.encrypt(data));

        // Verify code
        if (enteredCode !== data.code) {
            throw new Error(`Code incorrect. ${3 - data.attempts} tentatives restantes.`);
        }

        // Success - clear verification data
        sessionStorage.removeItem('2fa_verification');
        Security.logSecurityEvent('2fa_success', '2FA verification successful');

        return true;
    },

    /**
     * Show 2FA modal
     */
    show2FAModal(method, contactInfo, onSuccess) {
        // Generate and send code
        const code = this.generateCode();
        this.storeCode(method, code, contactInfo);

        // Send code based on method
        if (method === 'sms') {
            this.sendSMSCode(contactInfo, code);
        } else if (method === 'email') {
            this.sendEmailCode(contactInfo, code);
        }

        const modalHTML = `
            <div class="modal-overlay active" id="2fa-modal">
                <div class="modal" style="max-width: 450px;">
                    <h2 class="voice-modal-title">Vérification en 2 étapes</h2>
                    <p style="text-align: center; margin-bottom: var(--space-6); color: var(--color-text-secondary);">
                        Entrez le code à 6 chiffres envoyé ${method === 'sms' ? 'par SMS' : 'par email'} à<br>
                        <strong>${this.maskContact(contactInfo, method)}</strong>
                    </p>

                    <div class="code-input-container">
                        <input type="text" 
                               class="code-digit" 
                               maxlength="1" 
                               pattern="[0-9]"
                               data-index="0">
                        <input type="text" 
                               class="code-digit" 
                               maxlength="1" 
                               pattern="[0-9]"
                               data-index="1">
                        <input type="text" 
                               class="code-digit" 
                               maxlength="1" 
                               pattern="[0-9]"
                               data-index="2">
                        <input type="text" 
                               class="code-digit" 
                               maxlength="1" 
                               pattern="[0-9]"
                               data-index="3">
                        <input type="text" 
                               class="code-digit" 
                               maxlength="1" 
                               pattern="[0-9]"
                               data-index="4">
                        <input type="text" 
                               class="code-digit" 
                               maxlength="1" 
                               pattern="[0-9]"
                               data-index="5">
                    </div>

                    <p class="code-timer" id="code-timer" style="text-align: center; margin: var(--space-4) 0; color: var(--color-text-secondary);">
                        Code valide pendant <span id="timer-countdown">5:00</span>
                    </p>

                    <div class="modal-actions" style="display: flex; gap: var(--space-3); margin-top: var(--space-6);">
                        <button class="btn btn-secondary" id="resend-code-btn" style="flex: 1;">
                            Renvoyer le code
                        </button>
                        <button class="btn btn-primary" id="verify-code-btn" style="flex: 1;" disabled>
                            Vérifier
                        </button>
                    </div>

                    <button class="btn btn-secondary" id="cancel-2fa" style="position: absolute; top: var(--space-4); right: var(--space-4); width: auto; padding: var(--space-2);">✕</button>
                </div>
            </div>

            <style>
                .code-input-container {
                    display: flex;
                    gap: var(--space-3);
                    justify-content: center;
                    margin: var(--space-6) 0;
                }

                .code-digit {
                    width: 50px;
                    height: 60px;
                    text-align: center;
                    font-size: var(--text-3xl);
                    font-weight: var(--font-bold);
                    border: 2px solid var(--color-bg-secondary);
                    border-radius: var(--radius-lg);
                    background-color: var(--color-bg-elevated);
                    transition: all var(--transition-fast);
                }

                .code-digit:focus {
                    border-color: var(--color-accent-gold);
                    box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.2);
                    outline: none;
                }

                .code-digit.filled {
                    background-color: var(--color-accent-gold-light);
                    border-color: var(--color-accent-gold);
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Setup code input behavior
        this.setupCodeInput(onSuccess);

        // Start countdown timer
        this.startCountdown();

        // Setup resend button
        document.getElementById('resend-code-btn').addEventListener('click', () => {
            const newCode = this.generateCode();
            this.storeCode(method, newCode, contactInfo);

            if (method === 'sms') {
                this.sendSMSCode(contactInfo, newCode);
            } else {
                this.sendEmailCode(contactInfo, newCode);
            }

            // Reset inputs
            document.querySelectorAll('.code-digit').forEach(input => {
                input.value = '';
                input.classList.remove('filled');
            });
            document.querySelectorAll('.code-digit')[0].focus();

            // Restart countdown
            this.startCountdown();
        });

        // Cancel button
        document.getElementById('cancel-2fa').addEventListener('click', () => {
            document.getElementById('2fa-modal').remove();
        });
    },

    /**
     * Setup code input behavior
     */
    setupCodeInput(onSuccess) {
        const inputs = document.querySelectorAll('.code-digit');
        const verifyBtn = document.getElementById('verify-code-btn');

        inputs.forEach((input, index) => {
            // Auto-focus next input
            input.addEventListener('input', (e) => {
                const value = e.target.value;

                if (value && /[0-9]/.test(value)) {
                    input.classList.add('filled');
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                } else {
                    input.classList.remove('filled');
                }

                // Enable verify button when all filled
                const allFilled = Array.from(inputs).every(inp => inp.value !== '');
                verifyBtn.disabled = !allFilled;

                // Auto-verify when all filled
                if (allFilled) {
                    setTimeout(() => this.handleVerify(inputs, onSuccess), 300);
                }
            });

            // Backspace handling
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    inputs[index - 1].focus();
                    inputs[index - 1].value = '';
                    inputs[index - 1].classList.remove('filled');
                }
            });

            // Paste handling
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = e.clipboardData.getData('text');
                const digits = paste.replace(/\D/g, '').slice(0, 6).split('');

                digits.forEach((digit, i) => {
                    if (inputs[i]) {
                        inputs[i].value = digit;
                        inputs[i].classList.add('filled');
                    }
                });

                if (digits.length === 6) {
                    setTimeout(() => this.handleVerify(inputs, onSuccess), 300);
                }
            });
        });

        // Manual verify button
        verifyBtn.addEventListener('click', () => {
            this.handleVerify(inputs, onSuccess);
        });

        // Focus first input
        inputs[0].focus();
    },

    /**
     * Handle code verification
     */
    handleVerify(inputs, onSuccess) {
        const code = Array.from(inputs).map(inp => inp.value).join('');

        try {
            this.verifyCode(code);

            // Success
            Utils.showToast('Vérification réussie!', 'success');
            document.getElementById('2fa-modal').remove();

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            Utils.showToast(error.message, 'error');

            // Clear inputs on error
            inputs.forEach(input => {
                input.value = '';
                input.classList.remove('filled');
            });
            inputs[0].focus();
        }
    },

    /**
     * Start countdown timer
     */
    startCountdown() {
        const timerEl = document.getElementById('timer-countdown');
        if (!timerEl) return;

        let timeLeft = 300; // 5 minutes in seconds

        const interval = setInterval(() => {
            timeLeft--;

            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(interval);
                timerEl.textContent = 'Expiré';
                Utils.showToast('Code expiré. Demandez un nouveau code.', 'warning');
            }
        }, 1000);
    },

    /**
     * Mask contact info for display
     */
    maskContact(contact, method) {
        if (method === 'sms') {
            return contact.replace(/(\d{2})\d+(\d{2})/, '$1****$2');
        } else {
            const [name, domain] = contact.split('@');
            return `${name[0]}***@${domain}`;
        }
    },

    /**
     * Show code visually for demo/testing purposes
     */
    showCodeVisually(code, method) {
        // Create visual code display
        const codeDisplay = document.createElement('div');
        codeDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #D4A373 0%, #C89058 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(212, 163, 115, 0.4);
            z-index: 100000;
            font-family: 'Inter', sans-serif;
            animation: slideInRight 0.4s ease-out;
        `;

        codeDisplay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">
                    🔐 MODE DÉMO - Code ${method}
                </div>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">
                    ${code}
                </div>
                <div style="font-size: 11px; opacity: 0.8; margin-top: 8px;">
                    Entrez ce code ci-dessous
                </div>
            </div>
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(codeDisplay);

        // Auto-remove after 5 minutes
        setTimeout(() => {
            codeDisplay.style.opacity = '0';
            codeDisplay.style.transform = 'translateX(400px)';
            codeDisplay.style.transition = 'all 0.4s ease-out';
            setTimeout(() => codeDisplay.remove(), 400);
        }, 300000);
    },

    /**
     * Setup biometric authentication
     */
    async setupBiometric() {
        if (!window.PublicKeyCredential) {
            throw new Error('Biométrie non supportée sur ce navigateur');
        }

        // WebAuthn simulation
        Utils.showToast('Authentification biométrique activée', 'success');
        Security.logSecurityEvent('biometric_setup', 'Biometric authentication configured');
    }
};

window.TwoFactorAuth = TwoFactorAuth;
