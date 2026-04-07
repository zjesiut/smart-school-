const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let admin = await User.findOne({ email: 'admin@school.com' });
    if (admin) {
      console.log('Existing user found with email admin@school.com. Updating role to Admin.');
      admin.role = 'Admin';
      admin.password = await bcrypt.hash('Admin@123', 12);
      admin.schoolId = 'ESS/2016/000';
      await admin.save();
    } else {
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      admin = new User({
        name: 'Super Admin',
        email: 'admin@school.com',
        password: hashedPassword,
        role: 'Admin',
        schoolId: 'ESS/2016/000',
        phoneNumber: '0911223344',
        address: 'Addis Ababa, Ethiopia',
        isActive: true
      });
      await admin.save();
    }
    console.log('Super Admin ready!');
    console.log('Super Admin created successfully!');
    console.log('Email: admin@school.com');
    console.log('Password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
