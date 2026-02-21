const express = require("express");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = 3000;

app.use(express.json());


let menu = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request Body:", req.body);
  }

  next();
};

app.use(requestLogger);

const menuValidation = [
  body("name").isString().isLength({ min: 3 }),
  body("description").isString().isLength({ min: 10 }),
  body("price").isFloat({ gt: 0 }),
  body("category").isIn(["appetizer", "entree", "dessert", "beverage"]),
  body("ingredients").isArray({ min: 1 }),
  body("available").optional().isBoolean()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


app.get("/api/menu", (req, res) => {
  res.status(200).json(menu);
});

// GET one menu item
app.get("/api/menu/:id", (req, res) => {
  const item = menu.find(m => m.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: "Menu item not found" });
  }
  res.status(200).json(item);
});

// POST new menu item
app.post("/api/menu", menuValidation, handleValidationErrors, (req, res) => {
  const newItem = {
    id: menu.length + 1,
    available: true,
    ...req.body
  };
  menu.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/menu/:id", menuValidation, handleValidationErrors, (req, res) => {
  const index = menu.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Menu item not found" });
  }
  menu[index] = { ...menu[index], ...req.body };
  res.status(200).json(menu[index]);
});

app.delete("/api/menu/:id", (req, res) => {
  const index = menu.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Menu item not found" });
  }
  const deleted = menu.splice(index, 1);
  res.status(200).json(deleted[0]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
