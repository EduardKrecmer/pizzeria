import nodemailer from 'nodemailer';

/**
 * Email service pre pizzeria aplikáciu
 * Zabezpečuje odosielanie objednávok na email pizzerie
 */

// Konfigurácia emailového transportu
let transporter = null;

/**
 * Inicializuje email transporter s SMTP nastaveniami
 * @returns {Promise<Object|null>} Transporter objekt alebo null pri chybe
 */
async function initializeEmailTransporter() {
  // Validácia environment variables
  const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`❌ Chýbajúce environment variables: ${missingVars.join(', ')}`);
    return null;
  }

  try {
    // Bezpečná konfigurácia SMTP transportera
    transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_SECURE === 'true', // false pre port 587, true pre port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Bezpečnostné nastavenia
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      },
      // Timeout nastavenia
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    });

    await transporter.verify();
    console.log('✅ Email server je pripojený a funkčný');
    return transporter;
  } catch (error) {
    console.error('❌ Chyba pri pripájaní k email serveru:', error);
    return null;
  }
}

/**
 * Konvertuje veľkosť pizze na slovenský popis
 * @param {string} size - Veľkosť pizze (SMALL, REGULAR, LARGE)
 * @returns {string} Slovenský popis veľkosti
 */
function getSlovakSizeType(size) {
  const sizeMap = {
    'SMALL': 'Malá (26cm)',
    'REGULAR': 'Stredná (32cm)', 
    'LARGE': 'Veľká (42cm)'
  };
  
  return sizeMap[size] || 'Stredná (32cm)';
}

/**
 * Formátuje aktuálny čas podľa slovenskej lokalizácie
 * @returns {string} Formátovaný čas a dátum
 */
function formatOrderTime() {
  return new Intl.DateTimeFormat('sk-SK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Bratislava',
    weekday: 'long'
  }).format(new Date());
}

/**
 * Odošle notifikáciu o objednávke na email pizzerie
 * @param {Object} order - Objekt objednávky s detailmi
 * @returns {Promise<boolean>} True ak email bol úspešne odoslaný
 */
async function sendOrderNotificationToRestaurant(order) {
  // Validácia vstupných údajov
  if (!order || typeof order !== 'object') {
    console.error('❌ Neplatný objekt objednávky');
    return false;
  }

  // Validácia povinných polí objednávky
  const requiredFields = ['id', 'customerName', 'customerPhone', 'items', 'totalAmount'];
  const missingFields = requiredFields.filter(field => !order[field]);
  
  if (missingFields.length > 0) {
    console.error(`❌ Chýbajúce povinné polia v objednávke: ${missingFields.join(', ')}`);
    return false;
  }

  const emailTransporter = await initializeEmailTransporter();
  if (!emailTransporter) {
    console.error('❌ Email transporter nie je dostupný');
    return false;
  }

  const subject = `Nová objednávka #${order.id}`;
  
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #4a5d23; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">NOVÁ OBJEDNÁVKA #${order.id}</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px; font-weight: bold;">${formatOrderTime()}</p>
      </div>
      
      <div style="border: 1px solid #ddd; border-top: none; padding: 25px; background-color: #fff;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr style="background-color: #f7f7f7;">
            <td style="padding: 12px; width: 50%; border: 1px solid #ddd; font-weight: bold;">Zákazník:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${order.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Telefón:</td>
            <td style="padding: 12px; border: 1px solid #ddd; font-size: 18px;">${order.customerPhone}</td>
          </tr>
          ${order.customerEmail ? `
          <tr style="background-color: #f7f7f7;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${order.customerEmail}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Adresa:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">
              <strong>${order.deliveryAddress || 'Osobný odber'}</strong>
              ${order.deliveryCity ? `<br>${order.deliveryCity}, ${order.deliveryPostalCode}` : ''}
            </td>
          </tr>
          <tr style="background-color: #f7f7f7;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Celková suma:</td>
            <td style="padding: 12px; border: 1px solid #ddd; font-size: 22px; font-weight: bold; color: #4a5d23;">${order.totalAmount.toFixed(2)}€</td>
          </tr>
        </table>
        
        <div style="margin-bottom: 25px;">
          <h2 style="color: #4a5d23; padding-bottom: 10px; border-bottom: 2px solid #4a5d23; margin-bottom: 15px;">POLOŽKY OBJEDNÁVKY</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f7f7f7;">
                <th style="text-align: left; padding: 10px; border: 1px solid #ddd; font-size: 15px;">Položka</th>
                <th style="text-align: center; padding: 10px; border: 1px solid #ddd; font-size: 15px;">Variant</th>
                <th style="text-align: center; padding: 10px; border: 1px solid #ddd; font-size: 15px;">Počet</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? '#fff' : '#f9f9f9'}">
                  <td style="padding: 12px; border: 1px solid #ddd;">
                    <div style="font-weight: bold; font-size: 16px;">${item.name}</div>
                    ${item.extras && item.extras.length > 0 ? `
                      <div style="font-size: 14px; color: #666; margin-top: 8px; padding: 5px; background-color: #f0f0f0; border-radius: 4px;">
                        <span style="font-weight: bold;">Extra:</span> ${item.extras.map(e => e.name).join(', ')}
                      </div>
                    ` : ''}
                  </td>
                  <td style="text-align: center; padding: 12px; border: 1px solid #ddd; font-size: 14px;">${getSlovakSizeType(item.size)}</td>
                  <td style="text-align: center; padding: 12px; border: 1px solid #ddd; font-size: 18px; font-weight: bold;">${item.quantity}×</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        ${order.notes ? `
          <div style="margin: 25px 0; padding: 15px; background-color: #fff4e5; border: 1px solid #ffe0b2; border-radius: 5px;">
            <h3 style="color: #e65100; margin-top: 0; margin-bottom: 10px; font-size: 16px;">POZNÁMKA OD ZÁKAZNÍKA:</h3>
            <p style="margin: 0; font-size: 15px;">${order.notes}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  const textContent = `
Nová objednávka #${order.id}

Zákazník: ${order.customerName}
${order.customerEmail ? `Email: ${order.customerEmail}` : ''}
Telefón: ${order.customerPhone}

${order.deliveryType === 'DELIVERY' ? `Adresa doručenia: ${order.deliveryAddress}` : 'Osobný odber'}

Objednané položky:
${order.items.map(item => 
  `${item.quantity}× ${item.name} (${getSlovakSizeType(item.size)})${
    item.extras && item.extras.length > 0 ? 
        `\n   Extra: ${item.extras.map(e => e.name).join(', ')}` : ''
  }`
).join('\n')}

${order.notes ? `Poznámky: ${order.notes}` : ''}

Celková suma: ${order.totalAmount.toFixed(2)}€

Čas objednávky: ${formatOrderTime()}
  `.trim();

  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'pizza.objednavka@gmail.com',
      to: 'pizza.objednavka@gmail.com',
      subject,
      text: textContent,
      html: htmlContent,
    });

    console.log('📧 Email s objednávkou bol úspešne odoslaný na pizza.objednavka@gmail.com');
    return true;
  } catch (error) {
    console.error('❌ Chyba pri odosielaní emailu:', error);
    return false;
  }
}

export {
  sendOrderNotificationToRestaurant,
  initializeEmailTransporter
};