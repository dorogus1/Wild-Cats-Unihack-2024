import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Home Page!</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomePage;
