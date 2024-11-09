// SignUpPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

// Interfața pentru props-ul componentei `SignUpPage`
interface SignUpPageProps {
    setIsSignedUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ setIsSignedUp }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setIsSignedUp(true);
                navigate("/login");
            } else {
                const data = await response.json();
                setErrorMessage(data.message || "Failed to sign up. Please try again.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            console.error("Error during signup:", error);
        }
    };


    return (
        <div className="signup-container">
            <h1 className="signup-title">Sign Up</h1>
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
            <input
                type="password"
                placeholder="Confirm Password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="button" onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUpPage;
