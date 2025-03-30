import { 
  users, type User, type InsertUser,
  pizzas, type Pizza, type InsertPizza,
  extras, type Extra, type InsertExtra,
  orders, type Order, type InsertOrder
} from "@shared/schema";

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
    const pizza: Pizza = { ...insertPizza, id };
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
        name: "Diavola",
        description: "Paradajková omáčka, mozzarella, pikantná saláma, feferóny, oregano",
        price: 10.90,
        image: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Pikantné", "Klasické"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Pikantná saláma", "Feferóny", "Oregano"]
      },
      {
        name: "Quattro Formaggi",
        description: "Smotanový základ, mozzarella, gorgonzola, parmezán, ementál, čerstvé bylinky",
        price: 11.90,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Vegetariánske", "Špeciality"],
        ingredients: ["Smotanový základ", "Mozzarella", "Gorgonzola", "Parmezán", "Ementál", "Čerstvé bylinky"]
      },
      {
        name: "Capricciosa",
        description: "Paradajková omáčka, mozzarella, šunka, artičoky, olivy, huby",
        price: 10.50,
        image: "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Klasické"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Šunka", "Artičoky", "Olivy", "Huby"]
      },
      {
        name: "Prosciutto",
        description: "Paradajková omáčka, mozzarella, prosciutto crudo, rukola, cherry paradajky, parmezán",
        price: 12.90,
        image: "https://images.unsplash.com/photo-1581873372796-635b67ca2008?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Špeciality"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Prosciutto crudo", "Rukola", "Cherry paradajky", "Parmezán"]
      },
      {
        name: "Funghi",
        description: "Paradajková omáčka, mozzarella, šampiňóny, portobello huby, parmezán, petržlenová vňať",
        price: 9.90,
        image: "https://images.unsplash.com/photo-1542587222-f9172e5eba29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Vegetariánske"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Šampiňóny", "Portobello huby", "Parmezán", "Petržlenová vňať"]
      },
      {
        name: "Hawai",
        description: "Paradajková omáčka, mozzarella, šunka, ananás",
        price: 9.90,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Sladké", "Klasické"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Šunka", "Ananás"]
      },
      {
        name: "Tonno",
        description: "Paradajková omáčka, mozzarella, tuniak, červená cibuľa, kapary, oregano",
        price: 11.40,
        image: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Ryby", "Klasické"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Tuniak", "Červená cibuľa", "Kapary", "Oregano"]
      },
      {
        name: "Vegetariana",
        description: "Paradajková omáčka, mozzarella, cuketa, baklažán, paprika, cherry paradajky, rukola",
        price: 10.40,
        image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Vegetariánske", "Špeciality"],
        ingredients: ["Paradajková omáčka", "Mozzarella", "Grilovaná cuketa", "Grilovaný baklažán", "Paprika", "Cherry paradajky", "Rukola"]
      },
      {
        name: "Calzone",
        description: "Prekladaná pizza s paradajkovou omáčkou, ricottou, mozzarellou, šunkou a hubami",
        price: 11.90,
        image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d1c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Špeciality"],
        ingredients: ["Paradajková omáčka", "Ricotta", "Mozzarella", "Šunka", "Huby"]
      },
      {
        name: "Bufala",
        description: "Paradajková omáčka, mozzarella di bufala, čerstvé paradajky, bazalka, extra panenský olivový olej",
        price: 13.90,
        image: "https://images.unsplash.com/photo-1620374643809-b69c702d0ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
        tags: ["Prémiové", "Vegetariánske"],
        ingredients: ["Paradajková omáčka", "Mozzarella di bufala", "Čerstvé paradajky", "Bazalka", "Extra panenský olivový olej"]
      }
    ];

    samplePizzas.forEach((pizza) => {
      this.createPizza(pizza);
    });
  }

  private initializeExtras() {
    const sampleExtras: InsertExtra[] = [
      { name: "Parmezán", price: 1.00 },
      { name: "Rukola", price: 1.00 },
      { name: "Pršut", price: 1.50 },
      { name: "Huby", price: 1.00 },
      { name: "Olivy", price: 1.00 },
      { name: "Artičoky", price: 1.00 },
      { name: "Extra mozzarella", price: 1.50 },
      { name: "Feferóny", price: 0.80 },
      { name: "Slanina", price: 1.20 },
      { name: "Kukurica", price: 0.80 },
      { name: "Ančovičky", price: 1.50 },
      { name: "Volské oko", price: 1.00 }
    ];

    sampleExtras.forEach((extra) => {
      this.createExtra(extra);
    });
  }
}

export const storage = new MemStorage();
