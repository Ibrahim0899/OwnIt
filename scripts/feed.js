// ====================================
// Feed Module
// ====================================

const Feed = {
    posts: [],
    currentFilter: 'all',

    render(container) {
        this.posts = MockData.posts;

        const feedHTML = `
            <div class="feed-container">
                <div class="feed-header">
                    <h2 class="page-title">Fil d'actualité</h2>
                    <div class="feed-filters">
                        <button class="filter-btn active" data-filter="all">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                                <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor" opacity="0.5"/>
                            </svg>
                            Tout voir
                        </button>
                        <button class="filter-btn" data-filter="audio">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
                                <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
                            </svg>
                            Audio
                        </button>
                        <button class="filter-btn" data-filter="video">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor"/>
                            </svg>
                            Vidéo
                        </button>
                        <button class="filter-btn" data-filter="text">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/>
                            </svg>
                            Texte
                        </button>
                    </div>
                </div>
                
                <div class="feed-posts" id="feed-posts">
                    ${this.renderPosts()}
                </div>
            </div>
        `;

        container.innerHTML = feedHTML;
        this.setupEvents();
    },

    renderPosts() {
        const filteredPosts = this.currentFilter === 'all'
            ? this.posts
            : this.posts.filter(post => post.type === this.currentFilter);

        if (filteredPosts.length === 0) {
            return '<div class="card"><p>Aucun post à afficher</p></div>';
        }

        return filteredPosts.map(post => this.renderPost(post)).join('');
    },

    renderPost(post) {
        return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <img src="${post.author.photoUrl}" alt="${post.author.name}" class="post-author-photo">
                    <div class="post-author-info">
                        <div class="post-author-name">${post.author.name}</div>
                        <div class="post-author-title">${post.author.title}</div>
                        <div class="post-timestamp">${Utils.formatRelativeTime(post.createdAt)}</div>
                    </div>
                </div>
                
                <div class="post-content">
                    ${this.renderPostContent(post)}
                </div>
                
                <div class="post-actions">
                    <button class="post-action-btn" data-action="like" data-post-id="${post.id}">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="currentColor"/>
                        </svg>
                        <span class="like-count">${post.likes}</span>
                    </button>
                    <button class="post-action-btn" data-action="comment">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M21 6H19V15H6V17C6 17.55 6.45 18 7 18H18L22 22V7C22 6.45 21.55 6 21 6ZM17 12V3C17 2.45 16.55 2 16 2H3C2.45 2 2 2.45 2 3V17L6 13H16C16.55 13 17 12.55 17 12Z" fill="currentColor"/>
                        </svg>
                        <span>${post.comments}</span>
                    </button>
                    <button class="post-action-btn" data-action="share">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.91 18 21.91C19.61 21.91 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
                        </svg>
                        <span>${post.shares}</span>
                    </button>
                </div>
            </div>
        `;
    },

    renderPostContent(post) {
        switch (post.type) {
            case 'audio':
                return `
                    <div class="post-text">${post.content.transcription}</div>
                    <div class="post-audio-container" id="post-audio-${post.id}"></div>
                `;

            case 'video':
                return `
                    <div class="post-text">${post.content.description}</div>
                    <div class="post-video-container">
                        <img src="${post.content.thumbnailUrl}" class="post-video" alt="Video thumbnail">
                    </div>
                `;

            case 'text':
            default:
                return `
                    <div class="post-text" id="post-text-${post.id}">${post.content.text}</div>
                    <button class="post-read-btn" data-post-id="${post.id}">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M3 9V15C3 16.1 3.9 17 5 17H7V21H9V17H15V21H17V17H19C20.1 17 21 16.1 21 15V9L12 2L3 9Z" fill="currentColor"/>
                        </svg>
                        Écouter ce post
                    </button>
                `;
        }
    },

    setupEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                document.getElementById('feed-posts').innerHTML = this.renderPosts();
                this.setupPostEvents();
            });
        });

        this.setupPostEvents();
    },

    setupPostEvents() {
        // Like buttons
        document.querySelectorAll('[data-action="like"]').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('liked');
                const countEl = btn.querySelector('.like-count');
                const currentCount = parseInt(countEl.textContent);
                countEl.textContent = btn.classList.contains('liked') ? currentCount + 1 : currentCount - 1;
            });
        });

        // Read text posts
        document.querySelectorAll('.post-read-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const postId = btn.dataset.postId;
                const textEl = document.getElementById(`post-text-${postId}`);
                const text = textEl.textContent;

                textEl.classList.add('reading');
                TTS.speak(text, {
                    onEnd: () => {
                        textEl.classList.remove('reading');
                    }
                });
            });
        });

        // Initialize audio players for audio posts
        this.posts.filter(p => p.type === 'audio').forEach(post => {
            const container = document.getElementById(`post-audio-${post.id}`);
            if (container && post.content.audioUrl) {
                new AudioPlayer(container, post.content.audioUrl, {
                    title: `Post de ${post.author.name}`,
                    showWaveform: false
                });
            }
        });
    }
};

window.Feed = Feed;
