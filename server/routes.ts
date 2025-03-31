import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { initializeEmailTransporter, sendOrderConfirmationEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Inicializácia emailového transportera pri štarte servera
  try {
    await initializeEmailTransporter();
    console.log("Email transporter initialized successfully");
  } catch (error) {
    console.error("Failed to initialize email transporter:", error);
  }

  // Get all pizzas
  app.get("/api/pizzas", async (req, res) => {
    try {
      const pizzas = await storage.getAllPizzas();
      res.json(pizzas);
    } catch (error) {
      console.error("Error fetching pizzas:", error);
      res.status(500).json({ message: "Error fetching pizzas" });
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

  // Create order & send confirmation email
  app.post("/api/orders", async (req, res) => {
    try {
      const parseResult = insertOrderSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Vytvorenie objednávky v databáze
      const order = await storage.createOrder(parseResult.data);
      
      // Odoslanie potvrdzovacieho emailu (asynchrónne, nečakáme na dokončenie)
      if (order.customerEmail) {
        sendOrderConfirmationEmail(order)
          .then(success => {
            if (success) {
              console.log(`Confirmation email sent to ${order.customerEmail} for order #${order.id}`);
            } else {
              console.warn(`Failed to send confirmation email for order #${order.id}`);
            }
          })
          .catch(error => {
            console.error(`Error sending confirmation email for order #${order.id}:`, error);
          });
      } else {
        console.log(`No email provided for order #${order.id}, skipping confirmation email`);
      }
      
      // Okamžitá odpoveď klientovi (nemusí čakať na odoslanie emailu)
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
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

  // Test route pre overenie emailového odosielania
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
        res.json({ message: "Test email sent successfully. Check logs for details." });
      } else {
        res.status(500).json({ message: "Failed to send test email" });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ message: "Error sending test email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
