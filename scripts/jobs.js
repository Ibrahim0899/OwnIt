// ====================================
// Jobs Module
// ====================================

const Jobs = {
    jobs: [],
    currentFilter: null,

    render(container) {
        this.jobs = MockData.jobs;

        const jobsHTML = `
            <div class="jobs-container">
                <div class="jobs-header">
                    <h2 class="page-title">Offres d'emploi</h2>
                    <p class="page-description">Trouvez votre prochaine opportunité</p>
                </div>
                
                <div class="jobs-search">
                    <input type="search" 
                           class="jobs-search-input" 
                           id="jobs-search-input"
                           placeholder="Quel métier cherchez-vous ?" 
                           aria-label="Rechercher un emploi">
                    <button class="jobs-search-voice-btn" id="jobs-voice-search-btn" aria-label="Recherche vocale">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
                            <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                
                <div class="jobs-filters">
                    <button class="jobs-filter-btn" data-filter="cdi">CDI</button>
                    <button class="jobs-filter-btn" data-filter="cdd">CDD</button>
                    <button class="jobs-filter-btn" data-filter="freelance">Freelance</button>
                    <button class="jobs-filter-btn" data-filter="voice">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
                        </svg>
                        Candidature facile
                    </button>
                </div>
                
                <div class="jobs-grid" id="jobs-grid">
                    ${this.renderJobs()}
                </div>
            </div>
        `;

        container.innerHTML = jobsHTML;
        this.setupEvents();
    },

    renderJobs() {
        return this.jobs.map(job => this.renderJobCard(job)).join('');
    },

    renderJobCard(job) {
        const jobIcon = this.getJobIcon(job.category);

        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-card-header">
                    <div class="job-icon">${jobIcon}</div>
                    <div class="job-header-info">
                        <h3 class="job-title">${job.title}</h3>
                        <div class="job-company">${job.company}</div>
                        <div class="job-badges">
                            ${job.isNew ? '<span class="badge badge-new">NOUVEAU</span>' : ''}
                            ${job.allowsVoiceApplication ? '<span class="badge">Candidature facile</span>' : ''}
                        </div>
                    </div>
                </div>
                
                <div class="job-meta">
                    <div class="job-meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                        </svg>
                        ${job.location}
                    </div>
                    <div class="job-meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
                        </svg>
                        ${job.salary}
                    </div>
                    <div class="job-meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
                            <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
                        </svg>
                        ${job.contractType}
                    </div>
                </div>
                
                <div class="job-description-preview">${job.description}</div>
            </div>
        `;
    },

    getJobIcon(category) {
        const icons = {
            'Construction': '🏗️',
            'Artisanat': '✂️',
            'Transport': '🚗',
            'Services': '🛎️',
            'Commerce': '🏪'
        };
        return icons[category] || '💼';
    },

    setupEvents() {
        // Voice search
        document.getElementById('jobs-voice-search-btn').addEventListener('click', () => {
            VoiceSearch.open((query) => {
                document.getElementById('jobs-search-input').value = query;
                Utils.showToast('Recherche: ' + query, 'info');
            });
        });

        // Job cards
        document.querySelectorAll('.job-card').forEach(card => {
            card.addEventListener('click', () => {
                const jobId = card.dataset.jobId;
                const job = this.jobs.find(j => j.id === jobId);
                if (job) {
                    this.openJobDetail(job);
                }
            });
        });

        // Filters
        document.querySelectorAll('.jobs-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                Utils.showToast('Filtres appliqués', 'info');
            });
        });
    },

    openJobDetail(job) {
        const modalHTML = `
            <div class="modal-overlay active">
                <div class="modal job-detail-modal">
                    <div class="job-detail-header">
                        <div class="job-card-header">
                            <div class="job-icon">${this.getJobIcon(job.category)}</div>
                            <div class="job-header-info">
                                <h2 class="job-title">${job.title}</h2>
                                <div class="job-company">${job.company}</div>
                            </div>
                        </div>
                        <div class="job-meta" style="margin-top: var(--space-4);">
                            <div class="job-meta-item">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                                </svg>
                                ${job.location}
                            </div>
                            <div class="job-meta-item">
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z" fill="currentColor"/>
                                </svg>
                                ${job.salary}
                            </div>
                        </div>
                    </div>
                    
                    <div class="job-detail-content">
                        <div class="job-section">
                            <h3 class="job-section-title">Description du poste</h3>
                            <div class="job-description">${job.description}</div>
                        </div>
                        
                        <div class="job-section">
                            <h3 class="job-section-title">Compétences requises</h3>
                            <div class="job-requirements">
                                ${job.requirements.map(req => `
                                    <span class="requirement-badge">${req}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="job-actions-bottom">
                        ${job.allowsVoiceApplication ? `
                            <button class="btn btn-primary" id="apply-voice-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
                                    <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
                                </svg>
                                Postuler par vocal
                            </button>
                        ` : ''}
                        <button class="btn btn-outline" id="close-job-detail">Fermer</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.querySelector('.modal-overlay:last-child');

        document.getElementById('close-job-detail').addEventListener('click', () => {
            modal.remove();
        });

        const applyBtn = document.getElementById('apply-voice-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                modal.remove();
                this.openVoiceApplication(job);
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    openVoiceApplication(job) {
        const user = MockData.currentUser;

        const modalHTML = `
            <div class="modal-overlay active">
                <div class="modal voice-application-modal">
                    <h2 class="voice-modal-title">Candidature pour ${job.title}</h2>
                    
                    <div class="application-preview">
                        <div class="application-preview-header">
                            <img src="${user.photoUrl}" class="application-preview-photo" alt="${user.name}">
                            <div class="application-preview-info">
                                <h3>${user.name}</h3>
                                <p>${user.title}</p>
                            </div>
                        </div>
                        <p>Votre profil vocal sera envoyé au recruteur</p>
                        <div class="application-griot-player" id="application-audio"></div>
                    </div>
                    
                    <div class="application-message-section">
                        <h3>Message personnalisé (optionnel)</h3>
                        <button class="btn btn-secondary" id="record-custom-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
                            </svg>
                            Enregistrer un message
                        </button>
                    </div>
                    
                    <div class="application-submit">
                        <button class="btn btn-secondary" id="cancel-application">Annuler</button>
                        <button class="btn btn-primary" id="submit-application">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                            </svg>
                            Envoyer ma candidature
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.querySelector('.modal-overlay:last-child');

        // Initialize audio player
        const audioContainer = document.getElementById('application-audio');
        new AudioPlayer(audioContainer, user.griotAudio, {
            title: 'Mon Histoire Griot',
            showWaveform: false
        });

        // Event listeners
        document.getElementById('cancel-application').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('submit-application').addEventListener('click', () => {
            Utils.showToast('Candidature envoyée avec succès!', 'success');
            modal.remove();
        });

        document.getElementById('record-custom-message').addEventListener('click', () => {
            Utils.showToast('Fonctionnalité à venir...', 'info');
        });
    }
};

window.Jobs = Jobs;
