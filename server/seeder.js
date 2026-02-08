// billingSeeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/config.js";
import Billing from "./models/BillingModel.js";

dotenv.config();

const seedBills = async () => {
  try {
    await connectDB();

    // -----------------
    // Static Data
    // -----------------
    const addons = [
      { _id: "68e10e8da27d020608c1eeb1", name: "Coca Cola", type: "veg", price: 50 },
      { _id: "68e10ea3a27d020608c1eeb4", name: "Green Salad", type: "veg", price: 30 },
      { _id: "68e10eb1a27d020608c1eeb7", name: "Raita", type: "veg", price: 20 },
    ];

    const variations = [
      { _id: "68e10e36a27d020608c1eea5", name: "Half", extraPrice: 0 },
      { _id: "68e10e4ba27d020608c1eea8", name: "Full", extraPrice: 0 },
      { _id: "68e10e5da27d020608c1eeab", name: "1000 ml", extraPrice: 0 },
      { _id: "68e10e6aa27d020608c1eeae", name: "500 ml", extraPrice: 0 },
    ];

    const menuItems = [
      {
        _id: "68e11265a27d020608c1ef30",
        name: "Bhetki Fish Fry",
        price: 350,
        variations: [],
        addOns: [],
      },
      {
        _id: "68e112fea27d020608c1ef36",
        name: "Chicken Biriyani",
        price: 200,
        variations: [
          { variationId: "68e10e4ba27d020608c1eea8" },
          { variationId: "68e10e36a27d020608c1eea5" },
        ],
        addOns: addons,
      },
      {
        _id: "68e113c6a27d020608c1ef3e",
        name: "Mutton Biriyani",
        price: 300,
        variations: [
          { variationId: "68e10e4ba27d020608c1eea8" },
          { variationId: "68e10e36a27d020608c1eea5" },
        ],
        addOns: addons,
      },
    ];

    const indianNames = [
      "Ravi Kumar", "Sonal Gupta", "Amit Sharma", "Priya Reddy", "Vikram Singh",
      "Anjali Mehta", "Rahul Verma", "Sneha Joshi", "Aditya Nair", "Kavita Patel",
      "Manish Yadav", "Neha Choudhary", "Pooja Kaur", "Suresh Rao", "Divya Iyer",
      "Rajesh Kumar", "Shreya Das", "Karan Malhotra", "Alok Singh", "Anita Kapoor",
    ];

    const orderTypes = ["dine-in", "takeaway", "online"];
    const paymentMethods = ["cash", "card", "upi", "split", "due"];

    // -----------------
    // Generate 50 Bills
    // -----------------
    const bills = [];

    for (let i = 0; i < 50; i++) {
      const customerName = indianNames[i % indianNames.length];
      const customerPhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

      const cartItemsCount = (i % 3) + 1;
      const cart = [];

      for (let j = 0; j < cartItemsCount; j++) {
        const menu = menuItems[(i + j) % menuItems.length];

        // Random variation (always extraPrice 0)
        let variation = null;
        if (menu.variations.length) {
          const varOption = menu.variations[j % menu.variations.length];
          const varData = variations.find(v => v._id === varOption.variationId);
          if (varData) {
            variation = {
              id: varData._id,
              name: varData.name,
              extraPrice: 0,
            };
          }
        }

        // Random addons (0 to all)
        const addonCount = j % (menu.addOns.length + 1);
        const addonsSelected = menu.addOns.slice(0, addonCount).map(a => ({
          id: a._id,
          name: a.name,
          price: a.price,
        }));

        const quantity = (j % 3) + 1;
        const basePrice = menu.price; // variations do not add extraPrice
        const total = (basePrice + addonsSelected.reduce((acc, a) => acc + a.price, 0)) * quantity;

        cart.push({
          itemId: menu._id,
          itemName: menu.name,
          basePrice,
          quantity,
          variation,
          addons: addonsSelected,
          total,
        });
      }

      const totalBill = cart.reduce((acc, c) => acc + c.total, 0);
      const paymentMethod = paymentMethods[i % paymentMethods.length];

      bills.push({
        billingNumber: `BILL-${1000 + i}`,
        cart,
        orderType: orderTypes[i % orderTypes.length],
        customer: { name: customerName, phone: customerPhone },
        paymentMethod,
        payment: { totalPaid: totalBill, due: 0 },
        total: totalBill,
        orderStatus: "paid",
      });
    }

    await Billing.insertMany(bills);
    console.log("✅ 50 Bills seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeder error:", err.message);
    process.exit(1);
  }
};

seedBills();
