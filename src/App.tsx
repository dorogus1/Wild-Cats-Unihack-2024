import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import SignUpPage from "./SignUpPage";

const App: React.FC = () => {
    // Inițializează starea isLoggedIn folosind valoarea din localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });

    // Initializează starea pentru `isSignedUp`
    const [isSignedUp, setIsSignedUp] = useState(false);

    return (
        <Router>
            <Routes>
                {/* Pagina de login */}
                <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />

                {/* Pagina de signup */}
                <Route path="/SignUpPage" element={<SignUpPage setIsSignedUp={setIsSignedUp} />} />

                {/* Pagina Home protejată */}
                <Route
                    path="/home"
                    element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
                />

                {/* Redirecționare către login dacă accesezi ruta rădăcină */}
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
