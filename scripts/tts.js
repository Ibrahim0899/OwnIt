// ====================================
// Text-to-Speech Functionality
// ====================================

class TextToSpeech {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isReading = false;
        this.voices = [];

        this.init();
    }

    init() {
        // Load voices
        this.loadVoices();

        // Voices might load asynchronously
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();

        // Prefer French voices
        this.frenchVoice = this.voices.find(voice =>
            voice.lang.startsWith('fr')
        ) || this.voices[0];
    }

    speak(text, options = {}) {
        if (!this.synthesis) {
            console.error('Speech synthesis not supported');
            Utils.showToast('La synthèse vocale n\'est pas supportée par votre navigateur', 'error');
            return;
        }

        // Stop any ongoing speech
        this.stop();

        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.voice = this.frenchVoice;
        this.currentUtterance.rate = options.rate || 1;
        this.currentUtterance.pitch = options.pitch || 1;
        this.currentUtterance.volume = options.volume || 1;

        this.currentUtterance.onstart = () => {
            this.isReading = true;
            if (options.onStart) options.onStart();
        };

        this.currentUtterance.onend = () => {
            this.isReading = false;
            if (options.onEnd) options.onEnd();
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.isReading = false;
            if (options.onError) options.onError(event);
        };

        this.synthesis.speak(this.currentUtterance);
    }

    stop() {
        if (this.synthesis) {
            this.synthesis.cancel();
            this.isReading = false;
        }
    }

    pause() {
        if (this.synthesis && this.isReading) {
            this.synthesis.pause();
        }
    }

    resume() {
        if (this.synthesis && this.isReading) {
            this.synthesis.resume();
        }
    }
}

// Create global TTS instance
window.TTS = new TextToSpeech();
