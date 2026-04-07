require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        const uri = process.env.MONGO_URI;
        console.log('Testing connection to:', uri.replace(/:([^@]+)@/, ':****@'));
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000 // 10 seconds
        });
        console.log('SUCCESS: Connected to MongoDB Atlas');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Connection error occurred:');
        console.error(err);
        process.exit(1);
    }
}

testConnection();
