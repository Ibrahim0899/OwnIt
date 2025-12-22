/**
 * OwnIt Analytics Module
 * Tracks site visits using Supabase
 */

const Analytics = {
    config: {
        debugMode: false // ✅ PRODUCTION MODE
    },

    // Track a page visit
    async trackVisit() {
        try {
            // Gather visitor information
            const visitData = {
                page_url: window.location.href,
                page_path: window.location.pathname + window.location.hash,
                referrer: document.referrer || null,
                user_agent: navigator.userAgent,
                screen_width: window.screen.width,
                screen_height: window.screen.height,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                visitor_id: this.getOrCreateVisitorId()
            };

            // Insert visit record
            const { data, error } = await window.supabaseClient
                .from('site_visits')
                .insert([visitData]);

            if (error) {
                if (this.config.debugMode) {
                    console.warn('📊 Analytics: Could not track visit -', error.message);
                }
            } else {
                if (this.config.debugMode) {
                    console.log('📊 Visit tracked successfully');
                }
            }
        } catch (err) {
            if (this.config.debugMode) {
                console.warn('📊 Analytics: Error tracking visit', err);
            }
        }
    },

    // Get or create a unique visitor ID (stored in localStorage)
    getOrCreateVisitorId() {
        let visitorId = localStorage.getItem('ownit_visitor_id');
        if (!visitorId) {
            visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('ownit_visitor_id', visitorId);
        }
        return visitorId;
    },

    // Track page navigation (for SPA)
    trackPageChange(pageName) {
        try {
            const visitData = {
                page_url: window.location.href,
                page_path: '#' + pageName,
                referrer: document.referrer || null,
                user_agent: navigator.userAgent,
                screen_width: window.screen.width,
                screen_height: window.screen.height,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                visitor_id: this.getOrCreateVisitorId(),
                is_page_navigation: true
            };

            window.supabaseClient
                .from('site_visits')
                .insert([visitData])
                .then(({ error }) => {
                    if (error && this.config.debugMode) {
                        console.warn('📊 Analytics: Could not track page change', error.message);
                    }
                });
        } catch (err) {
            if (this.config.debugMode) {
                console.warn('📊 Analytics: Error tracking page change', err);
            }
        }
    },

    // Get visit statistics (for admin dashboard)
    async getStats() {
        try {
            // Total visits
            const { count: totalVisits } = await window.supabaseClient
                .from('site_visits')
                .select('*', { count: 'exact', head: true });

            // Unique visitors
            const { data: uniqueVisitors } = await window.supabaseClient
                .from('site_visits')
                .select('visitor_id')
                .limit(10000);

            const uniqueCount = new Set(uniqueVisitors?.map(v => v.visitor_id) || []).size;

            // Today's visits
            const today = new Date().toISOString().split('T')[0];
            const { count: todayVisits } = await window.supabaseClient
                .from('site_visits')
                .select('*', { count: 'exact', head: true })
                .gte('visited_at', today);

            // This week's visits
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const { count: weekVisits } = await window.supabaseClient
                .from('site_visits')
                .select('*', { count: 'exact', head: true })
                .gte('visited_at', weekAgo.toISOString());

            // Most visited pages
            const { data: pageVisits } = await window.supabaseClient
                .from('site_visits')
                .select('page_path')
                .limit(1000);

            const pageCounts = {};
            pageVisits?.forEach(v => {
                pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
            });

            const topPages = Object.entries(pageCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            return {
                totalVisits,
                uniqueVisitors: uniqueCount,
                todayVisits,
                weekVisits,
                topPages
            };
        } catch (err) {
            console.error('📊 Analytics: Error getting stats', err);
            return null;
        }
    },

    // Display stats in console (for quick check)
    async displayStats() {
        const stats = await this.getStats();
        if (stats) {
            console.log('📊 === OwnIt Analytics ===');
            console.log(`📈 Total Visits: ${stats.totalVisits}`);
            console.log(`👥 Unique Visitors: ${stats.uniqueVisitors}`);
            console.log(`📅 Today: ${stats.todayVisits} visits`);
            console.log(`📆 This Week: ${stats.weekVisits} visits`);
            console.log('🏆 Top Pages:', stats.topPages);
        }
        return stats;
    }
};

// Auto-track visit on page load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure Supabase is initialized
    setTimeout(() => {
        Analytics.trackVisit();
    }, 500);
});

// Export for global access
window.Analytics = Analytics;
