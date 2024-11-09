import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage"; // Asigură-te că este importat corect
import HomePage from "./HomePage";
import SignUpPage from "./SignUpPage"; // Asigură-te că este importat corect

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });

    const [isSignedUp, setIsSignedUp] = useState(false);

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} // Doar LoginPage primește setIsLoggedIn
                />
                <Route
                    path="/signup"
                    element={<SignUpPage setIsSignedUp={setIsSignedUp} />} // Doar SignUpPage primește setIsSignedUp
                />
                <Route
                    path="/home"
                    element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
