import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import SignUpPage from "./SignUpPage";
const App: React.FC = () => {
  // Inițializează starea isLoggedIn folosind valoarea din localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true"; // Verifică dacă utilizatorul este logat
  });

  return (
      <Router>
        <Routes>
          {/* LoginPage */}
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          {/* Protected HomePage */}
          <Route
              path="/home"
              element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
          />
          {/* Redirect către login dacă userul accesează ruta rădăcină */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
};

export default App;
