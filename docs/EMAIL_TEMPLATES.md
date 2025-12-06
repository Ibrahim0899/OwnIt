# 📧 Templates Email OwnIt pour Supabase

Ces templates sont à copier dans **Supabase Dashboard → Authentication → Email Templates**

---

## 1. Magic Link / OTP Email

Utilisé pour la vérification 2FA.

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
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌍 OwnIt</div>
        
        <p class="message">Bonjour,</p>
        <p class="message">Voici votre code de vérification pour vous connecter à <span class="highlight">OwnIt</span>:</p>
        
        <div class="code-box">
            <div class="code">{{ .Token }}</div>
        </div>
        
        <p class="message">Ce code expire dans <strong>5 minutes</strong>.</p>
        <p class="message">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        
        <div class="footer">
            <p>L'équipe OwnIt</p>
            <p>Chaque voix porte une histoire 🎤</p>
        </div>
    </div>
</body>
</html>
```

---

## 2. Confirm Signup Email

Utilisé pour confirmer l'inscription.

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
        .feature { display: flex; align-items: center; margin: 10px 0; color: #a0a0a0; }
        .feature-icon { font-size: 24px; margin-right: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌍 OwnIt</div>
        
        <p class="message">Bienvenue sur <span class="highlight">OwnIt</span>! 🎉</p>
        <p class="message">Vous êtes à un clic de rejoindre la communauté professionnelle voice-first.</p>
        
        <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="btn">✅ Confirmer mon email</a>
        </div>
        
        <div class="features">
            <div class="feature"><span class="feature-icon">🎤</span> Racontez votre histoire avec votre voix</div>
            <div class="feature"><span class="feature-icon">🔒</span> Sécurité maximale avec 2FA</div>
            <div class="feature"><span class="feature-icon">🌍</span> Accessible à tous</div>
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

## 3. Reset Password Email

Utilisé pour réinitialiser le mot de passe.

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
        .warning { background: #3d2929; border-left: 4px solid #ff6b6b; padding: 12px; border-radius: 4px; margin: 20px 0; color: #ff9999; font-size: 13px; }
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

## 📋 Comment configurer

1. **Supabase Dashboard** → Authentication → Email Templates
2. **Sélectionne** le type de template
3. **Colle** le Subject et le Body HTML
4. **Sauvegarde**

> 💡 **Astuce**: Teste l'email en créant un compte test!
