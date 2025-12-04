// ====================================
// Custom Audio Player Component
// ====================================

class AudioPlayer {
    constructor(container, audioSrc, options = {}) {
        this.container = container;
        this.audioSrc = audioSrc;
        this.options = {
            title: options.title || 'Audio',
            showWaveform: options.showWaveform !== false,
            ...options
        };

        this.audio = new Audio(audioSrc);
        this.isPlaying = false;
        this.currentSpeed = 1;
        this.speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

        this.init();
    }

    init() {
        this.render();
        this.setupEvents();
        if (this.options.showWaveform) {
            this.setupWaveform();
        }
    }

    render() {
        const playerHTML = `
            <div class="audio-player" data-audio-player>
                <div class="audio-player-controls">
                    <button class="play-btn" aria-label="Lecture">
                        <svg class="play-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                        </svg>
                        <svg class="pause-icon" style="display: none;" width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor"/>
                        </svg>
                    </button>
                    <div class="audio-info">
                        <div class="audio-title">${this.options.title}</div>
                        <div class="audio-time">
                            <span class="current-time">0:00</span> / 
                            <span class="total-time">0:00</span>
                        </div>
                    </div>
                </div>
                
                ${this.options.showWaveform ? '<div class="waveform"><canvas class="waveform-canvas"></canvas></div>' : ''}
                
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                
                <div class="audio-controls-extra">
                    <div class="speed-control">
                        ${this.speeds.map(speed => `
                            <button class="speed-btn ${speed === 1 ? 'active' : ''}" data-speed="${speed}">
                                ${speed}x
                            </button>
                        `).join('')}
                    </div>
                    <button class="download-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill="currentColor"/>
                        </svg>
                        Télécharger
                    </button>
                </div>
            </div>
        `;

        this.container.innerHTML = playerHTML;
        this.cacheElements();
    }

    cacheElements() {
        this.playBtn = this.container.querySelector('.play-btn');
        this.playIcon = this.container.querySelector('.play-icon');
        this.pauseIcon = this.container.querySelector('.pause-icon');
        this.currentTimeEl = this.container.querySelector('.current-time');
        this.totalTimeEl = this.container.querySelector('.total-time');
        this.progressBar = this.container.querySelector('.progress-bar');
        this.progressFill = this.container.querySelector('.progress-fill');
        this.speedBtns = this.container.querySelectorAll('.speed-btn');
        this.downloadBtn = this.container.querySelector('.download-btn');
        this.canvas = this.container.querySelector('.waveform-canvas');
    }

    setupEvents() {
        // Play/Pause
        this.playBtn.addEventListener('click', () => this.togglePlay());

        // Audio events
        this.audio.addEventListener('loadedmetadata', () => {
            this.totalTimeEl.textContent = Utils.formatDuration(this.audio.duration);
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });

        // Progress bar click
        this.progressBar.addEventListener('click', (e) => {
            const rect = this.progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        });

        // Speed controls
        this.speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseFloat(btn.dataset.speed);
                this.setSpeed(speed);
            });
        });

        // Download
        this.downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = this.audioSrc;
            link.download = this.options.title + '.mp3';
            link.click();
            Utils.showToast('Téléchargement démarré', 'success');
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();
    }

    updatePlayButton() {
        if (this.isPlaying) {
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
        } else {
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
        }
    }

    updateProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressFill.style.width = percent + '%';
        this.currentTimeEl.textContent = Utils.formatDuration(this.audio.currentTime);

        if (this.canvas && this.isPlaying) {
            this.animateWaveform();
        }
    }

    setSpeed(speed) {
        this.currentSpeed = speed;
        this.audio.playbackRate = speed;

        this.speedBtns.forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.speed) === speed) {
                btn.classList.add('active');
            }
        });
    }

    setupWaveform() {
        if (!this.canvas) return;

        const ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.offsetWidth * 2; // For retina displays
        this.canvas.height = this.canvas.offsetHeight * 2;
        ctx.scale(2, 2);

        this.waveformCtx = ctx;
        this.drawWaveform();
    }

    drawWaveform() {
        if (!this.waveformCtx) return;

        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;
        const ctx = this.waveformCtx;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Generate simple waveform visualization
        const bars = 60;
        const barWidth = width / bars;
        const barGap = 2;

        ctx.fillStyle = 'rgba(44, 95, 127, 0.6)'; // Indigo color

        for (let i = 0; i < bars; i++) {
            // Random heights for demo (in real app, use actual audio data)
            const barHeight = Math.random() * height * 0.8;
            const x = i * barWidth;
            const y = (height - barHeight) / 2;

            ctx.fillRect(x, y, barWidth - barGap, barHeight);
        }
    }

    animateWaveform() {
        if (!this.canvas || !this.isPlaying) return;

        // Simple animation - in real app, sync with actual audio data
        this.drawWaveform();
    }

    destroy() {
        this.audio.pause();
        this.audio = null;
    }
}

// Make AudioPlayer globally available
window.AudioPlayer = AudioPlayer;
