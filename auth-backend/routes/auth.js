// auth-backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Ruta de înregistrare
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificăm dacă utilizatorul există deja
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists!" });
        }

        // Criptăm parola
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creăm un nou utilizator
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// Ruta de autentificare
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Găsim utilizatorul în baza de date
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password!" });
        }

        // Verificăm parola
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password!" });
        }

        // Generăm un token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

module.exports = router;
