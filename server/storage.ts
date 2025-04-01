import { 
  users, type User, type InsertUser,
  pizzas, type Pizza, type InsertPizza,
  extras, type Extra, type InsertExtra,
  orders, type Order, type InsertOrder
} from "@shared/schema";
import fs from 'fs';
import path from 'path';

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pizzaData: Map<number, Pizza>;
  private extraData: Map<number, Extra>;
  private orderData: Map<number, Order>;
  userCurrentId: number;
  pizzaCurrentId: number;
  extraCurrentId: number;
  orderCurrentId: number;

  constructor() {
    this.users = new Map();
    this.pizzaData = new Map();
    this.extraData = new Map();
    this.orderData = new Map();
    this.userCurrentId = 1;
    this.pizzaCurrentId = 1;
    this.extraCurrentId = 1;
    this.orderCurrentId = 1;

    // Initialize with sample data
    this.initializePizzas();
    this.initializeExtras();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Pizza operations
  async getAllPizzas(): Promise<Pizza[]> {
    return Array.from(this.pizzaData.values());
  }

  async getPizzaById(id: number): Promise<Pizza | undefined> {
    return this.pizzaData.get(id);
  }

  async createPizza(insertPizza: InsertPizza): Promise<Pizza> {
    const id = this.pizzaCurrentId++;
    // Zaistíme, že weight a allergens sú správne typované ako string | null
    const pizza: Pizza = { 
      ...insertPizza, 
      id,
      weight: insertPizza.weight || null,
      allergens: insertPizza.allergens || null 
    };
    this.pizzaData.set(id, pizza);
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
    const id = this.extraCurrentId++;
    const extra: Extra = { ...insertExtra, id };
    this.extraData.set(id, extra);
    return extra;
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const now = new Date().toISOString();
    
    // Create a properly typed order object
    const order: Order = {
      id,
      customerName: insertOrder.customerName,
      customerEmail: insertOrder.customerEmail,
      customerPhone: insertOrder.customerPhone,
      deliveryAddress: insertOrder.deliveryAddress,
      deliveryCity: insertOrder.deliveryCity,
      deliveryPostalCode: insertOrder.deliveryPostalCode,
      notes: insertOrder.notes ?? null, // Ensure notes is string | null
      items: insertOrder.items,
      totalAmount: insertOrder.totalAmount,
      status: 'pending',
      createdAt: now
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

  // Initialize sample data
  private initializePizzas() {
    try {
      // Načítaj pizze z JSON súboru
      const pizzasFilePath = path.join(process.cwd(), 'pizzas-new.json');
      
      if (fs.existsSync(pizzasFilePath)) {
        console.log('Načítavam pizze z aktualizovaného súboru pizzas-new.json');
        const pizzasData = JSON.parse(fs.readFileSync(pizzasFilePath, 'utf-8'));
        
        // Konvertujeme načítané dáta na InsertPizza[]
        const pizzasToInsert: InsertPizza[] = pizzasData.map((pizza: any) => ({
          name: pizza.name,
          description: pizza.description,
          price: pizza.price,
          image: pizza.image,
          tags: pizza.tags || ["Klasické"],
          ingredients: pizza.ingredients,
          weight: pizza.weight || null,
          allergens: pizza.allergens || null
        }));
        
        pizzasToInsert.forEach((pizza) => {
          this.createPizza(pizza);
        });
        
        console.log(`Načítaných ${pizzasToInsert.length} pizz z pizzas-new.json`);
        return;
      }
    } catch (error) {
      console.error('Chyba pri načítaní pizz z JSON súboru:', error);
      console.log('Použijeme predvolené dáta pizz...');
    }
    
    // Fallback - predvolené pizze, ak sa nepodarí načítať z JSON súboru
    const samplePizzas: InsertPizza[] = [
      {
        name: "Margherita",
        description: "Paradajková omáčka, mozzarella, bazalka, extra panenský olivový olej",
        price: 8.90,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Vegetariánske", "Klasické"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Bazalka", "Olivový olej"]
      },
      {
        name: "Šunková",
        description: "Paradajková omáčka, mozzarella, šunka",
        price: 6.10,
        image: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Klasické"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Šunka"]
      },
      {
        name: "Funghi",
        description: "Paradajková omáčka, mozzarella, šampiňóny, parmezán",
        price: 9.90,
        image: "https://images.unsplash.com/photo-1542587222-f9172e5eba29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Vegetariánske"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Šampiňóny", "Parmezán"]
      }
    ];

    samplePizzas.forEach((pizza) => {
      this.createPizza(pizza);
    });
  }

  private initializeExtras() {
    const sampleExtras: InsertExtra[] = [
      // Skupina: Syry
      { name: "Mozzarella", price: 1.20 },
      { name: "Parmezán", price: 1.00 },
      { name: "Niva", price: 1.20 },
      { name: "Bryndza", price: 1.20 },
      { name: "Balkánsky syr", price: 1.00 },
      
      // Skupina: Zelenina
      { name: "Kukurica", price: 0.80 },
      { name: "Cibuľa", price: 0.60 },
      { name: "Rukola", price: 1.00 },
      { name: "Feferóny", price: 0.80 },
      { name: "Olivy", price: 1.00 },
      { name: "Paprika", price: 0.80 },
      { name: "Cherry paradajky", price: 1.00 },
      { name: "Baranie rohy", price: 0.80 },
      
      // Skupina: Mäso a ryby
      { name: "Šunka", price: 1.20 },
      { name: "Slanina", price: 1.20 },
      { name: "Klobása", price: 1.20 },
      { name: "Saláma", price: 1.20 },
      { name: "Pršut", price: 1.50 },
      { name: "Tuniak", price: 1.50 },
      { name: "Ančovičky", price: 1.50 },
      
      // Skupina: Špeciality
      { name: "Volské oko", price: 1.00 },
      { name: "Vajce", price: 0.80 },
      { name: "Artičoky", price: 1.00 },
      { name: "Cesnak", price: 0.50 },
      { name: "Huby", price: 1.00 }
    ];

    sampleExtras.forEach((extra) => {
      this.createExtra(extra);
    });
  }
}

export const storage = new MemStorage();
