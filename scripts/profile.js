// ====================================
// Profile Page Module
// ====================================

const Profile = {
    audioPlayer: null,
    experiencePlayerssection: [],

    render(container) {
        const user = MockData.currentUser;

        const profileHTML = `
            <div class="profile-container">
                ${this.renderHeader(user)}
                ${this.renderGriotSection(user)}
                ${this.renderSkillsSection(user)}
                ${this.renderExperienceSection(user)}
            </div>
        `;

        container.innerHTML = profileHTML;

        // Initialize audio players after render
        setTimeout(() => this.initializeAudioPlayers(user), 100);
    },

    renderHeader(user) {
        return `
            <div class="profile-header">
                <div class="cover-photo" style="background: linear-gradient(135deg, #2C5F7F 0%, #D4A373 100%);">
                    ${user.coverUrl ? `<img src="${user.coverUrl}" alt="Couverture" class="cover-photo">` : ''}
                </div>
                <div class="cover-gradient"></div>
                <div class="profile-photo-wrapper">
                    <img src="${user.photoUrl}" alt="${user.name}" class="profile-photo">
                </div>
            </div>
            
            <div class="profile-info">
                <h1 class="profile-name">
                    ${user.name}
                    ${user.verified ? '<span class="badge badge-verified">✓ Vérifié</span>' : ''}
                </h1>
                
                <div class="profile-meta">
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM14 6H10V4H14V6Z" fill="currentColor"/>
                        </svg>
                        ${user.title}
                    </div>
                    <div class="profile-meta-item">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                        </svg>
                        ${user.location}
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="btn btn-primary" onclick="Profile.readProfile()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M3 9V15C3 16.1 3.9 17 5 17H7V21H9V17H15V21H17V17H19C20.1 17 21 16.1 21 15V9L12 2L3 9ZM7 15V11H9V15H7ZM11 15V11H13V15H11ZM15 15V11H17V15H15Z" fill="currentColor"/>
                        </svg>
                        Écouter mon profil
                    </button>
                    <button class="btn btn-outline" onclick="Profile.shareProfile()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.91 18 21.91C19.61 21.91 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
                        </svg>
                        Partager
                    </button>
                </div>
            </div>
        `;
    },

    renderGriotSection(user) {
        return `
            <div class="griot-section card">
                <h2 class="section-title">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
                        <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
                    </svg>
                    Mon Histoire Griot
                </h2>
                <p class="section-description">
                    Écoutez mon parcours professionnel raconté avec mes propres mots
                </p>
                <div id="griot-audio-player"></div>
            </div>
        `;
    },

    renderSkillsSection(user) {
        const skillsHTML = user.skills.map(skill => `
            <div class="skill-badge">
                <div class="skill-icon">${skill.icon}</div>
                <div class="skill-name">${skill.name}</div>
                <div class="skill-level">
                    ${Array.from({ length: 5 }, (_, i) => `
                        <span class="star ${i < skill.level ? '' : 'empty'}">★</span>
                    `).join('')}
                </div>
            </div>
        `).join('');

        return `
            <div class="card">
                <h2 class="section-title">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M9 11H7V13H9V11ZM13 11H11V13H13V11ZM17 11H15V13H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="currentColor"/>
                    </svg>
                    Mes Compétences
                </h2>
                <div class="skills-grid">
                    ${skillsHTML}
                </div>
            </div>
        `;
    },

    renderExperienceSection(user) {
        const experiencesHTML = user.experience.map((exp, index) => {
            const startDate = new Date(exp.startDate);
            const endDate = exp.current ? 'Présent' : new Date(exp.endDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
            const startDateStr = startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

            return `
                <div class="timeline-item">
                    <div class="experience-header">
                        <div>
                            <h3 class="experience-title">${exp.title}</h3>
                            <div class="experience-company">${exp.company}</div>
                            <div class="experience-period">${startDateStr} - ${endDate} · ${exp.location}</div>
                        </div>
                        ${exp.current ? '<span class="badge">En cours</span>' : ''}
                    </div>
                    <p>${exp.description}</p>
                    ${exp.audioClip ? `
                        <div class="experience-audio" id="experience-audio-${index}"></div>
                    ` : ''}
                </div>
            `;
        }).join('');

        return `
            <div class="card">
                <h2 class="section-title">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM14 6H10V4H14V6Z" fill="currentColor"/>
                    </svg>
                    Expérience Professionnelle
                </h2>
                <div class="timeline">
                    ${experiencesHTML}
                </div>
            </div>
        `;
    },

    initializeAudioPlayers(user) {
        // Main Griot audio player
        const griotContainer = document.getElementById('griot-audio-player');
        if (griotContainer && user.griotAudio) {
            this.audioPlayer = new AudioPlayer(griotContainer, user.griotAudio, {
                title: 'Mon Histoire Professionnelle',
                showWaveform: true
            });
        }

        // Experience audio players
        user.experience.forEach((exp, index) => {
            if (exp.audioClip) {
                const expContainer = document.getElementById(`experience-audio-${index}`);
                if (expContainer) {
                    const player = new AudioPlayer(expContainer, exp.audioClip, {
                        title: `Témoignage - ${exp.title}`,
                        showWaveform: false
                    });
                    this.experiencePlayers.push(player);
                }
            }
        });
    },

    readProfile() {
        const user = MockData.currentUser;
        const textToRead = `
            ${user.name}, ${user.title}, basé à ${user.location}.
            ${user.bio}
        `;

        Utils.showToast('Lecture du profil en cours...', 'info');
        TTS.speak(textToRead, {
            onEnd: () => {
                Utils.showToast('Lecture terminée', 'success');
            }
        });
    },

    shareProfile() {
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: `Profil OwnIt - ${MockData.currentUser.name}`,
                text: `Découvrez mon profil professionnel sur OwnIt`,
                url: url
            }).then(() => {
                Utils.showToast('Profil partagé avec succès', 'success');
            }).catch(err => {
                console.error('Share failed:', err);
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url).then(() => {
                Utils.showToast('Lien copié dans le presse-papier', 'success');
            });
        }
    }
};

// Make Profile globally available
window.Profile = Profile;
