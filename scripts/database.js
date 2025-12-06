// ====================================
// Database Service Layer (Supabase)
// ====================================

const Database = {
    // ========== USERS ==========
    async createUser(userData) {
        // Get current authenticated user ID if not provided
        let userId = userData.id;
        if (!userId) {
            const { data: { user } } = await supabaseClient.auth.getUser();
            userId = user?.id;
        }

        if (!userId) {
            throw new Error('User must be authenticated to create profile');
        }

        const { data, error } = await supabaseClient
            .from('users')
            .insert([{
                id: userId,  // Use Supabase auth user ID for RLS
                email: userData.email,
                name: userData.name,
                title: userData.title || '',
                location: userData.location || '',
                bio: userData.bio || '',
                photo_url: userData.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.name),
                phone: userData.phone || '',
                skills: userData.skills || [],
                verified: false,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getUserByEmail(email) {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async getUserById(userId) {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateUser(userId, updates) {
        const { data, error } = await supabaseClient
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async searchUsers(query) {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .or(`name.ilike.%${query}%,title.ilike.%${query}%,location.ilike.%${query}%`)
            .limit(20);

        if (error) throw error;
        return data || [];
    },

    // ========== POSTS ==========
    async createPost(postData) {
        const { data, error } = await supabaseClient
            .from('posts')
            .insert([{
                user_id: postData.userId,
                content: postData.content,
                type: postData.type || 'text',
                media_url: postData.mediaUrl || null,
                audio_url: postData.audioUrl || null,
                likes: 0,
                comments_count: 0,
                shares: 0,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getPosts(limit = 20, offset = 0) {
        const { data, error } = await supabaseClient
            .from('posts')
            .select(`
                *,
                users (id, name, title, photo_url, verified)
            `)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data || [];
    },

    async likePost(postId, userId) {
        // Check if already liked
        const { data: existing } = await supabaseClient
            .from('post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .single();

        if (existing) {
            // Unlike
            await supabaseClient.from('post_likes').delete().eq('id', existing.id);
            await supabaseClient.rpc('decrement_likes', { post_id: postId });
            return false;
        } else {
            // Like
            await supabaseClient.from('post_likes').insert([{ post_id: postId, user_id: userId }]);
            await supabaseClient.rpc('increment_likes', { post_id: postId });
            return true;
        }
    },

    // ========== JOBS ==========
    async createJob(jobData) {
        const { data, error } = await supabaseClient
            .from('jobs')
            .insert([{
                poster_id: jobData.posterId,
                title: jobData.title,
                company: jobData.company,
                location: jobData.location,
                type: jobData.type,
                salary_min: jobData.salaryMin,
                salary_max: jobData.salaryMax,
                description: jobData.description,
                requirements: jobData.requirements || [],
                audio_description: jobData.audioDescription || null,
                is_active: true,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getJobs(filters = {}) {
        let query = supabaseClient
            .from('jobs')
            .select(`
                *,
                users:poster_id (id, name, photo_url, verified)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (filters.type) query = query.eq('type', filters.type);
        if (filters.location) query = query.ilike('location', `%${filters.location}%`);
        if (filters.search) {
            query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
        }

        const { data, error } = await query.limit(50);
        if (error) throw error;
        return data || [];
    },

    async applyToJob(applicationData) {
        const { data, error } = await supabaseClient
            .from('applications')
            .insert([{
                job_id: applicationData.jobId,
                user_id: applicationData.userId,
                cover_letter: applicationData.coverLetter || '',
                voice_message_url: applicationData.voiceMessageUrl || null,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getMyApplications(userId) {
        const { data, error } = await supabaseClient
            .from('applications')
            .select(`
                *,
                jobs (id, title, company, location)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // ========== CONNECTIONS ==========
    async sendConnectionRequest(fromUserId, toUserId, message = '') {
        const { data, error } = await supabaseClient
            .from('connections')
            .insert([{
                from_user_id: fromUserId,
                to_user_id: toUserId,
                message: message,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async acceptConnection(connectionId) {
        const { data, error } = await supabaseClient
            .from('connections')
            .update({ status: 'accepted', accepted_at: new Date().toISOString() })
            .eq('id', connectionId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async declineConnection(connectionId) {
        const { error } = await supabaseClient
            .from('connections')
            .delete()
            .eq('id', connectionId);

        if (error) throw error;
        return true;
    },

    async getMyConnections(userId) {
        const { data, error } = await supabaseClient
            .from('connections')
            .select(`
                *,
                from_user:from_user_id (id, name, title, photo_url, location, verified),
                to_user:to_user_id (id, name, title, photo_url, location, verified)
            `)
            .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
            .eq('status', 'accepted');

        if (error) throw error;
        return data || [];
    },

    async getConnectionRequests(userId) {
        const { data, error } = await supabaseClient
            .from('connections')
            .select(`
                *,
                from_user:from_user_id (id, name, title, photo_url, location, verified)
            `)
            .eq('to_user_id', userId)
            .eq('status', 'pending');

        if (error) throw error;
        return data || [];
    },

    // ========== MESSAGES ==========
    async sendMessage(conversationId, senderId, content, type = 'text') {
        const { data, error } = await supabaseClient
            .from('messages')
            .insert([{
                conversation_id: conversationId,
                sender_id: senderId,
                content: content,
                type: type,
                read: false,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // Update conversation last_message
        await supabaseClient
            .from('conversations')
            .update({
                last_message: content,
                last_message_at: new Date().toISOString()
            })
            .eq('id', conversationId);

        return data;
    },

    async getConversations(userId) {
        const { data, error } = await supabaseClient
            .from('conversations')
            .select(`
                *,
                user1:user1_id (id, name, photo_url),
                user2:user2_id (id, name, photo_url)
            `)
            .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
            .order('last_message_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getMessages(conversationId, limit = 50) {
        const { data, error } = await supabaseClient
            .from('messages')
            .select(`
                *,
                sender:sender_id (id, name, photo_url)
            `)
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    async getOrCreateConversation(user1Id, user2Id) {
        // Check if conversation exists
        const { data: existing } = await supabaseClient
            .from('conversations')
            .select('*')
            .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
            .single();

        if (existing) return existing;

        // Create new conversation
        const { data, error } = await supabaseClient
            .from('conversations')
            .insert([{
                user1_id: user1Id,
                user2_id: user2Id,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // ========== REAL-TIME SUBSCRIPTIONS ==========
    subscribeToMessages(conversationId, callback) {
        return supabaseClient
            .channel(`messages:${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, callback)
            .subscribe();
    },

    subscribeToNotifications(userId, callback) {
        return supabaseClient
            .channel(`notifications:${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'connections',
                filter: `to_user_id=eq.${userId}`
            }, callback)
            .subscribe();
    },

    // ========== AUTH HELPERS ==========
    async signUp(email, password, userData) {
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
            email,
            password
        });

        if (authError) throw authError;

        // Create user profile
        if (authData.user) {
            await this.createUser({
                ...userData,
                email,
                id: authData.user.id
            });
        }

        return authData;
    },

    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return null;

        return await this.getUserById(user.id);
    }
};

// Make globally available
window.Database = Database;
console.log('✅ Database service layer initialized');
