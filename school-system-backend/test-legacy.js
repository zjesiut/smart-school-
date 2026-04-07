require('dotenv').config();
const mongoose = require('mongoose');

const legacyURI = "mongodb://admin1:baba4235@cluster0-shard-00-00.fb8diyy.mongodb.net:27017,cluster0-shard-00-01.fb8diyy.mongodb.net:27017,cluster0-shard-00-02.fb8diyy.mongodb.net:27017/smart_school_db?ssl=true&replicaSet=atlas-6hlntd-shard-0&authSource=admin&retryWrites=true&w=majority";

async function testConnection() {
    try {
        console.log('Testing LEGACY connection to Atlas shards...');
        await mongoose.connect(legacyURI, {
            serverSelectionTimeoutMS: 10000 
        });
        console.log('SUCCESS: Connected to MongoDB Atlas using LEGACY string!');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Legacy connection failed:');
        console.error(err.message);
        process.exit(1);
    }
}

testConnection();
