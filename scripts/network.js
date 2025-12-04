// ====================================
// Network/Réseau Module
// ====================================

const Network = {
    currentTab: 'connections',
    connections: [],
    requests: [],
    suggestions: [],

    render(container) {
        this.connections = MockData.connections;
        this.requests = MockData.connectionRequests;
        this.suggestions = MockData.suggestions;

        const networkHTML = `
            <div class="network-container">
                <div class="network-header">
                    <h2 class="page-title">Mon Réseau</h2>
                    <p class="page-description">Gérez vos connections professionnelles</p>
                    
                    <div class="network-tabs">
                        <button class="network-tab ${this.currentTab === 'connections' ? 'active' : ''}" data-tab="connections">
                            Mes Connections (${this.connections.length})
                        </button>
                        <button class="network-tab ${this.currentTab === 'requests' ? 'active' : ''}" data-tab="requests">
                            Demandes (${this.requests.length})
                        </button>
                        <button class="network-tab ${this.currentTab === 'suggestions' ? 'active' : ''}" data-tab="suggestions">
                            Suggestions
                        </button>
                    </div>
                </div>

                <div class="network-content" id="network-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;

        container.innerHTML = networkHTML;
        this.setupEvents();
    },

    renderTabContent() {
        switch (this.currentTab) {
            case 'connections':
                return this.renderConnections();
            case 'requests':
                return this.renderRequests();
            case 'suggestions':
                return this.renderSuggestions();
            default:
                return '';
        }
    },

    renderConnections() {
        if (this.connections.length === 0) {
            return '<div class="network-empty"><div class="network-empty-icon">👥</div><p>Aucune connection pour le moment</p></div>';
        }

        return `
            <div class="network-search">
                <input type="search" placeholder="Rechercher dans mes connections..." id="search-connections">
            </div>
            <div class="connections-grid">
                ${this.connections.map(conn => `
                    <div class="connection-card">
                        <div class="connection-header">
                            <img src="${conn.photoUrl}" class="connection-avatar" alt="${conn.name}">
                            <h3 class="connection-name">${conn.name}</h3>
                            <p class="connection-title">${conn.title}</p>
                            <div class="connection-location">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"/>
                                </svg>
                                ${conn.location}
                            </div>
                        </div>
                        <div class="connection-meta">
                            <div class="connection-stat">
                                <div class="connection-stat-value">${conn.mutualConnections}</div>
                                <div class="connection-stat-label">Relations communes</div>
                            </div>
                        </div>
                        <div class="connection-actions">
                            <button class="btn btn-secondary btn-message" data-user-id="${conn.id}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"/>
                                </svg>
                                Message
                            </button>
                            <button class="btn btn-outline btn-view-profile" data-user-id="${conn.id}">
                                Voir profil
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderRequests() {
        if (this.requests.length === 0) {
            return '<div class="network-empty"><div class="network-empty-icon">📬</div><p>Aucune demande en attente</p></div>';
        }

        return this.requests.map(req => `
            <div class="request-card">
                <img src="${req.from.photoUrl}" class="request-avatar" alt="${req.from.name}">
                <div class="request-info">
                    <h3 class="request-name">${req.from.name}</h3>
                    <p class="request-title">${req.from.title} · ${req.from.location}</p>
                    <div class="request-message">${req.message}</div>
                    ${req.voiceIntro ? `
                        <div class="request-voice" data-voice-url="${req.voiceIntro}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5V19L19 12L8 5Z"/>
                            </svg>
                            <span>Écouter la présentation vocale</span>
                        </div>
                    ` : ''}
                    <div class="request-mutual">${req.mutualConnections} relation${req.mutualConnections > 1 ? 's' : ''} en commun</div>
                </div>
                <div class="request-actions">
                    <button class="btn btn-primary btn-accept" data-request-id="${req.id}">
                        Accepter
                    </button>
                    <button class="btn btn-secondary btn-decline" data-request-id="${req.id}">
                        Refuser
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderSuggestions() {
        return `
            <div class="connections-grid">
                ${this.suggestions.map(sug => `
                    <div class="suggestion-card">
                        <div class="suggestion-header">
                            <img src="${sug.photoUrl}" class="suggestion-avatar" alt="${sug.name}">
                            <div class="suggestion-info">
                                <h3>${sug.name}</h3>
                                <p>${sug.title}</p>
                                <div class="suggestion-reason">${sug.reason}</div>
                            </div>
                        </div>
                        <div class="suggestion-actions">
                            <button class="btn btn-primary btn-connect" data-user-id="${sug.id}">
                                Se connecter
                            </button>
                            <button class="btn btn-outline">
                                Voir profil
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    setupEvents() {
        // Tab switching
        document.querySelectorAll('.network-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.currentTab = tab.dataset.tab;
                this.render(document.getElementById('main-content'));
            });
        });

        // Message button - navigate to messages and open specific conversation
        document.querySelectorAll('.btn-message').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = btn.dataset.userId;
                const user = this.connections.find(c => c.id === userId);

                if (user && window.Messages) {
                    // Find or create conversation with this user
                    let conversation = MockData.conversations.find(c => c.user.id === userId);

                    if (!conversation) {
                        // Create new conversation
                        conversation = {
                            id: 'c_' + userId,
                            user: {
                                id: user.id,
                                name: user.name,
                                title: user.title,
                                photoUrl: user.photoUrl,
                                online: Math.random() > 0.5
                            },
                            lastMessage: {
                                text: 'Dites bonjour!',
                                timestamp: new Date(),
                                isVoice: false,
                                unread: 0
                            },
                            messages: []
                        };
                        MockData.conversations.unshift(conversation);
                    }

                    window.Messages.activeConversation = conversation;
                }

                window.navigation.loadPage('messages');
            });
        });

        // View profile button
        document.querySelectorAll('.btn-view-profile').forEach(btn => {
            btn.addEventListener('click', () => {
                window.navigation.loadPage('profile');
                Utils.showToast('Chargement du profil...', 'info');
            });
        });

        // Accept/Decline requests
        document.querySelectorAll('.btn-accept').forEach(btn => {
            btn.addEventListener('click', () => {
                const requestId = btn.dataset.requestId;
                const request = this.requests.find(r => r.id === requestId);

                if (request) {
                    // Add to connections
                    const newConnection = {
                        id: request.from.id,
                        name: request.from.name,
                        title: request.from.title,
                        location: request.from.location,
                        photoUrl: request.from.photoUrl,
                        mutualConnections: request.mutualConnections,
                        skills: [],
                        connectedSince: new Date().toISOString().split('T')[0]
                    };
                    MockData.connections.push(newConnection);
                }

                this.requests = this.requests.filter(r => r.id !== requestId);
                Utils.showToast('Demande acceptée! Vous êtes maintenant connectés.', 'success');
                this.render(document.getElementById('main-content'));
            });
        });

        document.querySelectorAll('.btn-decline').forEach(btn => {
            btn.addEventListener('click', () => {
                const requestId = btn.dataset.requestId;
                this.requests = this.requests.filter(r => r.id !== requestId);
                Utils.showToast('Demande refusée', 'info');
                this.render(document.getElementById('main-content'));
            });
        });

        // Connect button
        document.querySelectorAll('.btn-connect').forEach(btn => {
            btn.addEventListener('click', () => {
                Utils.showToast('Demande de connexion envoyée!', 'success');
                btn.textContent = 'En attente';
                btn.disabled = true;
            });
        });

        // Voice intro playback
        document.querySelectorAll('.request-voice').forEach(voice => {
            voice.addEventListener('click', () => {
                Utils.showToast('Lecture de la présentation vocale...', 'info');
            });
        });
    }
};

window.Network = Network;
