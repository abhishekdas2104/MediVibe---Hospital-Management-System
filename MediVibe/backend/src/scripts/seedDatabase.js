import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Bed from '../models/Bed.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Bed.deleteMany({});
    console.log('[Seed] Cleared existing users and beds');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@medivibe.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
    });

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

    const nurse = await User.create({
      name: 'Nurse Emily Davis',
      email: 'emily.davis@medivibe.com',
      password: 'nurse123',
      role: 'nurse',
      phone: '+1234567893',
    });

    const receptionist = await User.create({
      name: 'John Smith',
      email: 'john.smith@medivibe.com',
      password: 'receptionist123',
      role: 'receptionist',
      phone: '+1234567894',
    });

    console.log('[Seed] Users created ✓');

    // Create beds for each ward
    const wardConfig = [
      { ward: 'General', bedType: 'Standard', count: 5 },
      { ward: 'ICU', bedType: 'ICU Advanced', count: 3 },
      { ward: 'Emergency', bedType: 'Standard', count: 4 },
      { ward: 'Pediatric', bedType: 'Standard', count: 3 },
      { ward: 'Orthopedic', bedType: 'Standard', count: 3 },
      { ward: 'Cardiac', bedType: 'ICU Advanced', count: 2 },
    ];

    let totalBeds = 0;
    for (const config of wardConfig) {
      for (let i = 1; i <= config.count; i++) {
        await Bed.create({
          bedNumber: `${config.ward.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`,
          ward: config.ward,
          bedType: config.bedType,
          status: 'Available',
          dailyRate: 500
        });
        totalBeds++;
      }
    }

    console.log(`[Seed] Created ${totalBeds} beds ✓`);

    console.log(`
╔═══════════════════════════════════════════╗
║   Database Seeded Successfully!           ║
╠═══════════════════════════════════════════╣
║ USERS CREATED:                            ║
║ • Admin: admin@medivibe.com / admin123    ║
║ • Doctor 1: sarah.johnson@medivibe.com    ║
║ • Doctor 2: michael.chen@medivibe.com     ║
║ • Nurse: emily.davis@medivibe.com         ║
║ • Receptionist: john.smith@medivibe.com   ║
║                                           ║
║ BEDS CREATED: ${totalBeds}                     ║
║ • General Ward: 5 beds                    ║
║ • ICU: 3 beds                             ║
║ • Emergency: 4 beds                       ║
║ • Pediatric: 3 beds                       ║
║ • Orthopedic: 3 beds                      ║
║ • Cardiac: 2 beds                         ║
╚═══════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error:', error);
    process.exit(1);
  }
};

seedDatabase();
