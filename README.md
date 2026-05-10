# 💈 Noquemacutzz Barber - Booking System

Moderne Online-Terminbuchung für deinen Barbershop mit E-Mail-Bestätigung und Google Calendar Integration.

## ✨ Features

- 📱 Responsive Design (Desktop & Mobil)
- ✉️ Automatische E-Mail Bestätigung
- 📅 Google Calendar Integration
- 💳 Mehrere Services (Fade/Cut, Cut + Bart)
- 🔐 Formular-Validierung
- 🌙 Dark Mode Design
- 📞 Direkter Kontakt (078 697 15 09)

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer + Gmail
- **Calendar**: Google Calendar API
- **Environment**: dotenv

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm oder yarn
- Gmail-Konto
- Google Cloud Project

### Installation

```bash
# Clone das Repo
git clone https://github.com/Noquemacutzz/Noquemacutzz-Barber.git
cd Noquemacutzz-Barber

# Installiere Dependencies
npm install

# Erstelle .env Datei
cp .env.example .env
```

### Konfiguration

Siehe **[SETUP_GUIDE.md](SETUP_GUIDE.md)** für detaillierte Anweisungen zur Einrichtung von:
- Gmail App Password
- Google Calendar API
- Refresh Token

### Starten

```bash
# Development Mode
npm run dev

# Production Mode
npm start
```

Öffne: **http://localhost:3000**

## 📁 Projektstruktur

```
├── index.html          # Frontend Booking Form
├── server.js           # Backend Server
├── package.json        # Dependencies
├── .env.example        # Environment Template
├── SETUP_GUIDE.md      # Setup Anleitung
└── README.md           # Dieses File
```

## 📧 Funktionalität

### Kundenfluss

1. Kunde füllt Formular aus
2. ✅ Validation auf Client-Seite
3. 📤 Daten an `/api/book` gesendet
4. ✉️ Bestätigungsemail versendet
5. 📅 Termin zu Google Calendar hinzugefügt
6. 🔔 Barber-Benachrichtigung versendet

### E-Mails

- **Kundenbestätigung**: Mit Termindaten & Kalender-Link
- **Barber-Notification**: Mit Kundendaten & Service-Info

## 🔐 Environment Variables

```
EMAIL_USER              # Gmail Adresse
EMAIL_PASSWORD          # Gmail App Password
GOOGLE_CLIENT_ID        # Google OAuth Client ID
GOOGLE_CLIENT_SECRET    # Google OAuth Client Secret
GOOGLE_REDIRECT_URL     # OAuth Redirect URL
GOOGLE_REFRESH_TOKEN    # Calendar Refresh Token
BARBER_EMAIL           # (Optional) Barber Email Adresse
PORT                   # Server Port (Default: 3000)
NODE_ENV               # development/production
```

## 🎨 Customization

### Design anpassen
- Farben ändern in `index.html` (CSS-Variablen)
- Logo/Branding im HTML anpassen

### Services ändern
- Preise in `server.js` (servicePrices Objekt)
- Optionen in `index.html` (select Elemente)

### E-Mail Templates
- Kundenmail in `server.js` (sendConfirmationEmail)
- Barber-Mail in `server.js` (sendBarberNotification)

## 🌐 Deployment

### Vercel (empfohlen)

```bash
npm i -g vercel
vercel
```

### Heroku

```bash
heroku create your-app-name
git push heroku main
```

Siehe **SETUP_GUIDE.md** für detaillierte Deployment-Anweisungen.

## ❓ FAQ

**F: Wie ändere ich die Preise?**
A: Öffne `server.js` und bearbeite das `servicePrices` Objekt.

**F: Kann ich mehrere E-Mails empfangen?**
A: Ja, bearbeite `sendBarberNotification()` um mehrere Empfänger zu unterstützen.

**F: Wie kann ich Termine blocken?**
A: Füge Validierung in `/api/book` hinzu, um bestimmte Zeiten zu blockieren.

**F: Kann ich Zahlungsabwicklung hinzufügen?**
A: Ja, integriere Stripe oder PayPal in die Buchungs-API.

## 📞 Kontakt

📞 **078 697 15 09**

## 📄 Lizenz

MIT License - Frei zu verwenden & zu modifizieren

---

**Made with ❤️ by Noquemacutzz**
