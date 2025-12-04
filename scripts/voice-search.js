// ====================================
// Voice Search Module
// ====================================

const VoiceSearch = {
    recognition: null,
    isListening: false,
    callback: null,

    init() {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported');
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'fr-FR';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.setupEvents();
        return true;
    },

    setupEvents() {
        if (!this.recognition) return;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('Écoutez...');
        };

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            this.updateUI(transcript);

            // Final result
            if (event.results[0].isFinal) {
                if (this.callback) {
                    this.callback(transcript.trim());
                }
                setTimeout(() => this.close(), 500);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.updateUI('Erreur: ' + event.error);
            setTimeout(() => this.close(), 2000);
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };
    },

    open(callback) {
        this.callback = callback;

        // Initialize if not already done
        if (!this.recognition) {
            const initialized = this.init();
            if (!initialized) {
                Utils.showToast('La reconnaissance vocale n\'est pas supportée', 'error');
                return;
            }
        }

        this.createModal();

        // Start listening after a short delay
        setTimeout(() => {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                Utils.showToast('Impossible de démarrer la reconnaissance vocale', 'error');
                this.close();
            }
        }, 300);
    },

    createModal() {
        const modalHTML = `
            <div class="modal-overlay active" id="voice-search-modal">
                <div class="modal voice-search-modal">
                    <h2 class="voice-modal-title">Recherche vocale</h2>
                    
                    <div class="voice-search-animation">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
                            <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
                        </svg>
                    </div>
                    
                    <div class="voice-search-text" id="voice-search-text">
                        Parlez maintenant...
                    </div>
                    
                    <button class="btn btn-secondary" id="cancel-voice-search">Annuler</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('voice-search-modal');

        document.getElementById('cancel-voice-search').addEventListener('click', () => {
            this.close();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    },

    updateUI(text) {
        const textEl = document.getElementById('voice-search-text');
        if (textEl) {
            textEl.textContent = text;
        }
    },

    close() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }

        const modal = document.getElementById('voice-search-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
};

window.VoiceSearch = VoiceSearch;
