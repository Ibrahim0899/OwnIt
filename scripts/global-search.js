// ====================================
// Global Search System
// ====================================

const GlobalSearch = {
    searchQuery: '',
    searchResults: {
        posts: [],
        jobs: [],
        people: [],
        messages: []
    },

    /**
     * Initialize global search
     */
    init() {
        this.setupHeaderSearch();
    },

    /**
     * Setup header search functionality
     */
    setupHeaderSearch() {
        const searchInput = document.querySelector('.search-input');
        const voiceSearchBtn = document.querySelector('.search-voice-btn');

        if (searchInput) {
            // Debounced search
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchQuery = e.target.value.trim();
                if (this.searchQuery.length >= 2) {
                    this.performSearch();
                }
            }, 300));

            // Enter key to show results page
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.searchQuery) {
                    this.showSearchResults();
                }
            });
        }

        if (voiceSearchBtn) {
            voiceSearchBtn.addEventListener('click', () => {
                this.startVoiceSearch();
            });
        }
    },

    /**
     * Perform search across all content
     */
    performSearch() {
        const query = this.searchQuery.toLowerCase();

        // Search posts
        this.searchResults.posts = MockData.posts.filter(post => {
            return post.author.name.toLowerCase().includes(query) ||
                post.author.title.toLowerCase().includes(query) ||
                (post.content.text && post.content.text.toLowerCase().includes(query)) ||
                (post.content.transcription && post.content.transcription.toLowerCase().includes(query));
        });

        // Search jobs
        this.searchResults.jobs = MockData.jobs.filter(job => {
            return job.title.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query) ||
                job.location.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                job.requirements.some(req => req.toLowerCase().includes(query));
        });

        // Search people (connections + suggestions)
        const allPeople = [
            ...MockData.connections,
            ...MockData.suggestions,
            ...MockData.connectionRequests.map(r => r.from)
        ];

        this.searchResults.people = allPeople.filter(person => {
            return person.name.toLowerCase().includes(query) ||
                person.title.toLowerCase().includes(query) ||
                (person.location && person.location.toLowerCase().includes(query)) ||
                (person.skills && person.skills.some(s => s.toLowerCase().includes(query)));
        });

        // Remove duplicates from people
        this.searchResults.people = this.searchResults.people.filter((person, index, self) =>
            index === self.findIndex(p => p.id === person.id)
        );

        // Search messages
        this.searchResults.messages = MockData.conversations.filter(conv => {
            return conv.user.name.toLowerCase().includes(query) ||
                conv.messages.some(msg =>
                    msg.text && msg.text.toLowerCase().includes(query)
                );
        });

        // Show live suggestions if input is focused
        if (document.activeElement === document.querySelector('.search-input')) {
            this.showLiveSuggestions();
        }
    },

    /**
     * Show live search suggestions dropdown
     */
    showLiveSuggestions() {
        // Remove existing dropdown
        const existing = document.querySelector('.search-suggestions');
        if (existing) existing.remove();

        const totalResults =
            this.searchResults.posts.length +
            this.searchResults.jobs.length +
            this.searchResults.people.length +
            this.searchResults.messages.length;

        if (totalResults === 0 && this.searchQuery.length >= 2) {
            this.showNoResultsDropdown();
            return;
        }

        if (totalResults === 0) return;

        const container = document.querySelector('.search-container');
        const dropdown = document.createElement('div');
        dropdown.className = 'search-suggestions';

        dropdown.innerHTML = `
            <div class="search-suggestions-header">
                <strong>${totalResults} résultat${totalResults > 1 ? 's' : ''}</strong>
            </div>
            ${this.renderSuggestionSection('Personnes', this.searchResults.people.slice(0, 3), 'people')}
            ${this.renderSuggestionSection('Emplois', this.searchResults.jobs.slice(0, 3), 'jobs')}
            ${this.renderSuggestionSection('Posts', this.searchResults.posts.slice(0, 2), 'posts')}
            <div class="search-suggestions-footer">
                <button class="search-view-all-btn">
                    Voir tous les résultats (${totalResults})
                </button>
            </div>
        `;

        container.appendChild(dropdown);

        // View all button
        dropdown.querySelector('.search-view-all-btn').addEventListener('click', () => {
            this.showSearchResults();
        });

        // Click outside to close
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    dropdown.remove();
                }
            }, { once: true });
        }, 100);
    },

    /**
     * Show no results dropdown
     */
    showNoResultsDropdown() {
        const container = document.querySelector('.search-container');
        const dropdown = document.createElement('div');
        dropdown.className = 'search-suggestions search-no-results';

        dropdown.innerHTML = `
            <div class="search-empty-state">
                <div class="search-empty-icon">🔍</div>
                <p><strong>Aucun résultat pour "${this.searchQuery}"</strong></p>
                <p class="search-empty-hint">Essayez d'autres mots-clés ou vérifiez l'orthographe</p>
            </div>
        `;

        container.appendChild(dropdown);

        // Click outside to close
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    dropdown.remove();
                }
            }, { once: true });
        }, 100);
    },

    /**
     * Render suggestion section
     */
    renderSuggestionSection(title, items, type) {
        if (items.length === 0) return '';

        return `
            <div class="search-suggestion-section">
                <div class="search-suggestion-title">${title}</div>
                ${items.map(item => this.renderSuggestionItem(item, type)).join('')}
            </div>
        `;
    },

    /**
     * Render individual suggestion item
     */
    renderSuggestionItem(item, type) {
        switch (type) {
            case 'people':
                return `
                    <div class="search-suggestion-item" data-type="people" data-id="${item.id}">
                        <img src="${item.photoUrl}" class="suggestion-avatar" alt="${item.name}">
                        <div class="suggestion-info">
                            <div class="suggestion-name">${this.highlightQuery(item.name)}</div>
                            <div class="suggestion-meta">${item.title}</div>
                        </div>
                    </div>
                `;

            case 'jobs':
                return `
                    <div class="search-suggestion-item" data-type="jobs" data-id="${item.id}">
                        <div class="suggestion-icon">💼</div>
                        <div class="suggestion-info">
                            <div class="suggestion-name">${this.highlightQuery(item.title)}</div>
                            <div class="suggestion-meta">${item.company} · ${item.location}</div>
                        </div>
                    </div>
                `;

            case 'posts':
                return `
                    <div class="search-suggestion-item" data-type="posts" data-id="${item.id}">
                        <img src="${item.author.photoUrl}" class="suggestion-avatar" alt="${item.author.name}">
                        <div class="suggestion-info">
                            <div class="suggestion-name">${item.author.name}</div>
                            <div class="suggestion-meta">${this.truncate(item.content.text || item.content.transcription || 'Post vocal', 60)}</div>
                        </div>
                    </div>
                `;

            default:
                return '';
        }
    },

    /**
     * Highlight search query in text
     */
    highlightQuery(text) {
        if (!this.searchQuery) return text;
        const regex = new RegExp(`(${this.searchQuery})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },

    /**
     * Truncate text
     */
    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    },

    /**
     * Show full search results page
     */
    showSearchResults() {
        // Remove suggestions dropdown
        const dropdown = document.querySelector('.search-suggestions');
        if (dropdown) dropdown.remove();

        // Navigate to search results
        const mainContent = document.getElementById('main-content');

        const totalResults =
            this.searchResults.posts.length +
            this.searchResults.jobs.length +
            this.searchResults.people.length +
            this.searchResults.messages.length;

        mainContent.innerHTML = `
            <div class="search-results-page">
                <div class="search-results-header">
                    <h2>Résultats de recherche</h2>
                    <p class="search-query-display">
                        "${this.searchQuery}" · 
                        <strong>${totalResults} résultat${totalResults > 1 ? 's' : ''}</strong>
                    </p>
                </div>

                ${totalResults === 0 ? this.renderNoResults() : this.renderAllResults()}
            </div>
        `;

        this.setupResultsPageEvents();
    },

    /**
     * Render no results state
     */
    renderNoResults() {
        return `
            <div class="search-no-results-page">
                <div class="search-empty-icon-large">🔍</div>
                <h3>Aucun résultat trouvé</h3>
                <p>Nous n'avons trouvé aucun résultat pour "<strong>${this.searchQuery}</strong>"</p>
                
                <div class="search-suggestions-box">
                    <h4>Suggestions:</h4>
                    <ul>
                        <li>Vérifiez l'orthographe des mots</li>
                        <li>Essayez des mots-clés différents</li>
                        <li>Essayez des termes plus généraux</li>
                        <li>Utilisez la recherche vocale 🎤</li>
                    </ul>
                </div>

                <div class="search-quick-actions">
                    <button class="btn btn-primary" onclick="document.querySelector('.search-input').focus()">
                        Nouvelle recherche
                    </button>
                    <button class="btn btn-secondary" onclick="window.navigation.loadPage('feed')">
                        Retour au fil
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Render all results by category
     */
    renderAllResults() {
        return `
            ${this.renderResultsSection('Personnes', this.searchResults.people, 'people')}
            ${this.renderResultsSection('Emplois', this.searchResults.jobs, 'jobs')}
            ${this.renderResultsSection('Publications', this.searchResults.posts, 'posts')}
            ${this.renderResultsSection('Messages', this.searchResults.messages, 'messages')}
        `;
    },

    /**
     * Render results section
     */
    renderResultsSection(title, items, type) {
        if (items.length === 0) return '';

        return `
            <div class="search-results-section">
                <h3 class="search-results-section-title">${title} (${items.length})</h3>
                <div class="search-results-grid">
                    ${items.map(item => this.renderResultCard(item, type)).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Render result card
     */
    renderResultCard(item, type) {
        // Implementation will use existing card components
        switch (type) {
            case 'people':
                return `<div class="connection-card search-result-card" data-type="people" data-id="${item.id}">
                    <div class="connection-header">
                        <img src="${item.photoUrl}" class="connection-avatar" alt="${item.name}">
                        <h3 class="connection-name">${this.highlightQuery(item.name)}</h3>
                        <p class="connection-title">${this.highlightQuery(item.title)}</p>
                    </div>
                    <div class="connection-actions">
                        <button class="btn btn-primary btn-view-person">Voir le profil</button>
                    </div>
                </div>`;

            case 'jobs':
                return `<div class="job-card search-result-card" data-type="jobs" data-id="${item.id}">
                    <div class="job-card-header">
                        <div class="job-icon">${Jobs.getJobIcon(item.category)}</div>
                        <div class="job-header-info">
                            <h3 class="job-title">${this.highlightQuery(item.title)}</h3>
                            <div class="job-company">${this.highlightQuery(item.company)}</div>
                        </div>
                    </div>
                    <div class="job-meta">
                        <div class="job-meta-item">${item.location}</div>
                        <div class="job-meta-item">${item.contractType}</div>
                    </div>
                </div>`;

            default:
                return '';
        }
    },

    /**
     * Setup events for results page
     */
    setupResultsPageEvents() {
        // Navigate to person profile
        document.querySelectorAll('.btn-view-person').forEach(btn => {
            btn.addEventListener('click', () => {
                window.navigation.loadPage('profile');
            });
        });

        // Navigate to job detail
        document.querySelectorAll('.job-card.search-result-card').forEach(card => {
            card.addEventListener('click', () => {
                const jobId = card.dataset.id;
                const job = MockData.jobs.find(j => j.id === jobId);
                if (job && window.Jobs) {
                    window.Jobs.openJobDetail(job);
                }
            });
        });
    },

    /**
     * Start voice search
     */
    startVoiceSearch() {
        if (window.VoiceSearch) {
            VoiceSearch.open((query) => {
                document.querySelector('.search-input').value = query;
                this.searchQuery = query;
                this.performSearch();
                this.showSearchResults();
            });
        }
    }
};

// Initialize on page load
window.GlobalSearch = GlobalSearch;
document.addEventListener('DOMContentLoaded', () => {
    GlobalSearch.init();
});
