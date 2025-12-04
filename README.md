# OwnIt - Réseau Social Voice-First

> Un réseau social professionnel voice-first avec une touche africaine, conçu pour l'accessibilité universelle.

## 🎯 Vision

OwnIt combine le professionnalisme de LinkedIn avec une identité visuelle africaine moderne et chaleureuse, en mettant l'accent sur le contenu audio/vidéo pour être accessible aux personnes illettrées.

## ✨ Fonctionnalités Principales

### 🎤 Voice-First
- **Profil "Griot"**: Racontez votre histoire professionnelle en audio
- **Posts vocaux**: Créez du contenu avec votre voix
- **Candidatures vocales**: Postulez aux emplois sans CV écrit
- **Recherche vocale**: Trouvez des emplois en parlant
- **Lecture audio**: TTS pour tout le contenu texte

### 👤 Profil Professionnel
- Photo de couverture et profil
- Lecteur audio personnalisé avec waveform
- Grille de compétences visuelles avec évaluations
- Timeline d'expérience professionnelle
- Partage de profil facilité

### 📰 Fil d'Actualité
- Posts audio, vidéo et texte
- Filtres par type de contenu
- Interactions (J'aime, Commenter, Partager)
- TTS pour les posts texte
- Création de posts vocaux en un clic

### 💼 Offres d'Emploi
- Recherche par voix ou texte
- Filtres visuels (CDI, CDD, Freelance)
- Badges "Candidature facile" pour applications vocales
- Prévisualisation des offres
- Système de candidature en un clic

## 🎨 Design

### Palette de Couleurs
- **Fond**: Crème (#FAFAF8)
- **Or/Ocre**: #D4A373 (accents principaux)
- **Bleu Indigo**: #2C5F7F (accents secondaires)
- **Texte**: Noir profond (#1A1A1A)

### Typographie
- **Titres**: Merriweather (serif) - rappelle le Griot traditionnel
- **Corps**: Inter (sans-serif) - moderne et lisible
- **Taille minimum**: 16px pour l'accessibilité

## 🚀 Démarrage Rapide

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Python 3 (pour le serveur de développement)

### Installation

1. **Clonez ou téléchargez le projet**
```bash
cd /Users/isaiah/OwnIt
```

2. **Démarrez le serveur local**
```bash
python3 -m http.server 8000
```

3. **Ouvrez votre navigateur**
```
http://localhost:8000
```

C'est tout ! L'application est prête à l'emploi.

## 📱 Navigation

### Desktop
- **Barre latérale gauche** avec 5 sections principales
- **FAB (bouton flottant)** en bas à droite pour créer un post vocal

### Mobile
- **Barre de navigation inférieure** avec 5 icônes
- **FAB adapté** pour créer du contenu

## 🔧 Structure du Projet

```
OwnIt/
├── index.html              # Point d'entrée
├── styles/                 # CSS organisé par fonctionnalité
│   ├── design-system.css   # Variables et design tokens
│   ├── main.css            # Styles globaux
│   ├── navigation.css      # Navigation
│   ├── profile.css         # Page profil
│   ├── feed.css            # Fil d'actualité
│   └── jobs.css            # Offres d'emploi
├── scripts/                # JavaScript modulaire
│   ├── utils.js            # Utilitaires
│   ├── mock-data.js        # Données de démonstration
│   ├── navigation.js       # Routage
│   ├── tts.js              # Text-to-Speech
│   ├── audio-player.js     # Lecteur audio personnalisé
│   ├── profile.js          # Module profil
│   ├── feed.js             # Module feed
│   ├── voice-recorder.js   # Enregistrement vocal
│   ├── jobs.js             # Module emplois
│   └── voice-search.js     # Recherche vocale
└── assets/                 # Ressources statiques
```

## 🎯 Accessibilité

### Pour les Utilisateurs Illettrés
- ✅ Enregistrement vocal pour tout contenu
- ✅ Lecture audio de tous les textes (TTS)
- ✅ Icônes universelles et explicites
- ✅ Navigation visuelle simple

### Standards Web
- ✅ WCAG AA pour le contraste des couleurs
- ✅ Cibles tactiles minimum 44x44px
- ✅ Support clavier complet
- ✅ ARIA labels pour lecteurs d'écran

## 🌐 APIs Web Utilisées

- **MediaRecorder API**: Enregistrement audio
- **Web Speech API**: TTS et reconnaissance vocale
- **Canvas API**: Visualisation waveform
- **Web Audio API**: Analyse audio
- **Navigator Share API**: Partage de profil

## 📊 Compatibilité Navigateur

| Fonctionnalité | Chrome | Firefox | Safari | Edge |
|----------------|--------|---------|--------|------|
| Navigation | ✅ | ✅ | ✅ | ✅ |
| Audio Player | ✅ | ✅ | ✅ | ✅ |
| Enregistrement | ✅ | ✅ | ✅ | ✅ |
| TTS | ✅ | ✅ | ✅ | ✅ |
| Voice Search | ✅ | ⚠️ | ✅ | ✅ |

⚠️ = Support limité ou nécessite des préfixes

## 🎬 Captures d'Écran

Voir le fichier [walkthrough.md](.gemini/antigravity/brain/9463c4ef-e87a-4360-b005-22e509dcf82e/walkthrough.md) pour des captures d'écran détaillées.

## 🔐 Permissions Requises

L'application demandera l'accès à:
- **Microphone**: Pour l'enregistrement vocal et la recherche vocale
- **Notification** (optionnel): Pour les alertes de candidature

## 📝 Données de Démonstration

Le projet utilise des données fictives pour la démonstration:
- Profil utilisateur: Amadou Diallo (Maçon)
- 3 posts variés (audio, vidéo, texte)
- 3 offres d'emploi
- Tous les audios utilisent des MP3 de démonstration

## 🚧 Développement Futur

### Fonctionnalités Bonus Possibles
- [ ] Mode hors-ligne avec Service Workers
- [ ] Traduction automatique en temps réel
- [ ] Synthèse vocale personnalisée (IA)
- [ ] Login par reconnaissance faciale
- [ ] Chatbot vocal d'assistance
- [ ] Géolocalisation pour emplois à proximité
- [ ] Vérification d'identité par vidéo
- [ ] Groupes/Communautés par métier

## 📄 Licence

Projet éducatif - Libre d'utilisation

## 👥 Crédits

- **Design inspiré de**: LinkedIn, ownit-site.vercel.app
- **Concept "Griot"**: Tradition africaine du conteur
- **Fonts**: Google Fonts (Merriweather, Inter)
- **Icônes**: SVG personnalisés

---

**OwnIt** - *Votre Histoire, Votre Voix, Votre Réseau* 🎤✨
