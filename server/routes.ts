import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const parseResult = insertOrderSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        const errorMessage = fromZodError(parseResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const order = await storage.createOrder(parseResult.data);
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

  const httpServer = createServer(app);
  return httpServer;
}
