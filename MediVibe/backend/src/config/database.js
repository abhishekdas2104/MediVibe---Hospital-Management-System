import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medivibe');

    console.log(`
╔═══════════════════════════════════════════╗
║     MongoDB Connected Successfully        ║
╠═══════════════════════════════════════════╣
║ Host: ${conn.connection.host}
║ Database: ${conn.connection.name}
║ Port: ${conn.connection.port}
╚═══════════════════════════════════════════╝
    `);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
