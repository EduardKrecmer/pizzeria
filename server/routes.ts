import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { storage } from "./storage-fixed";
import { insertOrderSchema, type Order } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import nodemailer from 'nodemailer';
import { initializeEmailTransporter, sendOrderConfirmationEmail, sendOrderNotificationToRestaurant } from "./email";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { CartItem } from "../client/src/types";
import { validateOrder } from "./validators";
import fs from 'fs';
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // Povolenie CORS pre API volania z iných domén
  app.use(cors({
    origin: [
      'https://pizzeria-web-umber.vercel.app',
      'https://pizza-order-pro-krecmereduard.replit.app',
      /\.vercel\.app$/,
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  
  // Inicializácia emailového transportera pri štarte servera
  try {
    await initializeEmailTransporter();
    console.log("Email transporter initialized successfully");
  } catch (error) {
    console.error("Failed to initialize email transporter:", error);
  }

  // Get all pizzas - OPRAVENÉ načítanie z JSON súboru
  app.get("/api/pizzas", async (req, res) => {
    try {
      console.log('🍕 OPRAVA: Načítavam 32 pizz z aktualizovaného JSON súboru...');
      
      const pizzasPath = path.join(process.cwd(), 'client/src/data/pizzas.json');
      console.log(`🔍 Cesta k súboru: ${pizzasPath}`);
      console.log(`📁 Súbor existuje: ${fs.existsSync(pizzasPath)}`);
      
      if (fs.existsSync(pizzasPath)) {
        const fileContent = fs.readFileSync(pizzasPath, 'utf-8');
        const pizzasData = JSON.parse(fileContent);
        
        console.log(`✅ OPRAVA: Úspešne načítaných ${pizzasData.length} pizz z JSON`);
        console.log(`📝 Prvé 5 pizz: ${pizzasData.slice(0, 5).map((p: any) => p.name).join(', ')}`);
        console.log(`📝 Posledné 5 pizz: ${pizzasData.slice(-5).map((p: any) => p.name).join(', ')}`);
        
        // Zabezpečíme, že vracíame práve tie dáta z JSON súboru
        res.setHeader('Content-Type', 'application/json');
        res.json(pizzasData);
        return;
      } else {
        console.log('❌ JSON súbor neexistuje na ceste:', pizzasPath);
        res.status(404).json({ message: "Pizza data file not found" });
        return;
      }
    } catch (error) {
      console.error("❌ CHYBA pri načítaní pizz z JSON:", error);
      res.status(500).json({ message: "Error loading pizza data", error: error.message });
    }
  });

  // Get pizza by ID
  app.get("/api/pizzas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid pizza ID" });
      }
      
      const pizza = await storage.getPizzaById(id);
      
      if (!pizza) {
        return res.status(404).json({ message: "Pizza not found" });
      }
      
      res.json(pizza);
    } catch (error) {
      console.error("Error fetching pizza:", error);
      res.status(500).json({ message: "Error fetching pizza" });
    }
  });

  // Get all extras
  app.get("/api/extras", async (req, res) => {
    try {
      const extras = await storage.getAllExtras();
      res.json(extras);
    } catch (error) {
      console.error("Error fetching extras:", error);
      res.status(500).json({ message: "Error fetching extras" });
    }
  });

  // Create order & send confirmation emails
  app.post("/api/orders", validateOrder, async (req, res) => {
    try {
      console.log("Prijatá nová objednávka:", { 
        headers: req.headers['content-type'],
        origin: req.headers.origin || req.headers.referer || 'priame API volanie',
        ip: req.ip || 'unknown',
        body_size: JSON.stringify(req.body).length
      });
      
      const parseResult = insertOrderSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        console.warn("Neplatné dáta objednávky:", errorMessage);
        return res.status(400).json({ message: errorMessage });
      }
      
      // Záznam dôležitých údajov pre diagnostiku
      console.log("Validné dáta objednávky:", {
        customer: parseResult.data.customerName,
        email: parseResult.data.customerEmail || 'nezadaný', 
        items_count: Array.isArray(parseResult.data.items) ? parseResult.data.items.length : 'neznámy',
        total: parseResult.data.totalAmount
      });
      
      // Vytvorenie objednávky v databáze
      console.log("Vytváram objednávku v databáze...");
      const order = await storage.createOrder(parseResult.data);
      console.log(`Objednávka #${order.id} úspešne vytvorená a uložená do databázy`);
      
      // Inicializácia emailového odosielania pri každej objednávke - pomôže pri autoscale režime,
      // pretože zabezpečí, že SMTP spojenie bude vytvorené pre danú konkrétnu objednávku
      try {
        await initializeEmailTransporter();
        console.log("SMTP spojenie úspešne inicializované pre odoslanie emailov k objednávke #" + order.id);
      } catch (emailInitError) {
        console.error("Chyba pri inicializácii SMTP spojenia pre objednávku #" + order.id, emailInitError);
        // Nezastavujeme spracovanie objednávky pri chybe emailu
      }
            
      // Odosielanie emailu zákazníkovi s lepšou diagnostikou
      if (order.customerEmail) {
        console.log(`[EMAIL] Začínam odosielanie potvrdzovacieho e-mailu pre objednávku #${order.id}`);
        
        // Skúsime odoslať email okamžite (nie asynchrónne)
        try {
          const emailSuccess = await sendOrderConfirmationEmail(order);
          if (emailSuccess) {
            console.log(`Potvrdenie objednávky odoslané zákazníkovi ${order.customerEmail} pre objednávku #${order.id}`);
          } else {
            console.warn(`Nepodarilo sa odoslať email so zákazníckou objednávkou #${order.id}`);
          }
        } catch (emailError) {
          console.error(`Chyba pri odosielaní emailu zákazníkovi pre objednávku #${order.id}:`, emailError);
          // Nezastavujeme spracovanie objednávky pri chybe emailu
        }
      } else {
        console.log(`Nebola uvedená emailová adresa pre objednávku #${order.id}, preskakuje sa odoslanie emailu zákazníkovi`);
      }
      
      // Odosielanie notifikácie reštaurácii s lepšou diagnostikou
      console.log(`[EMAIL] Začínam odosielanie notifikácie o objednávke #${order.id} do reštaurácie`);
      
      try {
        const restaurantEmailSuccess = await sendOrderNotificationToRestaurant(order);
        if (restaurantEmailSuccess) {
          console.log(`Notifikácia o objednávke #${order.id} bola odoslaná reštaurácii`);
        } else {
          console.warn(`Nepodarilo sa odoslať notifikáciu reštaurácii o objednávke #${order.id}`);
        }
      } catch (restaurantEmailError) {
        console.error(`Chyba pri odosielaní notifikácie reštaurácii o objednávke #${order.id}:`, restaurantEmailError);
        // Nezastavujeme spracovanie objednávky pri chybe emailu
      }
      
      // Odpoveď klientovi
      res.status(201).json({
        ...order,
        email_status: order.customerEmail ? 'odosielané' : 'email nezadaný'
      });
    } catch (error) {
      console.error("Chyba pri vytváraní objednávky:", error);
      res.status(500).json({ 
        message: "Nepodarilo sa vytvoriť objednávku", 
        error: String(error)
      });
    }
  });

  // Get all orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  // Test route pre overenie emailového odosielania zákazníkovi
  app.get("/api/test-email", async (req, res) => {
    try {
      // Získame poslednú objednávku pre test
      const orders = await storage.getAllOrders();
      if (orders.length === 0) {
        return res.status(404).json({ message: "No orders found for testing email" });
      }
      
      const testOrder = orders[orders.length - 1];
      // Nastavíme testovaciu emailovú adresu
      const testOrderWithEmail = {
        ...testOrder,
        customerEmail: req.query.email as string || "test@example.com"
      };
      
      const success = await sendOrderConfirmationEmail(testOrderWithEmail);
      
      if (success) {
        res.json({ message: "Test email for customer sent successfully. Check logs for details." });
      } else {
        res.status(500).json({ message: "Failed to send test email to customer" });
      }
    } catch (error) {
      console.error("Error sending test email to customer:", error);
      res.status(500).json({ message: "Error sending test email to customer" });
    }
  });
  
  // Test route pre overenie emailového odosielania reštaurácii
  app.get("/api/test-restaurant-email", async (req, res) => {
    try {
      // Získame poslednú objednávku pre test
      const orders = await storage.getAllOrders();
      if (orders.length === 0) {
        return res.status(404).json({ message: "No orders found for testing email" });
      }
      
      const testOrder = orders[orders.length - 1];
      
      const success = await sendOrderNotificationToRestaurant(testOrder);
      
      if (success) {
        res.json({ message: "Test email for restaurant sent successfully. Check logs for details." });
      } else {
        res.status(500).json({ message: "Failed to send test email to restaurant" });
      }
    } catch (error) {
      console.error("Error sending test email to restaurant:", error);
      res.status(500).json({ message: "Error sending test email to restaurant" });
    }
  });
  
  // Jednoduchý endpoint pre odoslanie testovacieho emailu na konkrétnu adresu
  app.get("/api/send-test-email", async (req, res) => {
    try {
      const emailTo = req.query.email as string;
      
      if (!emailTo) {
        return res.status(400).json({ message: "Email address is required as query parameter ?email=example@example.com" });
      }
      
      // Inicializácia emailového transportera
      const emailTransporter = await initializeEmailTransporter();
      if (!emailTransporter) {
        return res.status(500).json({ message: "Email transporter not initialized. Check configuration." });
      }
      
      // Vytvorenie a odoslanie testovacieho emailu
      const info = await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || `"Pizzeria Janíček" <${process.env.EMAIL_USER || 'pizza.objednavka@gmail.com'}>`,
        to: emailTo,
        subject: "Testovací email z Pizzeria Janíček",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #4a5d23;">Testovací email z Pizzeria Janíček</h2>
            <p>Tento email bol úspešne odoslaný z vašej aplikácie.</p>
            <p>Čas odoslania: ${new Date().toLocaleString('sk-SK')}</p>
            <p>Konfigurácia SMTP servera funguje správne!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #888; font-size: 12px;">© ${new Date().getFullYear()} Pizzeria Janíček, Púchov</p>
          </div>
        `
      });
      
      // Pre testovacie Ethereal emaily vypíšeme URL pre zobrazenie
      let previewUrl = null;
      if (nodemailer.getTestMessageUrl && typeof nodemailer.getTestMessageUrl === 'function') {
        try {
          previewUrl = nodemailer.getTestMessageUrl(info);
        } catch (err) {
          console.log('Chyba pri získavaní URL pre zobrazenie testovacieho emailu:', err);
        }
      }
      
      res.json({ 
        success: true, 
        message: `Testovací email bol úspešne odoslaný na adresu ${emailTo}`,
        messageId: info.messageId,
        previewUrl: previewUrl
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ message: "Error sending test email", error: String(error) });
    }
  });
  
  // Test endpoint pre overenie aktuálnej konfigurácie SMTP (bezpečná verzia - neukazuje citlivé údaje)
  app.get("/api/email-config-status", async (req, res) => {
    try {
      const emailConfig = {
        configured: !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS),
        host: process.env.EMAIL_HOST ? 
              (process.env.EMAIL_HOST.includes('gmail.com') ? 'Gmail' : 
               process.env.EMAIL_HOST.includes('ethereal.email') ? 'Ethereal (Test)' : 
               'Custom SMTP') : 'Not configured',
        from: process.env.EMAIL_FROM || `Default from (${process.env.EMAIL_USER || 'not set'})`,
        restaurant_email: process.env.RESTAURANT_EMAIL || 'vlastnawebstranka@gmail.com',
        date_checked: new Date().toISOString()
      };
      
      res.json(emailConfig);
    } catch (error) {
      console.error("Error checking email configuration:", error);
      res.status(500).json({ message: "Error checking email configuration", error: String(error) });
    }
  });
  
  // API endpoint pre kontrolu stavu databázy
  app.get("/api/db-status", async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ 
          status: 'error',
          connected: false,
          message: 'Databázové spojenie nie je k dispozícii' 
        });
      }
      
      // Vyskúšame jednoduchý SQL dotaz
      const result = await db.execute(sql`SELECT NOW() as current_time`);
      
      // Zobrázíme stav a informácie o spojení
      // Spracujeme výsledok bezpečným spôsobom, aby sme sa vyhli typovým chybám
      let timestamp: string;
      try {
        // @ts-ignore - ignorujeme typovú chybu pre prístup do pole, keďže formát môže byť variabilný
        timestamp = result && result.length ? (result[0]?.current_time || new Date().toISOString()) : new Date().toISOString();
      } catch (e) {
        timestamp = new Date().toISOString();
      }
      
      res.json({
        status: 'ok',
        connected: true,
        database: process.env.PGDATABASE || 'unknown',
        host: process.env.PGHOST || 'unknown',
        timestamp: timestamp
      });
    } catch (err) {
      console.error('Chyba pri kontrole databázového spojenia:', err);
      res.status(500).json({ 
        status: 'error',
        connected: false,
        message: `Chyba spojenia s databázou: ${err}` 
      });
    }
  });
  
  // Nový endpoint pre testovanie priameho odosielania emailov cez nodemailer
  app.get("/api/test-email-direct", async (req, res) => {
    try {
      const emailTo = req.query.email as string || 'krecmer.eduard@gmail.com';
      const testCustomer = req.query.customer as string || 'Testovací Zákazník';
      
      console.log(`[TEST] Testovanie priameho odosielania emailu na ${emailTo}...`);
      
      // Inicializácia emailového transportera
      const emailTransporter = await initializeEmailTransporter();
      if (!emailTransporter) {
        return res.status(500).json({ success: false, message: "Email transporter nie je inicializovaný" });
      }
      
      // Vytvorenie HTML pre zákaznícky email 
      const htmlContent = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #4a5d23; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">TEST - Overenie SMTP konfigurácie</h1>
            <p style="color: #f0f0f0; margin: 5px 0 0 0; font-size: 16px;">Tento email bol odoslaný, aby sa overila konfigurácia SMTP servera</p>
          </div>
          
          <div style="padding: 25px; background-color: #fcfcfc; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;">
            <p style="margin-bottom: 20px;">Ahoj <strong>${testCustomer}</strong>, toto je testovacia správa odoslaná priamo cez nodemailer.</p>
            
            <p>Tento email potvrdzuje, že:</p>
            <ul>
              <li>Vaša SMTP konfigurácia funguje správne</li>
              <li>Odosielanie emailov je možné</li>
              <li>Gmail prijíma emaily z vašej aplikácie</li>
            </ul>
            
            <p style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #4a5d23;">
              <strong>Čas testu:</strong> ${new Date().toLocaleString('sk-SK')}<br>
              <strong>Testovací server:</strong> Replit<br>
              <strong>Email odosielateľa:</strong> pizza.objednavka@gmail.com
            </p>
          </div>
          
          <div style="background-color: #4a5d23; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 16px;">Pizzeria Janíček - Testovanie SMTP</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">© ${new Date().getFullYear()} Pizzeria Janíček, Púchov</p>
          </div>
        </div>
      `;
      
      // Vytvorenie HTML pre reštauračný email
      const restaurantHtmlContent = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #4a5d23; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">TEST - SMTP KONFIGURÁCIA REŠTAURÁCIE</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px; font-weight: bold;">Testovacia správa pre reštauráciu</p>
          </div>
          
          <div style="border: 1px solid #ddd; border-top: none; padding: 25px; background-color: #fff;">
            <p style="font-size: 18px; margin-bottom: 20px;">Toto je testovacia správa pre reštauráciu.</p>
            
            <p>Tento test bol vyvolaný z testovacieho endpointu a overuje, že odosielanie notifikácií o objednávkach 
            reštaurácii funguje správne. Ak vidíte túto správu, konfigurácia je v poriadku.</p>
            
            <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0;"><strong>Čas testu:</strong> ${new Date().toLocaleString('sk-SK')}</p>
              <p style="margin: 10px 0 0;"><strong>Test vyvolaný:</strong> ${testCustomer}</p>
              <p style="margin: 10px 0 0;"><strong>Email pre zákazníka:</strong> ${emailTo}</p>
            </div>
          </div>
          
          <div style="background-color: #4a5d23; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px;">
            <p style="margin: 0;">Pizzeria Janíček - Testovanie SMTP</p>
          </div>
        </div>
      `;
      
      // Odoslanie testovacieho emailu zákazníkovi
      console.log(`[TEST] Odosielam testovací email zákazníkovi na ${emailTo}...`);
      let customerEmailResult;
      try {
        customerEmailResult = await emailTransporter.sendMail({
          from: `"Pizzeria Janíček" <pizza.objednavka@gmail.com>`,
          to: emailTo,
          subject: "TEST - Overenie SMTP konfigurácie",
          html: htmlContent,
          priority: "high"
        });
        console.log(`[TEST] Email zákazníkovi úspešne odoslaný: ${customerEmailResult.messageId}`);
      } catch (error) {
        console.error(`[TEST] Chyba pri odosielaní emailu zákazníkovi:`, error);
        return res.status(500).json({ 
          success: false, 
          phase: "customer_email",
          message: `Chyba pri odosielaní emailu zákazníkovi: ${error}` 
        });
      }
      
      // Odoslanie testovacieho emailu reštaurácii
      console.log(`[TEST] Odosielam testovací email reštaurácii...`);
      let restaurantEmailResult;
      try {
        restaurantEmailResult = await emailTransporter.sendMail({
          from: `"Pizzeria Janíček" <pizza.objednavka@gmail.com>`,
          to: 'vlastnawebstranka@gmail.com',
          subject: "TEST - Overenie SMTP konfigurácie reštaurácie",
          html: restaurantHtmlContent,
          priority: "high",
          headers: {
            'X-Priority': '1',
            'X-MSMail-Priority': 'High',
            'Importance': 'high'
          }
        });
        console.log(`[TEST] Email reštaurácii úspešne odoslaný: ${restaurantEmailResult.messageId}`);
      } catch (error) {
        console.error(`[TEST] Chyba pri odosielaní emailu reštaurácii:`, error);
        return res.status(500).json({ 
          success: false, 
          phase: "restaurant_email",
          customerEmail: { success: true, messageId: customerEmailResult.messageId },
          message: `Chyba pri odosielaní emailu reštaurácii: ${error}` 
        });
      }
      
      // Vrátime výsledok testu
      res.json({
        success: true,
        customerEmail: {
          sent: true,
          to: emailTo,
          messageId: customerEmailResult.messageId
        },
        restaurantEmail: {
          sent: true,
          to: "vlastnawebstranka@gmail.com",
          messageId: restaurantEmailResult.messageId
        },
        message: `Testovanie emailov úspešné. Obidva emaily boli odoslané.`
      });
    } catch (error) {
      console.error("[TEST] Nečakaná chyba pri testovaní emailov:", error);
      res.status(500).json({ 
        success: false, 
        message: `Nečakaná chyba pri testovaní emailov: ${error}`,
        error: String(error)
      });
    }
  });
  
  // Nový endpoint pre zobrazenie diagnostickej stránky
  app.get("/status", (req, res) => {
    try {
      // Použijeme import.meta.url pre ES Modules namiesto __dirname
      const currentFilePath = new URL(import.meta.url).pathname;
      const currentDir = path.dirname(currentFilePath);
      const statusHtmlPath = path.join(currentDir, 'status.html');
      
      console.log('Cesta k diagnostickému HTML:', statusHtmlPath);
      
      if (fs.existsSync(statusHtmlPath)) {
        // Načítame HTML súbor a odošleme ho ako odpoveď
        const statusHtml = fs.readFileSync(statusHtmlPath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(statusHtml);
      } else {
        // Skúsime alternatívnu cestu
        const altPath = './server/status.html';
        console.log('Skúšame alternatívnu cestu:', altPath);
        
        if (fs.existsSync(altPath)) {
          const statusHtml = fs.readFileSync(altPath, 'utf8');
          res.setHeader('Content-Type', 'text/html');
          res.send(statusHtml);
        } else {
          res.status(404).send('Diagnostická stránka nebola nájdená. Hľadané cesty: ' + statusHtmlPath + ' a ' + altPath);
        }
      }
    } catch (error) {
      console.error('Chyba pri zobrazení diagnostickej stránky:', error);
      res.status(500).send('Chyba pri zobrazení diagnostickej stránky: ' + error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
