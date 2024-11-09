// app.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth"); // Importăm rutele de autentificare

dotenv.config(); // Încarcă variabilele din fișierul .env
const cors = require('cors')
const app = express();
app.use(cors())
// Middleware pentru parsarea datelor JSON
app.use(express.json());

// Conectarea la MongoDB folosind variabila de mediu pentru URI-ul bazei de date
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Setăm ruta de autentificare
app.use("/api/auth", authRoutes);

// Pornim serverul pe portul definit în .env sau pe portul 5000 implicit
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
