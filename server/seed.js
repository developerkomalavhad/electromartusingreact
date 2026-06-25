const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const products = [
  {
    name: "HP Pavilion 15",
    category: "Laptop",
    price: 59999,
    rating: 4.6,
    stock: 12,
    image: "hp",
    badge: "Best seller",
    featured: true,
    description: "A dependable performance laptop for study, office, and daily multitasking.",
  },
  {
    name: "iPhone 16",
    category: "Mobile",
    price: 79900,
    rating: 4.8,
    stock: 8,
    image: "iphone",
    badge: "New",
    featured: true,
    description: "A premium phone with a bright display, strong cameras, and fast performance.",
  },
  {
    name: "Dell Inspiron 14",
    category: "Laptop",
    price: 52999,
    rating: 4.4,
    stock: 10,
    image: "dell",
    badge: "Value pick",
    featured: true,
    description: "Compact, practical, and ready for work from anywhere.",
  },
  {
    name: "Lenovo IdeaPad Slim",
    category: "Laptop",
    price: 46999,
    rating: 4.3,
    stock: 15,
    image: "lenovo",
    badge: "Student choice",
    description: "Lightweight laptop with all-day comfort for classes and projects.",
  },
  {
    name: "Samsung Galaxy S Series",
    category: "Mobile",
    price: 64999,
    rating: 4.7,
    stock: 9,
    image: "samsung",
    badge: "Top rated",
    featured: true,
    description: "Smooth display, reliable battery, and versatile photography.",
  },
  {
    name: "Vivo V Series",
    category: "Mobile",
    price: 28999,
    rating: 4.2,
    stock: 18,
    image: "vivo",
    badge: "Budget star",
    description: "Stylish everyday phone with quick charging and crisp selfies.",
  },
];

async function seedDatabase() {
  const adminEmail = "admin@electromart.test";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: "ElectroMart Admin",
      email: adminEmail,
      password: await bcrypt.hash("admin123", 10),
      role: "Admin",
      status: "Active",
    });
  }

  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(products);
  }

  if ((await Order.countDocuments()) === 0) {
    const customer = await User.findOne({ email: "customer@electromart.test" });
    const savedCustomer =
      customer ||
      (await User.create({
        name: "Sample Customer",
        email: "customer@electromart.test",
        password: await bcrypt.hash("customer123", 10),
        role: "Customer",
        status: "Active",
      }));

    await Order.create([
      {
        customer: savedCustomer.name,
        email: savedCustomer.email,
        payment: "UPI",
        status: "Packed",
        total: 79900,
        itemCount: 1,
        user: savedCustomer._id,
        items: [{ name: "iPhone 16", price: 79900, quantity: 1 }],
      },
      {
        customer: "Aarav Sharma",
        email: "aarav@example.com",
        payment: "Card",
        status: "Delivered",
        total: 112998,
        itemCount: 2,
        items: [{ name: "HP Pavilion 15", price: 59999, quantity: 1 }],
      },
    ]);
  }
}

module.exports = seedDatabase;
