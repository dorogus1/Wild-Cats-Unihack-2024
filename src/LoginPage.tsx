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
    const navigate = useNavigate();

    const handleLogin = () => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((user: any) => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            setIsLoggedIn(true);
            navigate("/home");
        } else {
            alert("Invalid username or password");
        }
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
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
            <button className="button" onClick={handleLogin}>Login</button>
            <button className="button" onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default LoginPage;
