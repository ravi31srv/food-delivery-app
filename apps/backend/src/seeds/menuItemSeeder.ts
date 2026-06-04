import { MenuItem } from '../models/menuItem.js'; // Adjust path to your model

const sampleItems = [
  {
    name: "Classic Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas, served with tamarind chutney.",
    price: 4.50,
    imageUrl: "https://example.com/images/samosa.jpg",
    isAvailable: true,
  },
  {
    name: "Masala Chai",
    description: "Traditional spiced tea brewed with ginger, cardamom, and milk.",
    price: 2.99,
    imageUrl: "https://example.com/images/chai.jpg",
    isAvailable: true,
  },
  {
    name: "Vegetable Pakora",
    description: "Deep-fried fritters made with gram flour and assorted vegetables.",
    price: 5.50,
    imageUrl: "https://example.com/images/pakora.jpg",
    isAvailable: true,
  },
  {
    name: "Mango Lassi",
    description: "Creamy yogurt-based drink blended with sweet mango pulp.",
    price: 3.99,
    imageUrl: "https://example.com/images/lassi.jpg",
    isAvailable: false, // Useful for testing "Out of Stock" UI
  }
];

export const seedDatabase = async () => {
  try {
    // Check if data already exists to prevent duplicates on every restart
    const count = await MenuItem.countDocuments();
    
    if (count === 0) {
      console.log("🌱 Database is empty. Seeding sample items...");
      await MenuItem.insertMany(sampleItems);
      console.log("✅ Successfully seeded items.");
    }else{
        console.log("⚠️  Database already has items. Skipping seeding.");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};