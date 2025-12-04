// ====================================
// Messages Module
// ====================================

const Messages = {
    conversations: [],
    activeConversation: null,
    currentUserId: '1',

    render(container) {
        this.conversations = MockData.conversations;

        const messagesHTML = `
            <div class="messages-container">
                <div class="conversations-sidebar">
                    <div class="conversations-header">
                        <h2>Messages</h2>
                        <div class="conversations-search">
                            <input type="search" placeholder="Rechercher..." id="search-conversations">
                        </div>
                    </div>
                    <div class="conversations-list" id="conversations-list">
                        ${this.renderConversationsList()}
                    </div>
                </div>
                
                <div class="chat-area ${!this.activeConversation ? 'chat-empty' : ''}" id="chat-area">
                    ${this.activeConversation ? this.renderChatArea() : this.renderEmptyState()}
                </div>
            </div>
        `;

        container.innerHTML = messagesHTML;
        this.setupEvents();
    },

    renderConversationsList() {
        return this.conversations.map(conv => `
            <div class="conversation-item ${this.activeConversation?.id === conv.id ? 'active' : ''}" 
                 data-conversation-id="${conv.id}">
                <img src="${conv.user.photoUrl}" class="conversation-avatar" alt="${conv.user.name}">
                <div class="conversation-info">
                    <div class="conversation-name">
                        <span>${conv.user.name}</span>
                        <span class="conversation-time">${Utils.formatRelativeTime(conv.lastMessage.timestamp)}</span>
                    </div>
                    <div class="conversation-preview ${conv.lastMessage.isVoice ? 'voice' : ''}">
                        ${conv.lastMessage.isVoice ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z"/></svg>' : ''}
                        ${conv.lastMessage.text}
                    </div>
                </div>
                ${conv.lastMessage.unread > 0 ? `<span class="unread-badge">${conv.lastMessage.unread}</span>` : ''}
            </div>
        `).join('');
    },

    renderChatArea() {
        const conv = this.activeConversation;
        return `
            <div class="chat-header">
                <img src="${conv.user.photoUrl}" class="chat-user-avatar" alt="${conv.user.name}">
                <div class="chat-user-info">
                    <div class="chat-user-name">${conv.user.name}</div>
                    <div class="chat-user-status ${conv.user.online ? 'online' : ''}">
                        ${conv.user.online ? '● En ligne' : 'Hors ligne'}
                    </div>
                </div>
            </div>
            
            <div class="messages-area" id="messages-area">
                ${this.renderMessages()}
            </div>
            
            <div class="message-input-container">
                <div class="message-input-wrapper">
                    <textarea class="message-input" 
                              id="message-input" 
                              placeholder="Écrivez votre message..."
                              rows="1"></textarea>
                    <button class="message-voice-btn" id="voice-message-btn" aria-label="Message vocal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z"/>
                            <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z"/>
                        </svg>
                    </button>
                    <button class="message-send-btn" id="send-message-btn" disabled>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    },

    renderMessages() {
        const messages = this.activeConversation.messages;
        return messages.map(msg => {
            const isSent = msg.senderId === this.currentUserId;
            const user = isSent ? MockData.currentUser : this.activeConversation.user;

            return `
                <div class="message-group ${isSent ? 'sent' : 'received'}">
                    <img src="${user.photoUrl}" class="message-avatar" alt="${user.name}">
                    <div class="message-content">
                        <div class="message-bubble">
                            ${msg.isVoice ? this.renderVoiceMessage(msg) : `<div class="message-text">${msg.text}</div>`}
                        </div>
                        <div class="message-time">${Utils.formatRelativeTime(msg.timestamp)}</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderVoiceMessage(msg) {
        return `
            <div class="message-voice">
                <button class="voice-play-btn" data-voice-url="${msg.voiceUrl}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5V19L19 12L8 5Z"/>
                    </svg>
                </button>
                <div class="voice-waveform">
                    ${Array(12).fill(0).map((_, i) => `<div class="voice-bar" style="height: ${Math.random() * 30 + 10}px"></div>`).join('')}
                </div>
                <span class="voice-duration">${msg.duration}</span>
            </div>
        `;
    },

    renderEmptyState() {
        return `
            <div class="chat-empty">
                <div class="chat-empty-icon">💬</div>
                <h3>Sélectionnez une conversation</h3>
                <p>Choisissez une conversation dans la liste pour commencer à échanger</p>
            </div>
        `;
    },

    setupEvents() {
        // Conversation selection
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => {
                const convId = item.dataset.conversationId;
                this.activeConversation = this.conversations.find(c => c.id === convId);
                this.render(document.getElementById('main-content'));
            });
        });

        if (!this.activeConversation) return;

        // Message input
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-message-btn');

        if (messageInput) {
            messageInput.addEventListener('input', () => {
                sendBtn.disabled = !messageInput.value.trim();
            });

            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Voice message button
        const voiceBtn = document.getElementById('voice-message-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                VoiceRecorder.openModal();
            });
        }

        // Voice playback
        document.querySelectorAll('.voice-play-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Utils.showToast('Lecture du message vocal...', 'info');
            });
        });

        // Auto-scroll to bottom
        const messagesArea = document.getElementById('messages-area');
        if (messagesArea) {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    },

    sendMessage() {
        const input = document.getElementById('message-input');
        const text = input.value.trim();

        if (!text) return;

        // Add message to conversation
        const newMessage = {
            id: 'm' + Date.now(),
            senderId: this.currentUserId,
            text,
            timestamp: new Date(),
            isVoice: false
        };

        this.activeConversation.messages.push(newMessage);
        this.activeConversation.lastMessage = {
            text,
            timestamp: new Date(),
            isVoice: false,
            unread: 0
        };

        input.value = '';
        this.render(document.getElementById('main-content'));

        Utils.showToast('Message envoyé', 'success');
    }
};

window.Messages = Messages;
