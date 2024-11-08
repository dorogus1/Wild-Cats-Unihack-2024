import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
    setIsLoggedIn: (value: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = () => {
        // Aici poți implementa validarea credentialelor (username/parola)
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((user: any) => user.username === username && user.password === password);

        if (user) {
            localStorage.setItem("isLoggedIn", "true"); // Salvează autentificarea în localStorage
            setIsLoggedIn(true); // Actualizează starea de autentificare
            navigate("/home"); // Navighează la pagina Home
        } else {
            alert("Invalid username or password");
        }
    };

    const handleSignUp = () => {
        navigate("/signup"); // Navighează la pagina de înregistrare
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Login</h1>
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
            <br />
            <button onClick={handleLogin}>Login</button>
            <br />
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default LoginPage;
