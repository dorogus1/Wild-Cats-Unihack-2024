// auth-backend/app.js

// Importuri necesare
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

// Încarcă variabilele de mediu din fișierul .env
dotenv.config();

// Inițializează aplicația Express
const app = express();

// Middleware-uri
app.use(cors()); // Permite cererile cross-origin
app.use(express.json()); // Parsează cererile de tip JSON

// Conectare la baza de date MongoDB (fără opțiunile deprecate)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Definirea rutelor de autentificare
app.use("/api/auth", authRoutes);

// Pornirea serverului pe un port diferit dacă PORT este deja utilizat
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
