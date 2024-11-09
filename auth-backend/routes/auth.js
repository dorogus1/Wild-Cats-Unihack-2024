// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Asigură-te că ai modelul User configurat corect
const router = express.Router();

// Înregistrare utilizator nou
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificăm dacă utilizatorul există deja
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Generăm un hash pentru parolă
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creăm un nou utilizator
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        // Salvăm utilizatorul în baza de date
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Failed to sign up. Please try again." });
    }
});

// Autentificare utilizator existent
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificăm dacă utilizatorul există
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Comparăm parola introdusă cu hash-ul din baza de date
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generăm un token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Failed to log in. Please try again." });
    }
});

module.exports = router;
