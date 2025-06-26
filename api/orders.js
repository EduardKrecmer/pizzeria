// Vercel Serverless Function for pizza orders
import nodemailer from 'nodemailer';

export const config = {
  maxDuration: 30
};

// Initialize email transporter with optimized settings
async function createEmailTransporter() {
  const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars);
    return null;
  }

  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true,
      maxConnections: 1,
      maxMessages: 3
    });

    await transporter.verify();
    return transporter;
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return null;
  }
}

// Format order time in Slovak locale
function formatOrderTime() {
  return new Date().toLocaleString('sk-SK', {
    timeZone: 'Europe/Bratislava',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Get Slovak size description
function getSlovakSizeType(size) {
  switch (size) {
    case 'SMALL': return 'Malá (Ø 24 cm)';
    case 'REGULAR': return 'Stredná (Ø 30 cm)';
    case 'LARGE': return 'Veľká (Ø 36 cm)';
    default: return size;
  }
}

// Format order details for customer email
function formatOrderToHtml(order) {
  const { items, customerInfo, totalAmount, deliveryType } = order;
  const orderTime = formatOrderTime();
  
  return `
    <h2>Potvrdenie objednávky</h2>
    <p><strong>Dátum a čas objednávky:</strong> ${orderTime}</p>
    <p><strong>Meno:</strong> ${customerInfo.firstName} ${customerInfo.lastName}</p>
    <p><strong>Email:</strong> ${customerInfo.email}</p>
    <p><strong>Telefón:</strong> ${customerInfo.phone}</p>
    
    ${deliveryType === 'DELIVERY' ? `
      <p><strong>Adresa doručenia:</strong> ${customerInfo.street}, ${customerInfo.city} ${customerInfo.postalCode}</p>
    ` : `
      <p><strong>Typ prevzatia:</strong> Osobný odber v reštaurácii</p>
    `}
    
    <h3>Objednané položky:</h3>
    <ul>
      ${items.map((item) => `
        <li>
          <strong>${item.pizza.name}</strong> - ${getSlovakSizeType(item.size)} - ${item.quantity}x - ${(item.price * item.quantity).toFixed(2)}€
          ${item.extras.length > 0 ? `
            <br><span style="font-style: italic;">Extra:</span> ${item.extras.map((e) => `${e.name} (+${e.price.toFixed(2)}€)`).join(', ')}
          ` : ''}
        </li>
      `).join('')}
    </ul>
    
    <p><strong>Celková suma:</strong> ${totalAmount.toFixed(2)}€</p>
    
    ${customerInfo.notes ? `<p><strong>Poznámky:</strong> ${customerInfo.notes}</p>` : ''}
    
    <hr>
    <p>Ďakujeme za vašu objednávku! V prípade otázok nás kontaktujte.</p>
  `;
}

// Format order details for restaurant notification
function formatRestaurantOrderToHtml(order) {
  const { items, customerInfo, totalAmount, deliveryType } = order;
  const orderTime = formatOrderTime();
  
  return `
    <h2>NOVÁ OBJEDNÁVKA</h2>
    <p><strong>Čas objednávky:</strong> ${orderTime}</p>
    
    <h3>Zákazník:</h3>
    <p><strong>Meno:</strong> ${customerInfo.firstName} ${customerInfo.lastName}</p>
    <p><strong>Telefón:</strong> ${customerInfo.phone}</p>
    <p><strong>Email:</strong> ${customerInfo.email}</p>
    
    ${deliveryType === 'DELIVERY' ? `
      <p><strong>DORUČENIE NA ADRESU:</strong> ${customerInfo.street}, ${customerInfo.city} ${customerInfo.postalCode}</p>
    ` : `
      <p><strong>OSOBNÝ ODBER</strong> v reštaurácii</p>
    `}
    
    <h3>Objednané položky:</h3>
    <ol>
      ${items.map((item, index) => `
        <li>
          <strong>${item.pizza.name}</strong> - ${getSlovakSizeType(item.size)} - ${item.quantity}x
          ${item.extras.length > 0 ? `
            <br><strong>Extra:</strong> ${item.extras.map((e) => e.name).join(', ')}
          ` : ''}
        </li>
      `).join('')}
    </ol>
    
    <p><strong>CELKOVÁ SUMA: ${totalAmount.toFixed(2)}€</strong></p>
    
    ${customerInfo.notes ? `<p><strong>Poznámky zákazníka:</strong> ${customerInfo.notes}</p>` : ''}
  `;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const order = req.body;
    
    // Validate required order fields
    if (!order.customerInfo || !order.items || !order.totalAmount) {
      return res.status(400).json({ error: 'Missing required order information' });
    }

    const transporter = await createEmailTransporter();
    
    if (!transporter) {
      console.error('Email service not available');
      return res.status(500).json({ error: 'Email service temporarily unavailable' });
    }

    // Send confirmation email to customer
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: order.customerInfo.email,
        subject: 'Potvrdenie objednávky - Pizzeria',
        html: formatOrderToHtml(order)
      });
    } catch (emailError) {
      console.error('Customer email failed:', emailError);
    }

    // Send notification to restaurant
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: 'vlastnawebstranka@gmail.com',
        subject: 'NOVÁ OBJEDNÁVKA - Pizzeria',
        html: formatRestaurantOrderToHtml(order)
      });
    } catch (emailError) {
      console.error('Restaurant email failed:', emailError);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Order processed successfully',
      orderId: Date.now()
    });

  } catch (error) {
    console.error('Order processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}