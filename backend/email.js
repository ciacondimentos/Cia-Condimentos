// Utilitário para envio de e-mails usando SendGrid
let sgMail;
try {
  sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'SUA_CHAVE_AQUI');
} catch (err) {
  console.warn('SendGrid not available, email sending disabled');
  sgMail = null;
}

async function sendConfirmationEmail(to, code) {
  if (!sgMail) {
    console.log('Email sending disabled, skipping confirmation email');
    return;
  }
  const msg = {
    to,
    from: process.env.SENDGRID_FROM || 'no-reply@ciadecondimentos.com',
    subject: 'Confirmação de E-mail - Cia de Condimentos',
    text: `Seu código de confirmação é: ${code}`,
    html: `<p>Olá!<br>Seu código de confirmação é: <b>${code}</b></p>`
  };
  await sgMail.send(msg);
}

module.exports = { sendConfirmationEmail };
