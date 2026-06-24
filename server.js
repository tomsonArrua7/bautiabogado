const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint for Contact Form
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // 1. Basic Server-side Validation
  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos (Nombre, Email, Teléfono, Mensaje) son obligatorios.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'El formato de correo electrónico no es válido.'
    });
  }

  // Clear phone formatting and validate length
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'El número de teléfono parece ser demasiado corto.'
    });
  }

  // 2. Email Sending logic
  const mailOptions = {
    from: `"Web de Contacto - Galatro & Galatro Abogados" <${process.env.SMTP_USER || 'no-reply@galatroabogados.com'}>`,
    to: process.env.CONTACT_RECEIVER || 'galatrobautista@gmail.com',
    replyTo: email,
    subject: `Nueva Consulta de ${name} - Contacto Web`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #0f1f39; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Nueva Consulta - Estudio Jurídico</h2>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="margin-top: 0;">Has recibido un mensaje a través del formulario de contacto de tu sitio web:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold; width: 30%;">Nombre:</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7; font-weight: bold;">Teléfono:</td>
              <td style="padding: 10px; border-bottom: 1px solid #edf2f7;"><a href="tel:${cleanPhone}">${phone}</a></td>
            </tr>
          </table>
          
          <div style="margin-top: 20px;">
            <p style="font-weight: bold; margin-bottom: 8px;">Mensaje:</p>
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #6a824e; border-radius: 4px; font-style: italic; white-space: pre-wrap;">
              ${message}
            </div>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          Este correo fue generado automáticamente por el formulario de tu página web.
        </div>
      </div>
    `
  };

  // 3. SMTP configuration check
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // If not configured, run in mock mode for local testing
    console.log('\n--- [MODO SIMULADO] Email de Contacto Recibido ---');
    console.log(`Para: ${mailOptions.to}`);
    console.log(`De: ${name} (${email})`);
    console.log(`Teléfono: ${phone}`);
    console.log(`Mensaje: ${message}`);
    console.log('--------------------------------------------------\n');

    return res.status(200).json({
      success: true,
      simulated: true,
      message: 'Mensaje recibido con éxito (Modo Simulado local: sin credenciales SMTP).'
    });
  }

  // Send via SMTP
  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: user,
        pass: pass
      }
    });

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto a la brevedad.'
    });
  } catch (error) {
    console.error('Error enviando el correo SMTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error al intentar enviar el correo. Por favor, intenta de nuevo o comunícate vía WhatsApp.'
    });
  }
});

// Serve frontend routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor de Estudio Jurídico corriendo en http://localhost:${PORT}`);
});
