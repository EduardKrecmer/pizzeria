import nodemailer from 'nodemailer';
import { Order } from '../shared/schema';
import { CartItem, Extra } from '../client/src/types';

// Konfigurácia emailového transportu
// Pre produkciu by bolo potrebné nastaviť skutočný SMTP server
// Pre vývoj môžeme použiť Ethereal - https://ethereal.email/
let transporter: nodemailer.Transporter;

export async function initializeEmailTransporter() {
  // Ak už máme vytvorený transporter, tak ho vrátime
  if (transporter) return transporter;
  
  // Pre prípad, že nie sú zadané všetky env premenné,
  // vytvoríme testovacie konto pomocou Ethereal
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_HOST) {
    console.log('Chýbajú emailové prístupové údaje, vytvára sa testovacie konto...');
    
    try {
      // Vytvoriť testovacie Ethereal konto
      const testAccount = await nodemailer.createTestAccount();
      
      // Vytvoriť transporter s testovacími údajmi
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true pre port 465, false pre ostatné porty
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('Testovacie emailové konto vytvorené:', testAccount.user);
      console.log('Pre zobrazenie testovacích emailov navštívte: https://ethereal.email');
      
      return transporter;
    } catch (error) {
      console.error('Nepodarilo sa vytvoriť testovacie emailové konto:', error);
      return null;
    }
  }
  
  // Vytvoriť transporter s reálnymi prihlasovacími údajmi
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  return transporter;
}

// Formátovanie objednávky na čitateľný HTML string
function formatOrderToHtml(order: Order): string {
  // Bezpečnostná kontrola pre property items pred použitím
  const items = Array.isArray(order.items) ? order.items : [];
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3f51b5; border-bottom: 1px solid #eee; padding-bottom: 10px;">Potvrdenie objednávky</h1>
      
      <div style="margin: 20px 0;">
        <h2 style="font-size: 18px; margin-bottom: 10px;">Kontaktné údaje</h2>
        <p><strong>Meno:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Telefón:</strong> ${order.customerPhone}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h2 style="font-size: 18px; margin-bottom: 10px;">Doručovacia adresa</h2>
        <p>${order.deliveryAddress}</p>
        <p>${order.deliveryCity}, ${order.deliveryPostalCode}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h2 style="font-size: 18px; margin-bottom: 10px;">Položky objednávky</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Názov</th>
              <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">Veľkosť</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Množstvo</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Cena</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item: CartItem) => `
              <tr>
                <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                  ${item.name}
                  ${Array.isArray(item.extras) && item.extras.length > 0 ? 
                    `<br><span style="font-size: 12px; color: #666;">+ ${item.extras.map((e: Extra) => e.name).join(', ')}</span>` : 
                    ''}
                </td>
                <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${item.size}</td>
                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}×</td>
                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${(item.price * item.quantity).toFixed(2)}€</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right; padding: 8px; border-top: 1px solid #ddd;"><strong>Celková suma:</strong></td>
              <td style="text-align: right; padding: 8px; font-weight: bold; color: #3f51b5;">${order.totalAmount.toFixed(2)}€</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      ${order.notes ? `
        <div style="margin: 20px 0;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">Poznámka k objednávke</h2>
          <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">${order.notes}</p>
        </div>
      ` : ''}
      
      <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <p style="margin: 0;">Ďakujeme za vašu objednávku! V prípade akýchkoľvek otázok nás kontaktujte na telefónnom čísle +421 944 386 486.</p>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 10px; font-size: 12px; color: #666; text-align: center;">
        <p>© ${new Date().getFullYear()} Pizzeria Janíček. Všetky práva vyhradené.</p>
      </div>
    </div>
  `;
}

// Odosielanie emailu so súhrnom objednávky
export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  try {
    // Inicializácia transportera, ak ešte neexistuje
    const emailTransporter = await initializeEmailTransporter();
    if (!emailTransporter) {
      console.error('Nemožné odoslať email: emailový transporter nebol inicializovaný');
      return false;
    }
    
    // Nastavenie emailových údajov
    const emailOptions = {
      from: process.env.EMAIL_FROM || '"Pizzeria Janíček" <objednavky@pizzeriajanicek.sk>',
      to: order.customerEmail,
      subject: 'Potvrdenie vašej objednávky v Pizzerii Janíček',
      html: formatOrderToHtml(order),
    };
    
    // Odoslanie emailu
    const info = await emailTransporter.sendMail(emailOptions);
    console.log('Email odoslaný:', info.messageId);
    
    // Pre testovacie Ethereal emaily vypíšeme URL pre zobrazenie
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log('URL pre zobrazenie testovacieho emailu:', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Chyba pri odosielaní emailu:', error);
    return false;
  }
}