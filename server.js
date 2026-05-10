const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Service Prices
const servicePrices = {
  "fade-cut": { name: "Fade / Cut", price: 20 },
  "cut-beard": { name: "Cut + Bart", price: 25 },
};

// Gmail Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Google Calendar Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// Helper: Send Confirmation Email
async function sendConfirmationEmail(bookingData) {
  const service = servicePrices[bookingData.service];
  const dateObj = new Date(bookingData.date);
  const formattedDate = dateObj.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const emailContent = `
    <h2>✅ Termin Bestätigung</h2>
    <p>Hallo ${bookingData.name},</p>
    <p>Dein Termin wurde erfolgreich gebucht! Hier sind deine Daten:</p>
    
    <hr>
    <h3>📋 Termin Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${bookingData.name}</li>
      <li><strong>Service:</strong> ${service.name}</li>
      <li><strong>Preis:</strong> ${service.price} CHF</li>
      <li><strong>Datum:</strong> ${formattedDate}</li>
      <li><strong>Uhrzeit:</strong> ${bookingData.time}</li>
      <li><strong>Telefon:</strong> ${bookingData.phone}</li>
    </ul>
    <hr>
    
    <p>📍 <strong>Adresse:</strong> [Deine Barber Adresse einfügen]</p>
    <p>💳 <strong>Zahlungsart:</strong> Nur Barzahlung möglich</p>
    
    <p>Falls du deinen Termin verschieben oder stornieren möchtest, ruf uns einfach an:</p>
    <h3>☎️ 078 697 15 09</h3>
    
    <hr>
    <p>Wir freuen uns auf dich!</p>
    <p>Viele Grüße,<br><strong>Noquemacutzz Barber Team</strong></p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: bookingData.email,
      subject: `✅ Termin Bestätigung - ${formattedDate} um ${bookingData.time}`,
      html: emailContent,
    });
    console.log("✅ Confirmation email sent to:", bookingData.email);
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error);
    throw error;
  }
}

// Helper: Send Barber Notification
async function sendBarberNotification(bookingData) {
  const service = servicePrices[bookingData.service];
  const dateObj = new Date(bookingData.date);
  const formattedDate = dateObj.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const emailContent = `
    <h2>🔔 Neue Buchung!</h2>
    <p>Eine neue Buchung ist eingegangen:</p>
    
    <hr>
    <h3>👤 Kundendaten:</h3>
    <ul>
      <li><strong>Name:</strong> ${bookingData.name}</li>
      <li><strong>E-Mail:</strong> ${bookingData.email}</li>
      <li><strong>Telefon:</strong> ${bookingData.phone}</li>
    </ul>
    
    <h3>💇 Service:</h3>
    <ul>
      <li><strong>Dienstleistung:</strong> ${service.name}</li>
      <li><strong>Preis:</strong> ${service.price} CHF</li>
      <li><strong>Datum:</strong> ${formattedDate}</li>
      <li><strong>Uhrzeit:</strong> ${bookingData.time}</li>
    </ul>
    <hr>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.BARBER_EMAIL || process.env.EMAIL_USER,
      subject: `🔔 Neue Buchung - ${bookingData.name}`,
      html: emailContent,
    });
    console.log("✅ Barber notification sent");
  } catch (error) {
    console.error("❌ Error sending barber notification:", error);
    throw error;
  }
}

// Helper: Add Event to Google Calendar
async function addEventToCalendar(bookingData) {
  const service = servicePrices[bookingData.service];
  const startDateTime = new Date(`${bookingData.date}T${bookingData.time}`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

  const event = {
    summary: `${service.name} - ${bookingData.name}`,
    description: `
      Service: ${service.name}
      Price: ${service.price} CHF
      Customer: ${bookingData.name}
      Phone: ${bookingData.phone}
      Email: ${bookingData.email}
    `,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: "Europe/Zurich",
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: "Europe/Zurich",
    },
    reminders: {
      useDefault: true,
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    console.log("✅ Event added to Google Calendar:", response.data.id);
    return response.data.htmlLink;
  } catch (error) {
    console.error("❌ Error adding event to calendar:", error);
    throw error;
  }
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Booking API Endpoint
app.post("/api/book", async (req, res) => {
  try {
    const { name, email, phone, date, time, service } = req.body;

    // Validation
    if (!name || !email || !phone || !date || !time || !service) {
      return res.status(400).json({
        message: "Alle Felder sind erforderlich",
      });
    }

    if (!servicePrices[service]) {
      return res.status(400).json({
        message: "Ungültiger Service",
      });
    }

    const bookingData = { name, email, phone, date, time, service };

    // Send confirmation email
    await sendConfirmationEmail(bookingData);

    // Send barber notification
    await sendBarberNotification(bookingData);

    // Add to Google Calendar
    const calendarLink = await addEventToCalendar(bookingData);

    console.log("✅ Booking completed:", {
      name,
      email,
      date,
      time,
      service,
    });

    res.json({
      success: true,
      message: "Termin erfolgreich gebucht!",
      calendarLink,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({
      message: "Es gab einen Fehler beim Buchen. Bitte versuchen Sie es später erneut.",
      error: error.message,
    });
  }
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  🎉 Noquemacutzz Barber Booking   ║
║     Server läuft auf Port ${PORT}      ║
║  http://localhost:${PORT}            ║
╚════════════════════════════════════╝
  `);
});
