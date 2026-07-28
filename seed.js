const mongoose = require('./backend/node_modules/mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// Models
const User = require('./backend/models/User');
const Availability = require('./backend/models/Availability');
const Appointment = require('./backend/models/Appointment');
const Settings = require('./backend/models/Settings');
const Notification = require('./backend/models/Notification');

dotenv.config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/appointment-scheduler';

const seedData = async () => {
  try {
    console.log(`Connecting to database at URI: "${MONGO_URI}"...`);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected successfully. Cleaning database...');

    // Clean tables
    await User.deleteMany();
    await Availability.deleteMany();
    await Appointment.deleteMany();
    await Settings.deleteMany();
    await Notification.deleteMany();

    console.log('Database cleaned. Generating seed elements...');

    // 1. Create Global settings
    const settings = await Settings.create({
      key: 'platform_settings',
      requireProviderApproval: true,
      requireEmailVerification: false,
      allowCustomerRegistration: true,
    });
    console.log('Default settings created.');

    // 2. Create Users
    const plainPassword = 'password123';
    const adminPassword = 'admin@123';

    // Create Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: 'Admin',
      isEmailVerified: true,
      status: 'Approved'
    });

    // Create Coordinator
    const coordinator = await User.create({
      name: 'Emma Coordinator',
      email: 'coordinator@gmail.com',
      password: plainPassword,
      role: 'University Coordinator',
      isEmailVerified: true,
      status: 'Approved'
    });

    // Create Receptionist
    const receptionist = await User.create({
      name: 'Sarah Receptionist',
      email: 'receptionist@gmail.com',
      password: plainPassword,
      role: 'Receptionist',
      isEmailVerified: true,
      status: 'Approved'
    });

    // Create Providers
    const provider1 = await User.create({
      name: 'Dr. Alan Turing',
      email: 'alan@gmail.com',
      password: plainPassword,
      role: 'Provider',
      title: 'Prof.',
      specialization: 'Artificial Intelligence',
      bio: 'Pioneering researcher in computer science, cryptography, and neural systems.',
      isEmailVerified: true,
      status: 'Approved'
    });

    const provider2 = await User.create({
      name: 'Dr. Elizabeth Blackwell',
      email: 'elizabeth@gmail.com',
      password: plainPassword,
      role: 'Provider',
      title: 'Dr.',
      specialization: 'Cardiovascular Surgery',
      bio: 'Renowned cardiologist with 20+ years of operational medicine experience.',
      isEmailVerified: true,
      status: 'Approved'
    });

    // Create Customer
    const customer = await User.create({
      name: 'John Customer',
      email: 'customer@gmail.com',
      password: plainPassword,
      role: 'Customer',
      isEmailVerified: true,
      status: 'Approved'
    });

    console.log('Users created.');

    // 3. Create Provider Availability rules
    const defaultWeeklyHours = [];
    for (let i = 1; i <= 5; i++) {
      defaultWeeklyHours.push({
        dayOfWeek: i,
        slots: [
          { start: '09:00', end: '12:00' },
          { start: '13:00', end: '17:00' },
        ],
        isActive: true,
      });
    }

    await Availability.create({
      provider: provider1._id,
      timezone: 'Asia/Kolkata',
      slotDuration: 30,
      weeklyHours: defaultWeeklyHours,
    });

    await Availability.create({
      provider: provider2._id,
      timezone: 'Asia/Kolkata',
      slotDuration: 30,
      weeklyHours: defaultWeeklyHours,
    });

    console.log('Provider schedules registered.');

    // 4. Create Historical / Sample Appointments (For analytics chart)
    const today = new Date();
    const appts = [];

    // Helper to format date "YYYY-MM-DD"
    const formatDate = (date) => date.toISOString().split('T')[0];

    // Generate appointments for the last 7 days to populate line chart
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = formatDate(date);

      // Add a couple appointments on this day
      appts.push({
        customer: customer._id,
        provider: provider1._id,
        date: dateString,
        timeSlot: { start: '09:30', end: '10:00' },
        status: i === 0 ? 'Pending' : 'Completed',
        reason: `AI Research thesis review for semester check-in on day ${i}`,
        createdAt: date
      });

      appts.push({
        customer: customer._id,
        provider: provider2._id,
        date: dateString,
        timeSlot: { start: '14:00', end: '14:30' },
        status: 'Approved',
        reason: `Heart rate inspection and wellness assessment on day ${i}`,
        createdAt: date
      });
    }

    await Appointment.insertMany(appts);
    console.log(`${appts.length} appointments seeded successfully.`);

    console.log('-------------------------------');
    console.log('Database seeding finished successfully!');
    console.log('Default credentials:');
    console.log('Admin: admin@gmail.com / admin@123');
    console.log('Coordinator: coordinator@gmail.com / password123');
    console.log('Receptionist: receptionist@gmail.com / password123');
    console.log('Provider 1: alan@gmail.com / password123');
    console.log('Provider 2: elizabeth@gmail.com / password123');
    console.log('Customer: customer@gmail.com / password123');
    console.log('-------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
