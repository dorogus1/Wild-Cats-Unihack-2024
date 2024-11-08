import React from "react";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
    setIsLoggedIn: (value: true) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Aici poți implementa validarea credentialelor (username/parola)
        localStorage.setItem("isLoggedIn", "true"); // Salvează autentificarea în localStorage
        setIsLoggedIn(true); // Actualizează starea de autentificare
        navigate("/home"); // Navighează la pagina Home
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Login</h1>
            <input type="text" placeholder="Username" />
            <br />
            <input type="password" placeholder="Password" />
            <br />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
