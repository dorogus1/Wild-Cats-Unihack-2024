const mongoose = require('mongoose');
require('dotenv').config(); // Importă variabilele de mediu din .env

// Funcție pentru conectarea la baza de date
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Iese din aplicație dacă nu reușește conexiunea
    }
};

module.exports = connectDB;
