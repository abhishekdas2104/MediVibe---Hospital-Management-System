import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users (optional - comment out in production)
    await User.deleteMany({});
    console.log('[Seed] Cleared existing users');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@medivibe.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
    });

    // Create doctor users
    const doctor1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@medivibe.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+1234567891',
      specialization: 'Cardiology',
    });

    const doctor2 = await User.create({
      name: 'Dr. Michael Chen',
      email: 'michael.chen@medivibe.com',
      password: 'doctor123',
      role: 'doctor',
      phone: '+1234567892',
      specialization: 'Emergency Medicine',
    });

    // Create nurse user
    const nurse = await User.create({
      name: 'Nurse Emily Davis',
      email: 'emily.davis@medivibe.com',
      password: 'nurse123',
      role: 'nurse',
      phone: '+1234567893',
    });

    // Create receptionist user
    const receptionist = await User.create({
      name: 'John Smith',
      email: 'john.smith@medivibe.com',
      password: 'receptionist123',
      role: 'receptionist',
      phone: '+1234567894',
    });

    console.log(`
╔═══════════════════════════════════════════╗
║     Database Seeded Successfully          ║
╠═══════════════════════════════════════════╣
║ Users Created:                            ║
║ - Admin: admin@medivibe.com / admin123    ║
║ - Doctor 1: sarah.johnson@medivibe.com    ║
║   Password: doctor123                     ║
║ - Doctor 2: michael.chen@medivibe.com     ║
║   Password: doctor123                     ║
║ - Nurse: emily.davis@medivibe.com         ║
║   Password: nurse123                      ║
║ - Receptionist: john.smith@medivibe.com   ║
║   Password: receptionist123               ║
╚═══════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error:', error);
    process.exit(1);
  }
};

seedUsers();
