const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB Atlas...');
    // Simplified URI to mask password for console
    console.log('URI:', mongoURI.replace(/:([^@]+)@/, ':****@'));
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000, // Wait 15 seconds before timeout
      family: 4,                      // Force IPv4 as Atlas Free Tier sometimes has issues with IPv6
    });

    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    
    if (err.name === 'MongooseServerSelectionError') {
      console.error('\nPOSSIBLE CAUSES:');
      console.error('1. Your current network (University/Work) is blocking port 27017.');
      console.error('2. Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('3. The VPN is not tunnelled for terminal/Node.js traffic.');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
