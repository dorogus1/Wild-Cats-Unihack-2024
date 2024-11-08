import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Definim tipul props pentru componentă
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
        // Verificăm dacă parolele coincid
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        // Obținem lista de utilizatori din localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userExists = users.some((user: any) => user.username === username);

        if (userExists) {
            setErrorMessage("Username already exists!");
            return;
        }

        // Adăugăm utilizatorul nou în localStorage
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));

        // Setăm `isSignedUp` la `true`
        setIsSignedUp(true);

        // Navigăm către pagina de login
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
