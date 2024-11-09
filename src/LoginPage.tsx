import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Asigură-te că ai importat fișierul CSS

interface LoginPageProps {
    setIsLoggedIn: (value: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
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
                setIsLoggedIn(true);
                navigate("/home");
            } else {
                const data = await response.json();
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    const handleSignUpRedirect = () => {
        navigate("/signup"); // Redirecționează către pagina de înregistrare
    };

    return (
        <div className="login-container">
            <h1 className={"login-title"}>Login</h1>
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
            <button className="button" onClick={handleSignUpRedirect}>Sign Up</button> {/* Noul buton pentru redirecționare */}
        </div>
    );
};

export default LoginPage;
