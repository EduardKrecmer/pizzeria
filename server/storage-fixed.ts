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
  private orderData: Map<number, Order> = new Map();
  private userCounter: { value: number } = { value: 1 };
  private pizzaCounter: { value: number } = { value: 1 };
  private extraCounter: { value: number } = { value: 1 };
  private orderCounter: { value: number } = { value: 1 };

  constructor() {
    console.log('🍕 Inicializujem DatabaseStorage...');
    this.loadPizzasFromJson();
    this.initializeExtras();
  }

  private loadPizzasFromJson() {
    console.log('🔍 Načítavam pizze z JSON súboru...');
    
    // Skúsime všetky možné cesty
    const paths = [
      path.join(process.cwd(), 'client/src/data/pizzas.json'),
      path.join(__dirname, '../client/src/data/pizzas.json'),
      path.join(__dirname, '../../client/src/data/pizzas.json'),
      'client/src/data/pizzas.json'
    ];
    
    for (const filePath of paths) {
      try {
        console.log(`🔍 Skúšam cestu: ${filePath}`);
        if (fs.existsSync(filePath)) {
          console.log(`✅ Súbor nájdený na: ${filePath}`);
          
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const pizzasData = JSON.parse(fileContent);
          
          console.log(`📊 Načítaných ${pizzasData.length} pizz z JSON`);
          
          // Vyčistíme mapu a načítame nové dáta
          this.pizzaData.clear();
          
          pizzasData.forEach((pizzaJson: any, index: number) => {
            const pizza: Pizza = {
              id: pizzaJson.id || (index + 1),
              name: pizzaJson.name,
              description: pizzaJson.description,
              price: pizzaJson.price,
              image: pizzaJson.image,
              tags: pizzaJson.tags || ["Klasické"],
              ingredients: Array.isArray(pizzaJson.ingredients) ? pizzaJson.ingredients : [],
              weight: pizzaJson.weight || null,
              allergens: pizzaJson.allergens || null
            };
            
            this.pizzaData.set(pizza.id, pizza);
            this.pizzaCounter.value = Math.max(this.pizzaCounter.value, pizza.id + 1);
          });
          
          console.log(`✅ Úspešne načítaných ${this.pizzaData.size} pizz`);
          console.log(`📝 Prvé 5 pizz: ${Array.from(this.pizzaData.values()).slice(0, 5).map(p => p.name).join(', ')}`);
          return; // Úspešne načítané, ukončíme
        }
      } catch (error) {
        console.error(`❌ Chyba pri načítaní z ${filePath}:`, error);
        continue;
      }
    }
    
    // Ak sa žiadny súbor nenašiel, použijeme základné dáta
    console.log('⚠️ Žiadny JSON súbor sa nenašiel, načítavam základné pizze');
    this.loadDefaultPizzas();
  }

  private loadDefaultPizzas() {
    console.log('📦 Načítavam základné pizze...');
    
    const defaultPizzas = [
      {
        id: 1,
        name: "Syrová",
        description: "Paradajková drť, bazalka, mozzarella",
        price: 5.10,
        image: "/images/pizzas/margherita.jpg",
        tags: ["Vegetariánske", "Klasické"],
        ingredients: ["Paradajková drť", "Bazalka", "Mozzarella"],
        weight: "450g",
        allergens: "1,7"
      },
      {
        id: 2,
        name: "Šunková",
        description: "Paradajková drť, bazalka, mozzarella, šunka",
        price: 6.10,
        image: "/images/pizzas/sunka.jpg",
        tags: ["Klasické"],
        ingredients: ["Paradajková drť", "Bazalka", "Mozzarella", "Šunka"],
        weight: "500g",
        allergens: "1,7"
      }
    ];
    
    defaultPizzas.forEach(pizza => {
      this.pizzaData.set(pizza.id, pizza);
    });
    
    console.log(`✅ Načítaných ${defaultPizzas.length} základných pizz`);
  }

  // User operations
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
    
    const user: User = { 
      ...insertUser, 
      id: this.userCounter.value++,
      createdAt: new Date()
    };
    return user;
  }

  // Pizza operations
  async getAllPizzas(): Promise<Pizza[]> {
    const result = Array.from(this.pizzaData.values());
    console.log(`🍕 Vraciam ${result.length} pizz z storage`);
    return result;
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

  // Extras operations
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

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    try {
      if (db) {
        const orderData = {
          ...insertOrder,
          items: JSON.stringify(insertOrder.items)
        };
        const [order] = await db.insert(orders).values(orderData).returning();
        return order;
      }
    } catch (error) {
      console.error('Chyba pri vytváraní objednávky v databáze:', error);
    }

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

  private initializeExtras() {
    const sampleExtras: InsertExtra[] = [
      { name: "Mozzarella", price: 0.60 },
      { name: "Gorgonzola", price: 1.20 },
      { name: "Parmezán", price: 1.20 },
      { name: "Niva", price: 0.70 },
      { name: "Šunka", price: 1.60 },
      { name: "Štipľavá saláma", price: 1.60 },
      { name: "Slanina", price: 1.60 },
      { name: "Kuracie mäso", price: 1.60 },
      { name: "Cibuľa", price: 0.30 },
      { name: "Šampiňóny", price: 0.50 },
      { name: "Kukurica", price: 0.50 },
      { name: "Rukola", price: 0.40 },
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