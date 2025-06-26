import fs from 'fs';
import path from 'path';
import { 
  users, pizzas, extras, orders,
  type User, type Pizza, type Extra, type Order,
  type InsertUser, type InsertPizza, type InsertExtra, type InsertOrder
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Pizza operations
  getAllPizzas(): Promise<Pizza[]>;
  getPizzaById(id: number): Promise<Pizza | undefined>;
  createPizza(pizza: InsertPizza): Promise<Pizza>;

  // Extras operations
  getAllExtras(): Promise<Extra[]>;
  getExtraById(id: number): Promise<Extra | undefined>;
  createExtra(extra: InsertExtra): Promise<Extra>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  private pizzaData: Map<number, Pizza> = new Map();
  private extraData: Map<number, Extra> = new Map();
  private userCounter: { value: number } = { value: 1 };
  private pizzaCounter: { value: number } = { value: 1 };
  private extraCounter: { value: number } = { value: 1 };

  constructor() {
    this.initializePizzas();
    this.initializeExtras();
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      if (db) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || undefined;
      }
    } catch (error) {
      console.error('Chyba pri získavaní používateľa:', error);
    }
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      if (db) {
        const [user] = await db.select().from(users).where(eq(users.username, username));
        return user || undefined;
      }
    } catch (error) {
      console.error('Chyba pri hľadaní používateľa:', error);
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      if (db) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
    } catch (error) {
      console.error('Chyba pri vytváraní používateľa:', error);
    }
    
    // Fallback for in-memory storage
    const user: User = { 
      ...insertUser, 
      id: this.userCounter.value++,
      createdAt: new Date()
    };
    return user;
  }

  async getAllPizzas(): Promise<Pizza[]> {
    return Array.from(this.pizzaData.values());
  }

  async getPizzaById(id: number): Promise<Pizza | undefined> {
    return this.pizzaData.get(id);
  }

  async createPizza(insertPizza: InsertPizza): Promise<Pizza> {
    const pizza: Pizza = { 
      ...insertPizza, 
      id: this.pizzaCounter.value++
    };
    this.pizzaData.set(pizza.id, pizza);
    return pizza;
  }

  async getAllExtras(): Promise<Extra[]> {
    return Array.from(this.extraData.values());
  }

  async getExtraById(id: number): Promise<Extra | undefined> {
    return this.extraData.get(id);
  }

  async createExtra(insertExtra: InsertExtra): Promise<Extra> {
    const extra: Extra = { ...insertExtra, id: this.extraCounter.value++ };
    this.extraData.set(extra.id, extra);
    return extra;
  }

  private orderData: Map<number, Order> = new Map();
  private orderCounter: { value: number } = { value: 1 };

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    try {
      if (db) {
        const orderData = {
          ...insertOrder,
          items: JSON.stringify(insertOrder.items)
        };
        const [order] = await db.insert(orders).values(orderData).returning();
        const order: Order = { ...orderData, id };
        this.orderData.set(order.id, order);
        return order;
      }
    } catch (error) {
      console.error('Chyba pri vytváraní objednávky v databáze:', error);
    }

    // Fallback for in-memory storage
    const id = this.orderCounter.value++;
    const order: Order = {
      ...insertOrder,
      id,
      status: 'pending',
      createdAt: new Date()
    };
    this.orderData.set(id, order);
    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orderData.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orderData.values());
  }

  private initializePizzas() {
    // Definujeme všetky možné cesty k JSON súboru
    const possiblePaths = [
      path.join(__dirname, '../client/src/data/pizzas.json'),
      path.join(process.cwd(), 'client/src/data/pizzas.json'),
      path.join(__dirname, '../../client/src/data/pizzas.json')
    ];
    
    for (const pizzasFilePath of possiblePaths) {
      try {
        if (fs.existsSync(pizzasFilePath)) {
          console.log(`✅ Načítavam pizze z ${pizzasFilePath}`);
          const pizzasData = JSON.parse(fs.readFileSync(pizzasFilePath, 'utf-8'));
          
          this.pizzaData.clear();
          
          pizzasData.forEach((pizza: any) => {
            const normalizedPizza: Pizza = {
              id: pizza.id,
              name: pizza.name,
              description: pizza.description,
              price: pizza.price,
              image: pizza.image,
              tags: pizza.tags || ["Klasické"],
              ingredients: pizza.ingredients,
              weight: pizza.weight || null,
              allergens: pizza.allergens || null
            };
            
            this.pizzaData.set(normalizedPizza.id, normalizedPizza);
            this.pizzaCounter.value = Math.max(this.pizzaCounter.value, normalizedPizza.id + 1);
          });
          
          console.log(`✅ Úspešne načítaných ${pizzasData.length} pizz z aktualizovaného súboru`);
          console.log(`✅ Prvé tri pizze: ${pizzasData.slice(0, 3).map((p: any) => p.name).join(', ')}`);
          return;
        }
      } catch (error) {
        console.error(`❌ Chyba pri načítaní pizz z ${pizzasFilePath}:`, error);
        continue;
      }
    }
    
    console.log('⚠️ Žiadny JSON súbor s pizzami sa nenašiel, používam záložné dáta');
    const fallbackPizza: Pizza = {
      id: 1,
      name: "Margherita",
      description: "Paradajková drť, bazalka, mozzarella", 
      price: 6.50,
      image: "/images/pizzas/margherita.jpg",
      tags: ["Vegetariánske", "Klasické"],
      ingredients: ["Paradajková drť", "Bazalka", "Mozzarella"],
      weight: "450g",
      allergens: "1,7"
    };
    
    this.pizzaData.set(1, fallbackPizza);
  }

  private initializeExtras() {
    const sampleExtras: InsertExtra[] = [
      // Skupina: Syry
      { name: "Mozzarella", price: 0.60 },
      { name: "Gorgonzola", price: 1.20 },
      { name: "Parmezán", price: 1.20 },
      { name: "Niva", price: 0.70 },
      
      // Skupina: Mäso
      { name: "Šunka", price: 1.60 },
      { name: "Štipľavá saláma", price: 1.60 },
      { name: "Slanina", price: 1.60 },
      { name: "Kuracie mäso", price: 1.60 },
      
      // Skupina: Zelenina
      { name: "Cibuľa", price: 0.30 },
      { name: "Šampiňóny", price: 0.50 },
      { name: "Kukurica", price: 0.50 },
      { name: "Rukola", price: 0.40 },
      
      // Skupina: Iné
      { name: "Olivy", price: 0.50 },
      { name: "Cesnak", price: 0.20 },
      { name: "Chilli", price: 0.20 },
      { name: "Ananás", price: 0.60 }
    ];

    sampleExtras.forEach((extra) => {
      this.createExtra(extra);
    });
  }
}

export const storage = new DatabaseStorage();