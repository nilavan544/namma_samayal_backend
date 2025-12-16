import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: "admin@test.com" });
    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      console.log("Email: admin@test.com");
      console.log("Password: admin123");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@test.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
