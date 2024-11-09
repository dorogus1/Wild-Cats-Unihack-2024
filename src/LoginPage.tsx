// LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

interface LoginPageProps {
    setIsLoggedIn: (value: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("isLoggedIn", "true");
                setIsLoggedIn(true);
                navigate("/home");
            } else {
                setErrorMessage("Invalid username or password");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            console.error("Error during login:", error);
        }
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <input
                type="text"
                placeholder="Username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="button" onClick={handleLogin}>Login</button>
            <button className="button" onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default LoginPage;
