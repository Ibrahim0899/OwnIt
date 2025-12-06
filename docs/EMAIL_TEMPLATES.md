# 📧 Templates Email OwnIt pour Supabase - COMPLET

Copiez ces templates dans **Supabase Dashboard → Authentication → Email Templates**

---

## 1️⃣ Confirm Sign Up (Confirmation d'inscription)

### Subject:
```
🎉 Bienvenue sur OwnIt - Confirmez votre email
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border-radius: 16px; padding: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #D4A373; text-align: center; margin-bottom: 30px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #D4A373 0%, #C89058 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .message { color: #a0a0a0; line-height: 1.6; text-align: center; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        .highlight { color: #D4A373; }
        .features { background: #2d2d2d; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .feature { margin: 10px 0; color: #a0a0a0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌍 OwnIt</div>
        
        <p class="message">Bienvenue sur <span class="highlight">OwnIt</span>! 🎉</p>
        <p class="message">Vous êtes à un clic de rejoindre la communauté où chaque voix porte une histoire.</p>
        
        <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="btn">✅ Confirmer mon email</a>
        </div>
        
        <div class="features">
            <div class="feature">🎤 Racontez votre histoire avec votre voix</div>
            <div class="feature">🔒 Sécurité maximale avec 2FA</div>
            <div class="feature">🌍 Accessible à tous</div>
        </div>
        
        <p class="message" style="font-size: 12px;">Si le bouton ne fonctionne pas, copiez ce lien:<br>{{ .ConfirmationURL }}</p>
        
        <div class="footer">
            <p>L'équipe OwnIt</p>
            <p>Chaque voix porte une histoire 🎤</p>
        </div>
    </div>
</body>
</html>
```

---

## 2️⃣ Magic Link (Lien magique / Code OTP)

### Subject:
```
🔐 OwnIt - Votre code de vérification
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border-radius: 16px; padding: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #D4A373; text-align: center; margin-bottom: 30px; }
        .code-box { background: linear-gradient(135deg, #D4A373 0%, #C89058 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 30px 0; }
        .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff; font-family: monospace; }
        .message { color: #a0a0a0; line-height: 1.6; text-align: center; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        .highlight { color: #D4A373; }
        .btn { display: inline-block; background: linear-gradient(135deg, #D4A373 0%, #C89058 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌍 OwnIt</div>
        
        <p class="message">Bonjour,</p>
        <p class="message">Voici votre lien de connexion sécurisé pour <span class="highlight">OwnIt</span>:</p>
        
        <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="btn">🔐 Se connecter</a>
        </div>
        
        <p class="message">Ce lien expire dans <strong>5 minutes</strong>.</p>
        <p class="message">Si vous n'avez pas demandé ce lien, ignorez cet email.</p>
        
        <p class="message" style="font-size: 12px;">Si le bouton ne fonctionne pas, copiez ce lien:<br>{{ .ConfirmationURL }}</p>
        
        <div class="footer">
            <p>L'équipe OwnIt</p>
            <p>Chaque voix porte une histoire 🎤</p>
        </div>
    </div>
</body>
</html>
```

---

## 3️⃣ Reset Password (Réinitialisation de mot de passe)

### Subject:
```
🔑 OwnIt - Réinitialisez votre mot de passe
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border-radius: 16px; padding: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #D4A373; text-align: center; margin-bottom: 30px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #D4A373 0%, #C89058 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .message { color: #a0a0a0; line-height: 1.6; text-align: center; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        .warning { background: #3d2929; border-left: 4px solid #ff6b6b; padding: 12px; border-radius: 4px; margin: 20px 0; color: #ff9999; font-size: 13px; text-align: left; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌍 OwnIt</div>
        
        <p class="message">Vous avez demandé à réinitialiser votre mot de passe.</p>
        
        <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="btn">🔑 Réinitialiser mon mot de passe</a>
        </div>
        
        <div class="warning">
            ⚠️ Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
        </div>
        
        <p class="message" style="font-size: 12px;">Ce lien expire dans 24 heures.<br>Si le bouton ne fonctionne pas, copiez ce lien:<br>{{ .ConfirmationURL }}</p>
        
        <div class="footer">
            <p>L'équipe OwnIt</p>
            <p>Chaque voix porte une histoire 🎤</p>
        </div>
    </div>
</body>
</html>
```

---

## 4️⃣ Change Email Address (Changement d'email)

### Subject:
```
📧 OwnIt - Confirmez votre nouvelle adresse email
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border-radius: 16px; padding: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #D4A373; text-align: center; margin-bottom: 30px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #D4A373 0%, #C89058 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .message { color: #a0a0a0; line-height: 1.6; text-align: center; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        .highlight { color: #D4A373; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌍 OwnIt</div>
        
        <p class="message">Vous avez demandé à changer votre adresse email sur <span class="highlight">OwnIt</span>.</p>
        <p class="message">Cliquez sur le bouton ci-dessous pour confirmer votre nouvelle adresse email:</p>
        
        <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="btn">📧 Confirmer le changement</a>
        </div>
        
        <p class="message">Si vous n'avez pas demandé ce changement, ignorez cet email.</p>
        
        <div class="footer">
            <p>L'équipe OwnIt</p>
            <p>Chaque voix porte une histoire 🎤</p>
        </div>
    </div>
</body>
</html>
```

---

## 5️⃣ Invite User (Invitation utilisateur)

### Subject:
```
🤝 Vous êtes invité à rejoindre OwnIt!
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border-radius: 16px; padding: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #D4A373; text-align: center; margin-bottom: 30px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #D4A373 0%, #C89058 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .message { color: #a0a0a0; line-height: 1.6; text-align: center; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        .highlight { color: #D4A373; }
        .features { background: #2d2d2d; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .feature { margin: 10px 0; color: #a0a0a0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌍 OwnIt</div>
        
        <p class="message" style="font-size: 24px;">Vous êtes invité! 🤝</p>
        <p class="message">Rejoignez <span class="highlight">OwnIt</span>, la plateforme professionnelle où chaque voix porte une histoire.</p>
        
        <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="btn">🚀 Accepter l'invitation</a>
        </div>
        
        <div class="features">
            <div class="feature">🎤 Racontez votre histoire avec votre voix</div>
            <div class="feature">🔒 Sécurité maximale avec 2FA</div>
            <div class="feature">🌍 Accessible à tous</div>
        </div>
        
        <div class="footer">
            <p>L'équipe OwnIt</p>
            <p>Chaque voix porte une histoire 🎤</p>
        </div>
    </div>
</body>
</html>
```

---

## 6️⃣ Reauthentication (Ré-authentification)

### Subject:
```
🔒 OwnIt - Confirmez votre identité
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); border-radius: 16px; padding: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #D4A373; text-align: center; margin-bottom: 30px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #D4A373 0%, #C89058 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .message { color: #a0a0a0; line-height: 1.6; text-align: center; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        .highlight { color: #D4A373; }
        .warning { background: #3d2929; border-left: 4px solid #ff6b6b; padding: 12px; border-radius: 4px; margin: 20px 0; color: #ff9999; font-size: 13px; text-align: left; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌍 OwnIt</div>
        
        <p class="message">Une action sensible nécessite une confirmation de votre identité.</p>
        
        <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="btn">🔒 Confirmer mon identité</a>
        </div>
        
        <div class="warning">
            ⚠️ Si vous n'avez pas initié cette action, ne cliquez pas sur le lien et changez immédiatement votre mot de passe.
        </div>
        
        <div class="footer">
            <p>L'équipe OwnIt</p>
            <p>Chaque voix porte une histoire 🎤</p>
        </div>
    </div>
</body>
</html>
```

---

# 📮 Configuration SMTP (Optionnel mais recommandé)

Supabase utilise par défaut un service email intégré avec des **limites de débit**. Pour une app en production, configure un SMTP personnalisé.

## Options SMTP recommandées:

| Service | Emails gratuits/mois | Recommandé pour |
|---------|---------------------|-----------------|
| **Resend** | 3,000 | Startups |
| **SendGrid** | 100/jour | Apps moyennes |
| **Postmark** | À partir de $10/mois | Production |
| **Mailgun** | 5,000 | Développeurs |

## Configuration SMTP dans Supabase:

1. Clique sur **"Set up SMTP"** dans Supabase
2. Entre les infos de ton fournisseur SMTP:
   - **Host**: smtp.ton-provider.com
   - **Port**: 587 (TLS) ou 465 (SSL)
   - **Username**: ton-email
   - **Password**: ton-mot-de-passe
   - **Sender email**: noreply@ownittheibrahim.tech
   - **Sender name**: OwnIt

## Exemple avec Resend (gratuit jusqu'à 3000 emails/mois):

1. Inscris-toi sur https://resend.com
2. Vérifie ton domaine `ownittheibrahim.tech`
3. Crée une API Key
4. Dans Supabase SMTP Settings:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: `ta-api-key`
   - Sender: `noreply@ownittheibrahim.tech`
