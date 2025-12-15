const { connectDB } = require('./config/database');
const User = require('./models/UserSQL');

// Import models with associations
require('./models/associations');

const createTestUser = async () => {
  try {
    await connectDB();
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username: admin');
      console.log('Password: admin123');
      return;
    }
    
    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@pharmacy.com',
      password: 'admin123',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      permissions: ['view_inventory', 'manage_inventory', 'dispense_medication', 'view_prescriptions', 'manage_users', 'generate_reports']
    });
    
    console.log('✅ Test admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Role: admin');
    
    // Create a pharmacist user
    const pharmacistUser = await User.create({
      username: 'pharmacist',
      email: 'pharmacist@pharmacy.com',
      password: 'pharma123',
      role: 'pharmacist',
      firstName: 'John',
      lastName: 'Pharmacist',
      permissions: ['view_inventory', 'manage_inventory', 'dispense_medication', 'view_prescriptions']
    });
    
    console.log('✅ Test pharmacist user created successfully!');
    console.log('Username: pharmacist');
    console.log('Password: pharma123');
    console.log('Role: pharmacist');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
};

createTestUser();