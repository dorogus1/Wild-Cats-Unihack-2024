import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignUpPageProps {
    setIsSignedUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ setIsSignedUp }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();

    const handleSignUp = () => {
        // Validare: verifică dacă parolele coincid
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        // Inițializează lista de utilizatori din localStorage
        let users: { username: string; password: string }[] = [];
        try {
            users = JSON.parse(localStorage.getItem("users") || "[]");
        } catch (error) {
            console.error("Error parsing users from localStorage:", error);
        }

        // Verifică dacă username-ul există deja
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            setErrorMessage("Username already exists!");
            return;
        }

        // Adaugă utilizatorul nou în lista și salvează în localStorage
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));

        // Setează `isSignedUp` la `true` și redirecționează către login
        setIsSignedUp(true);
        navigate("/login");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Sign Up</h1>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUpPage;
