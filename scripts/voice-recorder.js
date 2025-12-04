// ====================================
// Voice Recorder Module
// ====================================

const VoiceRecorder = {
    mediaRecorder: null,
    audioChunks: [],
    isRecording: false,
    recordingStartTime: null,
    timerInterval: null,
    recordedBlob: null,

    openModal() {
        this.createModal();
    },

    createModal() {
        const modalHTML = `
            <div class="modal-overlay" id="voice-recorder-modal">
                <div class="modal voice-modal">
                    <div class="voice-modal-header">
                        <h2 class="voice-modal-title">Partagez votre histoire</h2>
                        <p class="voice-modal-description">Enregistrez un message vocal pour votre réseau</p>
                    </div>
                    
                    <div class="recording-area" id="recording-area">
                        <button class="record-btn" id="record-btn" aria-label="Démarrer l'enregistrement">
                            <svg class="record-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
                                <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
                            </svg>
                        </button>
                        <div class="recording-timer" id="recording-timer">00:00</div>
                        <div class="recording-status" id="recording-status">Cliquez pour commencer</div>
                    </div>

                    <canvas class="waveform-recorder" id="waveform-recorder" style="display: none;"></canvas>
                    
                    <div class="recording-preview" id="recording-preview" style="display: none;">
                        <h3>Prévisualisation</h3>
                        <div id="preview-player"></div>
                        
                        <div class="checkbox-group">
                            <input type="checkbox" id="auto-subtitle" checked>
                            <label for="auto-subtitle">Générer les sous-titres automatiquement</label>
                        </div>
                        
                        <div class="recording-actions">
                            <button class="btn btn-secondary" id="restart-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 5V1L7 6L12 11V7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13H4C4 17.42 7.58 21 12 21C16.42 21 20 17.42 20 13C20 8.58 16.42 5 12 5Z" fill="currentColor"/>
                                </svg>
                                Recommencer
                            </button>
                            <button class="btn btn-primary" id="publish-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                                </svg>
                                Publier
                            </button>
                        </div>
                    </div>

                    <button class="btn btn-secondary" id="close-modal-btn" style="position: absolute; top: var(--space-4); right: var(--space-4);">✕</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        setTimeout(() => {
            document.getElementById('voice-recorder-modal').classList.add('active');
        }, 10);

        this.setupModalEvents();
    },

    setupModalEvents() {
        const modal = document.getElementById('voice-recorder-modal');
        const recordBtn = document.getElementById('record-btn');
        const closeBtn = document.getElementById('close-modal-btn');
        const restartBtn = document.getElementById('restart-btn');
        const publishBtn = document.getElementById('publish-btn');

        recordBtn.addEventListener('click', () => this.toggleRecording());
        closeBtn.addEventListener('click', () => this.closeModal());

        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }

        if (publishBtn) {
            publishBtn.addEventListener('click', () => this.publish());
        }

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    },

    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    },

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                this.recordedBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.showPreview();
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingStartTime = Date.now();

            // Update UI
            const recordBtn = document.getElementById('record-btn');
            const status = document.getElementById('recording-status');
            const waveform = document.getElementById('waveform-recorder');

            recordBtn.classList.add('recording');
            status.textContent = 'Enregistrement en cours...';
            waveform.style.display = 'block';

            // Start timer
            this.startTimer();

        } catch (error) {
            console.error('Error accessing microphone:', error);
            Utils.showToast('Impossible d\'accéder au microphone', 'error');
        }
    },

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;

            // Update UI
            const recordBtn = document.getElementById('record-btn');
            const status = document.getElementById('recording-status');

            recordBtn.classList.remove('recording');
            status.textContent = 'Enregistrement terminé';

            // Stop timer
            this.stopTimer();
        }
    },

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('recording-timer').textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    },

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    showPreview() {
        const recordingArea = document.getElementById('recording-area');
        const preview = document.getElementById('recording-preview');
        const waveform = document.getElementById('waveform-recorder');

        recordingArea.style.display = 'none';
        waveform.style.display = 'none';
        preview.style.display = 'block';

        // Create audio URL
        const audioUrl = URL.createObjectURL(this.recordedBlob);

        // Show audio player
        const previewPlayer = document.getElementById('preview-player');
        new AudioPlayer(previewPlayer, audioUrl, {
            title: 'Votre enregistrement',
            showWaveform: false
        });
    },

    restart() {
        const recordingArea = document.getElementById('recording-area');
        const preview = document.getElementById('recording-preview');
        const timer = document.getElementById('recording-timer');

        recordingArea.style.display = 'block';
        preview.style.display = 'none';
        timer.textContent = '00:00';

        this.recordedBlob = null;
        this.audioChunks = [];
    },

    publish() {
        Utils.showToast('Publication de votre post vocal...', 'info');

        // Simulate upload
        setTimeout(() => {
            Utils.showToast('Votre post a été publié avec succès!', 'success');
            this.closeModal();

            // Refresh feed if on feed page
            if (window.navigation && window.navigation.currentPage === 'feed') {
                window.navigation.loadPage('feed', false);
            }
        }, 1500);
    },

    closeModal() {
        const modal = document.getElementById('voice-recorder-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }

        this.stopTimer();
        if (this.isRecording) {
            this.stopRecording();
        }
    }
};

window.VoiceRecorder = VoiceRecorder;
