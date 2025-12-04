// ====================================
// Navigation & Routing Logic
// ====================================

class Navigation {
    constructor() {
        this.currentPage = 'feed';
        this.init();
    }

    init() {
        // Handle navigation clicks
        this.setupNavigation();

        // Handle FAB click
        this.setupFAB();

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });

        // Load initial page
        const hash = window.location.hash.slice(1) || 'feed';
        this.loadPage(hash, true);
    }

    setupNavigation() {
        // Desktop and mobile navigation
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                if (page) {
                    this.loadPage(page, true);
                }
            });
        });
    }

    setupFAB() {
        const fab = document.querySelector('.fab');
        if (fab) {
            fab.addEventListener('click', () => {
                this.openPostCreationModal();
            });
        }
    }

    loadPage(pageName, pushState = true) {
        this.currentPage = pageName;

        // Update URL
        if (pushState) {
            history.pushState({ page: pageName }, '', `#${pageName}`);
        }

        // Update active navigation
        this.updateActiveNav(pageName);

        // Load page content
        this.renderPage(pageName);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateActiveNav(pageName) {
        // Desktop navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Mobile navigation
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Set active state
        const desktopLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
        const mobileLink = document.querySelector(`.mobile-nav-link[data-page="${pageName}"]`);

        if (desktopLink) {
            desktopLink.closest('.nav-item').classList.add('active');
        }

        if (mobileLink) {
            mobileLink.closest('.mobile-nav-item').classList.add('active');
        }
    }

    renderPage(pageName) {
        const mainContent = document.getElementById('main-content');

        switch (pageName) {
            case 'feed':
                if (window.Feed) {
                    window.Feed.render(mainContent);
                } else {
                    mainContent.innerHTML = '<h2>Fil d\'actualité</h2><p>Chargement...</p>';
                }
                break;

            case 'network':
                if (window.Network) {
                    window.Network.render(mainContent);
                } else {
                    mainContent.innerHTML = '<h2>Mon Réseau</h2><p>Chargement...</p>';
                }
                break;

            case 'jobs':
                if (window.Jobs) {
                    window.Jobs.render(mainContent);
                } else {
                    mainContent.innerHTML = '<h2>Offres d\'emploi</h2><p>Chargement...</p>';
                }
                break;

            case 'messages':
                if (window.Messages) {
                    window.Messages.render(mainContent);
                } else {
                    mainContent.innerHTML = '<h2>Messages</h2><p>Chargement...</p>';
                }
                break;

            case 'profile':
                if (window.Profile) {
                    window.Profile.render(mainContent);
                } else {
                    mainContent.innerHTML = '<h2>Mon Profil</h2><p>Chargement...</p>';
                }
                break;

            default:
                mainContent.innerHTML = `
                    <div class="page-container">
                        <h2 class="page-title">Page non trouvée</h2>
                        <p>La page "${pageName}" n'existe pas.</p>
                    </div>
                `;
        }
    }

    openPostCreationModal() {
        if (window.VoiceRecorder) {
            window.VoiceRecorder.openModal();
        } else {
            alert('Fonctionnalité d\'enregistrement vocal en cours de développement...');
        }
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
});
