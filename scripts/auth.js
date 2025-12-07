// ====================================
// Authentication Logic
// ====================================

class AuthManager {
    constructor() {
        this.currentForm = 'login';
        this.init();
    }

    init() {
        // Setup form switching
        this.setupFormSwitching();

        // Setup password visibility toggles
        this.setupPasswordToggles();

        // Setup password strength meter
        this.setupPasswordStrength();

        // Setup form submissions
        this.setupForms();

        // Setup alternative auth methods
        this.setupAlternativeAuth();
    }

    async logout() {
        this.showLoading();
        try {
            // Supabase auth signout
            const { error } = await window.supabaseClient.auth.signOut();
            if (error) throw error;

            // Clear local session via Security module
            Security.clearSession();

            Utils.showToast('Déconnexion réussie', 'success');

            // Redirect to auth page setup
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 500);
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout anyway
            Security.clearSession();
            window.location.href = 'auth.html';
        } finally {
            this.hideLoading();
        }
    }

    setupFormSwitching() {
        const switchToSignup = document.getElementById('switch-to-signup');
        const switchToLogin = document.getElementById('switch-to-login');

        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('signup');
        });

        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('login');
        });
    }

    switchForm(formType) {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (formType === 'signup') {
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            this.currentForm = 'signup';
        } else {
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
            this.currentForm = 'login';
        }
    }

    setupPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = btn.previousElementSibling;
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
            });
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('signup-password');
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                const password = e.target.value;
                const strength = Security.validatePasswordStrength(password);

                // Update bar
                strengthBar.className = 'strength-fill ' + strength.level;

                // Update text
                let text = 'Force: ';
                switch (strength.level) {
                    case 'weak':
                        text += 'Faible';
                        break;
                    case 'medium':
                        text += 'Moyenne';
                        break;
                    case 'strong':
                        text += 'Forte';
                        break;
                }

                if (strength.feedback.length > 0) {
                    text += ' (Manque: ' + strength.feedback.join(', ') + ')';
                }

                strengthText.textContent = text;
            });
        }
    }

    setupForms() {
        // Login form
        const loginForm = document.getElementById('login-form-element');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Signup form
        const signupForm = document.getElementById('signup-form-element');
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Show loading
        this.showLoading();

        try {
            // Rate limiting
            Security.checkRateLimit('login', 10, 60000);

            // Validate inputs
            if (!email || !password) {
                throw new Error('Veuillez remplir tous les champs');
            }

            // Real Supabase authentication
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw new Error(error.message === 'Invalid login credentials'
                    ? 'Email ou mot de passe incorrect'
                    : error.message);
            }

            // Check login attempts
            const remainingAttempts = Security.trackLoginAttempt(email, true);

            // Get user profile from database
            const userProfile = await Database.getUserByEmail(email);

            // Store user data temporarily for after 2FA
            const userData = {
                id: data.user.id,
                email: data.user.email,
                name: userProfile?.name || data.user.email.split('@')[0],
                photoUrl: userProfile?.photo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.user.email),
                title: userProfile?.title || '',
                verified: userProfile?.verified || false
            };

            this.hideLoading();

            // 🔐 TRIGGER 2FA EMAIL VERIFICATION
            Utils.showToast('Vérification 2FA requise...', 'info');

            TwoFactorAuth.show2FAModal('email', email, () => {
                // 2FA SUCCESS - Now store session and redirect
                Security.storeSession(userData, rememberMe);
                Utils.showToast('Connexion réussie avec 2FA!', 'success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            });

        } catch (error) {
            this.hideLoading();
            Utils.showToast(error.message, 'error');

            // Track failed attempt
            try {
                const remaining = Security.trackLoginAttempt(email, false);
                if (remaining) {
                    Utils.showToast(`${remaining} tentatives restantes`, 'warning');
                }
            } catch (lockoutError) {
                Utils.showToast(lockoutError.message, 'error');
            }
        }
    }

    async handleSignup() {
        const firstname = document.getElementById('signup-firstname').value;
        const lastname = document.getElementById('signup-lastname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const profession = document.getElementById('signup-profession').value;
        const termsAccepted = document.getElementById('terms-accept').checked;

        // Show loading
        this.showLoading();

        try {
            // Validate inputs
            if (!firstname || !lastname || !email || !password || !profession) {
                throw new Error('Veuillez remplir tous les champs');
            }

            if (!termsAccepted) {
                throw new Error('Veuillez accepter les conditions d\'utilisation');
            }

            // Validate password strength
            const strength = Security.validatePasswordStrength(password);
            if (!strength.isValid) {
                throw new Error('Mot de passe trop faible. ' + strength.feedback.join(', '));
            }

            // Use Edge Function for signup with auto-confirm
            const response = await fetch('https://wetunpfxuxdcaicyxhkq.supabase.co/functions/v1/signup-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldHVucGZ4dXhkY2FpY3l4aGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjkyMjUsImV4cCI6MjA4MDUwNTIyNX0.XhiTFD5oA-YWofQhEOTaVleqzvYaRUdc_NAtAocyk_4',
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName: firstname,
                    lastName: lastname,
                    profession
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de l\'inscription');
            }

            // Create user profile in database
            try {
                await Database.createUser({
                    id: result.user.id,
                    email,
                    name: `${firstname} ${lastname}`,
                    title: profession,
                    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstname + ' ' + lastname)}&background=D4A373&color=fff`
                });
            } catch (dbError) {
                console.warn('Profile creation warning:', dbError);
            }

            // Auto-login after signup
            const { data: loginData, error: loginError } = await window.supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            this.hideLoading();

            if (loginError) {
                Utils.showToast('Compte créé! Connectez-vous pour continuer.', 'success');
            } else {
                Utils.showToast('Compte créé avec succès!', 'success');

                // Store session
                const userData = {
                    id: result.user.id,
                    email: email,
                    name: `${firstname} ${lastname}`,
                    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstname + ' ' + lastname)}&background=D4A373&color=fff`,
                    title: profession,
                    verified: true  // Auto-confirmed
                };
                Security.storeSession(userData, false);

                // Redirect to app
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }

        } catch (error) {
            this.hideLoading();
            Utils.showToast(error.message, 'error');
        }
    }

    async simulateLoginAPI(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Demo: Accept any credentials
                if (email && password.length >= 6) {
                    resolve({ email, name: 'Utilisateur Demo' });
                } else {
                    reject(new Error('Email ou mot de passe incorrect'));
                }
            }, 1500);
        });
    }

    async simulateSignupAPI(firstname, lastname, email, password, profession) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    email,
                    name: `${firstname} ${lastname}`,
                    profession
                });
            }, 1500);
        });
    }

    trigger2FA(email, rememberMe, isNewUser = false) {
        this.hideLoading();

        // For demo, use email 2FA (in production, user would choose method)
        const method = 'email';
        const contactInfo = email;

        TwoFactorAuth.show2FAModal(method, contactInfo, () => {
            // 2FA success - create session
            const userData = {
                email,
                name: isNewUser ? document.getElementById('signup-firstname').value : 'Amadou Diallo',
                photoUrl: 'https://i.pravatar.cc/150?img=12',
                title: isNewUser ? document.getElementById('signup-profession').value : 'Maçon Expérimenté',
                verified: true
            };

            Security.storeSession(userData, rememberMe);

            // Show success message
            Utils.showToast(isNewUser ? 'Compte créé avec succès!' : 'Connexion réussie!', 'success');

            // Redirect to app
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    setupAlternativeAuth() {
        // Voice login
        document.getElementById('voice-login-btn').addEventListener('click', () => {
            Utils.showToast('Connexion vocale - Fonctionnalité à venir', 'info');
        });

        document.getElementById('voice-signup-btn').addEventListener('click', () => {
            Utils.showToast('Inscription vocale - Fonctionnalité à venir', 'info');
        });

        // Biometric
        document.getElementById('biometric-btn').addEventListener('click', async () => {
            try {
                await TwoFactorAuth.setupBiometric();
                Utils.showToast('Authentification biométrique configurée', 'success');
            } catch (error) {
                Utils.showToast(error.message, 'error');
            }
        });
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
