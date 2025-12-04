// ====================================
// Mock Data for Demonstration
// ====================================

const MockData = {
    // Current user profile
    currentUser: {
        id: '1',
        name: 'Amadou Diallo',
        title: 'Maçon Expérimenté',
        location: 'Dakar, Sénégal',
        photoUrl: 'https://i.pravatar.cc/150?img=12',
        coverUrl: null,
        verified: true,
        griotAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Demo audio
        bio: `Bonjour, je m'appelle Amadou Diallo. Je suis maçon depuis plus de 15 ans. 
              J'ai travaillé sur de nombreux projets de construction à Dakar et dans toute la région. 
              Ma passion est de créer des structures solides et durables qui servent les communautés. 
              Je suis spécialisé dans la construction traditionnelle et moderne, et j'aime partager 
              mes connaissances avec les jeunes qui veulent apprendre ce métier noble.`,
        skills: [
            { name: 'Maçonnerie', icon: '🧱', level: 5 },
            { name: 'Construction', icon: '🏗️', level: 5 },
            { name: 'Plomberie', icon: '🔧', level: 4 },
            { name: 'Électricité', icon: '⚡', level: 3 },
            { name: 'Menuiserie', icon: '🪚', level: 4 },
            { name: 'Gestion projet', icon: '📋', level: 4 }
        ],
        experience: [
            {
                title: 'Chef Maçon',
                company: 'BTP Sénégal',
                location: 'Dakar',
                startDate: '2018-01',
                endDate: null,
                current: true,
                description: 'Direction d\'équipes de construction pour des projets résidentiels et commerciaux',
                audioClip: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
            },
            {
                title: 'Maçon Senior',
                company: 'Constructions Modernes',
                location: 'Dakar',
                startDate: '2012-03',
                endDate: '2018-01',
                current: false,
                description: 'Réalisation de travaux de maçonnerie pour divers projets',
                audioClip: null
            },
            {
                title: 'Apprenti Maçon',
                company: 'Entreprise Familiale',
                location: 'Thiès',
                startDate: '2008-06',
                endDate: '2012-03',
                current: false,
                description: 'Formation et apprentissage des techniques de maçonnerie',
                audioClip: null
            }
        ]
    },

    // Sample posts for feed
    posts: [
        {
            id: 'p1',
            author: {
                id: '2',
                name: 'Fatou Sall',
                title: 'Couturière',
                photoUrl: 'https://i.pravatar.cc/150?img=5'
            },
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            type: 'audio',
            content: {
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                transcription: 'Bonjour à tous ! Je viens de terminer une magnifique robe traditionnelle pour un mariage. Le travail m\'a pris trois semaines mais le résultat est exceptionnel ! Si vous cherchez une couturière expérimentée, n\'hésitez pas à me contacter.'
            },
            likes: 24,
            comments: 5,
            shares: 2
        },
        {
            id: 'p2',
            author: {
                id: '3',
                name: 'Mamadou Sy',
                title: 'Chauffeur VTC',
                photoUrl: 'https://i.pravatar.cc/150?img=8'
            },
            createdAt: new Date(Date.now() - 7200000), // 2 hours ago
            type: 'text',
            content: {
                text: 'Excellent week-end avec mes clients ! J\'ai eu le plaisir de conduire des touristes à travers Dakar et de leur faire découvrir notre belle ville. Le métier de chauffeur, c\'est aussi être ambassadeur de notre pays ! 🇸🇳'
            },
            likes: 42,
            comments: 8,
            shares: 3
        },
        {
            id: 'p3',
            author: {
                id: '4',
                name: 'Aissatou Ndiaye',
                title: 'Vendeuse au marché',
                photoUrl: 'https://i.pravatar.cc/150?img=9'
            },
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
            type: 'video',
            content: {
                videoUrl: null, // Would be actual video URL
                thumbnailUrl: 'https://via.placeholder.com/600x400/D4A373/FFFFFF?text=Video',
                description: 'Démonstration de mes produits frais au marché Kermel'
            },
            likes: 67,
            comments: 12,
            shares: 5
        }
    ],

    // Sample job listings
    jobs: [
        {
            id: 'j1',
            title: 'Maçon Qualifié',
            company: 'BTP Excellence',
            companyLogo: 'https://via.placeholder.com/80/2C5F7F/FFFFFF?text=BTP',
            location: 'Dakar, Sénégal',
            salary: '200,000 - 350,000 FCFA',
            contractType: 'CDI',
            category: 'Construction',
            postedDate: new Date(Date.now() - 172800000), // 2 days ago
            description: `Nous recherchons un maçon qualifié pour rejoindre notre équipe dynamique.
            
Missions :
- Réalisation de travaux de maçonnerie
- Lecture de plans
- Gestion d'une petite équipe
- Respect des normes de sécurité

Profil recherché :
- Minimum 5 ans d'expérience
- Connaissance des matériaux de construction
- Autonome et rigoureux

Avantages :
- Mutuelle santé
- Prime de rendement
- Formation continue`,
            requirements: ['Maçonnerie', 'Construction', 'Gestion projet'],
            allowsVoiceApplication: true,
            isNew: true
        },
        {
            id: 'j2',
            title: 'Couturière Expérimentée',
            company: 'Atelier Mode Africaine',
            companyLogo: 'https://via.placeholder.com/80/D4A373/FFFFFF?text=MODE',
            location: 'Dakar, Plateau',
            salary: '150,000 - 250,000 FCFA',
            contractType: 'CDD',
            category: 'Artisanat',
            postedDate: new Date(Date.now() - 432000000), // 5 days ago
            description: `Atelier de couture recherche une couturière talentueuse.
            
Vous serez en charge de :
- Confection de vêtements sur mesure
- Prise de mesures clients
- Conseil mode et style
- Retouches et ajustements

Compétences requises :
- Maîtrise de la couture traditionnelle
- Créativité et sens du style
- Bon relationnel client`,
            requirements: ['Couture', 'Mode', 'Service client'],
            allowsVoiceApplication: true,
            isNew: false
        },
        {
            id: 'j3',
            title: 'Chauffeur Professionnel',
            company: 'TransDakar VTC',
            companyLogo: 'https://via.placeholder.com/80/2C5F7F/FFFFFF?text=VTC',
            location: 'Dakar et environs',
            salary: '180,000 - 300,000 FCFA + commissions',
            contractType: 'Freelance',
            category: 'Transport',
            postedDate: new Date(Date.now() - 86400000), // 1 day ago
            description: `Rejoignez notre flotte de chauffeurs VTC !
            
Conditions :
- Permis de conduire valide (minimum 3 ans)
- Véhicule personnel en bon état
- Excellente connaissance de Dakar
- Smartphone Android/iOS

Avantages :
- Horaires flexibles
- Commissions attractives
- Assurance véhicule
- Support technique 24/7`,
            requirements: ['Conduite', 'Service client', 'Navigation'],
            allowsVoiceApplication: true,
            isNew: true
        }
    ],

    // Conversations for Messages
    conversations: [
        {
            id: 'c1',
            user: {
                id: '2',
                name: 'Fatou Sall',
                title: 'Couturière',
                photoUrl: 'https://i.pravatar.cc/150?img=5',
                online: true
            },
            lastMessage: {
                text: 'Merci beaucoup pour votre aide!',
                timestamp: new Date(Date.now() - 300000), // 5 min ago
                isVoice: false,
                unread: 2
            },
            messages: [
                {
                    id: 'm1',
                    senderId: '1',
                    text: 'Bonjour Fatou! Comment puis-je vous aider?',
                    timestamp: new Date(Date.now() - 900000),
                    isVoice: false
                },
                {
                    id: 'm2',
                    senderId: '2',
                    text: 'Salut Amadou! J\'aurais besoin de conseils pour mon projet',
                    timestamp: new Date(Date.now() - 600000),
                    isVoice: false
                },
                {
                    id: 'm3',
                    senderId: '2',
                    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                    duration: '0:45',
                    timestamp: new Date(Date.now() - 400000),
                    isVoice: true
                },
                {
                    id: 'm4',
                    senderId: '1',
                    text: 'Bien sûr! Je vous appelle ce soir.',
                    timestamp: new Date(Date.now() - 350000),
                    isVoice: false
                },
                {
                    id: 'm5',
                    senderId: '2',
                    text: 'Merci beaucoup pour votre aide!',
                    timestamp: new Date(Date.now() - 300000),
                    isVoice: false
                }
            ]
        },
        {
            id: 'c2',
            user: {
                id: '3',
                name: 'Mamadou Sy',
                title: 'Chauffeur VTC',
                photoUrl: 'https://i.pravatar.cc/150?img=8',
                online: false
            },
            lastMessage: {
                text: 'Message vocal',
                timestamp: new Date(Date.now() - 3600000), // 1 hour ago
                isVoice: true,
                unread: 0
            },
            messages: [
                {
                    id: 'm6',
                    senderId: '3',
                    text: 'Salut mon frère! Ça fait longtemps',
                    timestamp: new Date(Date.now() - 7200000),
                    isVoice: false
                },
                {
                    id: 'm7',
                    senderId: '1',
                    voiceUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                    duration: '1:20',
                    timestamp: new Date(Date.now() - 3600000),
                    isVoice: true
                }
            ]
        },
        {
            id: 'c3',
            user: {
                id: '4',
                name: 'Aissatou Ndiaye',
                title: 'Vendeuse au marché',
                photoUrl: 'https://i.pravatar.cc/150?img=9',
                online: true
            },
            lastMessage: {
                text: 'À demain alors!',
                timestamp: new Date(Date.now() - 86400000), // 1 day ago
                isVoice: false,
                unread: 0
            },
            messages: [
                {
                    id: 'm8',
                    senderId: '4',
                    text: 'Bonjour Amadou! Tu passes au marché demain?',
                    timestamp: new Date(Date.now() - 90000000),
                    isVoice: false
                },
                {
                    id: 'm9',
                    senderId: '1',
                    text: 'Oui, vers 10h!',
                    timestamp: new Date(Date.now() - 87000000),
                    isVoice: false
                },
                {
                    id: 'm10',
                    senderId: '4',
                    text: 'À demain alors!',
                    timestamp: new Date(Date.now() - 86400000),
                    isVoice: false
                }
            ]
        }
    ],

    // Connections for Network page
    connections: [
        {
            id: '2',
            name: 'Fatou Sall',
            title: 'Couturière Expérimentée',
            location: 'Dakar, Médina',
            photoUrl: 'https://i.pravatar.cc/150?img=5',
            mutualConnections: 12,
            skills: ['Couture', 'Mode', 'Design'],
            connectedSince: '2023-05-15'
        },
        {
            id: '3',
            name: 'Mamadou Sy',
            title: 'Chauffeur VTC',
            location: 'Dakar',
            photoUrl: 'https://i.pravatar.cc/150?img=8',
            mutualConnections: 8,
            skills: ['Transport', 'Service client'],
            connectedSince: '2023-08-20'
        },
        {
            id: '4',
            name: 'Aissatou Ndiaye',
            title: 'Vendeuse au marché',
            location: 'Dakar, Kermel',
            photoUrl: 'https://i.pravatar.cc/150?img=9',
            mutualConnections: 15,
            skills: ['Commerce', 'Vente'],
            connectedSince: '2022-11-10'
        },
        {
            id: '5',
            name: 'Ousmane Diop',
            title: 'Électricien',
            location: 'Dakar, Plateau',
            photoUrl: 'https://i.pravatar.cc/150?img=11',
            mutualConnections: 6,
            skills: ['Électricité', 'Installation'],
            connectedSince: '2024-01-05'
        },
        {
            id: '6',
            name: 'Khady Fall',
            title: 'Coiffeuse',
            location: 'Dakar, HLM',
            photoUrl: 'https://i.pravatar.cc/150?img=1',
            mutualConnections: 10,
            skills: ['Coiffure', 'Beauté', 'Tresses'],
            connectedSince: '2023-03-22'
        }
    ],

    // Connection requests
    connectionRequests: [
        {
            id: 'r1',
            from: {
                id: '7',
                name: 'Ibrahima Sarr',
                title: 'Plombier',
                location: 'Dakar',
                photoUrl: 'https://i.pravatar.cc/150?img=13'
            },
            message: 'Bonjour Amadou, j\'ai vu votre profil et j\'aimerais échanger avec vous sur des opportunités de collaboration.',
            voiceIntro: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
            mutualConnections: 3,
            requestedAt: new Date(Date.now() - 172800000), // 2 days ago
            type: 'received'
        },
        {
            id: 'r2',
            from: {
                id: '8',
                name: 'Marie Faye',
                title: 'Architecte',
                location: 'Dakar, Almadies',
                photoUrl: 'https://i.pravatar.cc/150?img=16'
            },
            message: 'J\'ai besoin d\'un maçon expérimenté pour un projet important. Votre profil m\'intéresse beaucoup!',
            voiceIntro: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
            mutualConnections: 5,
            requestedAt: new Date(Date.now() - 86400000), // 1 day ago
            type: 'received'
        }
    ],

    // Suggestions
    suggestions: [
        {
            id: '9',
            name: 'Cheikh Ndiaye',
            title: 'Menuisier',
            location: 'Rufisque',
            photoUrl: 'https://i.pravatar.cc/150?img=14',
            reason: 'Travaille dans la construction',
            mutualConnections: 4
        },
        {
            id: '10',
            name: 'Aminata Ba',
            title: 'Chef de chantier',
            location: 'Thies',
            photoUrl: 'https://i.pravatar.cc/150?img=20',
            reason: 'Vous avez 7 relations en commun',
            mutualConnections: 7
        },
        {
            id: '11',
            name: 'Abdou Kane',
            title: 'Peintre en bâtiment',
            location: 'Dakar, Pikine',
            photoUrl: 'https://i.pravatar.cc/150?img=15',
            reason: 'Même secteur d\'activité',
            mutualConnections: 2
        }
    ]
};

// Make MockData globally available
window.MockData = MockData;
