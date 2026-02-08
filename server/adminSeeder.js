import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../server/models/UserModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect("mongodb+srv://devrounaknatta_db_user:RounakKitchenDiaries@kitchendiariesfinal.ndphrvy.mongodb.net/?appName=KitchenDiariesFinal");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      firstName: "System",
      lastName: "Admin",
      email: "admin@gmail.com",
      phone: "9999999999",
      password: "Admin@123", // will be hashed by pre-save hook
      role: "admin",
      isVerified: true,
      isActive: true,
      permissions: [
        "USER_MANAGE",
        "ROLE_MANAGE",
        "SYSTEM_SETTINGS",
        "VIEW_REPORTS",
      ],
      preferences: {
        theme: "dark",
        language: "en",
      },
      loginHistory: [],
      offlineSyncStatus: "online",
    });

    console.log("🚀 Admin seeded successfully:", admin.email);
    process.exit();
  } catch (error) {
    console.error("❌ Admin seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin();
