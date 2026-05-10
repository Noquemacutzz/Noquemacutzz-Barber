# 🎉 Noquemacutzz Barber - Booking System Setup Guide

Willkommen! Diese Anleitung zeigt dir Schritt für Schritt, wie du die Booking-Website mit E-Mail und Kalender einrichtest.

---

## 📋 Was du brauchst

- Gmail-Konto (kostenlos)
- Google Cloud Project (kostenlos)
- Node.js installiert ([nodejs.org](https://nodejs.org))
- Einen Texteditor (VS Code, Sublime, etc.)

---

## 🚀 Installation

### 1. Projekt vorbereiten

```bash
# Repository klonen/downloaden
cd Noquemacutzz-Barber

# Dependencies installieren
npm install
```

### 2. `.env` Datei erstellen

Erstelle eine neue Datei `.env` im Projekt-Root und füge deine Credentials ein:

```bash
# Kopiere die .env.example
cp .env.example .env
```

---

## 🔐 Schritt 1: Gmail App Password

Damit die Website E-Mails versenden kann, brauchst du ein **App Password** (nicht dein normales Passwort).

### So geht's:

1. Gehe zu [myaccount.google.com](https://myaccount.google.com)
2. Links klick auf **"Sicherheit"**
3. Scrolle runter zu **"App-Passwörter"** (braucht 2-Faktor-Authentifizierung)
4. Wenn du 2FA nicht aktiviert hast:
   - Gehe zu **"2-Faktor-Authentifizierung"** und aktiviere es
5. Gehe zurück zu **"App-Passwörter"**
6. Wähle **"Mail"** und **"Windows Computer"** (oder dein Gerät)
7. Google generiert ein 16-stelliges Passwort
8. **Kopiere** dieses Passwort

### In `.env` eintragen:

```
EMAIL_USER=deine-email@gmail.com
EMAIL_PASSWORD=dein-16-stelliges-app-password
```

**Beispiel:**
```
EMAIL_USER=noquemacutzz@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## 📅 Schritt 2: Google Calendar API

Damit Termine automatisch in deinen Kalender kommen:

### A) Google Cloud Project erstellen

1. Gehe zu [console.cloud.google.com](https://console.cloud.google.com)
2. Oben klick auf **"Projekt erstellen"**
3. Name: `Noquemacutzz Barber`
4. Klick **"Erstellen"**
5. Warte bis es erstellt ist (Top rechts)

### B) Calendar API aktivieren

1. In der Suchleiste oben: **"Calendar API"** suchen
2. Klick auf **"Google Calendar API"**
3. Klick **"AKTIVIEREN"**

### C) OAuth Credentials erstellen

1. Links im Menü klick auf **"Credentials"**
2. Klick **"+ Create Credentials"** → **"OAuth client ID"**
3. Wenn gefragt: **"Configure OAuth consent screen"**
   - Typ: **External**
   - Klick **"Create"**
   - Email: deine Email
   - App Name: `Noquemacutzz Barber`
   - Klick **"Save and Continue"**
   - (Scopes: Skip)
   - Klick **"Back to Dashboard"**
4. Jetzt wieder **"+ Create Credentials"** → **"OAuth client ID"**
5. Wähle **"Desktop application"**
6. Name: `Barber Booking`
7. Klick **"Create"**
8. **Kopiere** diese Werte:
   - `Client ID`
   - `Client secret`

### In `.env` eintragen:

```
GOOGLE_CLIENT_ID=deine-client-id-hier
GOOGLE_CLIENT_SECRET=dein-client-secret-hier
```

---

## 🔄 Schritt 3: Refresh Token bekommen

Das ist der knifflige Part. Du brauchst ein Refresh Token.

### Option A: Automatisch (einfach)

1. Erstelle eine neue Datei `get-token.js`:

```javascript
const { google } = require("googleapis");
const express = require("express");
const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/calendar"],
});

console.log("Öffne diese URL:");
console.log(authUrl);

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  console.log("\n✅ REFRESH TOKEN:");
  console.log(tokens.refresh_token);
  res.send("Token gespeichert! Siehe Konsole.");
});

app.listen(3001, () => {
  console.log("Listening on port 3001");
});

require("dotenv").config();
```

2. Führe aus:
```bash
node get-token.js
```

3. Öffne die URL in deinem Browser
4. Autorisiere die App
5. **Kopiere** das Refresh Token aus der Konsole

### In `.env` eintragen:

```
GOOGLE_REFRESH_TOKEN=dein-refresh-token-hier
```

---

## ✅ Finale Konfiguration

Deine `.env` Datei sollte jetzt so aussehen:

```
EMAIL_USER=deine-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
GOOGLE_REDIRECT_URL=http://localhost:3000/auth/google/callback
GOOGLE_REFRESH_TOKEN=1//0abc123...
BARBER_EMAIL=deine-email@gmail.com
PORT=3000
NODE_ENV=development
```

---

## 🎬 Server starten

```bash
# Lokal testen
npm run dev

# Oder
npm start
```

Öffne: **http://localhost:3000**

---

## 🧪 Test Termin buchen

1. Fülle das Formular aus
2. Klick **"Termin anfragen"**
3. Überprüfe deine E-Mail ✉️
4. Öffne deine Google Calendar - der Termin sollte dort sein! 📅

---

## 🚀 In die Cloud deployen

### Vercel (kostenlos & einfach)

1. Installiere Vercel CLI:
```bash
npm i -g vercel
```

2. In dein Projekt-Ordner:
```bash
vercel
```

3. Folge den Anweisungen
4. Gehe zu **Settings** → **Environment Variables**
5. Füge alle `.env` Variablen ein
6. Re-deploy

---

## ❓ Fehlersuche

### "Email konnte nicht gesendet werden"
- Überprüfe `EMAIL_USER` und `EMAIL_PASSWORD`
- Stelle sicher, dass 2FA aktiviert ist und App Password richtig ist

### "Calendar-Fehler"
- Überprüfe `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`
- Stelle sicher, dass Calendar API aktiviert ist

### "Port 3000 wird bereits verwendet"
- Ändere in `.env`: `PORT=3001` (oder eine andere Nummer)

---

## 📞 Support

Bei Problemen:
1. Überprüfe die Fehlermeldung in der Konsole
2. Stelle sicher, dass alle `.env` Variablen korrekt sind
3. Versuche den Server neu zu starten

---

## 🎉 Fertig!

Deine Barber-Booking-Website läuft jetzt mit:
- ✅ Online Terminbuchung
- ✅ E-Mail Bestätigung
- ✅ Google Calendar Integration
- ✅ Automatische Kundenbenachrichtigungen

Viel Erfolg! 💈
