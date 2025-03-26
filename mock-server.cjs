const http = require('http');

const drinks = [
  {
    "name": "Peppermint Mocha",
    "description": "Espresso with chocolate, peppermint syrup, and whipped cream",
    "price": 4.5,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 1,
    "is_active": 0
  },
  {
    "name": "Eggnog Latte",
    "description": "Rich eggnog mixed with espresso and steamed milk",
    "price": 4.75,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 1,
    "is_active": 0
  },
  {
    "name": "Gingerbread Latte",
    "description": "Espresso with gingerbread syrup and steamed milk",
    "price": 4.6,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 1,
    "is_active": 0
  },
  {
    "name": "Toasted White Chocolate Mocha",
    "description": "White chocolate and caramelized sugar with espresso",
    "price": 4.8,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 1,
    "is_active": 0
  },
  {
    "name": "Caramel Brulee Latte",
    "description": "Espresso with caramel brulee sauce and milk",
    "price": 4.85,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 1,
    "is_active": 0
  },
  {
    "name": "Chestnut Praline Latte",
    "description": "Espresso with caramelized chestnut and spices",
    "price": 4.75,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 1,
    "is_active": 0
  },
  {
    "name": "Pumpkin Spice Latte",
    "description": "Espresso with pumpkin spice syrup and steamed milk",
    "price": 4.75,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 2,
    "is_active": 0
  },
  {
    "name": "Witch’s Brew Frappuccino",
    "description": "Blended drink with green matcha and berry syrup",
    "price": 5.0,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 2,
    "is_active": 0
  },
  {
    "name": "Spooky Black Mocha",
    "description": "Dark chocolate mocha with spooky Halloween theme",
    "price": 4.9,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 2,
    "is_active": 0
  },
  {
    "name": "Candy Corn Latte",
    "description": "Espresso with sweet candy corn flavoring",
    "price": 4.6,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 2,
    "is_active": 0
  },
  {
    "name": "Blood Orange Cold Brew",
    "description": "Cold brew coffee with tangy blood orange syrup",
    "price": 4.5,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 2,
    "is_active": 0
  },
  {
    "name": "Pumpkin Cream Cold Brew",
    "description": "Cold brew coffee topped with pumpkin-flavored foam",
    "price": 4.65,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 2,
    "is_active": 0
  },
  {
    "name": "Iced Coconut Mocha",
    "description": "Chilled espresso with coconut milk and chocolate",
    "price": 4.75,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 3,
    "is_active": 0
  },
  {
    "name": "Mango Dragonfruit Refresher",
    "description": "Tropical mango and dragonfruit iced drink",
    "price": 4.5,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 3,
    "is_active": 0
  },
  {
    "name": "Frozen Pineapple Lemonade",
    "description": "Frozen lemonade with pineapple syrup",
    "price": 4.3,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 3,
    "is_active": 0
  },
  {
    "name": "Berry Hibiscus Iced Tea",
    "description": "Iced tea infused with berry hibiscus flavors",
    "price": 3.95,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 3,
    "is_active": 0
  },
  {
    "name": "Caramel Ribbon Crunch Frappuccino",
    "description": "Blended caramel drink with crunchy toppings",
    "price": 5.25,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 3,
    "is_active": 0
  },
  {
    "name": "Pink Drink",
    "description": "Strawberry Acai Refresher with coconut milk",
    "price": 4.4,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 3,
    "is_active": 0
  },
  {
    "name": "Hot Maple Latte",
    "description": "Espresso with rich maple syrup and steamed milk",
    "price": 4.7,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 4,
    "is_active": 0
  },
  {
    "name": "Vanilla Cardamom Mocha",
    "description": "Espresso with vanilla, cardamom, and chocolate",
    "price": 4.8,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 4,
    "is_active": 0
  },
  {
    "name": "Irish Cream Cold Brew",
    "description": "Cold brew coffee with Irish cream syrup",
    "price": 4.9,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 4,
    "is_active": 0
  },
  {
    "name": "Cinnamon Dolce Latte",
    "description": "Espresso with cinnamon dolce syrup and steamed milk",
    "price": 4.75,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 4,
    "is_active": 0
  },
  {
    "name": "Winter Spice Chai",
    "description": "Chai tea latte infused with warm winter spices",
    "price": 4.5,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 4,
    "is_active": 0
  },
  {
    "name": "Hazelnut Praline Mocha",
    "description": "Espresso with hazelnut and praline flavors",
    "price": 4.85,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 4,
    "is_active": 0
  },
  {
    "name": "Cherry Blossom Latte",
    "description": "Espresso with cherry blossom-infused syrup",
    "price": 4.6,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 5,
    "is_active": 0
  },
  {
    "name": "Lavender Honey Latte",
    "description": "Espresso with floral lavender and honey",
    "price": 4.75,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 5,
    "is_active": 0
  },
  {
    "name": "Strawberry Matcha Latte",
    "description": "Matcha green tea with strawberry-infused milk",
    "price": 4.5,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 5,
    "is_active": 0
  },
  {
    "name": "Peach Green Tea Lemonade",
    "description": "Iced green tea with peach and lemonade",
    "price": 4.2,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 5,
    "is_active": 0
  },
  {
    "name": "Rose Vanilla Macchiato",
    "description": "Vanilla macchiato with rose syrup",
    "price": 4.7,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 5,
    "is_active": 0
  },
  {
    "name": "Iced Honey Almond Flat White",
    "description": "Flat white with almond milk and honey",
    "price": 4.55,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 5,
    "is_active": 0
  },
  {
    "name": "Salted Caramel Mocha",
    "description": "Espresso with chocolate and salted caramel topping",
    "price": 4.85,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 6,
    "is_active": 0
  },
  {
    "name": "Maple Pecan Latte",
    "description": "Espresso with maple syrup and nutty pecan flavors",
    "price": 4.8,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 6,
    "is_active": 0
  },
  {
    "name": "Spiced Apple Chai",
    "description": "Chai tea infused with spiced apple flavors",
    "price": 4.5,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 6,
    "is_active": 0
  },
  {
    "name": "Brown Sugar Oat Latte",
    "description": "Espresso with oat milk and brown sugar syrup",
    "price": 4.65,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 6,
    "is_active": 0
  },
  {
    "name": "Caramel Apple Cider",
    "description": "Hot apple cider with caramel syrup",
    "price": 4.4,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 6,
    "is_active": 0
  },
  {
    "name": "Pumpkin Cream Nitro Cold Brew",
    "description": "Nitro cold brew topped with pumpkin-flavored foam",
    "price": 4.95,
    "category": "seasonal",
    "stock_status": 1,
    "is_default": 0,
    "template_id": 6,
    "is_active": 0
  }
];


const server = http.createServer((req, res) => {
  if (req.url === '/api/drinks' && req.method === 'GET') {
    // ✅ CORS headers go here
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(drinks));
  } else {
    res.writeHead(404, {
      'Access-Control-Allow-Origin': '*'
    });
    res.end();
  }
});

server.listen(3001, () => {
  console.log('🚀 Mock server running on http://localhost:3001/api/drinks');
});