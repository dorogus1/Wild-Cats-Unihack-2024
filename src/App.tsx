// App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import SignUpPage from "./SignUpPage";

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });

    const [isSignedUp, setIsSignedUp] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/signup" element={<SignUpPage setIsSignedUp={setIsSignedUp} />} />
                <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
